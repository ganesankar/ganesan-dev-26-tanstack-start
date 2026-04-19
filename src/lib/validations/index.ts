import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})
export type LoginFormData = z.infer<typeof loginSchema>

export const signupSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})
export type SignupFormData = z.infer<typeof signupSchema>

export const magicLinkSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})
export type MagicLinkFormData = z.infer<typeof magicLinkSchema>

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export const postSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title is too long'),
  slug: z.string().min(1, 'Slug is required').max(255, 'Slug is too long')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase with hyphens only'),
  description: z.string().max(500, 'Description is too long').optional(),
  content: z.string(),
  thumbnail_url: z.string().url().optional().or(z.literal('')),
  category_ids: z.array(z.string()),
  tag_ids: z.array(z.string()),
  published: z.boolean(),
})
export type PostFormData = z.infer<typeof postSchema>

export const pageSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title is too long'),
  slug: z.string().min(1, 'Slug is required').max(255, 'Slug is too long')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase with hyphens only'),
  description: z.string().max(500, 'Description is too long').optional(),
  content: z.string(),
  thumbnail_url: z.string().url().optional().or(z.literal('')),
  published: z.boolean(),
})
export type PageFormData = z.infer<typeof pageSchema>

export const portfolioSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title is too long'),
  slug: z.string().min(1, 'Slug is required').max(255, 'Slug is too long')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase with hyphens only'),
  description: z.string().max(500, 'Description is too long').optional(),
  content: z.string(),
  thumbnail_url: z.string().url().optional().or(z.literal('')),
  project_url: z.string().url().optional().or(z.literal('')),
  category_ids: z.array(z.string()),
  published: z.boolean(),
})
export type PortfolioFormData = z.infer<typeof portfolioSchema>

export const categorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  slug: z.string().min(1, 'Slug is required').max(100, 'Slug is too long')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase with hyphens only'),
  description: z.string().max(500, 'Description is too long').optional(),
})
export type CategoryFormData = z.infer<typeof categorySchema>

export const tagSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  slug: z.string().min(1, 'Slug is required').max(100, 'Slug is too long')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase with hyphens only'),
})
export type TagFormData = z.infer<typeof tagSchema>

export const resumeSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title is too long'),
  subtitle: z.string().max(255, 'Subtitle is too long').optional().or(z.literal('')),
  category: z.string().min(1, 'Category is required').max(100, 'Category is too long'),
  place: z.string().max(255, 'Place is too long').optional().or(z.literal('')),
  description: z.string().max(2000, 'Description is too long').optional().or(z.literal('')),
  start_date: z.string().optional().or(z.literal('')),
  end_date: z.string().optional().or(z.literal('')),
  published: z.boolean(),
  sort_order: z.number().int(),
})
export type ResumeFormData = z.infer<typeof resumeSchema>

export const RESUME_CATEGORIES = [
  { value: 'work', label: 'Work Experience' },
  { value: 'education', label: 'Education' },
  { value: 'certification', label: 'Certification' },
  { value: 'volunteer', label: 'Volunteer' },
  { value: 'project', label: 'Project' },
] as const

export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().max(255, 'Subject is too long').optional(),
  message: z.string()
    .min(10, 'Message must be at least 10 characters')
    .max(5000, 'Message is too long'),
})
export type ContactFormData = z.infer<typeof contactSchema>

export const ALLOWED_FILE_TYPES = {
  image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  video: ['video/mp4', 'video/webm'],
  document: ['application/pdf'],
  archive: ['application/zip'],
} as const

export const MAX_FILE_SIZES = {
  image: 10 * 1024 * 1024,
  video: 50 * 1024 * 1024,
  document: 25 * 1024 * 1024,
  archive: 50 * 1024 * 1024,
} as const

export function getMediaType(mimeType: string): 'image' | 'video' | 'document' | 'archive' | null {
  if (ALLOWED_FILE_TYPES.image.includes(mimeType as never)) return 'image'
  if (ALLOWED_FILE_TYPES.video.includes(mimeType as never)) return 'video'
  if (ALLOWED_FILE_TYPES.document.includes(mimeType as never)) return 'document'
  if (ALLOWED_FILE_TYPES.archive.includes(mimeType as never)) return 'archive'
  return null
}

export function isAllowedFileType(mimeType: string): boolean {
  return getMediaType(mimeType) !== null
}

export function getMaxFileSize(mimeType: string): number {
  const mediaType = getMediaType(mimeType)
  if (!mediaType) return 0
  return MAX_FILE_SIZES[mediaType]
}
