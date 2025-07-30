import { Navigation } from '@/components/navigation';
import { VideoCard } from '@/components/video-card';
import { Video } from '@/types';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { WelcomeHero } from '@/components/welcome-hero';

// Mock data - in a real app, this would come from an API
const mockVideos: Video[] = [
  {
    id: '1',
    title: 'Introduction to React Hooks',
    description:
      'Learn the basics of React Hooks and how to use them effectively in your applications.',
    duration: 1800, // 30 minutes
    thumbnailUrl:
      'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop',
    videoUrl: 'https://example.com/video1.mp4',
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
      createdAt: new Date(),
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    averageRating: 4.5,
    totalRatings: 120,
    viewCount: 1500,
  },
  {
    id: '2',
    title: 'Advanced TypeScript Patterns',
    description:
      'Explore advanced TypeScript patterns and best practices for building scalable applications.',
    duration: 2400, // 40 minutes
    thumbnailUrl:
      'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=300&fit=crop',
    videoUrl: 'https://example.com/video2.mp4',
    category: 'TypeScript',
    year: 2024,
    status: 'PUBLISHED',
    authorId: '1',
    author: {
      id: '1',
      email: 'john@example.com',
      name: 'John Doe',
      role: 'ADMIN',
      department: 'AAD',
      createdAt: new Date(),
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    averageRating: 4.8,
    totalRatings: 89,
    viewCount: 1200,
  },
  {
    id: '3',
    title: 'Next.js App Router Deep Dive',
    description:
      'Master the new App Router in Next.js 13+ and build modern web applications.',
    duration: 3600, // 60 minutes
    thumbnailUrl:
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop',
    videoUrl: 'https://example.com/video3.mp4',
    category: 'Next.js',
    year: 2024,
    status: 'PUBLISHED',
    authorId: '1',
    author: {
      id: '1',
      email: 'john@example.com',
      name: 'John Doe',
      role: 'ADMIN',
      department: 'AAD',
      createdAt: new Date(),
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    averageRating: 4.7,
    totalRatings: 156,
    viewCount: 2100,
  },
  {
    id: '4',
    title: 'Tailwind CSS Mastery',
    description:
      'Learn Tailwind CSS from basics to advanced techniques for modern web design.',
    duration: 2700, // 45 minutes
    thumbnailUrl:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
    videoUrl: 'https://example.com/video4.mp4',
    category: 'CSS',
    year: 2024,
    status: 'PUBLISHED',
    authorId: '1',
    author: {
      id: '1',
      email: 'john@example.com',
      name: 'John Doe',
      role: 'ADMIN',
      department: 'AAD',
      createdAt: new Date(),
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    averageRating: 4.6,
    totalRatings: 203,
    viewCount: 1800,
  },
];

export default async function HomePage() {
  // Get the current session
  const session = await getServerSession(authOptions);

  // In a real app, these would be fetched from an API
  const latestVideos = mockVideos.slice(0, 4);
  const topVideos = [...mockVideos]
    .sort((a, b) => b.averageRating - a.averageRating)
    .slice(0, 4);
  const recentWatch = mockVideos.slice(0, 4); // In real app, this would be user-specific

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <WelcomeHero userName={session?.user?.name} />

        {/* Latest Videos */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Latest Videos</h2>
            <a
              href="/videos"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              View all →
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {latestVideos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        </section>

        {/* Top Videos */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Top Rated Videos
            </h2>
            <a
              href="/videos"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              View all →
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {topVideos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        </section>

        {/* Recent Watch */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Recently Watched
            </h2>
            <a
              href="/videos"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              View all →
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentWatch.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
