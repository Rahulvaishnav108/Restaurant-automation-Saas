# Backend API Audit Test Script
$baseUrl = "http://localhost:5000"
$apiUrl = "$baseUrl/api/v1"

function Test-Api {
    param(
        [string]$Method,
        [string]$Url,
        [string]$Body = $null,
        [hashtable]$Headers = @{},
        [string]$Label
    )
    
    Write-Host "`n=== $Label ===" -ForegroundColor Cyan
    Write-Host "$Method $Url"
    
    try {
        $params = @{
            Uri = $Url
            Method = $Method
            ContentType = 'application/json'
            UseBasicParsing = $true
        }
        if ($Body) { $params.Body = $Body }
        if ($Headers.Count -gt 0) { $params.Headers = $Headers }
        
        $resp = Invoke-WebRequest @params
        Write-Host "STATUS: $($resp.StatusCode)" -ForegroundColor Green
        Write-Host "RESPONSE: $($resp.Content)"
        return @{ Status = $resp.StatusCode; Content = ($resp.Content | ConvertFrom-Json); Raw = $resp.Content }
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        $errorBody = ""
        try {
            $stream = $_.Exception.Response.GetResponseStream()
            $reader = New-Object System.IO.StreamReader($stream)
            $errorBody = $reader.ReadToEnd()
        } catch {}
        Write-Host "STATUS: $statusCode" -ForegroundColor Red
        Write-Host "ERROR: $errorBody"
        return @{ Status = $statusCode; Content = $errorBody; Error = $true }
    }
}

Write-Host "========================================" -ForegroundColor Yellow
Write-Host "  BACKEND API AUDIT - REAL VERIFICATION" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Yellow

# ---- PHASE 1: Health Endpoints ----
Write-Host "`n`n### PHASE 1: HEALTH ENDPOINTS ###" -ForegroundColor Yellow
Test-Api -Method GET -Url "$baseUrl/" -Label "Root Endpoint"
Test-Api -Method GET -Url "$baseUrl/health" -Label "Health Check"
Test-Api -Method GET -Url "$baseUrl/ready" -Label "Readiness Check"
Test-Api -Method GET -Url "$baseUrl/version" -Label "Version Check"
Test-Api -Method GET -Url "$apiUrl" -Label "API v1 Base"

# ---- PHASE 2: Auth APIs ----
Write-Host "`n`n### PHASE 2: AUTH APIs ###" -ForegroundColor Yellow

# Register
$regBody = '{"name":"Audit Test User","email":"audit_test_user@example.com","mobile":"9876543210","password":"AuditTest@123"}'
$regResult = Test-Api -Method POST -Url "$apiUrl/auth/register" -Body $regBody -Label "Auth Register"

# Login
$loginBody = '{"email":"audit_test_user@example.com","password":"AuditTest@123"}'
$loginResult = Test-Api -Method POST -Url "$apiUrl/auth/login" -Body $loginBody -Label "Auth Login"

$accessToken = ""
$refreshToken = ""
if (-not $loginResult.Error) {
    try {
        $accessToken = $loginResult.Content.data.accessToken
        $refreshToken = $loginResult.Content.data.refreshToken
        Write-Host "Access Token obtained: $($accessToken.Substring(0, 20))..." -ForegroundColor Green
    } catch {
        Write-Host "Could not extract tokens from login response" -ForegroundColor Red
    }
}

# Auth me
if ($accessToken) {
    $authHeaders = @{ "Authorization" = "Bearer $accessToken" }
    Test-Api -Method GET -Url "$apiUrl/auth/me" -Headers $authHeaders -Label "Auth Me"
    
    # Auth sessions
    Test-Api -Method GET -Url "$apiUrl/auth/sessions" -Headers $authHeaders -Label "Auth Sessions"
    
    # Refresh
    $refreshBody = "{`"refreshToken`":`"$refreshToken`"}"
    Test-Api -Method POST -Url "$apiUrl/auth/refresh" -Body $refreshBody -Headers $authHeaders -Label "Auth Refresh"
}

# Auth without token
Test-Api -Method GET -Url "$apiUrl/auth/me" -Label "Auth Me (No Token - should fail)"

# OTP endpoints
Test-Api -Method POST -Url "$apiUrl/auth/request-otp" -Body '{"email":"audit_test_user@example.com"}' -Label "Auth Request OTP"
Test-Api -Method POST -Url "$apiUrl/auth/verify-otp" -Body '{"email":"audit_test_user@example.com","otp":"123456"}' -Label "Auth Verify OTP"

# Forgot/Reset Password
Test-Api -Method POST -Url "$apiUrl/auth/forgot-password" -Body '{"email":"audit_test_user@example.com"}' -Label "Auth Forgot Password"
Test-Api -Method POST -Url "$apiUrl/auth/reset-password" -Body '{"token":"fake","password":"NewPass@123"}' -Label "Auth Reset Password"

