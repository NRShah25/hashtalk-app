import { auth } from "@clerk/nextjs";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

/**
 * Middleware function to ensure the user is authenticated using Clerk.
 * If the user is not authenticated, it throws an "Unauthorized" error.
 * @returns Object containing the authenticated user's ID.
 */
const handleAuth = () => {
    const { userId } = auth();
    if (!userId) throw new Error("Unauthorized");
    return { userId };
};

/**
 * Define our custom file router configurations for different upload scenarios.
 */
export const ourFileRouter = {
    serverImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
        .middleware(handleAuth)
        .onUploadComplete(() => {}),

    messageFile: f(["image", "pdf"])
        .middleware(handleAuth)
        .onUploadComplete(() => {})
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;