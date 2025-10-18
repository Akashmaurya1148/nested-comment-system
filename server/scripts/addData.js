import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

async function addData() {
  try {
    console.log('Adding new data from JSON files...');

    // Read JSON files
    const usersPath = path.join(__dirname, '../data/users.json');
    const commentsPath = path.join(__dirname, '../data/comments.json');

    if (!fs.existsSync(usersPath) || !fs.existsSync(commentsPath)) {
      console.error('JSON files not found. Please ensure users.json and comments.json exist in the data directory.');
      return;
    }

    const usersData = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
    const commentsData = JSON.parse(fs.readFileSync(commentsPath, 'utf8'));

    console.log(`Found ${usersData.length} users and ${commentsData.length} comments`);

    // Get existing posts
    const posts = await prisma.post.findMany();
    if (posts.length === 0) {
      console.error('No posts found. Please run the seed script first to create sample posts.');
      return;
    }

    console.log(`Found ${posts.length} existing posts`);

    // Add users (skip if already exists)
    console.log('Adding users...');
    let usersAdded = 0;
    for (const userData of usersData) {
      const existingUser = await prisma.user.findUnique({
        where: { id: userData.id }
      });

      if (!existingUser) {
        await prisma.user.create({
          data: {
            id: userData.id,
            name: userData.name,
            avatar: userData.avatar,
            createdAt: new Date(userData.created_at),
          },
        });
        usersAdded++;
      }
    }
    console.log(`Added ${usersAdded} new users`);

    // Add comments (skip if already exists)
    console.log('Adding comments...');
    let commentsAdded = 0;
    for (const commentData of commentsData) {
      const existingComment = await prisma.comment.findUnique({
        where: { id: commentData.id }
      });

      if (!existingComment) {
        // Map comment to a post (alternate between posts)
        const postId = parseInt(commentData.id) % 2 === 0 ? posts[0].id : posts[1]?.id || posts[0].id;

        await prisma.comment.create({
          data: {
            id: commentData.id,
            text: commentData.text,
            upvotes: commentData.upvotes,
            createdAt: new Date(commentData.created_at),
            userId: commentData.user_id,
            postId: postId,
            parentId: commentData.parent_id,
          },
        });
        commentsAdded++;
      }
    }
    console.log(`Added ${commentsAdded} new comments`);

    console.log('Data addition completed successfully!');
  } catch (error) {
    console.error('Error adding data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addData();
