import fastify from "fastify";
import sensible from "@fastify/sensible";
import cors from "@fastify/cors";
import cookie from "@fastify/cookie";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
dotenv.config();
const app = fastify();
app.register(sensible);
app.register(cookie, { secret: process.env.COOKIE_SECRET || "default-secret" });
app.register(cors, {
    origin: "http://localhost:5173",
    credentials: true,
});
const prisma = new PrismaClient();
// Get or create the default user
let CURRENT_USER_ID;
try {
    const user = await prisma.user.findFirst({ where: { name: "Kyle" } });
    if (user) {
        CURRENT_USER_ID = user.id;
    }
    else {
        const newUser = await prisma.user.create({
            data: {
                name: "Kyle",
                avatar: "https://i.pravatar.cc/150?img=1"
            }
        });
        CURRENT_USER_ID = newUser.id;
    }
}
catch (error) {
    console.error("Error setting up user:", error);
    process.exit(1);
}
app.addHook("onRequest", (req, res, done) => {
    if (req.cookies.userId !== CURRENT_USER_ID) {
        req.cookies.userId = CURRENT_USER_ID;
        res.clearCookie("userId");
        res.setCookie("userId", CURRENT_USER_ID);
    }
    done();
});
const COMMENT_SELECT_FIELDS = {
    id: true,
    text: true,
    parentId: true,
    upvotes: true,
    createdAt: true,
    user: {
        select: {
            id: true,
            name: true,
            avatar: true,
        },
    },
};
app.get("/posts", async (req, res) => {
    return await commitToDb(prisma.post.findMany({
        select: {
            id: true,
            title: true,
            body: true,
            createdAt: true,
        },
    }));
});
app.get("/posts/:id", async (req, res) => {
    const { id } = req.params;
    return await commitToDb(prisma.post
        .findUnique({
        where: { id },
        select: {
            id: true,
            title: true,
            body: true,
            createdAt: true,
            comments: {
                orderBy: {
                    createdAt: "asc",
                },
                select: {
                    ...COMMENT_SELECT_FIELDS,
                },
            },
        },
    })
        .then(async (post) => {
        if (!post) {
            throw new Error("Post not found");
        }
        return post;
    }));
});
app.post("/posts/:id/comments", async (req, res) => {
    const { text, parentId } = req.body;
    const { id } = req.params;
    if (text === "" || text == null) {
        return res.send(app.httpErrors.badRequest("Text is required"));
    }
    if (!req.cookies.userId) {
        return res.send(app.httpErrors.unauthorized("User not authenticated"));
    }
    return await commitToDb(prisma.comment.create({
        data: {
            text,
            userId: req.cookies.userId,
            parentId: parentId || null,
            postId: id,
            upvotes: 0,
        },
        select: COMMENT_SELECT_FIELDS,
    }));
});
app.put("/posts/:postId/comments/:commentId", async (req, res) => {
    const { text } = req.body;
    const { commentId } = req.params;
    if (text === "" || text == null) {
        return res.send(app.httpErrors.badRequest("Text is required"));
    }
    const comment = await prisma.comment.findUnique({
        where: { id: commentId },
        select: { userId: true },
    });
    if (!comment) {
        return res.send(app.httpErrors.notFound("Comment not found"));
    }
    if (comment.userId !== req.cookies.userId) {
        return res.send(app.httpErrors.unauthorized("You do not have permission to edit this comment"));
    }
    return await commitToDb(prisma.comment.update({
        where: { id: commentId },
        data: { text },
        select: { text: true },
    }));
});
app.delete("/posts/:postId/comments/:commentId", async (req, res) => {
    const { commentId } = req.params;
    const comment = await prisma.comment.findUnique({
        where: { id: commentId },
        select: { userId: true },
    });
    if (!comment) {
        return res.send(app.httpErrors.notFound("Comment not found"));
    }
    if (comment.userId !== req.cookies.userId) {
        return res.send(app.httpErrors.unauthorized("You do not have permission to delete this comment"));
    }
    return await commitToDb(prisma.comment.delete({
        where: { id: commentId },
        select: { id: true },
    }));
});
app.post("/posts/:postId/comments/:commentId/upvote", async (req, res) => {
    const { commentId } = req.params;
    if (!req.cookies.userId) {
        return res.send(app.httpErrors.unauthorized("User not authenticated"));
    }
    return await commitToDb(prisma.comment.update({
        where: { id: commentId },
        data: {
            upvotes: {
                increment: 1
            }
        },
        select: { upvotes: true },
    }));
});
// Authentication endpoints
app.post("/auth/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.send(app.httpErrors.badRequest("Email and password are required"));
    }
    // Simple authentication - check if email ends with allowed domains
    const allowedDomains = ["gmail.com", "yahoo.com", "outlook.com", "test.com"];
    const emailParts = email.split("@");
    if (emailParts.length !== 2) {
        return res.send(app.httpErrors.badRequest("Invalid email format"));
    }
    const emailDomain = emailParts[1];
    if (!allowedDomains.includes(emailDomain)) {
        return res.send(app.httpErrors.unauthorized("Invalid email domain"));
    }
    // For demo purposes, accept any password for valid domains
    if (password.length < 6) {
        return res.send(app.httpErrors.badRequest("Password must be at least 6 characters"));
    }
    // Find or create user
    const userName = emailParts[0];
    let user = await prisma.user.findFirst({
        where: { name: userName }
    });
    if (!user) {
        user = await prisma.user.create({
            data: {
                name: userName,
                avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 10) + 1}`
            }
        });
    }
    // Set user cookie
    res.setCookie("userId", user.id);
    return res.send({
        success: true,
        user: {
            id: user.id,
            name: user.name,
            avatar: user.avatar
        }
    });
});
app.post("/auth/logout", async (req, res) => {
    res.clearCookie("userId");
    return res.send({ success: true });
});
app.get("/auth/me", async (req, res) => {
    if (!req.cookies.userId) {
        return res.send(app.httpErrors.unauthorized("Not authenticated"));
    }
    const user = await prisma.user.findUnique({
        where: { id: req.cookies.userId },
        select: {
            id: true,
            name: true,
            avatar: true,
            createdAt: true
        }
    });
    if (!user) {
        return res.send(app.httpErrors.notFound("User not found"));
    }
    return res.send(user);
});
async function commitToDb(promise) {
    const [error, data] = await app.to(promise);
    if (error)
        return app.httpErrors.internalServerError(error.message);
    return data;
}
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;
app.listen({ port: PORT }, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`✅ Server running on ${address}`);
});
//# sourceMappingURL=server.js.map