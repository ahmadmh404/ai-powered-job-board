"use client";

import { generateUploadDropzone } from "@uploadthing/react";
import { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { UploadThingError } from "uploadthing/server";
import { Json } from "@uploadthing/shared";
import { CustomFileRouter } from "../router";

const UploadthingDroZoneComponent = generateUploadDropzone<CustomFileRouter>();

export function UploadDropZone({
  className,
  onClientUploadComplete,
  onUploadError,
  ...props
}: ComponentProps<typeof UploadthingDroZoneComponent>) {
  return (
    <UploadthingDroZoneComponent
      onClientUploadComplete={(res) => {
        res.forEach(({ serverData }) => {
          toast.success(serverData.message);
        });
        onClientUploadComplete?.(res);
      }}
      onUploadError={(error: UploadThingError<Json>) => {
        toast.error(error.message);
        onUploadError?.(error);
      }}
      className={cn(
        "border-dashed border-2 border-muted-foreground flex items-center justify-center",
        className
      )}
      {...props}
    />
  );
}
