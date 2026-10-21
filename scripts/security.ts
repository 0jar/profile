import { createHash } from "node:crypto";
import { themeScript } from "../src/data/security.ts";

export const themeHash = createHash("sha256").update(themeScript).digest("base64");

export const cspHeader = [
  "default-src 'self'",
  `script-src 'self' 'sha256-${themeHash}'`,
  "style-src 'self'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests"
].join("; ");
