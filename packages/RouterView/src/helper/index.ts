import { PAGE_META } from "../util/constant";
import type { Page } from "../type";

export function getPageMeta(): Page {
  var __g =
    typeof globalThis !== 'undefined' ? globalThis :
    typeof self !== 'undefined' ? self :
    typeof window !== 'undefined' ? window :
    // @ts-expect-error: ignore
    typeof global !== 'undefined' ? global :
    Function('return this')();
  const meta = __g[Symbol.for(PAGE_META)]
  if (!meta) {
    throw new Error('[RouterView]: Page meta not found, maybe you forget to inject page meta?')
  }
  return meta
}
