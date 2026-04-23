import { countryMap } from "./countries"

export function parseQuery(q) {
    const text = q.toLowerCase()
    const query = {}

    // Gender
    if (text.includes("male")) {
        query.gender = "male"
    }

    if (text.includes("female")) {
        query.gender = "female"
    }

    // Age Groups
    if (text.includes("child")) {
        query.age_group = "child"
    }

    if (text.includes("teen")) {
        query.age_group = "teenager"
    }

    if (text.includes("adult")) {
        query.age_group = "adult"
    }

    if (text.includes("senior")) {
        query.age_group = "senior"
    }

    // Young
    if (text.includes('young')) {
        query.min_age = 16
        query.max_age = 24
    }

    // Age Conditions
    const above = text.match(/above (\d+)/)
    if (above) {
        query.min_age = Number(above[1])
    }

    const below = text.match(/below (\d+)/)
    if (below) {
        query.max_age = Number(below[1])
    }

    // Countries
    // const countries = {
    //     nigeria: "NG",
    //     kenya: "KE",
    //     angola: "AO"
    // }
    
    for (const key in countryMap){ 
        if (text.includes(key)) {
            query.country_id = countryMap[key]
            break;
        }
    }

    return Object.keys(query).length ? query : null
}