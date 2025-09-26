"use client";

import { Sheet } from "@/components/ui/sheet";
import { useRouter, useSearchParams } from "next/navigation";
import { ReactNode, useState } from "react";

type Props = {
  children: ReactNode;
};

export default function ClientSheet({ children }: Props) {
  const [open, setOpen] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <Sheet
      open={open}
      onOpenChange={(open) => {
        if (open) return;
        setOpen(false);

        router.push(`/${searchParams}`);
      }}
    >
      {children}
    </Sheet>
  );
}
