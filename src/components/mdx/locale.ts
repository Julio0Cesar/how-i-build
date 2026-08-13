import { locale as rootLocale } from "next/root-params";
import { defaultLocale, isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

export async function currentLocale(): Promise<Locale> {
  const value = await rootLocale();
  return value && isLocale(value) ? value : defaultLocale;
}

export async function currentDictionary() {
  return getDictionary(await currentLocale());
}