# ---- PHASE 3: Public APIs ----
Write-Host "`n`n### PHASE 3: PUBLIC APIs ###" -ForegroundColor Yellow
Test-Api -Method GET -Url "$apiUrl/public/restaurants/test-restaurant" -Label "Public Restaurant Details"
Test-Api -Method GET -Url "$apiUrl/public/menu/000000000000000000000000" -Label "Public Menu"
Test-Api -Method POST -Url "$apiUrl/public/table-session/validate" -Body '{"token":"test-token"}' -Label "Public Table Session Validate"
Test-Api -Method POST -Url "$apiUrl/public/table-session/create" -Body '{"tableId":"000000000000000000000000","restaurantId":"000000000000000000000000"}' -Label "Public Table Session Create"
Test-Api -Method GET -Url "$apiUrl/public/reservations/availability?restaurantId=000000000000000000000000" -Label "Public Reservations Availability"
Test-Api -Method POST -Url "$apiUrl/public/queue/join" -Body '{"restaurantId":"000000000000000000000000","name":"Test","partySize":2}' -Label "Public Queue Join"

# ---- PHASE 4: Customer APIs ----
Write-Host "`n`n### PHASE 4: CUSTOMER APIs (Session-based) ###" -ForegroundColor Yellow
$sessionHeaders = @{ "x-session-token" = "fake-session-token" }
Test-Api -Method GET -Url "$apiUrl/customer/session" -Headers $sessionHeaders -Label "Customer Session"
Test-Api -Method GET -Url "$apiUrl/customer/menu/categories" -Headers $sessionHeaders -Label "Customer Menu Categories"
Test-Api -Method GET -Url "$apiUrl/customer/menu/items" -Headers $sessionHeaders -Label "Customer Menu Items"
Test-Api -Method GET -Url "$apiUrl/customer/cart" -Headers $sessionHeaders -Label "Customer Cart"
Test-Api -Method POST -Url "$apiUrl/customer/cart/items" -Body '{"menuItemId":"000000000000000000000000","quantity":1}' -Headers $sessionHeaders -Label "Customer Add to Cart"
Test-Api -Method GET -Url "$apiUrl/customer/orders" -Headers $sessionHeaders -Label "Customer Orders"
Test-Api -Method POST -Url "$apiUrl/customer/orders" -Body '{"items":[]}' -Headers $sessionHeaders -Label "Customer Place Order"
Test-Api -Method GET -Url "$apiUrl/customer/bill" -Headers $sessionHeaders -Label "Customer Bill"
Test-Api -Method POST -Url "$apiUrl/customer/bill/request" -Headers $sessionHeaders -Label "Customer Request Bill"
Test-Api -Method POST -Url "$apiUrl/customer/payments/create" -Body '{"orderId":"000000000000000000000000"}' -Headers $sessionHeaders -Label "Customer Create Payment"
Test-Api -Method POST -Url "$apiUrl/customer/feedback" -Body '{"rating":5,"comment":"Great"}' -Headers $sessionHeaders -Label "Customer Feedback"
Test-Api -Method GET -Url "$apiUrl/customer/loyalty" -Headers $sessionHeaders -Label "Customer Loyalty"
Test-Api -Method GET -Url "$apiUrl/customer/offers" -Headers $sessionHeaders -Label "Customer Offers"

# Customer assistance requests
Test-Api -Method POST -Url "$apiUrl/customer/requests/waiter" -Headers $sessionHeaders -Label "Customer Call Waiter"
Test-Api -Method POST -Url "$apiUrl/customer/requests/water" -Headers $sessionHeaders -Label "Customer Request Water"

# ---- PHASE 5: Staff APIs (JWT required) ----
Write-Host "`n`n### PHASE 5: STAFF APIs ###" -ForegroundColor Yellow
if ($accessToken) {
    Test-Api -Method GET -Url "$apiUrl/staff/tables" -Headers $authHeaders -Label "Staff Tables"
    Test-Api -Method GET -Url "$apiUrl/staff/queue" -Headers $authHeaders -Label "Staff Queue"
    Test-Api -Method GET -Url "$apiUrl/staff/reservations" -Headers $authHeaders -Label "Staff Reservations"
    Test-Api -Method GET -Url "$apiUrl/staff/orders/ready" -Headers $authHeaders -Label "Staff Ready Orders"
    Test-Api -Method GET -Url "$apiUrl/staff/requests" -Headers $authHeaders -Label "Staff Requests"
}
Test-Api -Method GET -Url "$apiUrl/staff/tables" -Label "Staff Tables (No Auth - should fail)"

# ---- PHASE 6: Kitchen APIs (JWT required) ----
Write-Host "`n`n### PHASE 6: KITCHEN APIs ###" -ForegroundColor Yellow
if ($accessToken) {
    Test-Api -Method GET -Url "$apiUrl/kitchen/dashboard" -Headers $authHeaders -Label "Kitchen Dashboard"
    Test-Api -Method GET -Url "$apiUrl/kitchen/orders" -Headers $authHeaders -Label "Kitchen Orders"
    Test-Api -Method GET -Url "$apiUrl/kitchen/batches" -Headers $authHeaders -Label "Kitchen Batches"
    Test-Api -Method GET -Url "$apiUrl/kitchen/load" -Headers $authHeaders -Label "Kitchen Load"
    Test-Api -Method GET -Url "$apiUrl/kitchen/performance" -Headers $authHeaders -Label "Kitchen Performance"
}

