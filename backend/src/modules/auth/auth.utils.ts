import type { Request } from 'express';
import { getRestaurantById } from '../../services/phase1Store';
import type { UserRecord } from '../../services/phase1Store';
import type { AuthenticatedUserDto } from './auth.types';

export function toAuthenticatedUserDto(user: UserRecord): AuthenticatedUserDto {
  const restaurant = user.restaurantId ? getRestaurantById(user.restaurantId) : undefined;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    mobile: user.mobile,
    role: user.role,
    restaurantId: user.restaurantId,
    restaurantName: restaurant?.name,
  };
}

export function getDeviceLabel(req: Request): string {
  return req.body?.deviceLabel || req.header('user-agent') || 'Unknown device';
}
