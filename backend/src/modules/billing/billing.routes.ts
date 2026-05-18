import { Router } from "express";
import { BillingController } from "./billing.controller";

const router = Router();

/*
|--------------------------------------------------------------------------
| CUSTOMER BILL APIs
|--------------------------------------------------------------------------
*/

router.get("/customer/bill", BillingController.getLiveBill);

router.post("/customer/bill/request", BillingController.requestFinalBill);

router.post("/customer/bill/coupon", BillingController.applyCoupon);

router.delete(
  "/customer/bill/coupon/:couponId",
  BillingController.removeCoupon
);

/*
|--------------------------------------------------------------------------
| PAYMENT APIs
|--------------------------------------------------------------------------
*/

router.post(
  "/customer/payments/create",
  BillingController.createPayment
);

router.post(
  "/customer/payments/verify",
  BillingController.verifyPayment
);

router.get(
  "/customer/payments/:paymentId/status",
  BillingController.getPaymentStatus
);

/*
|--------------------------------------------------------------------------
| ADMIN BILLING APIs
|--------------------------------------------------------------------------
*/

router.get(
  "/admin/billing/revenue",
  BillingController.getRevenueReport
);

router.get(
  "/admin/billing/tax",
  BillingController.getTaxReport
);

router.get(
  "/admin/billing/orders",
  BillingController.getOrderBillingReport
);

router.get(
  "/admin/billing/discounts",
  BillingController.getDiscountReport
);

router.get(
  "/admin/billing/payments",
  BillingController.getPaymentReport
);

export default router;