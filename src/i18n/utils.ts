import { ui, type UiKey } from "./ui.ts";
import { blogHost, defaultLocale, site, type ShippedLocale } from "../data/site.ts";

export function t(
  lang: ShippedLocale,
  key: UiKey,
  values: Record<string, string> = {}
): string {
  const replacements: Record<string, string> = { name: site.displayName, blog: blogHost, ...values };
  return ui[lang][key].replace(/\{(\w+)\}/g, (_, name: string) => replacements[name] ?? `{${name}}`);
}

export function localePath(lang: ShippedLocale, path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return lang === defaultLocale ? clean : `/${lang}${clean}`;
}

export function pluralize(
  lang: ShippedLocale,
  count: number,
  forms: Partial<Record<Intl.LDMLPluralRule, string>> & { other: string }
): string {
  const rule = new Intl.PluralRules(lang).select(count);
  return forms[rule] ?? forms.other;
}
