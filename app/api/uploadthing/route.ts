/**
 * @module route.ts
 * @description This module provides route handlers for the file upload functionality in the application.
 * @requires uploadthing/next
 * @requires ./core
 */

import { createNextRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";

/**
 * Creates the Next.js route handlers for file operations.
 * 
 * This function generates the GET and POST route handlers for file uploads.
 * It leverages the `ourFileRouter` configuration defined in the `core.ts` module.
 */
export const { GET, POST } = createNextRouteHandler({
    router: ourFileRouter,
});
