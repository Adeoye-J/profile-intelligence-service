import countries from "i18n-iso-countries";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

const enLocale = require("i18n-iso-countries/langs/en.json");

countries.registerLocale(enLocale);

const names = countries.getNames("en", { select: "official" });

export const countryMap = {};

// Build map
for (const code in names) {
  const name = names[code].toLowerCase();

  countryMap[name] = code;

  // basic demonym fallback
  if (name.endsWith("a")) {
    countryMap[name + "n"] = code;
  }
}

// Important overrides
Object.assign(countryMap, {
  american: "US",
  british: "GB",
  english: "GB",
  scottish: "GB",

  korean: "KR",
  russian: "RU",
  dutch: "NL",
  greek: "GR",
  swedish: "SE",
  norwegian: "NO",
  danish: "DK",
  finnish: "FI",
  polish: "PL",
  turkish: "TR",
  egyptian: "EG",
  south_african: "ZA"
});