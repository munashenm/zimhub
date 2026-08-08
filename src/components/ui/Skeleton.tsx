import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-gray-200/80", className)}
      aria-hidden="true"
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white">
      <Skeleton className="aspect-square rounded-none" />
      <div className="space-y-2 p-3">
        <Skeleton className="h-4 w-[80%]" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="mt-2 h-9 w-full rounded-full" />
      </div>
    </div>
  );
}

export function CartSkeleton() {
  return (
    <div className="container-app py-8 animate-fade-in">
      <Skeleton className="h-8 w-48" />
      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="flex gap-4 rounded-xl border border-gray-200 bg-white p-4"
            >
              <Skeleton className="h-20 w-20 shrink-0 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-1/4" />
              </div>
            </div>
          ))}
        </div>
        <div className="h-fit rounded-xl border border-gray-200 bg-white p-6">
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="mt-4 h-8 w-2/3" />
          <Skeleton className="mt-6 h-11 w-full rounded-full" />
        </div>
      </div>
    </div>
  );
}
