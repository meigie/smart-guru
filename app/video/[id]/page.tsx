"use client";

import { GeminiChat } from "@/components/GeminiChat";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate, formatDuration } from "@/lib/utils";
import { Video } from "@/types";
import { Calendar, Clock, Eye, Star, User } from "lucide-react";
import { Suspense, useState, useEffect } from "react";
import ReactPlayer from "react-player";
import { useSession } from "next-auth/react";
import { enrollmentApi, videoApi } from "@/lib/api";
import Image from "next/image";
import { revalidatePath } from "next/cache";

// Mock data - in a real app, this would come from an API
const mockVideo: Video = {
  id: "1",
  title: "Introduction to React Hooks",
  description:
    "Learn the basics of React Hooks and how to use them effectively in your applications. This comprehensive tutorial covers useState, useEffect, useContext, and custom hooks. Perfect for developers who want to modernize their React applications and take advantage of the latest features.",
  duration: 1800, // 30 minutes
  thumbnailUrl:
    "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop",
  videoUrl:
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", // Using a sample video
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
    createdAt: new Date("2025-01-01T00:00:00Z"),
  },
  createdAt: new Date("2025-01-01T00:00:00Z"),
  updatedAt: new Date("2025-01-01T00:00:00Z"),
  averageRating: 4.5,
  totalRatings: 120,
  viewCount: 1500,
};

const mockRatings = [
  {
    id: "1",
    rating: 5,
    comment: "Excellent tutorial! Very clear explanations.",
    user: "Alice",
    date: new Date("2025-01-01T00:00:00Z"),
  },
  {
    id: "2",
    rating: 4,
    comment: "Great content, helped me understand hooks better.",
    user: "Bob",
    date: new Date("2025-01-01T00:00:00Z"),
  },
  {
    id: "3",
    rating: 5,
    comment: "Perfect for beginners and intermediate developers.",
    user: "Charlie",
    date: new Date("2025-01-01T00:00:00Z"),
  },
];

