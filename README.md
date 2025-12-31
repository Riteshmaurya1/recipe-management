# 🍳 RecipeHub - Frontend

A modern, feature-rich frontend for the Recipe Management System built with vanilla HTML, CSS, and JavaScript.

## 📁 Project Structure

```
recipe-frontend/
├── index.html
├── css/
│   └── styles.css
└── js/
    ├── config.js
    ├── ui.js
    ├── auth.js
    ├── recipe.js
    ├── favorites.js
    ├── collections.js
    ├── profile.js
    ├── feed.js
    ├── reviews.js
    ├── admin.js
    └── app.js
```

## ✨ Features

### User Features
- ✅ User Authentication (Signup/Login with User/Admin roles)
- 🍽️ Recipe Management (CRUD operations)
- 🔍 Advanced Search & Filters (search, category, difficulty, ingredient)
- ❤️ Favorites System
- 📚 Collections Management
- ⭐ Reviews & Ratings
- 👥 Follow/Unfollow Users
- 📰 Personalized Feed
- 👤 User Profile Management

### Admin Features
- 👥 User Management (ban/unban, change user type)
- 🍽️ Recipe Management (view, delete all recipes)
- 📊 Dashboard with statistics

### UI/UX Features
- 🎨 Modern gradient design
- 📱 Fully responsive (mobile, tablet, desktop)
- ⚡ Smooth animations and transitions
- 🌙 Clean, professional interface
- 💳 Card-based layouts
- 🔔 Toast notifications
- 🎯 Modal dialogs

## 🚀 Getting Started

### Prerequisites
- Backend server running on `http://localhost:3000`
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. **Download/Clone the files**
   ```bash
   git clone <your-repo-url>
   cd recipe-frontend
   ```

2. **Update API Configuration**
   
   Open `js/config.js` and update the API base URL:
   ```javascript
   const API_BASE_URL = 'http://localhost:3000/api/v1';
   ```

