import { getCollection, getEntry, type CollectionEntry } from "astro:content";
import type { ShippedLocale } from "../data/site.ts";

const inLang = (id: string, lang: ShippedLocale) => id.startsWith(`${lang}/`);

type CollectionName = "timeline" | "projects" | "geography" | "faq";

export async function getEntries<Collection extends CollectionName>(
  collection: Collection,
  lang: ShippedLocale
): Promise<CollectionEntry<Collection>[]> {
  const entries = await getCollection(collection, (entry) => inLang(entry.id, lang));
  return entries.sort((a, b) => a.data.order - b.data.order);
}

export async function getBio(lang: ShippedLocale) {
  const entry = await getEntry("bio", `${lang}/profile`);
  if (!entry) throw new Error(`Missing bio profile for locale "${lang}"`);
  return entry;
}

export async function getLanguages(lang: ShippedLocale) {
  const entry = await getEntry("languages", lang);
  if (!entry) throw new Error(`Missing languages table for locale "${lang}"`);
  return entry.data.items;
}
