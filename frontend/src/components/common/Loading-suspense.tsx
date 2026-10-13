import { Loader2Icon } from "lucide-react";
import { Suspense, type ReactNode } from "react";

type LoadingSuspenseProps = {
  children: ReactNode;
};

export default function LoadingSuspense({ children }: LoadingSuspenseProps) {
  return (
    <Suspense fallback={<Loader2Icon className="size-20 animate-spin" />}>
      {children}
    </Suspense>
  );
}
