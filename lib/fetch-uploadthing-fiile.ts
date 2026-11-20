// src/lib/fetch-uploadthing-file.ts

import { Buffer } from "node:buffer";
import { extractText, getDocumentProxy } from "unpdf";

type FetchUploadThingFileOptions = {
  timeoutMs?: number;
  maxSizeBytes?: number;
  maxTextLength?: number;
};

export type FetchedUploadThingFile = {
  /** Extracted plain text ready for LLM inference. */
  text: string;

  /** The normalized MIME type of the document. */
  mimeType: string;
};

function assertValidOptions(
  timeoutMs: number,
  maxSizeBytes: number,
  maxTextLength: number,
) {
  if (!Number.isSafeInteger(timeoutMs) || timeoutMs <= 0) {
    throw new Error("timeoutMs must be a positive integer.");
  }

  if (!Number.isSafeInteger(maxSizeBytes) || maxSizeBytes <= 0) {
    throw new Error("maxSizeBytes must be a positive integer.");
  }

  if (!Number.isSafeInteger(maxTextLength) || maxTextLength <= 0) {
    throw new Error("maxTextLength must be a positive integer.");
  }
}

function parseUploadThingUrl(fileUrl: string): URL {
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

  return url;
}

async function readStreamWithinLimit(
  body: ReadableStream<Uint8Array>,
  maxSizeBytes: number,
): Promise<Buffer> {
  const reader = body.getReader();
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

  return Buffer.concat(chunks, size);
}

async function extractDocumentText(
  buffer: Buffer,
  mimeType: string,
): Promise<string> {
  if (mimeType === "application/pdf") {
    const pdf = await getDocumentProxy(new Uint8Array(buffer));
    const { text } = await extractText(pdf, { mergePages: true });
    return text;
  }

  if (mimeType.startsWith("text/")) {
    return buffer.toString("utf-8");
  }

  throw new Error(`Unsupported file MIME type: ${mimeType}`);
}

export async function fetchUploadThingFile(
  fileUrl: string,
  {
    timeoutMs = 15_000,
    maxSizeBytes = 10 * 1024 * 1024, // 10 MB
    maxTextLength = 15_000, // Stays safely within Groq free-tier TPM limits
  }: FetchUploadThingFileOptions = {},
): Promise<FetchedUploadThingFile> {
  assertValidOptions(timeoutMs, maxSizeBytes, maxTextLength);
  const url = parseUploadThingUrl(fileUrl);

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

  const mimeType =
    response.headers.get("content-type")?.split(";")[0].trim().toLowerCase() ||
    "application/octet-stream";

  const fileBuffer = await readStreamWithinLimit(response.body, maxSizeBytes);
  const rawText = await extractDocumentText(fileBuffer, mimeType);
  const cleanedText = rawText.trim();

  if (!cleanedText) {
    throw new Error("No readable text found in the uploaded file.");
  }

  return {
    text: cleanedText.slice(0, maxTextLength),
    mimeType,
  };
}
