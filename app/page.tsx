import Link from "next/link";

const posts = [
  {
    slug: "hello-world",
    title: "Hello World",
    excerpt: "Welcome to my minimal blog. This is the first post.",
    date: "2023-10-01",
  },
  {
    slug: "second-post",
    title: "Second Post",
    excerpt: "This is another post in the blog.",
    date: "2023-10-02",
  },
  {
    slug: "third-post",
    title: "Third Post",
    excerpt: "Yet another interesting post.",
    date: "2023-10-03",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-light text-gray-900">Minimal Blog</h1>
          <p className="text-gray-600 mt-2">Thoughts and ideas</p>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {posts.map((post) => (
            <article key={post.slug} className="border-b border-gray-100 pb-8">
              <h2 className="text-2xl font-light text-gray-900 mb-2">
                <Link
                  href={`/posts/${post.slug}`}
                  className="hover:text-gray-600"
                >
                  {post.title}
                </Link>
              </h2>
              <p className="text-gray-600 mb-2">{post.excerpt}</p>
              <time className="text-sm text-gray-500">{post.date}</time>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
