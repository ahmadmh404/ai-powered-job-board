"use client";

import { ReactNode, useEffect, useState } from "react";

type Props = {
  children: ReactNode;
  otherwise: ReactNode;
  breakPoint: string;
};

export default function IsBreakPoint({
  breakPoint,
  children,
  otherwise,
}: Props) {
  const isBreakPoint = useIsBreakPoint(breakPoint);

  return isBreakPoint ? children : otherwise;
}

function useIsBreakPoint(breakPoint: string) {
  const [isBreakPoint, setIsBreakPoint] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const media = window.matchMedia(`(${breakPoint})`);

    // Sync immediately on mount so initial render matches viewport
    setIsBreakPoint(media.matches);

    media.addEventListener(
      "change",
      (e) => {
        setIsBreakPoint(e.matches);
      },
      { signal: controller.signal },
    );

    return () => {
      controller.abort();
    };
  }, [breakPoint]);

  return isBreakPoint;
}
