import { queryOptions } from '@tanstack/react-query'
import {
  getPublishedPosts,
  getPostBySlug,
  getAdminPosts,
  getAdminPost,
} from '~/server/functions/posts'

export const postKeys = {
  all: ['posts'] as const,
  lists: () => [...postKeys.all, 'list'] as const,
  list: (filters: { category?: string; tag?: string; page?: number }) =>
    [...postKeys.lists(), filters] as const,
  details: () => [...postKeys.all, 'detail'] as const,
  detail: (slug: string) => [...postKeys.details(), slug] as const,
  admin: () => [...postKeys.all, 'admin'] as const,
  adminDetail: (id: string) => [...postKeys.admin(), id] as const,
}

export const publishedPostsOptions = (
  filters: { category?: string; tag?: string; page?: number } = {},
) =>
  queryOptions({
    queryKey: postKeys.list(filters),
    queryFn: () => getPublishedPosts({ data: filters }),
  })

export const postBySlugOptions = (slug: string) =>
  queryOptions({
    queryKey: postKeys.detail(slug),
    queryFn: () => getPostBySlug({ data: { slug } }),
  })

export const adminPostsOptions = () =>
  queryOptions({
    queryKey: postKeys.admin(),
    queryFn: () => getAdminPosts(),
  })

export const adminPostOptions = (id: string) =>
  queryOptions({
    queryKey: postKeys.adminDetail(id),
    queryFn: () => getAdminPost({ data: { id } }),
  })
