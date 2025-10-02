import { createRouteHandler } from "uploadthing/next";
import { customFileRouter } from "@/app/services/uploadthing/router";

export const { GET, POST } = createRouteHandler({
  router: customFileRouter,
});