3. **Start a local server**
   
   You can use any static file server. Here are some options:

   **Using Python:**
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   ```

   **Using Node.js (http-server):**
   ```bash
   npx http-server -p 8000
   ```

   **Using VS Code:**
   - Install "Live Server" extension
   - Right-click on `index.html`
   - Select "Open with Live Server"

4. **Open in browser**
   ```
   http://localhost:8000
   ```

## ⚙️ Backend Configuration

Ensure your backend has CORS enabled with credentials:

```javascript
app.use(cors({
    origin: 'http://localhost:8000', // Your frontend URL
    credentials: true,
}));
```

## 📚 API Endpoints Used

### Authentication
- `POST /api/v1/auth/signup` - Register new user
- `POST /api/v1/auth/signin` - Login
- `POST /api/v1/auth/logout` - Logout
- `POST /api/v1/auth/refresh` - Refresh token

### User Profile
- `GET /api/v1/user/profile` - Get profile
- `PUT /api/v1/user/profile` - Update profile

### Recipes
- `GET /api/v1/recipes` - Get all recipes (with filters)
- `GET /api/v1/recipes/:id` - Get recipe by ID
- `POST /api/v1/recipes/create` - Create recipe
- `PUT /api/v1/recipes/:id` - Update recipe
- `DELETE /api/v1/recipes/delete/:id` - Delete recipe

### Reviews
- `POST /api/v1/recipes/:recipeId/reviews` - Create/update review
- `GET /api/v1/recipes/:recipeId/reviews` - Get recipe reviews
- `DELETE /api/v1/recipes/:recipeId/reviews/me` - Delete my review

### Favorites
- `GET /api/v1/favorites/all` - Get all favorites
- `POST /api/v1/favorites/add/:recipeId` - Add to favorites
- `DELETE /api/v1/favorites/delete/:recipeId` - Remove from favorites

### Collections
- `GET /api/v1/collections/all` - Get all collections
- `POST /api/v1/collections/create` - Create collection
- `GET /api/v1/collections/by/:id` - Get collection by ID
- `PUT /api/v1/collections/update/:id` - Update collection
- `DELETE /api/v1/collections/delete/:id` - Delete collection
- `POST /api/v1/collections/:collectionId/recipes/add/:recipeId` - Add recipe to collection
- `DELETE /api/v1/collections/:collectionId/recipes/remove/:recipeId` - Remove recipe from collection

### Follow
- `POST /api/v1/user/profile/follow/:userId` - Follow user
- `DELETE /api/v1/user/profile/follow/:userId` - Unfollow user
- `GET /api/v1/user/profile/follow/following/me` - Get following list
- `GET /api/v1/user/profile/follow/followers/me` - Get followers list

### Feed
- `GET /api/v1/user/profile/feed` - Get personalized feed

### Admin (requires admin role)
- `GET /api/v1/admin/users` - Get all users
- `PATCH /api/v1/admin/users/:userId/ban` - Ban user
- `PATCH /api/v1/admin/users/:userId/unban` - Unban user
- `PATCH /api/v1/admin/users/:userId/user-type` - Update user type
- `GET /api/v1/admin/recipes` - Get all recipes
- `DELETE /api/v1/admin/recipes/:recipeId` - Delete recipe

## 🎯 Usage Guide

### For Users

1. **Registration**
   - Click "Sign up" on the login page
   - Select user type (User/Admin)
   - Fill in your details
   - Submit to create account

2. **Login**
   - Enter your email and password
   - Select correct user type
   - Click "Sign In"

3. **Browse Recipes**
   - View all public recipes on the main page
   - Use search and filters to find specific recipes
   - Click on a recipe card to view details

4. **Create Recipe**
   - Click "+ Add Recipe" button
   - Fill in all required fields
   - Add ingredients (one per line)
   - Write instructions
   - Submit to save

5. **Manage Favorites**
   - Click ❤️ icon on any recipe to add to favorites
   - View all favorites in "Favorites" page

6. **Create Collections**
   - Go to "Collections" page
   - Click "+ Create Collection"
   - Name your collection
   - Add recipes to collections using 📚 icon

7. **Leave Reviews**
   - View any recipe
   - Scroll to reviews section
   - Select star rating
   - Write optional comment
   - Submit review

8. **Follow Users**
   - View user profiles
   - Click "Follow" button
   - See their activity in your feed

### For Admins

1. **Access Admin Panel**
   - Login with admin account
   - Click "Admin" in navigation
   - Access user and recipe management

2. **Manage Users**
   - View all users
   - Ban/unban users
   - Change user roles

3. **Manage Recipes**
   - View all recipes
   - Delete inappropriate content

## 🎨 Customization

### Colors
Edit CSS variables in `css/styles.css`:
```css
:root {
    --primary: #6366f1;
    --secondary: #8b5cf6;
    --success: #10b981;
    --danger: #ef4444;
    /* ... */
}
```

### API URL
Update in `js/config.js`:
```javascript
const API_BASE_URL = 'YOUR_API_URL/api/v1';
```

## 🔧 Troubleshooting

### CORS Issues
- Ensure backend CORS is configured with `credentials: true`
- Check that frontend URL is in backend's allowed origins

### Cookies Not Working
- Make sure both frontend and backend are on same domain (or use localhost)
- Check browser settings allow cookies
- Verify backend sets cookies with proper options

### 401 Unauthorized
- Access token may have expired
- Try logging out and logging back in
- Check if backend refresh token endpoint is working

### Images Not Loading
- Verify image URLs are accessible
- Check CORS settings allow image requests
- Images should be HTTPS if site is HTTPS

## 📱 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Opera (latest)

## 🚀 Deployment

### Deploy to Netlify
1. Create `netlify.toml`:
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```
2. Connect repository and deploy

### Deploy to Vercel
1. Create `vercel.json`:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```
2. Connect repository and deploy

### Deploy to GitHub Pages
1. Push code to GitHub
2. Go to Settings > Pages
3. Select branch and folder
4. Save and access via provided URL

## 📄 License

MIT License - feel free to use for personal or commercial projects

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues or questions, please create an issue in the repository.

---

**Made with ❤️ for recipe enthusiasts**