export default function VideoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { data: session } = useSession();
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState("");
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [enrollmentError, setEnrollmentError] = useState("");
  const [videoCompleted, setVideoCompleted] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);

  const handleRatingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would submit to an API
    console.log("Submitting rating:", {
      rating: userRating,
      comment: userComment,
    });
    setShowRatingForm(false);
    setUserRating(0);
    setUserComment("");
  };

  // Check enrollment status when component mounts
  useEffect(() => {
    const checkEnrollment = async () => {
      if (!session?.user?.id) return;

      // Get the actual video ID from the URL params
      const resolvedParams = await params;
      const videoId = resolvedParams.id;

      console.log("Checking enrollment for video ID:", videoId);
      try {
        const response = await enrollmentApi.checkEnrollment(videoId);
        console.log("Enrollment response:", response.data);
        setIsEnrolled(response.data.isEnrolled);
      } catch (error) {
        console.error("Error checking enrollment:", error);
      }
    };

    checkEnrollment();
  }, [session?.user?.id, params]);

  const handleEnroll = async () => {
    if (!session?.user?.id) {
      setEnrollmentError("Please sign in to enroll in this course");
      return;
    }

    setIsEnrolling(true);
    setEnrollmentError("");

    try {
      // Get the actual video ID from the URL params
      const resolvedParams = await params;
      const videoId = resolvedParams.id;

      await enrollmentApi.enroll(videoId);
      setIsEnrolled(true);
    } catch (error: any) {
      setEnrollmentError(
        error.response?.data?.error || "Failed to enroll in course"
      );
    } finally {
      setIsEnrolling(false);
    }
  };

  const renderStars = (
    rating: number,
    interactive = false,
    onRatingChange?: (rating: number) => void
  ) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => interactive && onRatingChange?.(star)}
            className={`${interactive ? "cursor-pointer" : "cursor-default"}`}
            disabled={!interactive}
          >
            <Star
              className={`h-5 w-5 ${
                star <= rating
                  ? "text-yellow-400 fill-current"
                  : "text-gray-300"
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  const handleVideoEnded = async () => {
    console.log("Video has ended!");

    try {
      // Get the actual video ID from the URL params
      const resolvedParams = await params;
      const videoId = resolvedParams.id;

      // Mark video as completed in the backend
      await videoApi.markCompleted(videoId);
      console.log("Video marked as completed in backend");

      // Update local state
      setVideoCompleted(true);
      setShowCertificate(true);
    } catch (error) {
      console.error("Error marking video as completed:", error);
      // Still show the completion message even if API call fails
      setVideoCompleted(true);
      setShowCertificate(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 gap-8">
          {/* Video Player and Info */}
          <div>
            {/* Video Player or Thumbnail */}
            <div className="bg-black rounded-lg overflow-hidden mb-6">
              <div className="aspect-video">
                {session?.user && isEnrolled ? (
                  <ReactPlayer
                    src={mockVideo.videoUrl}
                    width="100%"
                    height="100%"
                    controls
                    light={mockVideo.thumbnailUrl}
                    onEnded={handleVideoEnded}
                  />
                ) : (
                  <div className="relative w-full h-full">
                    <Image
                      src={mockVideo.thumbnailUrl}
                      alt={mockVideo.title}
                      className="w-full h-full object-cover"
                      width={500}
                      height={300}
                    />
                    {session?.user && !isEnrolled && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="text-center text-white">
                          <div className="mb-4">
                            <svg
                              className="w-16 h-16 mx-auto mb-2"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <h3 className="text-xl font-semibold mb-2">
                            Enroll to Watch
                          </h3>
                          <p className="text-sm opacity-90 mb-4">
                            Please enroll in this training course to access the
                            video content
                          </p>
                        </div>
                      </div>
                    )}
                    {!session?.user && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="text-center text-white">
                          <div className="mb-4">
                            <svg
                              className="w-16 h-16 mx-auto mb-2"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <h3 className="text-xl font-semibold mb-2">
                            Sign In Required
                          </h3>
                          <p className="text-sm opacity-90 mb-4">
                            Please sign in to access this training course
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Test Button for Debugging */}
            {/* {session?.user && isEnrolled && (
              <div className="mb-4 p-4 bg-yellow-100 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Debug Controls:</h3>
                <div className="flex space-x-2">
                  <Button
                    onClick={handleVideoEnded}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Simulate Video End
                  </Button>
                  <Button
                    onClick={() => {
                      setVideoCompleted(true);
                      setShowCertificate(true);
                    }}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Show Certificate
                  </Button>
                  <Button
                    onClick={() => {
                      setVideoCompleted(false);
                      setShowCertificate(false);
                    }}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Reset
                  </Button>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Video Completed: {videoCompleted ? "Yes" : "No"} | Show
                  Certificate: {showCertificate ? "Yes" : "No"}
                </p>
              </div>
            )} */}

            {/* Certificate Completion Modal */}
            {showCertificate && videoCompleted && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center">
                  <div className="mb-6">
                    <Image
                      src="/certificate/completion-video-1.png"
                      alt="Certificate of Completion"
                      width={300}
                      height={200}
                      className="mx-auto rounded-lg shadow-lg"
                    />
                  </div>
                  <h2 className="text-2xl font-bold text-green-600 mb-4">
                    🎉 Congratulations!
                  </h2>
                  <p className="text-gray-700 mb-6">
                    You have successfully completed the training video. Your
                    certificate of completion is ready!
                  </p>
                  <div className="flex justify-center space-x-4">
                    <Button
                      onClick={() => setShowCertificate(false)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Continue Learning
                    </Button>
                    <Button
                      onClick={() => {
                        // In a real app, this would trigger a download
                        const link = document.createElement("a");
                        link.href = "/certificate/completion-video-1.png";
                        link.download = "certificate-of-completion.png";
                        link.click();
                      }}
                      variant="outline"
                    >
                      Download Certificate
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Enrollment Section */}
            {session?.user && !isEnrolled && (
              <div className="flex justify-end mb-6">
                <div>
                  <Button
                    onClick={handleEnroll}
                    disabled={isEnrolling}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isEnrolling ? "Enrolling..." : "Enroll"}
                  </Button>
                  {enrollmentError && (
                    <p className="text-red-600 text-sm mt-2">
                      {enrollmentError}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Video Info, Rating Form, and Reviews in Tabs */}
            <Tabs defaultValue="overview" className="w-full mb-6">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="ask-guru">Ask Guru</TabsTrigger>
              </TabsList>
              <TabsContent value="overview">
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="text-2xl">
                      {mockVideo.title}
                    </CardTitle>
                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {formatDuration(mockVideo.duration)}
                      </div>
                      <div className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        {mockVideo.viewCount} views
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(mockVideo.createdAt)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">
                      {mockVideo.description}
                    </p>
                    <div className="flex items-center justify-between mt-6 pt-6 border-t">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2 text-gray-600" />
                          <span className="text-sm text-gray-600">
                            By {mockVideo.author.name}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm text-gray-600 mr-2">
                            Rating:
                          </span>
                          {renderStars(mockVideo.averageRating)}
                          <span className="text-sm text-gray-600 ml-2">
                            ({mockVideo.averageRating.toFixed(1)})
                          </span>
                        </div>
                      </div>
                      <Button onClick={() => setShowRatingForm(true)}>
                        Rate this video
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                {/* Rating Form */}
                {showRatingForm && (
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle>Rate this video</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleRatingSubmit} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Your Rating
                          </label>
                          {renderStars(userRating, true, setUserRating)}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Comment (optional)
                          </label>
                          <textarea
                            value={userComment}
                            onChange={(e) => setUserComment(e.target.value)}
                            className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Share your thoughts about this video..."
                          />
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowRatingForm(false)}
                          >
                            Cancel
                          </Button>
                          <Button type="submit" disabled={userRating === 0}>
                            Submit Rating
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                )}
                {/* Reviews */}
                <Card>
                  <CardHeader>
                    <CardTitle>Reviews ({mockRatings.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockRatings.map((rating) => (
                        <div
                          key={rating.id}
                          className="border-b border-gray-200 pb-4 last:border-b-0"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">{rating.user}</span>
                              {renderStars(rating.rating)}
                            </div>
                            <span className="text-sm text-gray-500">
                              {formatDate(rating.date)}
                            </span>
                          </div>
                          {rating.comment && (
                            <p className="text-gray-700">{rating.comment}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="ask-guru">
                <Card>
                  <CardHeader>
                    <CardTitle>Ask Guru (Google Gemini Chat)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Suspense fallback={<div>Loading Gemini Chat...</div>}>
                      <GeminiChat />
                    </Suspense>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar removed */}
        </div>
      </main>
    </div>
  );
}
