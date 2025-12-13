"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface Follower {
  id: number;
  follower_name: string;
  follower_email?: string;
  followed_at: string;
}

export default function Followers() {
  const [followers, setFollowers] = useState<Follower[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFollowers = async () => {
      try {
        const { data, error } = await supabase
          .from("followers")
          .select("*")
          .eq("profile_id", 1)
          .order("followed_at", { ascending: false });

        if (error) throw error;

        setFollowers(data || []);
      } catch (error) {
        console.error("Error loading followers:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFollowers();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-light text-gray-900">Followers</h1>
          <p className="text-gray-600 mt-2">People who follow you</p>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-8">
        {followers.length === 0 ? (
          <p className="text-gray-600">No followers yet.</p>
        ) : (
          <ul className="space-y-4">
            {followers.map((follower) => (
              <li
                key={follower.id}
                className="border border-gray-200 rounded-md p-4"
              >
                <h3 className="text-lg font-semibold text-gray-900">
                  {follower.follower_name}
                </h3>
                <p className="text-sm text-gray-500">
                  Followed on{" "}
                  {new Date(follower.followed_at).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