# ---- PHASE 7: Cleaning APIs ----
Write-Host "`n`n### PHASE 7: CLEANING APIs ###" -ForegroundColor Yellow
if ($accessToken) {
    Test-Api -Method GET -Url "$apiUrl/cleaning/tasks" -Headers $authHeaders -Label "Cleaning Tasks"
}

# ---- PHASE 8: Admin APIs ----
Write-Host "`n`n### PHASE 8: ADMIN APIs ###" -ForegroundColor Yellow
if ($accessToken) {
    Test-Api -Method GET -Url "$apiUrl/admin/restaurant/overview" -Headers $authHeaders -Label "Admin Restaurant Overview"
    Test-Api -Method GET -Url "$apiUrl/admin/restaurant/settings" -Headers $authHeaders -Label "Admin Restaurant Settings"
    Test-Api -Method GET -Url "$apiUrl/admin/tables" -Headers $authHeaders -Label "Admin Tables"
    Test-Api -Method GET -Url "$apiUrl/admin/menu/categories" -Headers $authHeaders -Label "Admin Menu Categories"
    Test-Api -Method GET -Url "$apiUrl/admin/menu/items" -Headers $authHeaders -Label "Admin Menu Items"
    Test-Api -Method GET -Url "$apiUrl/admin/staff" -Headers $authHeaders -Label "Admin Staff"
    Test-Api -Method GET -Url "$apiUrl/admin/offers" -Headers $authHeaders -Label "Admin Offers"
    Test-Api -Method GET -Url "$apiUrl/admin/loyalty/rules" -Headers $authHeaders -Label "Admin Loyalty Rules"
    Test-Api -Method GET -Url "$apiUrl/admin/billing/revenue" -Headers $authHeaders -Label "Admin Billing Revenue"
    Test-Api -Method GET -Url "$apiUrl/admin/analytics/revenue" -Headers $authHeaders -Label "Admin Analytics Revenue"
    Test-Api -Method GET -Url "$apiUrl/admin/inventory" -Headers $authHeaders -Label "Admin Inventory"
}

# ---- PHASE 9: Super Admin APIs ----
Write-Host "`n`n### PHASE 9: SUPER ADMIN APIs ###" -ForegroundColor Yellow
if ($accessToken) {
    Test-Api -Method GET -Url "$apiUrl/super-admin/platform/overview" -Headers $authHeaders -Label "Super Admin Platform Overview"
    Test-Api -Method GET -Url "$apiUrl/super-admin/restaurants" -Headers $authHeaders -Label "Super Admin Restaurants"
    Test-Api -Method GET -Url "$apiUrl/super-admin/plans" -Headers $authHeaders -Label "Super Admin Plans"
    Test-Api -Method GET -Url "$apiUrl/super-admin/analytics/revenue" -Headers $authHeaders -Label "Super Admin Analytics Revenue"
    Test-Api -Method GET -Url "$apiUrl/super-admin/audit-logs" -Headers $authHeaders -Label "Super Admin Audit Logs"
    Test-Api -Method GET -Url "$apiUrl/super-admin/feature-flags" -Headers $authHeaders -Label "Super Admin Feature Flags"
}

# ---- PHASE 10: Shared Utility APIs ----
Write-Host "`n`n### PHASE 10: SHARED UTILITY APIs ###" -ForegroundColor Yellow
if ($accessToken) {
    Test-Api -Method GET -Url "$apiUrl/notifications" -Headers $authHeaders -Label "Notifications List"
    Test-Api -Method GET -Url "$apiUrl/search?q=pizza" -Headers $authHeaders -Label "Global Search"
}

# ---- PHASE 11: Table/Session Management ----
Write-Host "`n`n### PHASE 11: TABLE & SESSION MANAGEMENT ###" -ForegroundColor Yellow
if ($accessToken) {
    Test-Api -Method GET -Url "$apiUrl/tables" -Headers $authHeaders -Label "Tables List (Direct Route)"
    Test-Api -Method GET -Url "$apiUrl/sessions" -Headers $authHeaders -Label "Sessions List (Direct Route)"
}

# ---- PHASE 12: Billing Direct Routes ----
Write-Host "`n`n### PHASE 12: BILLING ROUTES ###" -ForegroundColor Yellow
if ($accessToken) {
    Test-Api -Method GET -Url "$apiUrl/customer/bill" -Headers $authHeaders -Label "Customer Bill (Auth)"
    Test-Api -Method GET -Url "$apiUrl/admin/billing/revenue" -Headers $authHeaders -Label "Admin Billing Revenue"
}

Write-Host "`n`n========================================" -ForegroundColor Yellow
Write-Host "  AUDIT COMPLETE" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Yellow
