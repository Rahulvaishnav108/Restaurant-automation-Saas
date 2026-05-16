import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { MongoMemoryServer } from 'mongodb-memory-server';
import newman from 'newman';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backendDir = path.resolve(__dirname, '..');
const collectionPath = path.join(
  backendDir,
  'postman',
  'collections',
  'restaurant-automation-api.postman_collection.json',
);
const environmentPath = path.join(
  backendDir,
  'postman',
  'environments',
  'restaurant-automation-local.postman_environment.json',
);
const port = 5075;
const baseUrl = `http://127.0.0.1:${port}`;

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getId(entity) {
  return entity?.id ?? entity?._id ?? null;
}

function last(array) {
  return Array.isArray(array) && array.length > 0 ? array[array.length - 1] : null;
}

async function waitForHealth(url, attempts = 60) {
  for (let index = 0; index < attempts; index += 1) {
    try {
      const response = await fetch(`${url}/health`);
      if (response.ok) {
        return;
      }
    } catch {}

    await sleep(1000);
  }

  throw new Error('Backend did not become healthy in time');
}

async function request(url, method, pathname, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs ?? 10000);
  const headers = {
    ...(options.headers ?? {}),
  };

  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  if (options.sessionToken) {
    headers['x-session-token'] = options.sessionToken;
  }

  if (options.body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  try {
    const response = await fetch(`${url}${pathname}`, {
      method,
      headers,
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
      signal: controller.signal,
    });

    const raw = await response.text();
    let json = null;

    if (raw) {
      try {
        json = JSON.parse(raw);
      } catch {
        json = null;
      }
    }

    return {
      status: response.status,
      json,
      raw,
    };
  } finally {
    clearTimeout(timeout);
  }
}

async function login(url, email, password, deviceLabel) {
  const response = await request(url, 'POST', '/api/v1/auth/login', {
    body: { email, password, deviceLabel },
  });

  assert(response.status === 200, `Login failed for ${email} with status ${response.status}`);
  assert(response.json?.data?.accessToken, `Access token missing for ${email}`);
  assert(response.json?.data?.refreshToken, `Refresh token missing for ${email}`);

  return {
    accessToken: response.json.data.accessToken,
    refreshToken: response.json.data.refreshToken,
    user: response.json.data.user,
  };
}

async function runNewmanSuite(url) {
  const environment = JSON.parse(fs.readFileSync(environmentPath, 'utf8'));
  const runtimeEnvironment = {
    ...environment,
    values: environment.values.map((entry) => (entry.key === 'baseUrl' ? { ...entry, value: url } : entry)),
  };

  const summary = await new Promise((resolve, reject) => {
    newman.run(
      {
        collection: collectionPath,
        environment: runtimeEnvironment,
        insecure: true,
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result);
      },
    );
  });

  const failures = summary.run.failures.map((failure) => ({
    source: failure.source?.name ?? failure.parent?.name ?? 'unknown',
    message: failure.error?.message ?? String(failure.error ?? 'Unknown failure'),
  }));

  return {
    stats: summary.run.stats,
    failures,
  };
}

