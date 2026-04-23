import countries from "i18n-iso-countries"
import enLocale from "i18n-iso-countries/langs/en.json" assert {type: "json"}

countries.registerLocale(enLocale)

// Get all country names => ISO Codes
const names = countries.getNames("en", {select: "official"})

export const countryMap = {}

// Build mapping dynamically
for (const code in names) {
    const name = names[code].toLowerCase()

    countryMap[name] = code

    // Basic Fallback
    if (name.endsWith("a")) {
        countryMap[name + "n"] = code
    }
}

Object.assign(countryMap, {
  american: "US",
  british: "GB",
  english: "GB",
  scottish: "GB",

  korean: "KR",
  north_korean: "KP",

  russian: "RU",
  dutch: "NL",
  swiss: "CH",
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
