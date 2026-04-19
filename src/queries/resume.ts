import { queryOptions } from '@tanstack/react-query'
import {
  getPublishedResume,
  getAdminResume,
  getAdminResumeItem,
} from '~/server/functions/resume'

export const resumeKeys = {
  all: ['resume'] as const,
  published: () => [...resumeKeys.all, 'published'] as const,
  admin: () => [...resumeKeys.all, 'admin'] as const,
  adminDetail: (id: string) => [...resumeKeys.admin(), id] as const,
}

export const publishedResumeOptions = () =>
  queryOptions({
    queryKey: resumeKeys.published(),
    queryFn: () => getPublishedResume(),
  })

export const adminResumeOptions = () =>
  queryOptions({
    queryKey: resumeKeys.admin(),
    queryFn: () => getAdminResume(),
  })

export const adminResumeItemOptions = (id: string) =>
  queryOptions({
    queryKey: resumeKeys.adminDetail(id),
    queryFn: () => getAdminResumeItem({ data: { id } }),
  })
