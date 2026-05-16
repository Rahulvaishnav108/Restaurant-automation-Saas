import { Request, Response } from 'express';
import { MenuService } from './menu.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { parsePagination } from '../../utils/pagination';
import { AppError } from '../../utils/AppError';
import { ErrorCode } from '../../constants/errors';
import { MenuItem } from './menu.model';

export class MenuController {
  /*
  |--------------------------------------------------------------------------
  | CATEGORIES (ADMIN)
  |--------------------------------------------------------------------------
  */

  static createCategory = asyncHandler(async (req: Request, res: Response) => {
    // Note: requires roleGuard and requireAuth middleware before reaching here
    const category = await MenuService.createCategory(req.user!.restaurantId!, req.body, req.user!._id);
    res.status(201).json({ success: true, data: category });
  });

  static getAdminCategories = asyncHandler(async (req: Request, res: Response) => {
    const categories = await MenuService.getCategories(req.user!.restaurantId!, {
      excludeHidden: false,
      activeOnly: false,
    });
    res.status(200).json({ success: true, data: categories });
  });

  static getAdminCategoryById = asyncHandler(async (req: Request, res: Response) => {
    const category = await MenuService.getCategoryById(req.user!.restaurantId!, req.params.id);
    res.status(200).json({ success: true, data: category });
  });

  static updateCategory = asyncHandler(async (req: Request, res: Response) => {
    const category = await MenuService.updateCategory(req.user!.restaurantId!, req.params.id, req.body, req.user!._id);
    res.status(200).json({ success: true, data: category });
  });

  static deleteCategory = asyncHandler(async (req: Request, res: Response) => {
    await MenuService.deleteCategory(req.user!.restaurantId!, req.params.id);
    res.status(200).json({ success: true, data: {} });
  });

  static toggleCategory = asyncHandler(async (req: Request, res: Response) => {
    const category = await MenuService.updateCategory(
      req.user!.restaurantId!,
      req.params.id,
      { isActive: req.body.isActive },
      req.user!._id
    );
    res.status(200).json({ success: true, data: category });
  });

  static reorderCategories = asyncHandler(async (req: Request, res: Response) => {
    await MenuService.reorderCategories(req.user!.restaurantId!, req.body.categories, req.user!._id);
    res.status(200).json({ success: true, data: {} });
  });

  /*
  |--------------------------------------------------------------------------
  | MENU ITEMS (ADMIN)
  |--------------------------------------------------------------------------
  */

  static createItem = asyncHandler(async (req: Request, res: Response) => {
    const item = await MenuService.createItem(req.user!.restaurantId!, req.body, req.user!._id);
    res.status(201).json({ success: true, data: item });
  });

  static getAdminItems = asyncHandler(async (req: Request, res: Response) => {
    const pagination = parsePagination(req.query as any);
    const data = await MenuService.getAdminItems(req.user!.restaurantId!, {
      ...pagination,
      categoryId: req.query.categoryId as string,
    });
    res.status(200).json({ success: true, data });
  });

  static getAdminItemById = asyncHandler(async (req: Request, res: Response) => {
    const item = await MenuService.getItemById(req.user!.restaurantId!, req.params.id);
    res.status(200).json({ success: true, data: item });
  });

  static updateItem = asyncHandler(async (req: Request, res: Response) => {
    const item = await MenuService.updateItem(req.user!.restaurantId!, req.params.id, req.body, req.user!._id);
    res.status(200).json({ success: true, data: item });
  });

  static deleteItem = asyncHandler(async (req: Request, res: Response) => {
    await MenuService.deleteItem(req.user!.restaurantId!, req.params.id);
    res.status(200).json({ success: true, data: {} });
  });

  static toggleItemAvailability = asyncHandler(async (req: Request, res: Response) => {
    const item = await MenuService.toggleItemAvailability(
      req.user!.restaurantId!,
      req.params.id,
      req.body.isAvailable,
      req.user!._id
    );
    res.status(200).json({ success: true, data: item });
  });

  static toggleItemVisibility = asyncHandler(async (req: Request, res: Response) => {
    const item = await MenuService.toggleItemVisibility(
      req.user!.restaurantId!,
      req.params.id,
      req.body.isHidden,
      req.user!._id
    );
    res.status(200).json({ success: true, data: item });
  });

  static reorderItems = asyncHandler(async (req: Request, res: Response) => {
    await MenuService.reorderItems(req.user!.restaurantId!, req.body.items, req.user!._id);
    res.status(200).json({ success: true, data: {} });
  });

  /*
  |--------------------------------------------------------------------------
  | PUBLIC / CUSTOMER (READ-ONLY)
  |--------------------------------------------------------------------------
  */

  // Gets restaurantId from JWT session (Customer) or param (Public)
  private static getRestaurantIdFromReq(req: Request): string {
    if (req.tableSession) return req.tableSession.restaurantId.toString();
    if (req.params.restaurantId) return req.params.restaurantId;
    throw new AppError('Restaurant ID is required', 400, ErrorCode.INVALID_REQUEST);
  }

  static getCustomerCategories = asyncHandler(async (req: Request, res: Response) => {
    const restaurantId = MenuController.getRestaurantIdFromReq(req);
    const categories = await MenuService.getCategories(restaurantId, {
      excludeHidden: true,
      activeOnly: true,
    });
    res.status(200).json({ success: true, data: categories });
  });

  static getCustomerItems = asyncHandler(async (req: Request, res: Response) => {
    const restaurantId = MenuController.getRestaurantIdFromReq(req);
    const pagination = parsePagination(req.query as any);
    
    // We already do basic type conversion in Zod query schema, but let's be explicit
    const vegOnly = String(req.query.vegOnly) === 'true';
    const availableOnly = String(req.query.available) === 'true';

    const data = await MenuService.getItems(restaurantId, {
      ...pagination,
      categoryId: req.query.category as string,
      vegOnly,
      availableOnly,
      search: req.query.search as string,
      sortBy: req.query.sortBy as string,
    });
    res.status(200).json({ success: true, data });
  });

  static getCustomerItemById = asyncHandler(async (req: Request, res: Response) => {
    const restaurantId = MenuController.getRestaurantIdFromReq(req);
    const item = await MenuService.getItemById(restaurantId, req.params.id);
    res.status(200).json({ success: true, data: item });
  });

  static getPublicItemById = asyncHandler(async (req: Request, res: Response) => {
    // Public fetch doesn't necessarily know restaurantId if only given the item ID,
    // but in MongoDB, object IDs are globally unique. We can query without restaurantId.
    // Let's create a getGlobalItemById in MenuService or just query it directly here.
    const item = await MenuItem.findById(req.params.id);
    if (!item) throw new AppError('Menu item not found', 404, ErrorCode.NOT_FOUND);
    res.status(200).json({ success: true, data: item });
  });
}
