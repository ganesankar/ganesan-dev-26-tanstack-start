import { queryOptions } from '@tanstack/react-query'
import { getCategories } from '~/server/functions/categories'

export const categoryKeys = {
  all: ['categories'] as const,
}

export const categoriesOptions = () =>
  queryOptions({
    queryKey: categoryKeys.all,
    queryFn: () => getCategories(),
  })
