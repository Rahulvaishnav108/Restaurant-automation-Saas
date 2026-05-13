export const roles = {
  customer: 'customer',
  serviceStaff: 'service-staff',
  kitchenStaff: 'kitchen-staff',
  cleaningStaff: 'cleaning-staff',
  restaurantAdmin: 'restaurant-admin',
  superAdmin: 'super-admin',
} as const;

export type AppRole = (typeof roles)[keyof typeof roles];
