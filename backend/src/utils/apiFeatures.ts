import { IAllQuery } from '../models'
import mongoose from 'mongoose'

export const paginationQuery = (query: IAllQuery) => {
    const page = query.page * 1 || 1
    const limit = query.limit * 1 || 9

    const skip = (page - 1) * limit

    return { skip, limit }
}

export const sortQuery = (query: IAllQuery) => {
    if (query.sort) {
        return query.sort.split(',').join(' ')
    }
    return '-createdAt'
}

export const filtersQuery = (query: IAllQuery) => {
    const excludes = ['sort', 'limit', 'page', 'fields']
    const newQuery = { ...query }
    for (const key in query) {
        if (excludes.includes(key)) delete newQuery[key]
    }

    const queryStr = JSON.stringify(newQuery)
    const newQueryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)

    return JSON.parse(newQueryStr)
}

export const fieldsQuery = (query: IAllQuery) => {
    if (query.fields) {
        return query.fields.split(',').join(' ')
    }
    return ''
}

export const handleQuery = (query: IAllQuery) => {
    const filters = filtersQuery(query)
    const { skip, limit } = paginationQuery(query)
    const sort = sortQuery(query)
    const select = fieldsQuery(query)

    return {
        filters,
        skip,
        limit,
        sort,
        select,
    }
}

export const handleQueryProducts = (query: IAllQuery) => {
    let filters = {}

    if (query.categories && query.categories?.length > 0) {
        const categories = query.categories.map((c: string) => {
            const id = new mongoose.Types.ObjectId(c)
            return id
        })
        filters['category'] = { $in: categories }
    }

    if (query.subCategories && query.subCategories?.length > 0) {
        const subCategories = query.subCategories.map((c: string) => {
            const id = new mongoose.Types.ObjectId(c)
            return id
        })
        filters['subCategory'] = { $in: subCategories }
    }

    if (query.colors && query.colors?.length > 0) {
        const colors = query.colors.map((c: string) => {
            const id = new mongoose.Types.ObjectId(c)
            return id
        })
        filters['colors'] = { $in: colors }
    }

    if (query.sizes && query.sizes?.length > 0) {
        const sizes = query.sizes.map((c: string) => {
            const id = new mongoose.Types.ObjectId(c)
            return id
        })
        filters['sizes'] = { $in: sizes }
    }

    if (query.ratings && query.ratings?.length > 0) {
        filters['ratingAverage'] = { $in: query.ratings }
    }

    if (query.prices && query.prices?.length > 0) {
        const prices = query.prices.map((p) => {
            const newValues = Object.entries(p).map((k) => {
                const key = k[0].replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)
                return {
                    [key]: Number(k[1]),
                }
            })
            const newPrices = newValues.reduce((obj: any, item: any) => {
                const arr = Object.entries(item)[0] as any
                obj[arr[0] as string] = arr[1]
                return obj
            }, {})
            return newPrices
        })
        const newPricesValues = prices.map((p) => ({ price: p }))
        filters['$or'] = newPricesValues
    }

    return filters
}
