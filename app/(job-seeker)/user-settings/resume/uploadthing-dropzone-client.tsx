"use client";

import { UploadDropZone } from "@/services/uploadthing/components/uploadthing";
import { useRouter } from "next/navigation";

export function DropZoneCLient() {
  // refresh the page to get the file from the server to allow the user to download it.s
  const router = useRouter();

  return (
    <UploadDropZone
      endpoint={"resumeUploader"}
      onClientUploadComplete={() => router.refresh()}
    />
  );
}
