export enum UserRole {
  CUSTOMER = 'customer',
  SERVICE_STAFF = 'service-staff',
  KITCHEN_STAFF = 'kitchen-staff',
  CLEANING_STAFF = 'cleaning-staff',
  RESTAURANT_ADMIN = 'restaurant-admin',
  SUPER_ADMIN = 'super-admin',
}

export const roles = {
  customer: UserRole.CUSTOMER,
  serviceStaff: UserRole.SERVICE_STAFF,
  kitchenStaff: UserRole.KITCHEN_STAFF,
  cleaningStaff: UserRole.CLEANING_STAFF,
  restaurantAdmin: UserRole.RESTAURANT_ADMIN,
  superAdmin: UserRole.SUPER_ADMIN,
} as const;

export type AppRole = (typeof roles)[keyof typeof roles];

export const RESTAURANT_ROLES = [
  UserRole.RESTAURANT_ADMIN,
  UserRole.SERVICE_STAFF,
  UserRole.KITCHEN_STAFF,
  UserRole.CLEANING_STAFF,
] as const;

export const STAFF_ROLES = [
  UserRole.SERVICE_STAFF,
  UserRole.KITCHEN_STAFF,
  UserRole.CLEANING_STAFF,
] as const;

export const ADMIN_ROLES = [UserRole.RESTAURANT_ADMIN, UserRole.SUPER_ADMIN] as const;
