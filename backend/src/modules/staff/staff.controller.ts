import type { NextFunction, Request, Response } from 'express';
import { ErrorCode } from '../../constants/errors';
import { STAFF_ROLES } from '../../constants/roles';
import { UserStatus } from '../../constants/statuses';
import { AppError } from '../../utils/AppError';
import { hashPassword } from '../../utils/crypto';
import { ok } from '../../utils/responses';
import { UserModel } from '../users/users.model';
import { StaffShiftAssignmentModel } from './staff.model';
import { logAudit } from '../auditLogs/auditLogs.helper';
import { AuditAction, AuditEntity } from '../auditLogs/auditLogs.types';

type StaffRole = (typeof STAFF_ROLES)[number];

function resolveRestaurantId(req: Request, candidate?: unknown): string {
  if (req.user?.restaurantId) {
    return req.user.restaurantId;
  }

  if (typeof candidate === 'string' && candidate.trim()) {
    return candidate.trim();
  }

  throw new AppError('Restaurant context required', 403, ErrorCode.FORBIDDEN);
}

function ensureStaffRole(role: string): role is StaffRole {
  return STAFF_ROLES.includes(role as StaffRole);
}

async function ensureStaffRecord(restaurantId: string, staffId: string) {
  const staff = await UserModel.findOne({
    _id: staffId,
    restaurantId,
    role: { $in: STAFF_ROLES },
  }).lean();

  if (!staff) {
    throw new AppError('Staff member not found', 404, ErrorCode.NOT_FOUND);
  }

  return staff;
}

async function getActiveShiftMap(restaurantId: string, staffIds: string[]) {
  const activeShifts = await StaffShiftAssignmentModel.find({
    restaurantId,
    staffId: { $in: staffIds },
    active: true,
  })
    .sort({ updatedAt: -1 })
    .lean();

  const shiftMap = new Map<string, (typeof activeShifts)[number]>();

  activeShifts.forEach((shift) => {
    const key = String(shift.staffId);
    if (!shiftMap.has(key)) {
      shiftMap.set(key, shift);
    }
  });

  return shiftMap;
}

