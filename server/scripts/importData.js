import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

async function importData() {
  try {
    console.log('Starting data import...');

    // Read JSON files
    const usersPath = path.join(__dirname, '../data/users.json');
    const commentsPath = path.join(__dirname, '../data/comments.json');

    const usersData = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
    const commentsData = JSON.parse(fs.readFileSync(commentsPath, 'utf8'));

    console.log(`Found ${usersData.length} users and ${commentsData.length} comments`);

    // Clear existing data
    await prisma.comment.deleteMany();
    await prisma.post.deleteMany();
    await prisma.user.deleteMany();

    console.log('Cleared existing data');

    // Import users
    console.log('Importing users...');
    for (const userData of usersData) {
      await prisma.user.create({
        data: {
          id: userData.id,
          name: userData.name,
          avatar: userData.avatar,
          createdAt: new Date(userData.created_at),
        },
      });
    }
    console.log(`Imported ${usersData.length} users`);

    // Create sample posts
    console.log('Creating sample posts...');
    const post1 = await prisma.post.create({
      data: {
        title: "Understanding Modern Web Development",
        body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer placerat urna vel ante volutpat, ut elementum mi placerat. Phasellus varius nisi a nisl interdum, at ultrices ex tincidunt. Duis nec nunc vel urna ullamcorper eleifend ac id dolor. Phasellus vitae tortor ac metus laoreet rutrum. Aenean condimentum consequat elit, ut placerat massa mattis vitae. Vivamus dictum faucibus massa, eget euismod turpis pretium a. Aliquam rutrum rhoncus mi, eu tincidunt mauris placerat nec. Nunc sagittis libero sed facilisis suscipit. Curabitur nisi lacus, ullamcorper eu maximus quis, malesuada sit amet nisi. Proin dignissim, lacus vitae mattis fermentum, dui dolor feugiat turpis, ut euismod libero purus eget dui.",
        createdAt: new Date(),
      },
    });

    const post2 = await prisma.post.create({
      data: {
        title: "Post is not found",
        body: "This is a sample post created to demonstrate the platform's functionality. When users navigate to a post that doesn't exist or has been removed, they would typically see a 'Post not found' message. This post serves as an example of how the system handles such scenarios and provides a realistic testing environment for the comment system.",
        createdAt: new Date(),
      },
    });

    console.log('Created sample posts');

    // Import comments
    console.log('Importing comments...');
    for (const commentData of commentsData) {
      // Map comment to a post (alternate between posts)
      const postId = parseInt(commentData.id) % 2 === 0 ? post1.id : post2.id;

      await prisma.comment.create({
        data: {
          id: commentData.id.toString(),
          text: commentData.text,
          upvotes: commentData.upvotes,
          createdAt: new Date(commentData.created_at),
          userId: commentData.user_id,
          postId: postId,
          parentId: commentData.parent_id ? commentData.parent_id.toString() : null,
        },
      });
    }
    console.log(`Imported ${commentsData.length} comments`);

    console.log('Data import completed successfully!');
  } catch (error) {
    console.error('Error importing data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

importData();
