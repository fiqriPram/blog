"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteButton({ slug }: { slug: string }) {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/posts?slug=${slug}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.push("/");
      } else {
        alert("Failed to delete post");
      }
    } catch (error) {
      alert("Error deleting post");
    }
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="text-gray-600 hover:text-gray-900"
      >
        Delete Post
      </button>

      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Delete Post
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this post? This action cannot be
              undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
