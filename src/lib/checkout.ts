import { CHECKOUT_URLS } from "./constants";

export function getCheckoutUrl(kitSlug: string): string {
  return CHECKOUT_URLS[kitSlug as keyof typeof CHECKOUT_URLS] || "#";
}
