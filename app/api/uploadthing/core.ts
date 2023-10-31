/**
 * @module core.ts
 * @description This module configures and creates a file router for handling file uploads in the application.
 * @requires @clerk/nextjs
 * @requires uploadthing/next
 */

import { auth } from "@clerk/nextjs";
import { createUploadthing, type FileRouter } from "uploadthing/next";

/** Initialize the Uploadthing instance. */
const f = createUploadthing();

/**
 * Handle authentication for file operations.
 * 
 * This function checks if the user is authenticated using the Clerk authentication library.
 * If the user is not authenticated, it throws an "Unauthorized" error.
 * 
 * @returns {Object} An object containing the authenticated user's ID.
 * @throws {Error} Throws an error if the user is not authenticated.
 */
const handleAuth = () => {
    const { userId } = auth();
    if (!userId) throw new Error("Unauthorized");
    return { userId: userId };
};

/**
 * Defines the file router configuration for the application.
 * 
 * The router provides two routes:
 * - serverImage: Accepts image files with a maximum file size of 4MB and a maximum file count of 1.
 * - messageFile: Accepts image and PDF files.
 * 
 * Both routes include authentication middleware.
 */
export const ourFileRouter = {
    serverImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
        .middleware(() => handleAuth())
        .onUploadComplete(() => {}),
    messageFile: f(["image", "pdf"])
        .middleware(() => handleAuth())
        .onUploadComplete(() => {})
} satisfies FileRouter;

/** Type definition for the file router. */
export type OurFileRouter = typeof ourFileRouter;