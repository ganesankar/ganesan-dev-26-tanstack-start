import type { ComponentType } from 'react'

export interface Post {
  id: string
  title: string
  slug: string
  description: string | null
  content: string
  thumbnail_url: string | null
  published: boolean
  created_at: string
  updated_at: string
  published_at: string | null
}

export interface PostWithRelations extends Post {
  categories: Category[]
  tags: Tag[]
}

export interface Page {
  id: string
  title: string
  slug: string
  description: string | null
  content: string
  thumbnail_url: string | null
  published: boolean
  created_at: string
  updated_at: string
  published_at: string | null
}

export interface Portfolio {
  id: string
  title: string
  slug: string
  description: string | null
  content: string
  thumbnail_url: string | null
  project_url: string | null
  published: boolean
  created_at: string
  updated_at: string
  published_at: string | null
}

export interface PortfolioWithCategories extends Portfolio {
  categories: Category[]
}

export interface Resume {
  id: string
  title: string
  subtitle: string | null
  category: string
  place: string | null
  description: string | null
  start_date: string | null
  end_date: string | null
  published: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  thumbnail_url: string | null
  created_at: string
}

export interface Tag {
  id: string
  name: string
  slug: string
  created_at: string
}

export interface Message {
  id: string
  name: string
  email: string
  subject: string | null
  message: string
  read: boolean
  created_at: string
}

export interface Media {
  id: string
  filename: string
  file_type: string
  file_size: number
  storage_path: string
  public_url: string
  alt_text: string | null
  created_at: string
}

export interface ContactFormData {
  name: string
  email: string
  subject?: string
  message: string
}

export interface PostFormData {
  title: string
  slug: string
  description?: string
  content: string
  thumbnail_url?: string
  category_ids: string[]
  tag_ids: string[]
  published: boolean
}

export interface PageFormData {
  title: string
  slug: string
  description?: string
  content: string
  thumbnail_url?: string
  published: boolean
}

export interface PortfolioFormData {
  title: string
  slug: string
  description?: string
  content: string
  thumbnail_url?: string
  project_url?: string
  category_ids: string[]
  published: boolean
}

export interface ResumeFormData {
  title: string
  subtitle?: string
  category: string
  place?: string
  description?: string
  start_date?: string
  end_date?: string
  published: boolean
  sort_order: number
}

export interface CategoryFormData {
  name: string
  slug: string
  description?: string
  thumbnail_url?: string
}

export interface TagFormData {
  name: string
  slug: string
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface MediaUploadResponse {
  id: string
  filename: string
  file_type: string
  file_size: number
  storage_path: string
  public_url: string
}

export type MediaType = 'image' | 'video' | 'document' | 'archive'

export interface NavItem {
  title: string
  href: string
  icon?: ComponentType<{ className?: string }>
  badge?: string
  disabled?: boolean
}

export interface NavGroup {
  title: string
  items: NavItem[]
}

export interface SocialLink {
  name: string
  href: string
  icon: ComponentType<{ className?: string }>
}

export interface TableRow {
  id: string
}

export interface PostsFilter {
  published?: boolean
  category_id?: string
  tag_id?: string
  search?: string
  page?: number
  pageSize?: number
}

export interface MediaFilter {
  file_type?: MediaType
  search?: string
  page?: number
  pageSize?: number
}
