import { queryOptions } from '@tanstack/react-query'
import { getHomeData } from '~/server/functions/home'

export const homeKeys = {
  all: ['home'] as const,
}

export const homeDataOptions = () =>
  queryOptions({
    queryKey: homeKeys.all,
    queryFn: () => getHomeData(),
  })
