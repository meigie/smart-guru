"use client";

import { useState, useEffect } from "react";
import { Navigation } from "@/components/navigation";
import { VideoCard } from "@/components/video-card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import { Video, SearchFilters } from "@/types";
import { VIDEO_CATEGORIES } from "@/lib/constants";
import { useSearch } from "@/lib/contexts/search-context";

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
    id: "2",
    title: "Advanced TypeScript Patterns",
    description:
      "Explore advanced TypeScript patterns and best practices for building scalable applications.",
    duration: 2400,
    thumbnailUrl:
      "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=300&fit=crop",
    videoUrl: "https://example.com/video2.mp4",
    category: "TypeScript",
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
    averageRating: 4.8,
    totalRatings: 89,
    viewCount: 1200,
  },
  {
    id: "3",
    title: "Next.js App Router Deep Dive",
    description:
      "Master the new App Router in Next.js 13+ and build modern web applications.",
    duration: 3600,
    thumbnailUrl:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop",
    videoUrl: "https://example.com/video3.mp4",
    category: "Next.js",
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
    averageRating: 4.7,
    totalRatings: 156,
    viewCount: 2100,
  },
  {
    id: "4",
    title: "Tailwind CSS Mastery",
    description:
      "Learn Tailwind CSS from basics to advanced techniques for modern web design.",
    duration: 2700,
    thumbnailUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
    videoUrl: "https://example.com/video4.mp4",
    category: "CSS",
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
    averageRating: 4.6,
    totalRatings: 203,
    viewCount: 1800,
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
];

const categories = ["All", ...VIDEO_CATEGORIES];
const years = ["All", "2024", "2023", "2022"];

export default function VideosPage() {
  const [filters, setFilters] = useState<SearchFilters>({});
  // const [searchTerm, setSearchTerm] = useState("");
  const { searchTerm, setSearchTerm } = useSearch();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("PUBLISHED");

  // Filter videos based on search criteria
  const filteredVideos = mockVideos.filter((video) => {
    const matchesSearch =
      !searchTerm ||
      video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || video.category === selectedCategory;
    const matchesYear =
      selectedYear === "All" || video.year.toString() === selectedYear;
    const matchesStatus = video.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesYear && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">All Videos</h1>
          <p className="text-gray-600">
            Browse and search through our collection of training videos
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search videos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Year Filter */}
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger>
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PUBLISHED">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="pending_review">Pending Review</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredVideos.length} video
            {filteredVideos.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Videos Grid */}
        {filteredVideos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredVideos.map((video) => (
              <VideoCard key={video.id} video={video} showStatus={true} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No videos found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search criteria or filters.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
