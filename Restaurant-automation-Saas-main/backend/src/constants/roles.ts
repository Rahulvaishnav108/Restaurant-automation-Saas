// src/constants/roles.ts
// All user roles in the system — matches PRD Section 2

export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  SERVICE_STAFF = 'SERVICE_STAFF',
  KITCHEN_STAFF = 'KITCHEN_STAFF',
  CLEANING_STAFF = 'CLEANING_STAFF',
  RESTAURANT_ADMIN = 'RESTAURANT_ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

/** Roles that belong to a specific restaurant */
export const RESTAURANT_ROLES = [
  UserRole.RESTAURANT_ADMIN,
  UserRole.SERVICE_STAFF,
  UserRole.KITCHEN_STAFF,
  UserRole.CLEANING_STAFF,
] as const;

/** Staff roles (all restaurant roles except admin) */
export const STAFF_ROLES = [
  UserRole.SERVICE_STAFF,
  UserRole.KITCHEN_STAFF,
  UserRole.CLEANING_STAFF,
] as const;

/** Admin-level roles */
export const ADMIN_ROLES = [
  UserRole.RESTAURANT_ADMIN,
  UserRole.SUPER_ADMIN,
] as const;
