// src/lib/fetch-uploadthing-file.ts

import { Buffer } from "node:buffer";

type FetchUploadThingFileOptions = {
  timeoutMs?: number;
  maxSizeBytes?: number;
};

type FetchedUploadThingFile = {
  /** Base64 encoded document data. */
  data: string;

  /** The MIME type of the document data. */
  mimeType: string;
};

export async function fetchUploadThingFile(
  fileUrl: string,
  {
    timeoutMs = 15_000,
    maxSizeBytes = 10 * 1024 * 1024, // 10 MB
  }: FetchUploadThingFileOptions = {},
): Promise<FetchedUploadThingFile> {
  if (!Number.isSafeInteger(timeoutMs) || timeoutMs <= 0) {
    throw new Error("timeoutMs must be a positive integer.");
  }

  if (!Number.isSafeInteger(maxSizeBytes) || maxSizeBytes <= 0) {
    throw new Error("maxSizeBytes must be a positive integer.");
  }

  const url = new URL(fileUrl);

  const isUploadThingHost =
    url.hostname === "utfs.io" || /^[a-z0-9-]+\.ufs\.sh$/.test(url.hostname);

  if (
    url.protocol !== "https:" ||
    !isUploadThingHost ||
    url.port !== "" ||
    url.username !== "" ||
    url.password !== "" ||
    !/^\/f\/[^/]+$/.test(url.pathname)
  ) {
    throw new Error("Invalid UploadThing file URL.");
  }

  const response = await fetch(url, {
    method: "GET",
    cache: "no-store",
    redirect: "error",
    signal: AbortSignal.timeout(timeoutMs),
  });

  if (!response.ok) {
    await response.body?.cancel();

    throw new Error(
      `Failed to fetch UploadThing file: HTTP ${response.status}.`,
    );
  }

  if (!response.body) {
    throw new Error("The file response has no body.");
  }

  const contentLength = response.headers.get("content-length");

  if (contentLength !== null && Number(contentLength) > maxSizeBytes) {
    await response.body.cancel();
    throw new Error(`File exceeds the ${maxSizeBytes}-byte limit.`);
  }

  const reader = response.body.getReader();
  const chunks: Buffer[] = [];
  let size = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      size += value.byteLength;

      if (size > maxSizeBytes) {
        await reader.cancel();
        throw new Error(`File exceeds the ${maxSizeBytes}-byte limit.`);
      }

      chunks.push(Buffer.from(value));
    }
  } finally {
    reader.releaseLock();
  }

  return {
    data: Buffer.concat(chunks, size).toString("base64"),
    mimeType:
      response.headers
        .get("content-type")
        ?.split(";")[0]
        .trim()
        .toLowerCase() || "application/octet-stream",
  };
}
