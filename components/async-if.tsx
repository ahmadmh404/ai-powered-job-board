import { ReactNode, Suspense } from "react";

type Props = {
  condition: () => Promise<boolean>;
  children: ReactNode;
  fallback?: ReactNode;
  otherwise?: ReactNode;
};

export default function AsyncIf({
  children,
  condition,
  otherwise,
  fallback,
}: Props) {
  return (
    <Suspense fallback={fallback}>
      <SuspensedComponent condition={condition} otherwise={otherwise}>
        {children}
      </SuspensedComponent>
    </Suspense>
  );
}

async function SuspensedComponent({
  children,
  condition,
  otherwise,
}: Omit<Props, "fallback">) {
  return (await condition()) ? children : otherwise;
}
