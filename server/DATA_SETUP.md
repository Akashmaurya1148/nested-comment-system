

### 1. JSON Data Files
- **`server/data/users.json`** - Contains all users with avatars and creation dates
- **`server/data/comments.json`** - Contains all sample comments with nested structure and upvotes
- **`server/data/README.md`** - Documentation for the JSON file structure and usage

### 2. Scripts
- **`server/scripts/importData.js`** - Complete data import script (clears and imports all data)
- **`server/scripts/addData.js`** - Add new data script (preserves existing data)
- **`server/scripts/update-data.bat`** - Windows batch file for easy data updates

### 3. Sample Posts Created
1. **"Understanding Modern Web Development"** - Original comprehensive post
2. **"Post is not found"** - New sample post demonstrating error handling scenarios

## Current Database Status

✅ **2 Posts** with full content and metadata
✅ **3 Users** (Liam Joshi, Liam Chakraborty, Sally Johnson) with avatars
✅ **Multiple Comments** with nested structure and upvotes
✅ **Authentication System** working with email domain validation

## How to Add More Data

### Method 1: Edit JSON Files
1. Edit `server/data/users.json` to add new users
2. Edit `server/data/comments.json` to add new comments
3. Run: `npx prisma db seed` (or use the batch file)

### Method 2: Use Import Script
1. Update the JSON files with your data
2. Run: `node scripts/importData.js` (clears existing data)
3. Or run: `node scripts/addData.js` (preserves existing data)

### Method 3: Use Batch File (Windows)
1. Double-click `scripts/update-data.bat`
2. Follow the prompts

## Sample Data Structure

### Users
```json
{
  "id": "9e92ed55-e15c-4cb1-b5ee-1e0278f38b35",
  "name": "Liam Joshi",
  "avatar": "https://i.pravatar.cc/150?img=1",
  "created_at": "2020-11-10T17:34:39.239Z"
}
```

### Comments
```json
{
  "id": "1",
  "parent_id": null,
  "text": "Interesting, I hadn't thought about it this way before.",
  "upvotes": 50,
  "created_at": "2023-09-08T05:01:07.787Z",
  "user_id": "d9b5c4a2-6224-43c1-ac0e-fac037a68f24"
}
```

## Testing the Application

1. **Access**: http://localhost:5173
2. **Login**: Use any email from allowed domains (gmail.com, yahoo.com, outlook.com, test.com)
3. **View Posts**: Both sample posts are available with comments
4. **Test Comments**: Create, edit, delete, and upvote comments
5. **Test Nested Replies**: Reply to comments to see the nested structure

## API Endpoints Available

- `GET /posts` - List all posts
- `GET /posts/:id` - Get specific post with comments
- `POST /posts/:id/comments` - Create new comment
- `PUT /posts/:postId/comments/:commentId` - Edit comment
- `DELETE /posts/:postId/comments/:commentId` - Delete comment
- `POST /posts/:postId/comments/:commentId/upvote` - Upvote comment
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `GET /auth/me` - Get current user


