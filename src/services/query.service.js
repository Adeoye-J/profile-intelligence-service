export function buildQuery(params) {
    const query = {}

    if (params.gender) {
        query.gender = params.gender.toLowerCase()
    }

    if (params.age_group) {
        query.age_group = params.age_group.toLowerCase()
    }

    if (params.country_id) {
        query.country_id = params.country_id.toUpperCase()
    }

    if (params.min_age || params.max_age) {
        query.age = {}
        if (params.min_age) {
            query.age.$gte = Number(params.min_age)
        }
        if (params.max_age) {
            query.age.$lte = Number(params.max_age)
        }
    }

    if (params.min_gender_probability) {
        query.gender_probability = {
            $gte: Number(params.min_gender_probability)
        }
    }

    if (params.min_country_probability) {
        query.country_probability = {
            $gte: Number(params.min_country_probability)
        }
    }

    return query
}

export function buildOptions(params) {
    const sort = {}

    if (params.sort_by) {
        const order = params.order === "desc" ? -1 : 1;
        sort[params.sort_by] = order
    }

    const page = Math.max(Number(params.page) || 1, 1)
    const limit = Math.min(Number(params.limit) || 10, 50)

    return {
        sort,
        page,
        limit,
        skip: (page - 1) * limit
    }
}