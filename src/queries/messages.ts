import { queryOptions } from '@tanstack/react-query'
import { getMessages } from '~/server/functions/messages'

export const messageKeys = {
  all: ['messages'] as const,
  admin: () => [...messageKeys.all, 'admin'] as const,
}

export const adminMessagesOptions = () =>
  queryOptions({
    queryKey: messageKeys.admin(),
    queryFn: () => getMessages(),
  })
