import { queryOptions } from '@tanstack/react-query'
import { getAdminMedia } from '~/server/functions/media'

export const mediaKeys = {
  all: ['media'] as const,
  admin: () => [...mediaKeys.all, 'admin'] as const,
}

export const adminMediaOptions = () =>
  queryOptions({
    queryKey: mediaKeys.admin(),
    queryFn: () => getAdminMedia(),
  })
