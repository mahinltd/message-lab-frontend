export type MetaEventName =
  | "ViewContent"
  | "SignUp"
  | "CompleteRegistration"
  | "InitiateCheckout"
  | "Purchase"
  | "signup_start"
  | "apk_download"
  | "cta_click";

export type MetaEventParameters = Record<string, string | number | boolean>;

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    __messagelabMetaInitialized?: boolean;
    __messagelabMetaEventQueue?: unknown[][];
  }
}

export function trackMetaEvent(
  eventName: MetaEventName,
  parameters?: MetaEventParameters,
): void {
  if (typeof window === "undefined") return;
  if (typeof window.fbq === "function") {
    window.fbq("track", eventName, parameters);
    return;
  }
  window.__messagelabMetaEventQueue ??= [];
  window.__messagelabMetaEventQueue.push(["track", eventName, parameters]);
}

export function trackMetaCustomEvent(
  eventName: Exclude<MetaEventName, "ViewContent" | "SignUp" | "CompleteRegistration" | "InitiateCheckout" | "Purchase">,
  parameters?: MetaEventParameters,
): void {
  if (typeof window === "undefined") return;
  if (typeof window.fbq === "function") {
    window.fbq("trackCustom", eventName, parameters);
    return;
  }
  window.__messagelabMetaEventQueue ??= [];
  window.__messagelabMetaEventQueue.push(["trackCustom", eventName, parameters]);
}