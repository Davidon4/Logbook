import { PortableTextBlock } from 'sanity'

export interface Post {
  _id: string
  _createdAt: string
  title: string
  slug: {
    current: string
  }
  publishedAt: string
  content: PortableTextBlock[]
}