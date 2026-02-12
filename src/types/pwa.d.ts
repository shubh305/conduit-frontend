import type { Serwist } from "serwist";

declare global {
  interface Window {
    serwist?: Serwist;
  }
}
