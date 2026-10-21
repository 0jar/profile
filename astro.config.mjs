import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { defaultLocale, shippedLocales, site } from "./src/data/site.ts";

const localePaths = Object.fromEntries(shippedLocales.map((locale) => [locale, locale]));

export default defineConfig({
  site: site.url,
  output: "static",
  trailingSlash: "always",
  prerenderConflictBehavior: "error",
  compressHTML: true,
  build: {
    inlineStylesheets: "never"
  },
  i18n: {
    defaultLocale,
    locales: shippedLocales,
    routing: {
      prefixDefaultLocale: false
    }
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale,
        locales: localePaths
      }
    })
  ],
  vite: {
    build: {
      assetsInlineLimit: 0
    }
  }
});

