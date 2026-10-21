import { cspHeader } from "./scripts/security.ts";

export const playwrightConfig = {
  cspHeader,
  routes: [
    "/",
    "/vi/",
    "/cv/",
    "/cv/ats/",
    "/vi/cv/",
    "/vi/cv/ats/",
    "/projects/websites/",
    "/vi/projects/websites/",
    "/colophon/",
    "/vi/colophon/",
    "/404.html",
    "/vi/404/"
  ]
} as const;
