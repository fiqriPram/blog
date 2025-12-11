"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { PostType } from "@/types/post";
import DeleteButton from "@/components/DeleteButton";
import EditButton from "@/components/EditButton";

export default function Post({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [post, setPost] = useState<PostType | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: "",
    content: "",
    date: "",
  });
  const router = useRouter();

  useEffect(() => {
    const loadPost = async () => {
      try {
        const { data: posts, error } = await supabase
          .from("posts")
          .select("*")
          .order("date", { ascending: false });

        if (error) throw error;

        const foundPost = posts.find((p: PostType) => p.slug === slug);
        if (foundPost) {
          setPost(foundPost);
          setEditData({
            title: foundPost.title,
            content: foundPost.content,
            date: foundPost.date,
          });
        }
      } catch (error) {
        console.error("Error loading post:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [slug]);

  const handleSave = async () => {
    if (!post) return;

    try {
      const { error } = await supabase
        .from("posts")
        .update({
          title: editData.title,
          content: editData.content,
          date: editData.date,
        })
        .eq("slug", post.slug);

      if (error) throw error;

      setPost({ ...post, ...editData });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating post:", error);
      alert("Failed to update post");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        Post not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200 py-8">
        <div className="max-w-4xl mx-auto px-4 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-light text-gray-900">Minimal Blog</h1>
            <p className="text-gray-600 mt-2">Thoughts and ideas</p>
          </div>
          <EditButton
            isEditing={isEditing}
            onEdit={() => setIsEditing(true)}
            onSave={handleSave}
            onCancel={() => {
              setIsEditing(false);
              if (post) {
                setEditData({
                  title: post.title,
                  content: post.content,
                  date: post.date,
                });
              }
            }}
          />
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-8">
        <article>
          {isEditing ? (
            <div className="space-y-4">
              <input
                type="text"
                value={editData.title}
                onChange={(e) =>
                  setEditData({ ...editData, title: e.target.value })
                }
                className="w-full text-3xl font-light text-gray-900 border-b border-gray-300 focus:outline-none focus:border-gray-500"
                placeholder="Title"
              />
              <input
                type="date"
                value={editData.date}
                onChange={(e) =>
                  setEditData({ ...editData, date: e.target.value })
                }
                className="block text-sm text-gray-500 border-b border-gray-300 focus:outline-none focus:border-gray-500"
              />
              <textarea
                value={editData.content}
                onChange={(e) =>
                  setEditData({ ...editData, content: e.target.value })
                }
                className="w-full prose prose-gray max-w-none text-gray-900 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
                rows={10}
                placeholder="Content"
              />
            </div>
          ) : (
            <>
              <h1 className="text-3xl font-light text-gray-900 mb-4">
                {post.title}
              </h1>
              <time className="text-sm text-gray-500 mb-8 block">
                {post.date}
              </time>
              <div className="prose prose-gray max-w-none text-gray-900">
                <p>{post.content}</p>
              </div>
            </>
          )}
        </article>
        <div className="mt-8 flex justify-between items-center">
          <Link href="/" className="text-gray-600 hover:text-gray-900">
            ← Back to posts
          </Link>
          <DeleteButton slug={post.slug} />
        </div>
      </main>
    </div>
  );
}
