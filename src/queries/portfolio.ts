import { queryOptions } from '@tanstack/react-query'
import {
  getPublishedPortfolio,
  getPortfolioBySlug,
  getAdminPortfolio,
  getAdminPortfolioItem,
} from '~/server/functions/portfolio'

export const portfolioKeys = {
  all: ['portfolio'] as const,
  lists: () => [...portfolioKeys.all, 'list'] as const,
  list: (filters: { category?: string; page?: number }) =>
    [...portfolioKeys.lists(), filters] as const,
  details: () => [...portfolioKeys.all, 'detail'] as const,
  detail: (slug: string) => [...portfolioKeys.details(), slug] as const,
  admin: () => [...portfolioKeys.all, 'admin'] as const,
  adminDetail: (id: string) => [...portfolioKeys.admin(), id] as const,
}

export const publishedPortfolioOptions = (
  filters: { category?: string; page?: number } = {},
) =>
  queryOptions({
    queryKey: portfolioKeys.list(filters),
    queryFn: () => getPublishedPortfolio({ data: filters }),
  })

export const portfolioBySlugOptions = (slug: string) =>
  queryOptions({
    queryKey: portfolioKeys.detail(slug),
    queryFn: () => getPortfolioBySlug({ data: { slug } }),
  })

export const adminPortfolioOptions = () =>
  queryOptions({
    queryKey: portfolioKeys.admin(),
    queryFn: () => getAdminPortfolio(),
  })

export const adminPortfolioItemOptions = (id: string) =>
  queryOptions({
    queryKey: portfolioKeys.adminDetail(id),
    queryFn: () => getAdminPortfolioItem({ data: { id } }),
  })
