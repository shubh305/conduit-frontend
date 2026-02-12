import Cookies from "js-cookie";
import { getRootDomain } from "./utils";

const getCookieDomain = () => {
  if (typeof window === "undefined") return undefined;
  const hostname = window.location.hostname;
  
  if (hostname === "localhost" || hostname.endsWith(".localhost") || hostname === "127.0.0.1") {
    return undefined;
  }
  
  const rootDomain = getRootDomain().split(":")[0];
  return `.${rootDomain}`;
};

export const COOKIE_OPTIONS: Cookies.CookieAttributes = {
  expires: 30, // 30 days
  path: "/",
  domain: getCookieDomain(),
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
};

export const setAuthCookie = (name: string, value: string, options?: Cookies.CookieAttributes) => {
  Cookies.set(name, value, options || COOKIE_OPTIONS);
};

export const getAuthCookie = (name: string) => {
  return Cookies.get(name);
};

export const removeAuthCookie = (name: string, options?: Cookies.CookieAttributes) => {
  Cookies.remove(name, options || COOKIE_OPTIONS);
};
