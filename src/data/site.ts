export const supportedLocales = ["en", "vi", "et", "ru"] as const;
export type Locale = (typeof supportedLocales)[number];

export const shippedLocales = ["en", "vi"] as const;
export type ShippedLocale = (typeof shippedLocales)[number];
export const defaultLocale = shippedLocales[0];
export const localeAutonyms: Record<ShippedLocale, string> = {
  en: "English",
  vi: "Tiếng Việt"
};
export const ogLocales: Record<ShippedLocale, string> = {
  en: "en_GB",
  vi: "vi_VN"
};

export const site = {
  displayName: "Jarema",
  legalName: "Vũ Việt Anh",
  monogram: "0jar",
  signalHandle: "jarema.26",
  email: "hi@jar.vn",
  phone: "+84858832868",
  signalUrl: "https://signal.me/#eu/wHpqXqMSQ6LSg0zijVcCCWm5PK5gwshaDFOAg0aj-aq5BSs94E9CLJ5ThNuy4t6A",
  url: "https://jar.vn",
  blogUrl: "https://jarema.me",
  linksUrl: "https://jar.tf",
  pdfBaseName: "jarema",
  codeProfiles: [
    { label: "Codeberg", handle: "0jar", url: "https://codeberg.org/0jar" },
    { label: "GitHub", handle: "0jar", url: "https://github.com/0jar" },
    { label: "GitLab", handle: "0jar", url: "https://gitlab.com/0jar" }
  ]
} as const;

export const siteHost = new URL(site.url).hostname;
export const blogHost = new URL(site.blogUrl).hostname;
export const linksHost = new URL(site.linksUrl).hostname;

export function getPaths() {
  return shippedLocales
    .filter((locale) => locale !== defaultLocale)
    .map((lang) => ({ params: { lang }, props: { lang } }));
}

export function parseEntryId(entryId: string): { lang: Locale; slug: string } {
  const clean = entryId.replace(/\.(md|yaml)$/, "");
  const [lang, ...rest] = clean.split("/");
  return { lang: lang as Locale, slug: rest.join("/") || (lang as string) };
}
