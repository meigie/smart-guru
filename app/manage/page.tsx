"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { VideoCard } from "@/components/video-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Upload, Edit, Trash2, User } from "lucide-react";
import { Video } from "@/types";
import { VIDEO_CATEGORIES } from "@/lib/constants";

// Mock data - in a real app, this would come from an API
const mockVideos: Video[] = [
  {
    id: "1",
    title: "Introduction to React Hooks",
    description:
      "Learn the basics of React Hooks and how to use them effectively in your applications.",
    duration: 1800,
    thumbnailUrl:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop",
    videoUrl: "https://example.com/video1.mp4",
    category: "React",
    year: 2024,
    status: "PUBLISHED",
    authorId: "1",
    author: {
      id: "1",
      email: "john@example.com",
      name: "John Doe",
      role: "ADMIN",
      department: "AAD",
      createdAt: new Date(),
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    averageRating: 4.5,
    totalRatings: 120,
    viewCount: 1500,
  },
  {
    id: "5",
    title: "Draft: Vue.js 3 Composition API",
    description: "Learn Vue.js 3 Composition API (draft version).",
    duration: 3000,
    thumbnailUrl:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop",
    videoUrl: "https://example.com/video5.mp4",
    category: "Vue.js",
    year: 2024,
    status: "DRAFT",
    authorId: "1",
    author: {
      id: "1",
      email: "john@example.com",
      name: "John Doe",
      role: "ADMIN",
      department: "AAD",
      createdAt: new Date(),
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    averageRating: 0,
    totalRatings: 0,
    viewCount: 0,
  },
  {
    id: "6",
    title: "Next.js 14 App Router Deep Dive",
    description:
      "Comprehensive guide to Next.js 14 App Router features and best practices.",
    duration: 3600,
    thumbnailUrl:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop",
    videoUrl: "https://example.com/video6.mp4",
    category: "Next.js",
    year: 2024,
    status: "PENDING_REVIEW",
    authorId: "1",
    author: {
      id: "1",
      email: "john@example.com",
      name: "John Doe",
      role: "ADMIN",
      department: "AAD",
      createdAt: new Date(),
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    averageRating: 0,
    totalRatings: 0,
    viewCount: 0,
  },
];

export default function ManagePage() {
  const { data: session } = useSession();
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    year: new Date().getFullYear().toString(),
    duration: "",
    thumbnailUrl: "",
    videoUrl: "",
    status: "draft",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => {
      const updatedData = { ...prev, [field]: value };

      // If status is changing to draft, set year to current year
      if (field === "status" && value === "draft") {
        updatedData.year = new Date().getFullYear().toString();
      }

      return updatedData;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would submit to an API
    console.log("Submitting video:", formData);
    setShowUploadForm(false);
    setFormData({
      title: "",
      description: "",
      category: "",
      year: new Date().getFullYear().toString(),
      duration: "",
      thumbnailUrl: "",
      videoUrl: "",
      status: "draft",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Manage Videos
            </h1>
            <p className="text-gray-600">Upload and manage training videos</p>
            {/* {session && (
              <div className="flex items-center mt-2 text-sm text-gray-500">
                <User className="h-4 w-4 mr-1" />
                Logged in as: {session.user.name} ({session.user.role})
              </div>
            )} */}
          </div>
          <Button asChild>
            <Link href="/manage/upload">
              <Plus className="h-4 w-4 mr-2" />
              Create New
            </Link>
          </Button>
        </div>

        {/* Upload Form Modal */}
        {showUploadForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>Upload New Video</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Video Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) =>
                        handleInputChange("title", e.target.value)
                      }
                      placeholder="Enter video title"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      placeholder="Enter video description"
                      className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) =>
                          handleInputChange("category", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {VIDEO_CATEGORIES.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="year">Year</Label>
                      <Input
                        id="year"
                        type="number"
                        value={formData.year}
                        onChange={(e) =>
                          handleInputChange("year", e.target.value)
                        }
                        min="2020"
                        max={new Date().getFullYear()}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="duration">Duration (seconds)</Label>
                      <Input
                        id="duration"
                        type="number"
                        value={formData.duration}
                        onChange={(e) =>
                          handleInputChange("duration", e.target.value)
                        }
                        placeholder="1800"
                        min="1"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value) =>
                          handleInputChange("status", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="pending_review">
                            Pending Review
                          </SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                          <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="thumbnailUrl">Thumbnail URL</Label>
                    <Input
                      id="thumbnailUrl"
                      type="url"
                      value={formData.thumbnailUrl}
                      onChange={(e) =>
                        handleInputChange("thumbnailUrl", e.target.value)
                      }
                      placeholder="https://example.com/thumbnail.jpg"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="videoUrl">Video URL</Label>
                    <Input
                      id="videoUrl"
                      type="url"
                      value={formData.videoUrl}
                      onChange={(e) =>
                        handleInputChange("videoUrl", e.target.value)
                      }
                      placeholder="https://example.com/video.mp4"
                      required
                    />
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowUploadForm(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      <Upload className="h-4 w-4 mr-2" />
                      Create New
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Videos List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mockVideos.map((video) => (
            <div key={video.id} className="relative">
              <VideoCard video={video} showStatus={true} />
              <div className="absolute top-2 left-2 flex space-x-1">
                <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="destructive" className="h-8 w-8 p-0">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {mockVideos.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Upload className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No videos uploaded yet
            </h3>
            <p className="text-gray-600">
              Start by uploading your first training video.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
