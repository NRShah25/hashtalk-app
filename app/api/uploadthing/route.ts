import { createNextRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";

/**
 * Using the createNextRouteHandler function, we set up the route handlers based on our file router configuration.
 */
const routeHandlers = createNextRouteHandler({
  router: ourFileRouter,
});

export const { GET, POST } = routeHandlers;