# Subscription Plan Architecture — Change Summary

## Plans Overview

| Feature | Free | Pro ($10/mo) | Pro Max ($15/mo) | Trial (when enabled) |
|---|---|---|---|---|
| Staff accounts | ❌ | 6 staff (7 total) | Unlimited | Unlimited |
| Export Excel | ❌ | ✅ | ✅ | ✅ |
| Oil Price Estimation | ❌ | ❌ | ✅ | ✅ |
| Create fuels / records | ✅ | ✅ | ✅ | ✅ |

---

## .env Keys You Can Change

```env
# ── Subscription Plan Configuration ───────────────────────────────
# Toggle free trial for new users (change this one key to enable/disable trial promotions)
ENABLE_FREE_TRIAL=false   # true = new users get a free trial, false = no trial

# How many months the trial lasts (only applies when ENABLE_FREE_TRIAL=true)
TRIAL_DURATION_MONTHS=3

# Monthly price for Pro plan (USD)
PRO_PLAN_PRICE=10

# Monthly price for Pro Max plan (USD)  
PRO_MAX_PLAN_PRICE=15
```

> [!IMPORTANT]
> To toggle free trial on/off: only change `ENABLE_FREE_TRIAL` between `true` and `false`. No code changes needed.

---

## Upgrade / Renewal Flows

### Pro Plan Renewal (pay $10 again)
- If **currently on active Pro** and not yet expired → extends `proExpiryDate` by 1 month **from the current expiry** (not from today). Days are never lost.
- If **expired / free / on trial** → starts fresh 1-month Pro from today.

### Pro → Pro Max Upgrade (pay $15)
- Remaining Pro days are **credited**: remaining Pro days are counted and added to the new Pro Max period.
- Formula: `newExpiry = now + remainingProDays + 30 days`
- Example: 15 days left on Pro → Pro Max expires in 45 days.

### Pro Max Renewal (already on Pro Max, pay $15 again)
- Extends `proExpiryDate` by 1 month **from current expiry**. Days are never lost.

### Downgrade to Free
- Happens automatically via cron job (runs daily at 1 AM) when any plan expires.
- All staff (non-owners) are suspended. They are restored when the owner upgrades again.

---

## Payment Initiation — API Change

`POST /api/payments/initiate` now accepts an optional `targetPlan` field:

```json
{
  "subscriptionId": "...",
  "targetPlan": "pro_max"   // "pro" or "pro_max" — defaults to "pro" if omitted
}
```

The KHQR charge amount is read from `.env` (`PRO_PLAN_PRICE` or `PRO_MAX_PLAN_PRICE`) — not from the stored `pricePerMonth` field. This means you can change the price in `.env` and it takes effect immediately on the next payment.

---

## New Subscription Routes

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/subscription/status` | Get current plan status for the logged-in user's station |
| `POST` | `/api/subscription/upgrade-to-pro` | Upgrade/renew to Pro (extends if already active) |
| `POST` | `/api/subscription/upgrade-to-pro-max` | Upgrade to Pro Max (credits remaining Pro days) |
| `POST` | `/api/subscription/downgrade` | Downgrade to free (admin/testing) |

### GET /api/subscription/status — Response
```json
{
  "success": true,
  "data": {
    "plan": "pro",
    "hasProAccess": true,
    "canManageStaff": true,
    "canExportExcel": true,
    "canViewOilEstimation": false,
    "maxStaff": 6,
    "isTrialActive": false,
    "trialEndDate": null,
    "proExpiryDate": "2026-08-03T...",
    "proNextBillingDate": "...",
    "pricePerMonth": 10
  }
}
```

---

## Staff Limit Enforcement

When creating a staff account (`POST /api/staff/create`):
- The new `requireStaffSlot` middleware checks:
  1. Does the station have any paid plan access? (If free → 403)
  2. How many staff does the current plan allow? (Pro = 6, Pro Max = Infinity)
  3. Count current non-deleted, non-owner staff. If at limit → 403 with helpful message.

Error response when limit reached:
```json
{
  "success": false,
  "message": "Your Pro plan allows a maximum of 6 staff accounts (7 users total including you). Please upgrade to Pro Max for unlimited staff.",
  "code": "STAFF_LIMIT_REACHED",
  "current": 6,
  "limit": 6
}
```

---

## Oil Price Estimation Guard

For routes that show oil price estimation, use:
```js
const planAccess = require('../middlewares/planAccess')
router.get('/oil-estimate', auth.ensureSignedIn, planAccess.requireProMaxAccess, ...)
```

Error response:
```json
{
  "success": false,
  "message": "Oil price estimation is only available on the Pro Max plan.",
  "code": "PRO_MAX_REQUIRED"
}
```

---

## HTTP Logging (Morgan)

All API requests are now logged in the terminal automatically:
- **Development** (`MODE=development`): `dev` format — colored, compact
- **Production** (`MODE=production`): `combined` format — Apache-style with IP, user-agent

Example terminal output (dev):
```
GET /api/subscription/status 200 45 ms - 312
POST /api/staff/create 403 12 ms - 89
```

---

## Files Changed

| File | Change |
|---|---|
| `models/subscriptions.js` | Added `pro_max` plan, `canViewOilEstimation`, `maxStaff` virtuals |
| `services/subscriptionService.js` | Added `upgradeToProMax`, trial toggle logic, extend-on-renew, expiry cron for paid plans |
| `middlewares/planAccess.js` | Added `requireProMaxAccess`, `requireStaffSlot`, improved `stationId` resolution |
| `services/bakongPaymentService.js` | `initiatePayment` accepts `targetPlan`, routes to correct upgrade function |
| `routes/payment.js` | Accepts `targetPlan` in POST /initiate body |
| `routes/subscription.js` | Added `/status` and `/upgrade-to-pro-max` endpoints |
| `routes/staff.js` | Uses `requireStaffSlot` instead of `requireProAccess` |
| `routes/fuel_stock.js` | Added `requireProAccess` to `/download` route |
| `routes/fuel_sold.js` | Added `requireProAccess` to `/download` route |
| `server.js` | Added `morgan` HTTP logger |
| `.env` | Added 4 new plan config keys |
| `.env.example` | Added 4 new plan config keys with comments |