async function runSmokeSuite(url) {
  const results = [];
  const state = {
    admin: null,
    customer: null,
    staff: null,
    kitchen: null,
    cleaning: null,
    superAdmin: null,
    tempUser: null,
    restaurantId: '',
    createdTableId: '',
    createdQrToken: '',
    createdSessionToken: '',
    createdCartItemId: '',
    createdOrderId: '',
    reorderedOrderId: '',
    cancelCandidateOrderId: '',
    createdPaymentId: '',
    createdFeedbackId: '',
    createdBatchId: '',
    createdPlanId: '',
    createdRequestId: '',
    queueId: '',
    reservationId: '',
    readyOrderId: '',
    cleaningTaskId: '',
    notificationId: '',
    featureFlagId: '',
    pendingRestaurantId: '',
  };

  async function runStep(name, fn) {
    try {
      const detail = await fn();
      results.push({ name, passed: true, detail: detail ?? '' });
    } catch (error) {
      results.push({
        name,
        passed: false,
        detail: error instanceof Error ? error.message : String(error),
      });
    }
  }

  await runStep('system routes', async () => {
    for (const pathname of ['/health', '/ready', '/api/v1', '/version']) {
      const response = await request(url, 'GET', pathname);
      assert(response.status === 200, `${pathname} returned ${response.status}`);
    }
  });

  await runStep('auth login role matrix', async () => {
    state.admin = await login(url, 'admin@ambertable.com', 'Admin@123', 'Phase1 Verify Admin');
    state.customer = await login(url, 'guest@ambertable.com', 'Guest@123', 'Phase1 Verify Customer');
    state.staff = await login(url, 'staff@ambertable.com', 'Staff@123', 'Phase1 Verify Staff');
    state.kitchen = await login(url, 'kitchen@ambertable.com', 'Kitchen@123', 'Phase1 Verify Kitchen');
    state.cleaning = await login(url, 'cleaning@ambertable.com', 'Cleaning@123', 'Phase1 Verify Cleaning');
    state.superAdmin = await login(url, 'superadmin@graphura.com', 'Super@123', 'Phase1 Verify Super Admin');
  });

  await runStep('auth me sessions refresh logout otp', async () => {
    const me = await request(url, 'GET', '/api/v1/auth/me', { token: state.admin.accessToken });
    assert(me.status === 200, `auth/me returned ${me.status}`);
    assert((me.json?.data?.user ?? me.json?.data)?.role === 'restaurant-admin', 'auth/me role mismatch');

    const sessions = await request(url, 'GET', '/api/v1/auth/sessions', { token: state.admin.accessToken });
    assert(sessions.status === 200, `auth/sessions returned ${sessions.status}`);
    const sessionId = sessions.json?.data?.sessions?.[0]?.id ?? sessions.json?.data?.sessions?.[0]?._id;
    assert(sessionId, 'No revokable auth session found');

    const revoke = await request(url, 'DELETE', `/api/v1/auth/sessions/${sessionId}`, {
      token: state.admin.accessToken,
    });
    assert(revoke.status === 200, `revoke session returned ${revoke.status}`);

    const refresh = await request(url, 'POST', '/api/v1/auth/refresh', {
      body: { refreshToken: state.customer.refreshToken },
    });
    assert(refresh.status === 200, `refresh returned ${refresh.status}`);
    state.customer.accessToken = refresh.json?.data?.accessToken;
    state.customer.refreshToken = refresh.json?.data?.refreshToken;

    const logout = await request(url, 'POST', '/api/v1/auth/logout', {
      token: state.customer.accessToken,
      body: { refreshToken: state.customer.refreshToken },
    });
    assert(logout.status === 200, `logout returned ${logout.status}`);

    state.customer = await login(url, 'guest@ambertable.com', 'Guest@123', 'Phase1 Verify Customer Relogin');

    const otpRequest = await request(url, 'POST', '/api/v1/auth/request-otp', {
      body: { email: 'guest@ambertable.com' },
    });
    assert(otpRequest.status === 200, `request-otp returned ${otpRequest.status}`);
    const otp = otpRequest.json?.data?.otp;
    assert(otp, 'OTP was not returned in non-production verification mode');

    const otpVerify = await request(url, 'POST', '/api/v1/auth/verify-otp', {
      body: { email: 'guest@ambertable.com', otp },
    });
    assert(otpVerify.status === 200, `verify-otp returned ${otpVerify.status}`);
  });

  await runStep('auth register user lifecycle', async () => {
    const timestamp = Date.now();
    const tempEmail = `phase1-user-${timestamp}@example.com`;
    const initialPassword = 'Phase1@123';
    const changedPassword = 'Phase1@456';
    const resetPassword = 'Phase1@789';

    const register = await request(url, 'POST', '/api/v1/auth/register', {
      body: {
        name: 'Phase1 Temp User',
        email: tempEmail,
        mobile: `9${String(timestamp).slice(-9)}`,
        password: initialPassword,
      },
    });
    assert(register.status === 201, `register returned ${register.status}`);
    assert(register.json?.data?.refreshToken, 'register refresh token missing');

    let temp = await login(url, tempEmail, initialPassword, 'Phase1 Temp Login');
    state.tempUser = temp;

    const updateProfile = await request(url, 'PATCH', '/api/v1/users/me', {
      token: temp.accessToken,
      body: { name: 'Phase1 Temp User Updated' },
    });
    assert(updateProfile.status === 200, `update profile returned ${updateProfile.status}`);

    const changePassword = await request(url, 'PATCH', '/api/v1/users/me/password', {
      token: temp.accessToken,
      body: { currentPassword: initialPassword, newPassword: changedPassword },
    });
    assert(changePassword.status === 200, `change password returned ${changePassword.status}`);

    temp = await login(url, tempEmail, changedPassword, 'Phase1 Temp Login Changed Password');

    const forgot = await request(url, 'POST', '/api/v1/auth/forgot-password', {
      body: { email: tempEmail },
    });
    assert(forgot.status === 200, `forgot-password returned ${forgot.status}`);
    const resetToken = forgot.json?.data?.resetToken;
    assert(resetToken, 'reset token missing in non-production verification mode');

    const reset = await request(url, 'POST', '/api/v1/auth/reset-password', {
      body: { token: resetToken, password: resetPassword },
    });
    assert(reset.status === 200, `reset-password returned ${reset.status}`);

    temp = await login(url, tempEmail, resetPassword, 'Phase1 Temp Login Reset Password');

    const deleteAccount = await request(url, 'DELETE', '/api/v1/users/me', {
      token: temp.accessToken,
      body: { confirmText: 'DELETE MY ACCOUNT' },
    });
    assert(deleteAccount.status === 200, `delete account returned ${deleteAccount.status}`);
  });

  await runStep('public and admin bootstrap flow', async () => {
    const uniqueTableNumber = (Date.now() % 1000) + 100;
    const restaurant = await request(url, 'GET', '/api/v1/public/restaurants/amber-table');
    assert(restaurant.status === 200, `public restaurant returned ${restaurant.status}`);
    state.restaurantId = getId(restaurant.json?.data?.restaurant);
    assert(state.restaurantId, 'Public restaurant id missing');

    const publicMenu = await request(url, 'GET', `/api/v1/public/menu/${state.restaurantId}/items`);
    assert(publicMenu.status === 200, `public menu returned ${publicMenu.status}`);

    const availability = await request(
      url,
      'GET',
      `/api/v1/public/reservations/availability?restaurantId=${state.restaurantId}&date=2026-05-20&guests=2`,
    );
    assert(availability.status === 200, `reservation availability returned ${availability.status}`);

    const queueJoin = await request(url, 'POST', '/api/v1/public/queue/join', {
      body: { restaurantId: state.restaurantId, customerName: 'Queue Guest', guests: 3 },
    });
    assert(queueJoin.status === 201, `queue join returned ${queueJoin.status}`);
    state.queueId = getId(queueJoin.json?.data?.queueEntry);
    assert(state.queueId, 'Queue id missing');

    const overview = await request(url, 'GET', '/api/v1/admin/restaurant/overview', {
      token: state.admin.accessToken,
    });
    assert(overview.status === 200, `admin overview returned ${overview.status}`);

    const settings = await request(url, 'GET', '/api/v1/admin/restaurant/settings', {
      token: state.admin.accessToken,
    });
    assert(settings.status === 200, `admin settings returned ${settings.status}`);

    const updateSettings = await request(url, 'PATCH', '/api/v1/admin/restaurant/settings', {
      token: state.admin.accessToken,
      body: { sessionDurationMinutes: 120, serviceChargeEnabled: false },
    });
    assert(updateSettings.status === 200, `admin settings patch returned ${updateSettings.status}`);

    const createTable = await request(url, 'POST', '/api/v1/admin/tables', {
      token: state.admin.accessToken,
      body: { name: `VERIFY-T${uniqueTableNumber}`, number: uniqueTableNumber, floor: 2, section: 'Verify', capacity: 4 },
    });
    assert(createTable.status === 201, `create table returned ${createTable.status}`);
    state.createdTableId = getId(createTable.json?.data?.table);
    assert(state.createdTableId, 'Created table id missing');

    const listTables = await request(url, 'GET', '/api/v1/admin/tables', {
      token: state.admin.accessToken,
    });
    assert(listTables.status === 200, `list tables returned ${listTables.status}`);

    const getTable = await request(url, 'GET', `/api/v1/admin/tables/${state.createdTableId}`, {
      token: state.admin.accessToken,
    });
    assert(getTable.status === 200, `get table returned ${getTable.status}`);

    const updateTable = await request(url, 'PATCH', `/api/v1/admin/tables/${state.createdTableId}`, {
      token: state.admin.accessToken,
      body: { section: 'Verify Updated', capacity: 6 },
    });
    assert(updateTable.status === 200, `update table returned ${updateTable.status}`);

    const bulkCreate = await request(url, 'POST', '/api/v1/admin/tables/bulk', {
      token: state.admin.accessToken,
      body: {
        tables: [
          { name: 'VERIFY-T2', number: 82, floor: 1, section: 'Verify', capacity: 2 },
          { name: 'VERIFY-T3', number: 83, floor: 1, section: 'Verify', capacity: 2 },
        ],
      },
    });
    assert(bulkCreate.status === 201, `bulk create tables returned ${bulkCreate.status}`);

    const generateQr = await request(url, 'POST', `/api/v1/admin/tables/${state.createdTableId}/qr`, {
      token: state.admin.accessToken,
    });
    assert(generateQr.status === 200, `generate qr returned ${generateQr.status}`);
    state.createdQrToken = generateQr.json?.data?.qrToken;
    assert(state.createdQrToken, 'QR token missing');

    const getQr = await request(url, 'GET', `/api/v1/admin/tables/${state.createdTableId}/qr`, {
      token: state.admin.accessToken,
    });
    assert(getQr.status === 200, `get qr returned ${getQr.status}`);

    const createSession = await request(url, 'POST', '/api/v1/public/table-session/create', {
      body: {
        token: state.createdQrToken,
        customerName: 'Phase1 Guest',
        mobile: '9876543210',
        partySize: 2,
      },
    });
    assert(createSession.status === 201, `create table session returned ${createSession.status}`);
    state.createdSessionToken =
      createSession.json?.data?.session?.token ?? createSession.json?.data?.sessionToken ?? '';
    assert(state.createdSessionToken, 'Created session token missing');

    const validateSession = await request(url, 'POST', '/api/v1/public/table-session/validate', {
      body: { token: state.createdSessionToken },
    });
    assert(validateSession.status === 200, `validate table session returned ${validateSession.status}`);
  });

  await runStep('customer menu cart order payment flow', async () => {
    const sessionToken = state.createdSessionToken;

    const session = await request(url, 'GET', '/api/v1/customer/session', { sessionToken });
    assert(session.status === 200, `customer session returned ${session.status}`);

    const extend = await request(url, 'PATCH', '/api/v1/customer/session/extend', { sessionToken });
    assert(extend.status === 200, `customer session extend returned ${extend.status}`);

    const categories = await request(url, 'GET', '/api/v1/customer/menu/categories', { sessionToken });
    assert(categories.status === 200, `customer categories returned ${categories.status}`);

    const items = await request(url, 'GET', '/api/v1/customer/menu/items?veg=true&sortBy=price', { sessionToken });
    assert(items.status === 200, `customer menu items returned ${items.status}`);
    const menuItems = items.json?.data?.items ?? [];
    const menuItem = menuItems.find((item) => item?.isAvailable !== false) ?? menuItems[0];
    const menuItemId = getId(menuItem);
    assert(menuItemId, 'No menu item available for customer flow');

    const itemDetails = await request(url, 'GET', `/api/v1/customer/menu/items/${menuItemId}`, { sessionToken });
    assert(itemDetails.status === 200, `customer menu item details returned ${itemDetails.status}`);

    const cart = await request(url, 'GET', '/api/v1/customer/cart', { sessionToken });
    assert(cart.status === 200, `customer cart returned ${cart.status}`);

    const addCartItem = await request(url, 'POST', '/api/v1/customer/cart/items', {
      sessionToken,
      body: { menuItem: menuItemId, quantity: 2, notes: 'verify spicy' },
    });
    assert(addCartItem.status === 201, `add cart item returned ${addCartItem.status}`);
    state.createdCartItemId = getId(last(addCartItem.json?.data?.items));
    assert(state.createdCartItemId, 'Created cart item id missing');

    const updateCartItem = await request(url, 'PATCH', `/api/v1/customer/cart/items/${state.createdCartItemId}`, {
      sessionToken,
      body: { quantity: 3, notes: 'verify updated' },
    });
    assert(updateCartItem.status === 200, `update cart item returned ${updateCartItem.status}`);

    const addRemovableCartItem = await request(url, 'POST', '/api/v1/customer/cart/items', {
      sessionToken,
      body: { menuItem: menuItemId, quantity: 1, notes: 'remove me' },
    });
    assert(addRemovableCartItem.status === 201, `add removable cart item returned ${addRemovableCartItem.status}`);
    const removableCartItemId = getId(last(addRemovableCartItem.json?.data?.items));
    assert(removableCartItemId, 'Removable cart item id missing');

    const removeCartItem = await request(url, 'DELETE', `/api/v1/customer/cart/items/${removableCartItemId}`, {
      sessionToken,
    });
    assert(removeCartItem.status === 200, `remove cart item returned ${removeCartItem.status}`);

    const createOrder = await request(url, 'POST', '/api/v1/customer/orders', {
      sessionToken,
      body: { specialInstructions: 'Less oil please' },
    });
    assert(createOrder.status === 201, `create order returned ${createOrder.status}`);
    state.createdOrderId = getId(createOrder.json?.data?.order);
    assert(state.createdOrderId, 'Created order id missing');

    const listOrders = await request(url, 'GET', '/api/v1/customer/orders?page=1&limit=5', { sessionToken });
    assert(listOrders.status === 200, `list customer orders returned ${listOrders.status}`);

    const orderDetails = await request(url, 'GET', `/api/v1/customer/orders/${state.createdOrderId}`, {
      sessionToken,
    });
    assert(orderDetails.status === 200, `customer order details returned ${orderDetails.status}`);

    const waiterRequest = await request(url, 'POST', '/api/v1/customer/requests/waiter', { sessionToken });
    assert(waiterRequest.status === 201, `customer waiter request returned ${waiterRequest.status}`);
    state.createdRequestId = getId(waiterRequest.json?.data?.request);

    const bill = await request(url, 'GET', '/api/v1/customer/bill', { sessionToken });
    assert(bill.status === 200, `customer bill returned ${bill.status}`);

    const billRequest = await request(url, 'POST', '/api/v1/customer/bill/request', { sessionToken });
    assert(billRequest.status === 200, `customer bill request returned ${billRequest.status}`);

    const applyCoupon = await request(url, 'POST', '/api/v1/customer/bill/coupon', {
      sessionToken,
      body: { code: 'LUNCH10' },
    });
    assert(applyCoupon.status === 200, `apply coupon returned ${applyCoupon.status}`);

    const removeCoupon = await request(url, 'DELETE', '/api/v1/customer/bill/coupon/LUNCH10', { sessionToken });
    assert(removeCoupon.status === 200, `remove coupon returned ${removeCoupon.status}`);

    const paymentAmount = createOrder.json?.data?.order?.finalAmount ?? 0;
    const createPayment = await request(url, 'POST', '/api/v1/customer/payments/create', {
      sessionToken,
      body: { orderId: state.createdOrderId, amount: paymentAmount, method: 'UPI' },
    });
    assert(createPayment.status === 201, `create payment returned ${createPayment.status}`);
    state.createdPaymentId = getId(createPayment.json?.data?.payment);
    assert(state.createdPaymentId, 'Created payment id missing');

    const verifyPayment = await request(url, 'POST', '/api/v1/customer/payments/verify', {
      sessionToken,
      body: { paymentId: state.createdPaymentId },
    });
    assert(verifyPayment.status === 200, `verify payment returned ${verifyPayment.status}`);

    const paymentStatus = await request(
      url,
      'GET',
      `/api/v1/customer/payments/${state.createdPaymentId}/status`,
      { sessionToken },
    );
    assert(paymentStatus.status === 200, `payment status returned ${paymentStatus.status}`);

    const feedback = await request(url, 'POST', '/api/v1/customer/feedback', {
      sessionToken,
      body: { rating: 5, comment: 'Phase1 verify feedback' },
    });
    assert(feedback.status === 201, `create feedback returned ${feedback.status}`);
    state.createdFeedbackId = getId(feedback.json?.data?.feedback);

    const feedbackList = await request(url, 'GET', '/api/v1/customer/feedback', { sessionToken });
    assert(feedbackList.status === 200, `feedback list returned ${feedbackList.status}`);

    const loyalty = await request(url, 'GET', '/api/v1/customer/loyalty', { sessionToken });
    assert(loyalty.status === 200, `loyalty returned ${loyalty.status}`);

    const offers = await request(url, 'GET', '/api/v1/customer/offers', { sessionToken });
    assert(offers.status === 200, `offers returned ${offers.status}`);

    const eligibility = await request(url, 'GET', '/api/v1/customer/offers/eligibility', { sessionToken });
    assert(eligibility.status === 200, `offer eligibility returned ${eligibility.status}`);

    const reorder = await request(url, 'POST', `/api/v1/customer/orders/${state.createdOrderId}/reorder`, {
      sessionToken,
    });
    assert(reorder.status === 200, `reorder returned ${reorder.status}`);
    state.reorderedOrderId = getId(reorder.json?.data?.order);
    assert(state.reorderedOrderId, 'Reordered order id missing');

    const cancelCandidate = await request(url, 'POST', `/api/v1/customer/orders/${state.createdOrderId}/reorder`, {
      sessionToken,
    });
    assert(cancelCandidate.status === 200, `cancel candidate reorder returned ${cancelCandidate.status}`);
    state.cancelCandidateOrderId = getId(cancelCandidate.json?.data?.order);
    assert(state.cancelCandidateOrderId, 'Cancel candidate order id missing');

    const cancel = await request(url, 'POST', `/api/v1/customer/orders/${state.cancelCandidateOrderId}/cancel`, {
      sessionToken,
    });
    assert(cancel.status === 200, `cancel order returned ${cancel.status}`);

    const clearCart = await request(url, 'DELETE', '/api/v1/customer/cart', { sessionToken });
    assert(clearCart.status === 200, `clear cart returned ${clearCart.status}`);
  });

  await runStep('staff kitchen cleaning super-admin shared flows', async () => {
    const staffTables = await request(url, 'GET', '/api/v1/staff/tables', { token: state.staff.accessToken });
    assert(staffTables.status === 200, `staff tables returned ${staffTables.status}`);
    const staffTableId = getId(staffTables.json?.data?.tables?.[0]);
    assert(staffTableId, 'No staff table id available');

    const staffTable = await request(url, 'GET', `/api/v1/staff/tables/${staffTableId}`, {
      token: state.staff.accessToken,
    });
    assert(staffTable.status === 200, `staff table details returned ${staffTable.status}`);

    const assignTable = await request(url, 'PATCH', `/api/v1/staff/tables/${staffTableId}/assign`, {
      token: state.staff.accessToken,
      body: { staffId: state.staff.user.id ?? state.staff.user._id },
    });
    assert(assignTable.status === 200, `assign table returned ${assignTable.status}`);

    const reservations = await request(url, 'GET', '/api/v1/staff/reservations', {
      token: state.staff.accessToken,
    });
    assert(reservations.status === 200, `reservations returned ${reservations.status}`);
    state.reservationId = getId(reservations.json?.data?.reservations?.[0]);
    assert(state.reservationId, 'Reservation id missing');

    const reserveTable = await request(url, 'PATCH', `/api/v1/staff/tables/${staffTableId}/reserve`, {
      token: state.staff.accessToken,
      body: { reservationId: state.reservationId },
    });
    assert(reserveTable.status === 200, `reserve table returned ${reserveTable.status}`);

    const occupyTable = await request(url, 'PATCH', `/api/v1/staff/tables/${staffTableId}/occupy`, {
      token: state.staff.accessToken,
    });
    assert(occupyTable.status === 200, `occupy table returned ${occupyTable.status}`);

    const queue = await request(url, 'GET', '/api/v1/staff/queue', { token: state.staff.accessToken });
    assert(queue.status === 200, `staff queue returned ${queue.status}`);
    const queueId = state.queueId || getId(queue.json?.data?.entries?.[0]);
    assert(queueId, 'Queue id missing for staff flow');

    const queueDetails = await request(url, 'GET', `/api/v1/staff/queue/${queueId}`, {
      token: state.staff.accessToken,
    });
    assert(queueDetails.status === 200, `queue details returned ${queueDetails.status}`);

    const queuePriority = await request(url, 'PATCH', `/api/v1/staff/queue/${queueId}/priority`, {
      token: state.staff.accessToken,
      body: { priority: 'HIGH' },
    });
    assert(queuePriority.status === 200, `queue priority returned ${queuePriority.status}`);

    const reservationDetail = await request(url, 'GET', `/api/v1/staff/reservations/${state.reservationId}`, {
      token: state.staff.accessToken,
    });
    assert(reservationDetail.status === 200, `reservation detail returned ${reservationDetail.status}`);

    const checkIn = await request(url, 'PATCH', `/api/v1/staff/reservations/${state.reservationId}/check-in`, {
      token: state.staff.accessToken,
      body: { staffId: state.staff.user.id ?? state.staff.user._id },
    });
    assert(checkIn.status === 200, `reservation check-in returned ${checkIn.status}`);

    const readyOrders = await request(url, 'GET', '/api/v1/staff/orders/ready', {
      token: state.staff.accessToken,
    });
    assert(readyOrders.status === 200, `ready orders returned ${readyOrders.status}`);
    state.readyOrderId = getId(readyOrders.json?.data?.orders?.[0]);
    assert(state.readyOrderId, 'Ready order id missing');

    const pickReadyOrder = await request(url, 'PATCH', `/api/v1/staff/orders/${state.readyOrderId}/pick`, {
      token: state.staff.accessToken,
    });
    assert(pickReadyOrder.status === 200, `pick ready order returned ${pickReadyOrder.status}`);

    const serveReadyOrder = await request(url, 'PATCH', `/api/v1/staff/orders/${state.readyOrderId}/serve`, {
      token: state.staff.accessToken,
    });
    assert(serveReadyOrder.status === 200, `serve ready order returned ${serveReadyOrder.status}`);

    const requests = await request(url, 'GET', '/api/v1/staff/requests', { token: state.staff.accessToken });
    assert(requests.status === 200, `staff requests returned ${requests.status}`);

    const acceptRequest = await request(url, 'PATCH', `/api/v1/staff/requests/${state.createdRequestId}/accept`, {
      token: state.staff.accessToken,
      body: { staffId: state.staff.user.id ?? state.staff.user._id },
    });
    assert(acceptRequest.status === 200, `accept request returned ${acceptRequest.status}`);

    const completeRequest = await request(
      url,
      'PATCH',
      `/api/v1/staff/requests/${state.createdRequestId}/complete`,
      { token: state.staff.accessToken },
    );
    assert(completeRequest.status === 200, `complete request returned ${completeRequest.status}`);

    const escalateIssue = await request(url, 'POST', '/api/v1/staff/issues/escalate', {
      token: state.staff.accessToken,
      body: { staffId: state.staff.user.id ?? state.staff.user._id, entityId: staffTableId },
    });
    assert(escalateIssue.status === 201, `escalate issue returned ${escalateIssue.status}`);

    const kitchenDashboard = await request(url, 'GET', '/api/v1/kitchen/dashboard', {
      token: state.kitchen.accessToken,
    });
    assert(kitchenDashboard.status === 200, `kitchen dashboard returned ${kitchenDashboard.status}`);

    const kitchenOrders = await request(url, 'GET', '/api/v1/kitchen/orders', {
      token: state.kitchen.accessToken,
    });
    assert(kitchenOrders.status === 200, `kitchen orders returned ${kitchenOrders.status}`);

    const kitchenOrderDetails = await request(url, 'GET', `/api/v1/kitchen/orders/${state.createdOrderId}`, {
      token: state.kitchen.accessToken,
    });
    assert(kitchenOrderDetails.status === 200, `kitchen order details returned ${kitchenOrderDetails.status}`);

    const acceptOrder = await request(url, 'PATCH', `/api/v1/kitchen/orders/${state.createdOrderId}/accept`, {
      token: state.kitchen.accessToken,
      body: { estimatedPreparationTime: 12 },
    });
    assert(acceptOrder.status === 200, `accept order returned ${acceptOrder.status}`);

    const startCooking = await request(url, 'PATCH', `/api/v1/kitchen/orders/${state.createdOrderId}/start`, {
      token: state.kitchen.accessToken,
    });
    assert(startCooking.status === 200, `start cooking returned ${startCooking.status}`);

    const delayOrder = await request(url, 'PATCH', `/api/v1/kitchen/orders/${state.createdOrderId}/delay`, {
      token: state.kitchen.accessToken,
      body: { delayMinutes: 5 },
    });
    assert(delayOrder.status === 200, `delay order returned ${delayOrder.status}`);

    const readyOrder = await request(url, 'PATCH', `/api/v1/kitchen/orders/${state.createdOrderId}/ready`, {
      token: state.kitchen.accessToken,
    });
    assert(readyOrder.status === 200, `ready order returned ${readyOrder.status}`);

    const rejectOrder = await request(url, 'PATCH', `/api/v1/kitchen/orders/${state.reorderedOrderId}/reject`, {
      token: state.kitchen.accessToken,
      body: { reason: 'Verification reject path' },
    });
    assert(rejectOrder.status === 200, `reject order returned ${rejectOrder.status}`);

    const createBatch = await request(url, 'POST', '/api/v1/kitchen/batches', {
      token: state.kitchen.accessToken,
      body: { name: 'Phase1 Verify Batch', orderIds: [state.createdOrderId], station: 'Hot Line' },
    });
    assert(createBatch.status === 201, `create batch returned ${createBatch.status}`);
    state.createdBatchId = getId(createBatch.json?.data?.batch);
    assert(state.createdBatchId, 'Created batch id missing');

    const batches = await request(url, 'GET', '/api/v1/kitchen/batches', { token: state.kitchen.accessToken });
    assert(batches.status === 200, `list batches returned ${batches.status}`);

    const batchDetails = await request(url, 'GET', `/api/v1/kitchen/batches/${state.createdBatchId}`, {
      token: state.kitchen.accessToken,
    });
    assert(batchDetails.status === 200, `batch details returned ${batchDetails.status}`);

    const updateBatch = await request(url, 'PATCH', `/api/v1/kitchen/batches/${state.createdBatchId}`, {
      token: state.kitchen.accessToken,
      body: { name: 'Phase1 Verify Batch Updated', status: 'COMPLETE' },
    });
    assert(updateBatch.status === 200, `update batch returned ${updateBatch.status}`);

    const kitchenLoad = await request(url, 'GET', '/api/v1/kitchen/load', { token: state.kitchen.accessToken });
    assert(kitchenLoad.status === 200, `kitchen load returned ${kitchenLoad.status}`);

    const kitchenPerformance = await request(url, 'GET', '/api/v1/kitchen/performance', {
      token: state.kitchen.accessToken,
    });
    assert(kitchenPerformance.status === 200, `kitchen performance returned ${kitchenPerformance.status}`);

    const cleaningTasks = await request(url, 'GET', '/api/v1/cleaning/tasks', {
      token: state.cleaning.accessToken,
    });
    assert(cleaningTasks.status === 200, `cleaning tasks returned ${cleaningTasks.status}`);
    state.cleaningTaskId = getId(cleaningTasks.json?.data?.tasks?.[0]);
    assert(state.cleaningTaskId, 'Cleaning task id missing');

    const cleaningTask = await request(url, 'GET', `/api/v1/cleaning/tasks/${state.cleaningTaskId}`, {
      token: state.cleaning.accessToken,
    });
    assert(cleaningTask.status === 200, `cleaning task details returned ${cleaningTask.status}`);

    const startCleaning = await request(url, 'PATCH', `/api/v1/cleaning/tasks/${state.cleaningTaskId}/start`, {
      token: state.cleaning.accessToken,
      body: { staffId: state.cleaning.user.id ?? state.cleaning.user._id },
    });
    assert(startCleaning.status === 200, `start cleaning task returned ${startCleaning.status}`);

    const completeCleaning = await request(
      url,
      'PATCH',
      `/api/v1/cleaning/tasks/${state.cleaningTaskId}/complete`,
      { token: state.cleaning.accessToken },
    );
    assert(completeCleaning.status === 200, `complete cleaning task returned ${completeCleaning.status}`);

    const verifyCleaning = await request(url, 'PATCH', `/api/v1/cleaning/tasks/${state.cleaningTaskId}/verify`, {
      token: state.cleaning.accessToken,
      body: { verifiedBy: state.staff.user.id ?? state.staff.user._id },
    });
    assert(verifyCleaning.status === 200, `verify cleaning task returned ${verifyCleaning.status}`);

    const platformOverview = await request(url, 'GET', '/api/v1/super-admin/platform/overview', {
      token: state.superAdmin.accessToken,
    });
    assert(platformOverview.status === 200, `platform overview returned ${platformOverview.status}`);

    const restaurants = await request(url, 'GET', '/api/v1/super-admin/restaurants?status=PENDING', {
      token: state.superAdmin.accessToken,
    });
    assert(restaurants.status === 200, `super-admin restaurants returned ${restaurants.status}`);
    state.pendingRestaurantId = getId(restaurants.json?.data?.restaurants?.[0]);
    assert(state.pendingRestaurantId, 'Pending restaurant id missing');

    const restaurantDetails = await request(
      url,
      'GET',
      `/api/v1/super-admin/restaurants/${state.pendingRestaurantId}`,
      { token: state.superAdmin.accessToken },
    );
    assert(restaurantDetails.status === 200, `super-admin restaurant details returned ${restaurantDetails.status}`);

    const approveRestaurant = await request(
      url,
      'PATCH',
      `/api/v1/super-admin/restaurants/${state.pendingRestaurantId}/approve`,
      { token: state.superAdmin.accessToken, body: { actorId: state.superAdmin.user.id ?? state.superAdmin.user._id } },
    );
    assert(approveRestaurant.status === 200, `approve restaurant returned ${approveRestaurant.status}`);

    const suspendRestaurant = await request(
      url,
      'PATCH',
      `/api/v1/super-admin/restaurants/${state.pendingRestaurantId}/suspend`,
      { token: state.superAdmin.accessToken, body: { actorId: state.superAdmin.user.id ?? state.superAdmin.user._id } },
    );
    assert(suspendRestaurant.status === 200, `suspend restaurant returned ${suspendRestaurant.status}`);

    const createPlan = await request(url, 'POST', '/api/v1/super-admin/plans', {
      token: state.superAdmin.accessToken,
      body: { name: 'PHASE1_VERIFY', priceMonthly: 9999, tenantLimit: 3 },
    });
    assert(createPlan.status === 201, `create plan returned ${createPlan.status}`);
    state.createdPlanId = getId(createPlan.json?.data?.plan);
    assert(state.createdPlanId, 'Created plan id missing');

    const plans = await request(url, 'GET', '/api/v1/super-admin/plans', {
      token: state.superAdmin.accessToken,
    });
    assert(plans.status === 200, `list plans returned ${plans.status}`);

    const updatePlan = await request(url, 'PATCH', `/api/v1/super-admin/plans/${state.createdPlanId}`, {
      token: state.superAdmin.accessToken,
      body: { priceMonthly: 10999 },
    });
    assert(updatePlan.status === 200, `update plan returned ${updatePlan.status}`);

    const revenueAnalytics = await request(url, 'GET', '/api/v1/super-admin/analytics/revenue', {
      token: state.superAdmin.accessToken,
    });
    assert(revenueAnalytics.status === 200, `revenue analytics returned ${revenueAnalytics.status}`);

    const tenantAnalytics = await request(url, 'GET', '/api/v1/super-admin/analytics/tenants', {
      token: state.superAdmin.accessToken,
    });
    assert(tenantAnalytics.status === 200, `tenant analytics returned ${tenantAnalytics.status}`);

    const monitoring = await request(url, 'GET', '/api/v1/super-admin/system/monitoring', {
      token: state.superAdmin.accessToken,
    });
    assert(monitoring.status === 200, `system monitoring returned ${monitoring.status}`);

    const auditLogs = await request(url, 'GET', '/api/v1/super-admin/audit-logs', {
      token: state.superAdmin.accessToken,
    });
    assert(auditLogs.status === 200, `audit logs returned ${auditLogs.status}`);

    const featureFlags = await request(url, 'GET', '/api/v1/super-admin/feature-flags', {
      token: state.superAdmin.accessToken,
    });
    assert(featureFlags.status === 200, `feature flags returned ${featureFlags.status}`);
    state.featureFlagId = getId(featureFlags.json?.data?.featureFlags?.[0]);
    assert(state.featureFlagId, 'Feature flag id missing');

    const updateFeatureFlag = await request(url, 'PATCH', `/api/v1/super-admin/feature-flags/${state.featureFlagId}`, {
      token: state.superAdmin.accessToken,
      body: { enabled: false },
    });
    assert(updateFeatureFlag.status === 200, `update feature flag returned ${updateFeatureFlag.status}`);

    const notifications = await request(url, 'GET', '/api/v1/notifications', {
      token: state.admin.accessToken,
    });
    assert(notifications.status === 200, `notifications returned ${notifications.status}`);
    state.notificationId = getId(notifications.json?.data?.notifications?.[0]);
    assert(state.notificationId, 'Notification id missing');

    const readNotification = await request(url, 'PATCH', `/api/v1/notifications/${state.notificationId}/read`, {
      token: state.admin.accessToken,
    });
    assert(readNotification.status === 200, `mark notification read returned ${readNotification.status}`);

    const readAllNotifications = await request(url, 'PATCH', '/api/v1/notifications/read-all', {
      token: state.admin.accessToken,
    });
    assert(readAllNotifications.status === 200, `mark all notifications read returned ${readAllNotifications.status}`);

    const upload = await request(url, 'POST', '/api/v1/uploads', {
      token: state.admin.accessToken,
      body: { fileName: 'phase1-verify.png' },
    });
    assert(upload.status === 201, `upload returned ${upload.status}`);

    const search = await request(url, 'GET', '/api/v1/search?q=pizza', { token: state.admin.accessToken });
    assert(search.status === 200, `search returned ${search.status}`);
  });

  await runStep('rbac and cleanup flow', async () => {
    const forbidden = await request(url, 'GET', '/api/v1/admin/tables', {
      token: state.customer.accessToken,
    });
    assert(forbidden.status === 403, `customer admin access should be 403, got ${forbidden.status}`);

    const unauthorized = await request(url, 'GET', '/api/v1/admin/tables');
    assert(unauthorized.status === 401, `missing token should be 401, got ${unauthorized.status}`);

    const endCustomerSession = await request(url, 'POST', '/api/v1/customer/session/end', {
      sessionToken: state.createdSessionToken,
    });
    assert(endCustomerSession.status === 200, `end session returned ${endCustomerSession.status}`);

    const deleteTable = await request(url, 'DELETE', `/api/v1/admin/tables/${state.createdTableId}`, {
      token: state.admin.accessToken,
    });
    assert(deleteTable.status === 200, `delete created table returned ${deleteTable.status}`);
  });

  const passed = results.filter((entry) => entry.passed).length;
  return {
    passed,
    failed: results.length - passed,
    total: results.length,
    results,
  };
}

