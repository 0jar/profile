import type { ShippedLocale } from "../data/site.ts";
import { t } from "../i18n/utils.ts";

export function formatYearMonth(ym: string, lang: ShippedLocale): string {
  const [year, month] = ym.split("-");
  if (!year || !month) throw new Error(`Invalid YYYY-MM date: ${ym}`);
  return new Intl.DateTimeFormat(lang, { month: "short", year: "numeric", timeZone: "UTC" }).format(
    new Date(`${ym}-01T00:00:00Z`)
  );
}

export function formatDateRange(
  start: string,
  end: string,
  lang: ShippedLocale,
  isExpectedEnd = false
): string {
  const s = formatYearMonth(start, lang);
  if (end === "present") return `${s} ${t(lang, "dates.present")}`;
  const e = formatYearMonth(end, lang);
  return `${s} ${t(lang, "dates.to")} ${e}${isExpectedEnd ? ` (${t(lang, "dates.expected")})` : ""}`;
}
