import { client } from '@/sanity/lib/client'
import { groq } from 'next-sanity'
import Link from 'next/link'
import { Post } from '@/types/post'

async function getPosts(): Promise<Post[]> {
  const query = groq`
    *[_type == "post"] | order(publishedAt desc) {
      _id,
      _createdAt,
      title,
      slug,
      publishedAt
    }
  `
  return client.fetch(query)
}

export default async function HomePage() {
  const posts = await getPosts()

  return (
    <div className="max-w-5xl mx-auto py-20">
      <h1 className="text-3xl font-bold mb-10">Blog Posts</h1>
      
      <div className="grid grid-cols-1 gap-8">
        {posts.map((post) => (
          <article key={post._id}>
            <Link 
              href={`/posts/${post.slug.current}`}
              className="group block"
            >
              <h2 className="text-2xl font-bold group-hover:text-blue-500">
                {post.title}
              </h2>
              <time className="text-gray-600" dateTime={post.publishedAt}>
                {new Date(post.publishedAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </time>
            </Link>
          </article>
        ))}
      </div>
    </div>
  )
}