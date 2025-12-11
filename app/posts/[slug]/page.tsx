import { notFound } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { PostType } from "@/types/post";

export default async function Post({ params }: { params: { slug: string } }) {
  const { data: posts, error } = await supabase
    .from("posts")
    .select("*")
    .order("date", { ascending: false });

  if (error) {
    console.error("Error fetching posts:", error);
    notFound();
  }

  const post = posts.find((p: PostType) => p.slug === params.slug);

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