export async function createStaffController(req: Request, res: Response, next: NextFunction) {
  try {
    const restaurantId = resolveRestaurantId(req, req.body.restaurantId);

    const [emailConflict, mobileConflict] = await Promise.all([
      UserModel.exists({ email: req.body.email }),
      UserModel.exists({ mobile: req.body.mobile }),
    ]);

    if (emailConflict) {
      throw new AppError('Email is already in use', 409, ErrorCode.CONFLICT);
    }

    if (mobileConflict) {
      throw new AppError('Mobile is already in use', 409, ErrorCode.CONFLICT);
    }

    const created = await UserModel.create({
      restaurantId,
      name: req.body.name,
      email: req.body.email,
      mobile: req.body.mobile,
      password: await hashPassword(req.body.password),
      role: req.body.role,
      status: req.body.status ?? UserStatus.ACTIVE,
      isEmailVerified: true,
      isMobileVerified: true,
    });

    const staff = await UserModel.findById(created._id).lean();

    ok(res, { staff }, 201);
    void logAudit(req, {
      entityType:   AuditEntity.STAFF,
      entityId:     created._id.toString(),
      action:       AuditAction.ADMIN_STAFF_CREATED,
      restaurantId: restaurantId,
      metadata: {
        name:  req.body.name,
        email: req.body.email,
        role:  req.body.role,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function listStaffController(req: Request, res: Response, next: NextFunction) {
  try {
    const restaurantId = resolveRestaurantId(req, req.query.restaurantId);
    const search = typeof req.query.q === 'string' ? req.query.q.trim() : '';
    const role = typeof req.query.role === 'string' && ensureStaffRole(req.query.role) ? req.query.role : undefined;
    const status = typeof req.query.status === 'string' ? req.query.status : undefined;

    const filter: Record<string, unknown> = {
      restaurantId,
      role: role ? role : { $in: STAFF_ROLES },
    };

    if (status) {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { mobile: { $regex: search, $options: 'i' } },
      ];
    }

    const staff = await UserModel.find(filter).sort({ createdAt: -1 }).lean();
    const shiftMap = await getActiveShiftMap(
      restaurantId,
      staff.map((member) => String(member._id)),
    );

    ok(res, {
      staff: staff.map((member) => ({
        ...member,
        activeShift: shiftMap.get(String(member._id)) ?? null,
      })),
      meta: {
        count: staff.length,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getStaffByIdController(req: Request, res: Response, next: NextFunction) {
  try {
    const restaurantId = resolveRestaurantId(req, req.query.restaurantId);
    const staff = await ensureStaffRecord(restaurantId, req.params.id);
    const activeShift = await StaffShiftAssignmentModel.findOne({
      restaurantId,
      staffId: req.params.id,
      active: true,
    })
      .sort({ updatedAt: -1 })
      .lean();

    ok(res, { staff: { ...staff, activeShift: activeShift ?? null } });
  } catch (error) {
    next(error);
  }
}

export async function updateStaffController(req: Request, res: Response, next: NextFunction) {
  try {
    const restaurantId = resolveRestaurantId(req, req.body.restaurantId ?? req.query.restaurantId);
    await ensureStaffRecord(restaurantId, req.params.id);

    if (req.body.email) {
      const existingEmail = await UserModel.exists({
        _id: { $ne: req.params.id },
        email: req.body.email,
      });

      if (existingEmail) {
        throw new AppError('Email is already in use', 409, ErrorCode.CONFLICT);
      }
    }

    if (req.body.mobile) {
      const existingMobile = await UserModel.exists({
        _id: { $ne: req.params.id },
        mobile: req.body.mobile,
      });

      if (existingMobile) {
        throw new AppError('Mobile is already in use', 409, ErrorCode.CONFLICT);
      }
    }

    const update: Record<string, unknown> = {
      name: req.body.name,
      email: req.body.email,
      mobile: req.body.mobile,
      role: req.body.role,
      status: req.body.status,
    };

    if (req.body.password) {
      update.password = await hashPassword(req.body.password);
      update.refreshTokens = [];
    }

    Object.keys(update).forEach((key) => update[key] === undefined && delete update[key]);

    const staff = await UserModel.findOneAndUpdate(
      {
        _id: req.params.id,
        restaurantId,
        role: { $in: STAFF_ROLES },
      },
      update,
      { new: true, runValidators: true },
    ).lean();

    if (!staff) {
      throw new AppError('Staff member not found', 404, ErrorCode.NOT_FOUND);
    }

    const activeShift = await StaffShiftAssignmentModel.findOne({
      restaurantId,
      staffId: req.params.id,
      active: true,
    })
      .sort({ updatedAt: -1 })
      .lean();

    ok(res, { staff: { ...staff, activeShift: activeShift ?? null } });
    void logAudit(req, {
      entityType:   AuditEntity.STAFF,
      entityId:     req.params.id,
      action:       AuditAction.ADMIN_STAFF_UPDATED,
      restaurantId: restaurantId,
      metadata: {
        updatedFields: Object.keys(update),
        role:          req.body.role,
        status:        req.body.status,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteStaffController(req: Request, res: Response, next: NextFunction) {
  try {
    const restaurantId = resolveRestaurantId(req, req.query.restaurantId);
    const staff = await UserModel.findOneAndUpdate(
      {
        _id: req.params.id,
        restaurantId,
        role: { $in: STAFF_ROLES },
      },
      {
        isDeleted: true,
        deletedAt: new Date(),
        email: `deleted_${Date.now()}_${req.params.id}@deleted.com`,
        mobile: `deleted_${Date.now()}_${req.params.id}`,
        refreshTokens: [],
      },
      { new: true },
    ).lean();

    if (!staff) {
      throw new AppError('Staff member not found', 404, ErrorCode.NOT_FOUND);
    }

    await StaffShiftAssignmentModel.updateMany(
      {
        restaurantId,
        staffId: req.params.id,
        active: true,
      },
      {
        active: false,
      },
    );

    ok(res, { staff });
    void logAudit(req, {
      entityType:   AuditEntity.STAFF,
      entityId:     req.params.id,
      action:       AuditAction.ADMIN_STAFF_DELETED,
      restaurantId: restaurantId,
      metadata: {
        deletedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function assignStaffShiftController(req: Request, res: Response, next: NextFunction) {
  try {
    const restaurantId = resolveRestaurantId(req, req.body.restaurantId);
    await ensureStaffRecord(restaurantId, req.body.staffId);

    const shouldActivate = req.body.active ?? true;

    if (shouldActivate) {
      await StaffShiftAssignmentModel.updateMany(
        {
          restaurantId,
          staffId: req.body.staffId,
          active: true,
        },
        {
          active: false,
        },
      );
    }

    const shift = await StaffShiftAssignmentModel.create({
      restaurantId,
      staffId: req.body.staffId,
      name: req.body.name,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      days: req.body.days,
      notes: req.body.notes,
      active: shouldActivate,
      assignedBy: req.user?.id ?? null,
    });

    ok(res, { shift }, 201);
  } catch (error) {
    next(error);
  }
}
