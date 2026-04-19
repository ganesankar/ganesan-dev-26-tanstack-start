import { queryOptions } from '@tanstack/react-query'
import {
  getPageBySlug,
  getAdminPages,
  getAdminPage,
} from '~/server/functions/pages'

export const pageKeys = {
  all: ['pages'] as const,
  details: () => [...pageKeys.all, 'detail'] as const,
  detail: (slug: string) => [...pageKeys.details(), slug] as const,
  admin: () => [...pageKeys.all, 'admin'] as const,
  adminDetail: (id: string) => [...pageKeys.admin(), id] as const,
}

export const pageBySlugOptions = (slug: string) =>
  queryOptions({
    queryKey: pageKeys.detail(slug),
    queryFn: () => getPageBySlug({ data: { slug } }),
  })

export const adminPagesOptions = () =>
  queryOptions({
    queryKey: pageKeys.admin(),
    queryFn: () => getAdminPages(),
  })

export const adminPageOptions = (id: string) =>
  queryOptions({
    queryKey: pageKeys.adminDetail(id),
    queryFn: () => getAdminPage({ data: { id } }),
  })
