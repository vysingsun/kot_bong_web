# Fuel Price Estimation — API Reference

Base path: `/api/fuel_price_estimate`

---

## Role Access Summary

| Action | Super_Admin | Admin | User |
|---|---|---|---|
| View estimate list | ✅ | ✅ | ❌ |
| View single estimate + comments | ✅ | ✅ | ❌ |
| Create estimate (send message) | ✅ | ❌ | ❌ |
| Update estimate | ✅ | ❌ | ❌ |
| Delete estimate | ✅ | ❌ | ❌ |
| Add comment | ✅ | ✅ | ❌ |
| Edit own comment | ✅ | ✅ | ❌ |
| Delete any comment | ✅ | ❌ | ❌ |
| Delete own comment | ✅ | ✅ | ❌ |

---

## New Files Created

| Path | Purpose |
|---|---|
| `configs/cloudinary.js` | Cloudinary SDK init + Multer-Cloudinary storage |
| `models/fuelPriceEstimates.js` | Estimate (message) Mongoose schema |
| `models/estimateComments.js` | Comment Mongoose schema |
| `services/fuelPriceEstimate.js` | All business logic (CRUD) |
| `routes/fuelPriceEstimate.js` | Express router |

---

## Environment Variable

```bash
# .env  – replace with real credentials
CLOUDINARY_URL=cloudinary://my_key:my_secret@my_cloud_name?secure_distribution=mydomain.com&upload_prefix=https://api-eu.cloudinary.com
```

Images are stored in the Cloudinary folder **`fuel_price_estimates/`**.

---

## Endpoints

### 1. Create Estimate (Send Message)

```
POST /api/fuel_price_estimate/create
```

**Auth:** Bearer token · **Role:** Super_Admin  
**Content-Type:** `multipart/form-data`

| Field | Type | Required | Description |
|---|---|---|---|
| `content` | string | conditional | Text body of the message |
| `images` | file(s) | conditional | Up to 5 image files |

> At least one of `content` or `images` must be provided.

**Response 201**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "content": "Diesel price expected to rise next week...",
    "images": [
      { "url": "https://res.cloudinary.com/.../fuel_price_estimates/abc.jpg", "publicId": "fuel_price_estimates/abc" }
    ],
    "postedBy": { "_id": "...", "firstName": "Vysing", "lastName": "Sun" },
    "createdAt": "2026-07-08T10:00:00.000Z"
  }
}
```

---

### 2. Get All Estimates (Feed)

```
GET /api/fuel_price_estimate/all?page=1&limit=20
```

**Auth:** Bearer token · **Role:** Super_Admin | Admin

**Response 200**
```json
{
  "success": true,
  "data": [ { ...estimate }, ... ],
  "pagination": { "total": 42, "page": 1, "limit": 20, "totalPages": 3 }
}
```

---

### 3. Get Single Estimate + Comments

```
GET /api/fuel_price_estimate/:id
```

**Auth:** Bearer token · **Role:** Super_Admin | Admin

**Response 200**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "content": "...",
    "images": [...],
    "postedBy": { ... },
    "createdAt": "...",
    "comments": [
      {
        "_id": "...",
        "content": "Thank you for the update!",
        "postedBy": { "_id": "...", "firstName": "Admin", "lastName": "User" },
        "createdAt": "..."
      }
    ]
  }
}
```

---

### 4. Update Estimate

```
POST /api/fuel_price_estimate/update/:id
```

**Auth:** Bearer token · **Role:** Super_Admin  
**Content-Type:** `multipart/form-data`

| Field | Type | Required | Description |
|---|---|---|---|
| `content` | string | optional | Updated text body |
| `images` | file(s) | optional | New images to add (max 5) |
| `removePublicIds` | string (JSON array) | optional | Cloudinary publicIds to remove, e.g. `["fuel_price_estimates/abc"]` |

**Response 200**
```json
{ "success": true, "data": { ...updatedEstimate } }
```

---

### 5. Delete Estimate

```
POST /api/fuel_price_estimate/delete/:id
```

**Auth:** Bearer token · **Role:** Super_Admin  
Soft-deletes the estimate, cascades soft-delete to all comments, and purges images from Cloudinary.

**Response 200**
```json
{ "success": true, "message": "Estimate deleted successfully." }
```

---

### 6. Get Comments for an Estimate

```
GET /api/fuel_price_estimate/:id/comments?page=1&limit=50
```

**Auth:** Bearer token · **Role:** Super_Admin | Admin

**Response 200**
```json
{
  "success": true,
  "data": [ { ...comment }, ... ],
  "pagination": { "total": 10, "page": 1, "limit": 50, "totalPages": 1 }
}
```

---

### 7. Add Comment

```
POST /api/fuel_price_estimate/:id/comments/create
```

**Auth:** Bearer token · **Role:** Super_Admin | Admin  
**Content-Type:** `application/json`

```json
{ "content": "Noted, thanks!" }
```

**Response 201**
```json
{ "success": true, "data": { ...comment } }
```

---

### 8. Edit Comment

```
POST /api/fuel_price_estimate/comments/update/:commentId
```

**Auth:** Bearer token · **Role:** Super_Admin | Admin (own comment only)  
**Content-Type:** `application/json`

```json
{ "content": "Updated comment text" }
```

**Response 200**
```json
{ "success": true, "data": { ...updatedComment } }
```

---

### 9. Delete Comment

```
POST /api/fuel_price_estimate/comments/delete/:commentId
```

**Auth:** Bearer token · **Role:** Super_Admin (any) | Admin (own only)

**Response 200**
```json
{ "success": true, "message": "Comment deleted successfully." }
```

---

## Image Upload Notes

- Up to **5 images** per message
- Max **10 MB** per file
- Accepted formats: `jpg`, `jpeg`, `png`, `webp`, `gif`
- Images are auto-transformed: width ≤ 1200 px, quality = auto
- When an estimate is deleted, all its Cloudinary images are purged automatically
