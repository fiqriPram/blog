"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Write() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, date }),
      });
      if (response.ok) {
        const { slug } = await response.json();
        router.push("/");
      } else {
        alert("Failed to publish post");
      }
    } catch (error) {
      alert("Error publishing post");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-light text-gray-900">Write a Post</h1>
          <p className="text-gray-600 mt-2">Create a new blog post</p>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-gray-500 focus:border-gray-500 text-gray-900"
              required
            />
          </div>
          <div>
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700"
            >
              Date
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-gray-500 focus:border-gray-500 text-gray-900"
              required
            />
          </div>
          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700"
            >
              Content
            </label>
            <textarea
              id="content"
              rows={10}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-gray-500 focus:border-gray-500 text-gray-900"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800"
          >
            Publish Post
          </button>
        </form>
      </main>
    </div>
  );
}
