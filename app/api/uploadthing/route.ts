import { createRouteHandler } from "uploadthing/next";
import { customFleRouter } from "@/app/services/uploadthing/router";

export const { GET, POST } = createRouteHandler({
  router: customFleRouter,
});
