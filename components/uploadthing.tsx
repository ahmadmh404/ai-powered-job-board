import { connection } from "next/server";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { Suspense } from "react";
import { customFileRouter } from "@/app/services/uploadthing/router";

export function UploadthingSSr() {
  return (
    <Suspense>
      <UTSSR />
    </Suspense>
  );
}

async function UTSSR() {
  await connection();

  return <NextSSRPlugin routerConfig={extractRouterConfig(customFileRouter)} />;
}
