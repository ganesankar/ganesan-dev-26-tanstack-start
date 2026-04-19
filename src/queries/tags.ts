import { queryOptions } from '@tanstack/react-query'
import { getTags } from '~/server/functions/tags'

export const tagKeys = {
  all: ['tags'] as const,
}

export const tagsOptions = () =>
  queryOptions({
    queryKey: tagKeys.all,
    queryFn: () => getTags(),
  })
