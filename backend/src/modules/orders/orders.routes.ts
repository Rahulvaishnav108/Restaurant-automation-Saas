// src/modules/orders/orders.routes.ts

import { Router } from "express";

const orderrouter = Router();

/*
|--------------------------------------------------------------------------
| CUSTOMER ORDER APIs
|--------------------------------------------------------------------------
*/

// Place Order
// POST /customer/orders
orderrouter.post("/customer/orders", (req, res) => {
  res.send("Place Order");
});

// Get Orders
// GET /customer/orders
orderrouter.get("/customer/orders", (req, res) => {
  res.send("Get Customer Orders");
});

// Get Single Order
// GET /customer/orders/:id
orderrouter.get("/customer/orders/:id", (req, res) => {
  res.send(`Get Order ${req.params.id}`);
});

// Reorder
// POST /customer/orders/:id/reorder
orderrouter.post("/customer/orders/:id/reorder", (req, res) => {
  res.send(`Reorder ${req.params.id}`);
});

// Cancel Order
// POST /customer/orders/:id/cancel
orderrouter.post("/customer/orders/:id/cancel", (req, res) => {
  res.send(`Cancel Order ${req.params.id}`);
});

/*
|--------------------------------------------------------------------------
| KITCHEN ORDER APIs
|--------------------------------------------------------------------------
*/

// Kitchen Dashboard Orders
// GET /kitchen/orders
orderrouter.get("/kitchen/orders", (req, res) => {
  res.send("Kitchen Orders");
});

// Kitchen Order Details
// GET /kitchen/orders/:id
orderrouter.get("/kitchen/orders/:id", (req, res) => {
  res.send(`Kitchen Order Details ${req.params.id}`);
});

// Accept Order
// PATCH /kitchen/orders/:id/accept
orderrouter.patch("/kitchen/orders/:id/accept", (req, res) => {
  res.send(`Accept Order ${req.params.id}`);
});

// Start Cooking
// PATCH /kitchen/orders/:id/start
orderrouter.patch("/kitchen/orders/:id/start", (req, res) => {
  res.send(`Start Cooking ${req.params.id}`);
});

// Mark Ready
// PATCH /kitchen/orders/:id/ready
orderrouter.patch("/kitchen/orders/:id/ready", (req, res) => {
  res.send(`Mark Ready ${req.params.id}`);
});

// Delay Order
// PATCH /kitchen/orders/:id/delay
orderrouter.patch("/kitchen/orders/:id/delay", (req, res) => {
  res.send(`Delay Order ${req.params.id}`);
});

// Reject Order
// PATCH /kitchen/orders/:id/reject
orderrouter.patch("/kitchen/orders/:id/reject", (req, res) => {
  res.send(`Reject Order ${req.params.id}`);
});

/*
|--------------------------------------------------------------------------
| SERVICE STAFF ORDER APIs
|--------------------------------------------------------------------------
*/

// Ready Orders Queue
// GET /staff/orders/ready
orderrouter.get("/staff/orders/ready", (req, res) => {
  res.send("Ready Orders Queue");
});

// Pick Food
// PATCH /staff/orders/:id/pick
orderrouter.patch("/staff/orders/:id/pick", (req, res) => {
  res.send(`Pick Food ${req.params.id}`);
});

// Mark Served
// PATCH /staff/orders/:id/serve
orderrouter.patch("/staff/orders/:id/serve", (req, res) => {
  res.send(`Mark Served ${req.params.id}`);
});

export default orderrouter;