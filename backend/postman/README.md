# Postman Assets

Import these files into the VS Code Postman extension:

- `collections/restaurant-automation-api.postman_collection.json`
- `environments/restaurant-automation-local.postman_environment.json`

Recommended local flow:

1. Start the backend with `npm run dev --workspace backend`
2. Select the `Restaurant Automation Local` environment
3. Run the login requests first to populate token variables
4. Run the admin table requests to populate `createdTableId` and `createdQrToken`
5. Run the public table-session create request to populate `createdSessionToken`

Seeded credentials in the environment:

- Admin: `admin@ambertable.com` / `Admin@123`
- Customer: `guest@ambertable.com` / `Guest@123`
- Staff: `staff@ambertable.com` / `Staff@123`
- Kitchen: `kitchen@ambertable.com` / `Kitchen@123`
- Cleaning: `cleaning@ambertable.com` / `Cleaning@123`
- Super Admin: `superadmin@graphura.com` / `Super@123`

Automated full-suite verification was also added in:

- `.codex/phase1-intense-test.mjs`

That script exercises the broad API surface across auth, public, admin, customer, staff, kitchen, cleaning, super-admin, shared, and RBAC flows.
