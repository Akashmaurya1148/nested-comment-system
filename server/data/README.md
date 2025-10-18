# Data Files

This directory contains JSON files with sample data for the nested comments platform.

## Files

### `users.json`
Contains user data with the following structure:
```json
{
  "id": "unique-user-id",
  "name": "User Name",
  "avatar": "https://avatar-url.com",
  "created_at": "2020-11-10T17:34:39.239Z"
}
```

### `comments.json`
Contains comment data with the following structure:
```json
{
  "id": "unique-comment-id",
  "parent_id": "parent-comment-id-or-null",
  "text": "Comment text content",
  "upvotes": 50,
  "created_at": "2023-09-08T05:01:07.787Z",
  "user_id": "user-id-who-wrote-comment"
}
```

## Usage

### Adding New Data

1. **To add new users**: Edit `users.json` and add new user objects following the structure above.

2. **To add new comments**: Edit `comments.json` and add new comment objects following the structure above.
   - Set `parent_id` to `null` for root comments
   - Set `parent_id` to an existing comment ID for replies
   - Ensure `user_id` matches an existing user ID

### Importing Data

To import the JSON data into the database, you can use the import script:

```bash
cd server
node scripts/importData.js
```

Or run the seed command to use the updated seed file:

```bash
cd server
npx prisma db seed
```

## Sample Posts

The system includes two sample posts:

1. **"Understanding Modern Web Development"** - A comprehensive post about web development
2. **"Post is not found"** - A sample post demonstrating error handling scenarios

Both posts have associated comments and nested replies to demonstrate the full functionality of the platform.

## Data Relationships

- Users can have multiple comments
- Comments can have parent-child relationships (nested structure)
- Comments belong to specific posts
- Comments have upvote counts
- All entities have creation timestamps
