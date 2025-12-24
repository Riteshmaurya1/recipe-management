# Recipe Management System - API Routes Documentation

## Base URL
```
http://localhost:3000/api/v1
```

---

## 1. Authentication Routes (`/auth`)

### POST `/auth/signup`
**Description:** Register a new user  
**Auth Required:** No  
**Body:**
```json
{
  "userType": "user", // or "admin"
  "username": "john_doe",
  "name": "John Doe",
  "email": "john@example.com",
  "phoneNumber": "1234567890",
  "password": "password123"
}
```
**Response:** Sets `accessToken` and `refreshToken` cookies

### POST `/auth/signin`
**Description:** Login user  
**Auth Required:** No  
**Body:**
```json
{
  "userType": "user",
  "email": "john@example.com",
  "password": "password123"
}
```
**Response:** Sets `accessToken` and `refreshToken` cookies

### POST `/auth/refresh`
**Description:** Refresh access token  
**Auth Required:** No  
**Body:**
```json
{
  "refreshToken": "your-refresh-token"
}
```
**Response:** New `accessToken` and `refreshToken` cookies

### POST `/auth/logout`
**Description:** Logout user  
**Auth Required:** Yes  
**Response:** Clears cookies

---

## 2. User Profile Routes (`/user`)

### GET `/user/profile`
**Description:** Get current user profile  
**Auth Required:** Yes

### PUT `/user/profile`
**Description:** Update current user profile  
**Auth Required:** Yes  
**Body:**
```json
{
  "name": "John Updated",
  "username": "john_updated",
  "phoneNumber": "9876543210",
  "password": "newpassword123"
}
```

---

## 3. Follow Routes (`/user/profile/follow`)

### POST `/user/profile/follow/:userId`
**Description:** Follow a user  
**Auth Required:** Yes

### DELETE `/user/profile/follow/:userId`
**Description:** Unfollow a user  
**Auth Required:** Yes

### GET `/user/profile/follow/following/me`
**Description:** Get list of users I follow  
**Auth Required:** Yes

### GET `/user/profile/follow/followers/me`
**Description:** Get my followers list  
**Auth Required:** Yes

---

## 4. Feed Routes (`/user/profile/feed`)

### GET `/user/profile/feed?limit=20&offset=0`
**Description:** Get personalized feed from followed users  
**Auth Required:** Yes  
**Query Params:**
- `limit` (default: 20)
- `offset` (default: 0)

---

## 5. Recipe Routes (`/recipes`)

### GET `/recipes`
**Description:** Browse all public recipes with filters  
**Auth Required:** No  
**Query Params:**
```
?search=pasta
&ingredient=tomato
&category=italian
&diet=vegetarian
&difficulty=easy
&timeMin=10
&timeMax=30
&page=1
&limit=10
```

### GET `/recipes/:id`
**Description:** Get single recipe by ID  
**Auth Required:** No

### POST `/recipes/create`
**Description:** Create new recipe  
**Auth Required:** Yes  
**Body:**
```json
{
  "title": "Spaghetti Carbonara",
  "description": "Classic Italian pasta dish",
  "ingredients": ["spaghetti", "eggs", "bacon", "parmesan"],
  "instructions": "Cook pasta. Mix eggs and cheese...",
  "cookingTime": 30,
  "servings": 4,
  "difficulty": "easy",
  "imageUrl": "https://example.com/image.jpg",
  "category": "italian",
  "dietaryTags": ["non-vegetarian"]
}
```

### PUT `/recipes/:id`
**Description:** Update own recipe  
**Auth Required:** Yes  
**Body:** Same as create (all fields optional)

### DELETE `/recipes/delete/:id`
**Description:** Delete own recipe  
**Auth Required:** Yes

---

## 6. Review Routes (`/recipes/:recipeId/reviews`)

### POST `/recipes/:recipeId/reviews`
**Description:** Create or update review for a recipe  
**Auth Required:** Yes  
**Body:**
```json
{
  "rating": 5,
  "comment": "Excellent recipe!"
}
```

### GET `/recipes/:recipeId/reviews`
**Description:** Get all reviews for a recipe  
**Auth Required:** No

### DELETE `/recipes/:recipeId/reviews/me`
**Description:** Delete my review  
**Auth Required:** Yes

---

## 7. Favorites Routes (`/favorites`)

### POST `/favorites/add/:recipeId`
**Description:** Add recipe to favorites  
**Auth Required:** Yes

### DELETE `/favorites/delete/:recipeId`
**Description:** Remove recipe from favorites  
**Auth Required:** Yes

### GET `/favorites/all`
**Description:** Get all my favorite recipes  
**Auth Required:** Yes

---

## 8. Collections Routes (`/collections`)

### POST `/collections/create`
**Description:** Create a new collection  
**Auth Required:** Yes  
**Body:**
```json
{
  "name": "My Italian Recipes"
}
```

### GET `/collections/all`
**Description:** Get all my collections  
**Auth Required:** Yes

### GET `/collections/by/:collectionId`
**Description:** Get collection by ID with recipes  
**Auth Required:** Yes

### PUT `/collections/update/:collectionId`
**Description:** Update collection name  
**Auth Required:** Yes  
**Body:**
```json
{
  "name": "Updated Collection Name"
}
```

### DELETE `/collections/delete/:collectionId`
**Description:** Delete collection  
**Auth Required:** Yes

### POST `/collections/:collectionId/recipes/add/:recipeId`
**Description:** Add recipe to collection  
**Auth Required:** Yes

### DELETE `/collections/:collectionId/recipes/remove/:recipeId`
**Description:** Remove recipe from collection  
**Auth Required:** Yes

---
## Authentication Details

### Cookies Used
- `accessToken` - Valid for 24 hours
- `refreshToken` - Valid for 7 days

### Cookie Options
```javascript
{
  httpOnly: true,
  secure: true (in production),
  sameSite: "strict",
  credentials: true
}
```

### Headers Required
```
Content-Type: application/json
```

### CORS Configuration
- Origin: `http://localhost:5173`
- Credentials: `true`
- Methods: `GET, POST, PUT, PATCH, DELETE`

---

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* response data */ },
  "total": 10 // for list responses
}
```

### Error Response
```json
{
  "error": "Error message here"
}
```

### Common Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Server Error