async function main() {
  const mongod = await MongoMemoryServer.create({
    instance: {
      dbName: 'restaurant-automation-verify',
    },
  });

  const server = spawn(process.execPath, [path.join(backendDir, 'dist', 'server.js')], {
    cwd: backendDir,
    env: {
      ...process.env,
      NODE_ENV: 'development',
      PORT: String(port),
      API_PREFIX: '/api/v1',
      MONGODB_URI: mongod.getUri(),
      MONGODB_CONNECT_TIMEOUT_MS: '5000',
      ALLOW_NO_DB: 'false',
      SEED_ON_STARTUP: 'true',
      JWT_SECRET: 'phase1-verify-secret',
      JWT_REFRESH_SECRET: 'phase1-verify-refresh-secret',
      COOKIE_SECRET: 'phase1-verify-cookie-secret',
      CORS_ORIGIN: 'http://localhost:5173',
      SOCKET_CORS_ORIGIN: 'http://localhost:5173',
      ENABLE_REQUEST_LOGS: 'false',
      HELMET_ENABLED: 'false',
      TRUST_PROXY: 'false',
      RATE_LIMIT_MAX: '1000',
      RATE_LIMIT_MAX_REQUESTS: '1000',
      AUTH_RATE_LIMIT_MAX_REQUESTS: '200',
      SMTP_HOST: '',
      SMTP_USER: '',
      SMTP_PASS: '',
      SMTP_FROM: 'noreply@example.com',
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  let stdout = '';
  let stderr = '';
  server.stdout.on('data', (chunk) => {
    stdout += chunk.toString();
  });
  server.stderr.on('data', (chunk) => {
    stderr += chunk.toString();
  });

  try {
    await waitForHealth(baseUrl);
    const postman = await runNewmanSuite(baseUrl);
    const smoke = await runSmokeSuite(baseUrl);

    const summary = {
      postman,
      smoke,
    };

    console.log(JSON.stringify(summary, null, 2));

    if (postman.failures.length > 0 || smoke.failed > 0) {
      process.exitCode = 1;
    }
  } catch (error) {
    console.error(
      JSON.stringify(
        {
          fatal: true,
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
          serverLogs: {
            stdout,
            stderr,
          },
        },
        null,
        2,
      ),
    );
    process.exitCode = 1;
  } finally {
    server.kill('SIGTERM');
    await new Promise((resolve) => server.on('exit', resolve));
    await mongod.stop();
  }
}

await main();
