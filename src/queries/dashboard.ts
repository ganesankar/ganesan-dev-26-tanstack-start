import { queryOptions } from '@tanstack/react-query'
import { getDashboardStats } from '~/server/functions/dashboard'

export const dashboardKeys = {
  all: ['dashboard'] as const,
  stats: () => [...dashboardKeys.all, 'stats'] as const,
}

export const dashboardStatsOptions = () =>
  queryOptions({
    queryKey: dashboardKeys.stats(),
    queryFn: () => getDashboardStats(),
  })
