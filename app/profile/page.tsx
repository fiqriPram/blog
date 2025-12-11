"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { ProfileData } from "@/types/profile";

export default function Profile() {
  const [avatarUrl, setAvatarUrl] = useState("/avatar.jpg");
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .single();

        if (error) throw error;

        setProfile(data);
        setAvatarUrl(data.avatar_url || "/avatar.jpg");
      } catch (error) {
        console.error("Error loading profile:", error);
        // Fallback to defaults
        setProfile({
          name: "Fiqri Pramana",
          title: "Software Developer & Blogger",
          bio: "Hello! I'm Fiqri Pramana...",
          currentFocus: "I'm currently focusing...",
          expertise: [
            "Frontend Development...",
            "Backend Development...",
            "Database...",
            "DevOps...",
            "Programming Languages...",
          ],
          email: "fiqri@example.com",
          linkedin: "https://linkedin.com/in/fiqripramana",
          github: "https://github.com/fiqripram",
        });
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleSave = async () => {
    if (!profile) return;

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          name: profile.name,
          title: profile.title,
          bio: profile.bio,
          current_focus: profile.currentFocus,
          expertise: profile.expertise,
          email: profile.email,
          linkedin: profile.linkedin,
          github: profile.github,
          avatar_url: avatarUrl,
        })
        .eq("id", 1); // Assuming id=1

      if (error) throw error;

      setIsEditing(false);
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile");
    }
  };

  const handleExpertiseChange = (index: number, value: string) => {
    if (!profile) return;
    const newExpertise = [...profile.expertise];
    newExpertise[index] = value;
    setProfile({ ...profile, expertise: newExpertise });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const { url } = await response.json();
        setAvatarUrl(url);
        // Update avatar_url in Supabase
        if (profile) {
          await supabase
            .from("profiles")
            .update({ avatar_url: url })
            .eq("id", 1);
        }
      } else {
        alert("Upload failed");
      }
    } catch (error) {
      alert("Upload error");
    }
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        Error loading profile
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        Error loading profile
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200 py-8">
        <div className="max-w-4xl mx-auto px-4 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-light text-gray-900">Profile</h1>
            <p className="text-gray-600 mt-2">About the author</p>
          </div>
          <button
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700"
          >
            {isEditing ? "Save" : "Edit"}
          </button>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="max-w-4xl">
          <div className="mb-8">
            <div className="relative">
              <Image
                src={avatarUrl}
                alt="Author"
                width={128}
                height={128}
                className="w-32 h-32 rounded-full mx-auto mb-4"
              />
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-1/2 transform translate-x-16 bg-gray-800 text-white px-2 py-1 rounded-full text-xs cursor-pointer hover:bg-gray-700"
              >
                Edit
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
            {isEditing ? (
              <div className="text-center">
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) =>
                    setProfile({ ...profile, name: e.target.value })
                  }
                  className="text-2xl font-light text-gray-900 text-center border-b border-gray-300 focus:outline-none focus:border-gray-500"
                />
                <input
                  type="text"
                  value={profile.title}
                  onChange={(e) =>
                    setProfile({ ...profile, title: e.target.value })
                  }
                  className="text-gray-900 text-center border-b border-gray-300 focus:outline-none focus:border-gray-500 mt-2"
                />
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-light text-gray-900 text-center">
                  {profile.name}
                </h2>
                <p className="text-gray-900 text-center">{profile.title}</p>
              </>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="prose prose-gray max-w-none text-gray-900">
              {isEditing ? (
                <textarea
                  value={profile.bio}
                  onChange={(e) =>
                    setProfile({ ...profile, bio: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                  rows={10}
                />
              ) : (
                profile.bio
                  .split("\n\n")
                  .map((para, i) => <p key={i}>{para}</p>)
              )}
              <h3 className="mt-6 font-semibold text-gray-900 uppercase">
                Current Focus
              </h3>
              {isEditing ? (
                <textarea
                  value={profile.currentFocus}
                  onChange={(e) =>
                    setProfile({ ...profile, currentFocus: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                  rows={3}
                />
              ) : (
                <p>{profile.currentFocus}</p>
              )}
              {isEditing ? (
                <div className="space-y-2">
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) =>
                      setProfile({ ...profile, email: e.target.value })
                    }
                    placeholder="Email"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                  />
                  <input
                    type="url"
                    value={profile.linkedin}
                    onChange={(e) =>
                      setProfile({ ...profile, linkedin: e.target.value })
                    }
                    placeholder="LinkedIn URL"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                  />
                  <input
                    type="url"
                    value={profile.github}
                    onChange={(e) =>
                      setProfile({ ...profile, github: e.target.value })
                    }
                    placeholder="GitHub URL"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                  />
                </div>
              ) : (
                <p>
                  Email:{" "}
                  <a
                    href={`mailto:${profile.email}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {profile.email}
                  </a>
                  <br />
                  LinkedIn:{" "}
                  <a
                    href={profile.linkedin}
                    className="text-blue-600 hover:text-blue-800"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {profile.linkedin.replace("https://", "")}
                  </a>
                  <br />
                  GitHub:{" "}
                  <a
                    href={profile.github}
                    className="text-blue-600 hover:text-blue-800"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {profile.github.replace("https://", "")}
                  </a>
                </p>
              )}
            </div>
            <div className="prose prose-gray max-w-none text-gray-900">
              <h3 className="font-semibold text-gray-900 uppercase">
                Expertise
              </h3>
              {isEditing ? (
                <div className="space-y-2">
                  {profile.expertise.map((item, index) => (
                    <input
                      key={index}
                      type="text"
                      value={item}
                      onChange={(e) =>
                        handleExpertiseChange(index, e.target.value)
                      }
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                    />
                  ))}
                </div>
              ) : (
                <ul>
                  {profile.expertise.map((item, index) => (
                    <li key={index}>
                      <strong>{item.split(":")[0]}:</strong>{" "}
                      {item.split(":")[1]}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
