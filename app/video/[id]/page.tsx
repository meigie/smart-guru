'use client';

import { GeminiChat } from '@/components/GeminiChat';
import { Navigation } from '@/components/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatDate, formatDuration } from '@/lib/utils';
import { Video } from '@/types';
import { Calendar, Clock, Eye, Star, User } from 'lucide-react';
import { Suspense, useState } from 'react';
import ReactPlayer from 'react-player';

// Mock data - in a real app, this would come from an API
const mockVideo: Video = {
  id: '1',
  title: 'Introduction to React Hooks',
  description:
    'Learn the basics of React Hooks and how to use them effectively in your applications. This comprehensive tutorial covers useState, useEffect, useContext, and custom hooks. Perfect for developers who want to modernize their React applications and take advantage of the latest features.',
  duration: 1800, // 30 minutes
  thumbnailUrl:
    'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop',
  videoUrl:
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', // Using a sample video
  category: 'React',
  year: 2024,
  status: 'PUBLISHED',
  authorId: '1',
  author: {
    id: '1',
    email: 'john@example.com',
    name: 'John Doe',
    role: 'ADMIN',
    department: 'AAD',
    createdAt: new Date('2025-01-01T00:00:00Z'),
  },
  createdAt: new Date('2025-01-01T00:00:00Z'),
  updatedAt: new Date('2025-01-01T00:00:00Z'),
  averageRating: 4.5,
  totalRatings: 120,
  viewCount: 1500,
};

const mockRatings = [
  {
    id: '1',
    rating: 5,
    comment: 'Excellent tutorial! Very clear explanations.',
    user: 'Alice',
    date: new Date('2025-01-01T00:00:00Z'),
  },
  {
    id: '2',
    rating: 4,
    comment: 'Great content, helped me understand hooks better.',
    user: 'Bob',
    date: new Date('2025-01-01T00:00:00Z'),
  },
  {
    id: '3',
    rating: 5,
    comment: 'Perfect for beginners and intermediate developers.',
    user: 'Charlie',
    date: new Date('2025-01-01T00:00:00Z'),
  },
];

export default function VideoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState('');
  const [showRatingForm, setShowRatingForm] = useState(false);

  const handleRatingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would submit to an API
    console.log('Submitting rating:', {
      rating: userRating,
      comment: userComment,
    });
    setShowRatingForm(false);
    setUserRating(0);
    setUserComment('');
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
            className={`${interactive ? 'cursor-pointer' : 'cursor-default'}`}
            disabled={!interactive}
          >
            <Star
              className={`h-5 w-5 ${
                star <= rating
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 gap-8">
          {/* Video Player and Info */}
          <div>
            {/* Video Player */}
            <div className="bg-black rounded-lg overflow-hidden mb-6">
              <div className="aspect-video">
                <ReactPlayer
                  src={mockVideo.videoUrl}
                  width="100%"
                  height="100%"
                  controls
                  light={mockVideo.thumbnailUrl}
                />
              </div>
            </div>

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
