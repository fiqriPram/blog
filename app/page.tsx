import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { PostType } from "@/types/post";
import SettingsMenu from "@/components/SettingsMenu";

export default async function Home() {
  const { data: posts, error } = await supabase
    .from("posts")
    .select("*")
    .order("date", { ascending: false });

  if (error) {
    console.error("Error fetching posts:", error);
    return <div>Error loading posts</div>;
  }

  const mappedPosts = posts.map((post: PostType) => ({
    slug: post.slug,
    title: post.title,
    excerpt: post.content.substring(0, 100) + "...",
    date: post.date,
  }));

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200 py-8">
        <div className="max-w-4xl mx-auto px-4 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-light text-gray-900">Minimal Blog</h1>
            <p className="text-gray-600 mt-2">Thoughts and ideas</p>
          </div>
          <div className="flex space-x-4 items-center">
            <Link href="/write" className="text-gray-600 hover:text-gray-900">
              Write Post
            </Link>
            <Link href="/profile" className="text-gray-600 hover:text-gray-900">
              Profile
            </Link>
            <SettingsMenu />
          </div>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {mappedPosts.map((post) => (
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
