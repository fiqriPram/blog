import { notFound } from "next/navigation";
import Link from "next/link";

const posts = {
  "hello-world": {
    title: "Hello World",
    content:
      "Welcome to my minimal blog. This is the first post. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    date: "2023-10-01",
  },
  "second-post": {
    title: "Second Post",
    content:
      "This is another post in the blog. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    date: "2023-10-02",
  },
  "third-post": {
    title: "Third Post",
    content:
      "Yet another interesting post. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    date: "2023-10-03",
  },
};

export default function Post({ params }: { params: { slug: string } }) {
  const post = posts[params.slug as keyof typeof posts];

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-light text-gray-900">Minimal Blog</h1>
          <p className="text-gray-600 mt-2">Thoughts and ideas</p>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-8">
        <article>
          <h1 className="text-3xl font-light text-gray-900 mb-4">
            {post.title}
          </h1>
          <time className="text-sm text-gray-500 mb-8 block">{post.date}</time>
          <div className="prose prose-gray max-w-none">
            <p>{post.content}</p>
          </div>
        </article>
        <div className="mt-8">
          <Link href="/" className="text-gray-600 hover:text-gray-900">
            ← Back to posts
          </Link>
        </div>
      </main>
    </div>
  );
}
