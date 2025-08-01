import { client } from '@/sanity/lib/client'
import { groq } from 'next-sanity'
import { PortableText } from '@portabletext/react'
import { notFound } from 'next/navigation'
import { Post } from '@/types/post'

const query = groq`*[_type == "post" && slug.current == $slug][0] {
  _id,
  title,
  content,
  publishedAt
}`

async function getPost(slug: string) {
  if (!slug) {
    return null
  }

  try {
    const post = await client.fetch(query, { slug })
    return post
  } catch (error) {
    return null
  }
}

export async function generateStaticParams() {
  const slugs = await client.fetch(
    groq`*[_type == "post"] { "slug": slug.current }`
  )
  
  return slugs.map((slug: any) => ({
    slug: slug.slug,
  }))
}

export default async function PostPage({
  params,
}: {
  params: { slug: string }
}) {
  const post = await getPost(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <article className="max-w-3xl mx-auto py-8">
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      
      <div className="flex items-center space-x-2 mb-8">
        <time dateTime={post.publishedAt} className="text-gray-600">
          {new Date(post.publishedAt).toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          })}
        </time>
      </div>

      <div className="prose prose-lg max-w-none">
        <PortableText 
          value={post.content} 
          components={{
            block: {
              h2: ({children}) => <h2 className="text-2xl font-bold mt-8 mb-4">{children}</h2>,
              blockquote: ({children}) => <blockquote className="border-l-4 border-gray-200 pl-4 italic">{children}</blockquote>,
              normal: ({children}) => <p className="mb-4">{children}</p>
            }
          }}
        />
      </div>
    </article>
  )
}