import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function seed() {
    await prisma.post.deleteMany();
    await prisma.user.deleteMany();
    await prisma.comment.deleteMany();
    // Create users with avatars
    const liamJoshi = await prisma.user.create({
        data: {
            name: "Liam Joshi",
            avatar: "https://i.pravatar.cc/150?img=1"
        }
    });
    const liamChakraborty = await prisma.user.create({
        data: {
            name: "Liam Chakraborty",
            avatar: "https://i.pravatar.cc/150?img=2"
        }
    });
    const sally = await prisma.user.create({
        data: {
            name: "Sally Johnson",
            avatar: "https://i.pravatar.cc/150?img=3"
        }
    });
    // Create posts
    const post1 = await prisma.post.create({
        data: {
            body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer placerat urna vel ante volutpat, ut elementum mi placerat. Phasellus varius nisi a nisl interdum, at ultrices ex tincidunt. Duis nec nunc vel urna ullamcorper eleifend ac id dolor. Phasellus vitae tortor ac metus laoreet rutrum. Aenean condimentum consequat elit, ut placerat massa mattis vitae. Vivamus dictum faucibus massa, eget euismod turpis pretium a. Aliquam rutrum rhoncus mi, eu tincidunt mauris placerat nec. Nunc sagittis libero sed facilisis suscipit. Curabitur nisi lacus, ullamcorper eu maximus quis, malesuada sit amet nisi. Proin dignissim, lacus vitae mattis fermentum, dui dolor feugiat turpis, ut euismod libero purus eget dui.",
            title: "Understanding Modern Web Development",
        },
    });
    // Create nested comments
    const rootComment1 = await prisma.comment.create({
        data: {
            text: "Interesting, I hadn't thought about it this way before.",
            upvotes: 50,
            userId: liamJoshi.id,
            postId: post1.id,
        },
    });
    const rootComment2 = await prisma.comment.create({
        data: {
            text: "Great post! Really enjoyed reading this.",
            upvotes: 45,
            userId: liamChakraborty.id,
            postId: post1.id,
        },
    });
    // Create nested replies
    await prisma.comment.create({
        data: {
            text: "I agree! This perspective really changes how I think about the topic.",
            upvotes: 12,
            userId: sally.id,
            postId: post1.id,
            parentId: rootComment1.id,
        },
    });
    await prisma.comment.create({
        data: {
            text: "Thanks for sharing your thoughts. What specific aspects resonated with you?",
            upvotes: 8,
            userId: liamJoshi.id,
            postId: post1.id,
            parentId: rootComment2.id,
        },
    });
    await prisma.$disconnect();
}
seed().catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
});
//# sourceMappingURL=seed.js.map