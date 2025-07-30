'use client';

import Link from 'next/link';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Clock, Star, Eye } from 'lucide-react';
import { formatDuration, formatDate } from '@/lib/utils';
import { Video } from '@/types';
import Image from 'next/image';

interface VideoCardProps {
  video: Video;
  showStatus?: boolean;
}

export function VideoCard({ video, showStatus = false }: VideoCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <Image
          src={video.thumbnailUrl}
          alt={video.title}
          width={800}
          height={600}
          className="w-full h-48 object-cover"
        />
        {/* <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="w-full h-48 object-cover"
        /> */}
        <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-all duration-200 flex items-center justify-center">
          <Button
            size="icon"
            className="opacity-0 hover:opacity-100 transition-opacity duration-200"
            asChild
          >
            <Link href={`/video/${video.id}`}>
              <Play className="h-6 w-6" />
            </Link>
          </Button>
        </div>
        {showStatus && (
          <div className="absolute top-2 right-2">
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${
                video.status === 'PUBLISHED'
                  ? 'bg-green-100 text-green-800'
                  : video.status === 'DRAFT'
                  ? 'bg-yellow-100 text-yellow-800'
                  : video.status === 'PENDING_REVIEW'
                  ? 'bg-blue-100 text-blue-800'
                  : video.status === 'ARCHIVED'
                  ? 'bg-gray-100 text-gray-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {video.status}
            </span>
          </div>
        )}
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg line-clamp-2">
          <Link
            href={`/video/${video.id}`}
            className="hover:text-blue-600 transition-colors"
          >
            {video.title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-gray-600 line-clamp-2">
          {video.description}
        </p>
        <div className="flex items-center justify-between mt-3 text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {formatDuration(video.duration)}
            </div>
            <div className="flex items-center">
              <Star className="h-4 w-4 mr-1 text-yellow-500" />
              {video.averageRating.toFixed(1)}
            </div>
          </div>
          <div className="flex items-center">
            <Eye className="h-4 w-4 mr-1" />
            {video.viewCount}
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <div className="flex items-center justify-between w-full text-xs text-gray-500">
          <span>{video.category}</span>
          <span>{video.year}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
