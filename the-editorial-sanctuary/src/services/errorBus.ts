export type ErrorTopic = "api" | "auth";

/** Structured error for logging and future toast UI (no UI mounted here). */
export interface AppErrorEvent {
  topic: ErrorTopic;
  message: string;
  cause?: string;
  endpoint?: string;
  method?: string;
  requestId?: string;
  /** Non-sensitive summary only (no passwords or tokens). */
  payloadSummary?: string;
  /** Reserved for a future toast layer — subscribe and map to your design system. */
  toastReady?: { title: string; body: string; variant: "error" };
}

const BUS = "masuki:app-error";

export function emitAppError(e: AppErrorEvent): void {
  const toastReady = {
    title: e.topic === "auth" ? "Session" : "Request failed",
    body: e.message,
    variant: "error" as const,
  };
  const detail: AppErrorEvent = { ...e, toastReady: e.toastReady ?? toastReady };

  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(BUS, { detail }));
  }
}

export function subscribeAppErrors(
  handler: (e: AppErrorEvent) => void
): () => void {
  if (typeof window === "undefined") {
    return () => undefined;
  }
  const fn = (ev: Event) => {
    handler((ev as CustomEvent<AppErrorEvent>).detail);
  };
  window.addEventListener(BUS, fn);
  return () => window.removeEventListener(BUS, fn);
}
