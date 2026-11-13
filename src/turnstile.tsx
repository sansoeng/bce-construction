import { useEffect, useRef, useState } from "react";

const SITE_KEY =
  (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_TURNSTILE_SITE_KEY ||
  "0x4AAAAAAF-VzpfgSQaEPDl7";

type TurnstileApi = {
  render: (element: HTMLElement, options: Record<string, unknown>) => string;
  reset: (widgetId?: string) => void;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

let scriptPromise: Promise<void> | null = null;

const loadTurnstile = () => {
  if (window.turnstile) return Promise.resolve();
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>("script[data-bce-turnstile]");
    if (existing) {
      if (window.turnstile) return resolve();
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("Could not load the security check")));
      return;
    }
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.defer = true;
    script.dataset.bceTurnstile = "true";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Could not load the security check"));
    document.head.appendChild(script);
  });
  return scriptPromise;
};

export function Turnstile({
  onToken,
  resetKey = 0,
  action = "quote",
}: {
  onToken: (token: string) => void;
  resetKey?: number;
  action?: string;
}) {
  const container = useRef<HTMLDivElement>(null);
  const callback = useRef(onToken);
  const [error, setError] = useState("");

  callback.current = onToken;

  useEffect(() => {
    let widgetId: string | undefined;
    let cancelled = false;

    loadTurnstile()
      .then(() => {
        if (cancelled || !container.current || !window.turnstile) return;
        widgetId = window.turnstile.render(container.current, {
          sitekey: SITE_KEY,
          action,
          theme: "light",
          callback: (token: string) => callback.current(token),
          "expired-callback": () => callback.current(""),
          "error-callback": () => {
            callback.current("");
            setError("Security check failed. Please try again.");
          },
        });
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Security check unavailable"));

    return () => {
      cancelled = true;
      if (widgetId && window.turnstile) {
        try {
          window.turnstile.remove(widgetId);
        } catch {
          /* widget already removed */
        }
      }
    };
  }, [action, resetKey]);

  return (
    <div className="mt-8 flex flex-col gap-2">
      <div ref={container} />
      {error && <p className="text-sm text-[#b3261e]">{error}</p>}
      <p className="text-[.8rem] text-black/40">
        Protected by Cloudflare Turnstile. We only store the details you submit.
      </p>
    </div>
  );
}
