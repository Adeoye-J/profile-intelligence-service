import axios from "axios"

export async function getGenderData(name) {
    try {
        const response = await axios.get(
            `https://api.genderize.io?name=${name.toLowerCase()}`,
            { timeout: 3000 }
        )

        const {gender, probability, count} = response.data

        // Edge case
        // if (gender === null || count === 0) {
        //     throw {
        //         status: 422,
        //         message: "No prediction available for the provided name"       
        //     }
        // }
        if (
            gender === null ||
            count === 0 ||
            Number(probability) < 0.6 ||   // 🔥 NEW
            count < 10                     // 🔥 NEW
        ) {
            throw {
                status: 422,
                message: "No prediction available for the provided name"
            };
        }

        return { gender, probability, count }

    } catch (error) {
        throw {
            status: 502,
            message: "Failed to fetch data from Genderize API"
        }
    }
}
