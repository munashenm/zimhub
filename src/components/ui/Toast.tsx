"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { CheckCircle2, X, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastTone = "success" | "error" | "info";

type ToastItem = {
  id: string;
  message: string;
  tone: ToastTone;
};

type ToastContextValue = {
  toast: (message: string, tone?: ToastTone) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const toast = useCallback(
    (message: string, tone: ToastTone = "success") => {
      const id =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random()}`;
      setItems((prev) => [...prev.slice(-3), { id, message, tone }]);
      window.setTimeout(() => dismiss(id), 3200);
    },
    [dismiss]
  );

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-24 z-[60] flex flex-col items-center gap-2 px-4 sm:bottom-8 sm:items-end sm:px-6"
        aria-live="polite"
      >
        {items.map((item) => (
          <div
            key={item.id}
            className={cn(
              "pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border bg-white px-4 py-3 shadow-lg animate-toast-in",
              item.tone === "success" && "border-brand-200",
              item.tone === "error" && "border-red-200",
              item.tone === "info" && "border-gray-200"
            )}
          >
            {item.tone === "success" && (
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
            )}
            {item.tone === "error" && (
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
            )}
            {item.tone === "info" && (
              <Info className="mt-0.5 h-5 w-5 shrink-0 text-gray-500" />
            )}
            <p className="flex-1 text-sm font-medium text-gray-800">{item.message}</p>
            <button
              type="button"
              onClick={() => dismiss(item.id)}
              className="rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
              aria-label="Dismiss notification"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
