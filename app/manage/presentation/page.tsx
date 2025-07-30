'use client';

import React, { useState } from 'react';
import { Navigation } from '@/components/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Save, Play, Edit, Eye } from 'lucide-react';
import Link from 'next/link';
import { NextRequest, NextResponse } from 'next/server';
import { VIDEO_CATEGORIES } from '@/lib/constants';
import Image from 'next/image';

// Mock data for presentation slides - in a real app, this would come from the uploaded file
const mockSlides = [
  {
    id: 1,
    imageUrl:
      'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop',
    transcript:
      "Welcome to our training session on React Hooks. Today we'll explore the fundamentals of React Hooks and how they can transform your React applications.",
    slideNumber: 1,
  },
  {
    id: 2,
    imageUrl:
      'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=300&fit=crop',
    transcript:
      'React Hooks were introduced in React 16.8 to allow you to use state and other React features without writing a class component.',
    slideNumber: 2,
  },
  {
    id: 3,
    imageUrl:
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop',
    transcript:
      "The useState hook is the most basic hook that allows you to add state to functional components. Let's see how it works.",
    slideNumber: 3,
  },
  {
    id: 4,
    imageUrl:
      'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=300&fit=crop',
    transcript:
      'useEffect is another important hook that lets you perform side effects in functional components, similar to componentDidMount and componentDidUpdate.',
    slideNumber: 4,
  },
  {
    id: 5,
    imageUrl:
      'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop',
    transcript:
      'Custom hooks allow you to extract component logic into reusable functions. This is one of the most powerful features of React Hooks.',
    slideNumber: 5,
  },
];

const mockProcessedSlides = [
  {
    imagePath: '/uploads/slides/slide_1753872134628-1.jpg',
    note: 'Hello everyone. I am Tester. Today, we’ll introduce how to use ppt presenter to create demo video from power point slides. ‹#›',
  },
  {
    imagePath: '/uploads/slides/slide_1753872134628-2.jpg',
    note: 'You need to have Python to run the script. First, follow instructions in README to install required packages. ‹#›',
  },
  {
    imagePath: '/uploads/slides/slide_1753872134628-3.jpg',
    note: 'Next, make your slides and take speaker’s note. ‹#›',
  },
  {
    imagePath: '/uploads/slides/slide_1753872134628-4.jpg',
    note: 'When you are finished, save your presentation, and also export your presentation into pdf format. ‹#›',
  },
  {
    imagePath: '/uploads/slides/slide_1753872134628-5.jpg',
    note: 'Finally, run the script specifying the path of your pptx and pdf files. You can run python, ppt presenter dot PY dash h to get help information. ‹#›',
  },
  {
    imagePath: '/uploads/slides/slide_1753872134628-6.jpg',
    note: 'You can open an issue on GitHub, if you encounter any problem. ‹#›',
  },
];

export default function PresentationPage() {
  const [slides, setSlides] = useState(mockSlides);
  const [isEditing, setIsEditing] = useState(false);
  const [hoveredSlide, setHoveredSlide] = useState<number | null>(null);
  const [selectedSlide, setSelectedSlide] = useState<number | null>(null);
  const [isNewPresentation, setIsNewPresentation] = useState(false);
  const [formData, setFormData] = useState({
    title: 'Introduction to React Hooks',
    description:
      'Learn the basics of React Hooks and how to use them effectively in your applications. This comprehensive tutorial covers useState, useEffect, useContext, and custom hooks.',
    category: 'React',
    year: new Date().getFullYear().toString(),
    authorName: 'John Doe',
    authorEmail: 'john@example.com',
    duration: '30',
    status: 'draft',
  });

  // Load processed slides from sessionStorage if available
  React.useEffect(() => {
    //temporary comment
    //const processedSlides = sessionStorage.getItem('processedSlides');
    // mock start
    const processedSlidesStr = JSON.stringify(mockProcessedSlides);
    const processedSlides = processedSlidesStr;
    //mock end

    const originalFile = sessionStorage.getItem('originalFile');

    if (processedSlides) {
      try {
        const slidesData = JSON.parse(processedSlides);
        console.log('Loaded slides from sessionStorage:', slidesData);
        // Map new API format to expected structure
        const mappedSlides = slidesData.map((slide: any, idx: number) => ({
          id: idx + 1,
          imageUrl: slide.imagePath || slide.imageUrl,
          transcript: slide.note || slide.transcript || '',
          slideNumber: idx + 1,
        }));
        setSlides(mappedSlides);
        // Set as new presentation and force draft status with current year
        setIsNewPresentation(true);
        setFormData((prev) => ({
          ...prev,
          status: 'draft',
          year: new Date().getFullYear().toString(),
        }));
        // Clear sessionStorage after loading
        sessionStorage.removeItem('processedSlides');
        sessionStorage.removeItem('originalFile');
      } catch (error) {
        console.error('Error loading processed slides:', error);
      }
    } else {
      console.log(
        'No processed slides found in sessionStorage, using mock data'
      );
    }
  }, []);

  const handleTranscriptChange = (slideId: number, newTranscript: string) => {
    setSlides((prev) =>
      prev.map((slide) =>
        slide.id === slideId ? { ...slide, transcript: newTranscript } : slide
      )
    );
  };

  const handleFormChange = (field: string, value: string) => {
    // Prevent changes to status and year for new presentations
    if (isNewPresentation && (field === 'status' || field === 'year')) {
      return;
    }

    setFormData((prev) => {
      const updatedData = { ...prev, [field]: value };

      // If status is changing to draft, set year to current year
      if (field === 'status' && value === 'draft') {
        updatedData.year = new Date().getFullYear().toString();
      }

      return updatedData;
    });
  };

  const handleSave = () => {
    // In a real app, this would save to your backend
    console.log('Saving presentation:', { slides, formData });
    setIsEditing(false);
    setIsNewPresentation(false); // Allow editing status and year after saving
    alert('Presentation saved successfully!');
  };

  const handlePublish = () => {
    // In a real app, this would publish the video
    console.log('Publishing video:', { slides, formData });
    setIsNewPresentation(false); // Allow editing status and year after publishing
    alert('Video published successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Link href="/manage/upload" className="mr-4">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Upload
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Presentation Editor
              </h1>
              <p className="text-gray-600">
                Review slides and edit transcripts
              </p>
            </div>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center"
            >
              <Edit className="h-4 w-4 mr-2" />
              {isEditing ? 'Preview' : 'Edit'}
            </Button>
            <Button onClick={handleSave} className="flex items-center">
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button
              onClick={handlePublish}
              variant="default"
              className="flex items-center"
            >
              <Play className="h-4 w-4 mr-2" />
              Publish
            </Button>
          </div>
        </div>

        {/* Debug Info */}
        {slides.length > 0 &&
          slides[0].imageUrl &&
          slides[0].imageUrl.includes('/uploads/') && (
            <Card className="mb-6 bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800">
                  Extraction Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Total Slides:</span>
                    <span className="ml-2 text-blue-600">{slides.length}</span>
                  </div>
                  <div>
                    <span className="font-medium">Images Created:</span>
                    <span className="ml-2 text-green-600">
                      {
                        slides.filter(
                          (s) => s.imageUrl && s.imageUrl.includes('/uploads/')
                        ).length
                      }
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">With Transcripts:</span>
                    <span className="ml-2 text-green-600">
                      {
                        slides.filter(
                          (s) => s.transcript && s.transcript.length > 0
                        ).length
                      }
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Status:</span>
                    <span className="ml-2 text-green-600">
                      Ready for Editing
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Slides and Transcripts */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Eye className="h-5 w-5 mr-2" />
                  Slides & Transcripts ({slides.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {slides.map((slide) => (
                    <div key={slide.id} className="border rounded-lg p-4">
                      <div className="flex items-start space-x-4">
                        {/* Slide Image with Enhanced Hover Zoom */}
                        <div className="flex-shrink-0">
                          <div className="relative group">
                            {/* Container with fixed dimensions to prevent layout shifts */}
                            <div className="w-48 h-36 relative overflow-hidden rounded-md border shadow-sm bg-white">
                              <Image
                                src={slide.imageUrl}
                                alt={`Slide ${slide.slideNumber}`}
                                className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-125 cursor-pointer"
                                width={500}
                                height={450}
                                onError={(e) => {
                                  // Fallback for missing images
                                  const target = e.target as HTMLImageElement;
                                  target.src = `data:image/svg+xml;base64,${btoa(`
                                    <svg width="192" height="144" xmlns="http://www.w3.org/2000/svg">
                                      <rect width="192" height="144" fill="#f8f9fa"/>
                                      <rect x="16" y="16" width="160" height="112" fill="white" stroke="#dee2e6" stroke-width="2"/>
                                      <text x="96" y="72" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" fill="#6c757d">Slide ${slide.slideNumber}</text>
                                      <text x="96" y="90" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" fill="#adb5bd">Image not available</text>
                                    </svg>
                                  `)}`;
                                }}
                                onMouseEnter={() => setHoveredSlide(slide.id)}
                                onMouseLeave={() => setHoveredSlide(null)}
                                onClick={() => setSelectedSlide(slide.id)}
                              />
                              <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded z-10">
                                Slide {slide.slideNumber}
                              </div>

                              {/* Hover Zoom Tooltip */}
                              {hoveredSlide === slide.id && (
                                <div className="absolute z-50 top-0 left-full ml-2 transform -translate-y-1/2">
                                  <div className="bg-white border border-gray-200 rounded-lg shadow-xl p-3 max-w-sm">
                                    <div className="relative">
                                      <Image
                                        src={slide.imageUrl}
                                        alt={`Slide ${slide.slideNumber} - Preview`}
                                        className="w-80 h-60 object-contain rounded border"
                                        width={500}
                                        height={450}
                                        onError={(e) => {
                                          const target =
                                            e.target as HTMLImageElement;
                                          target.src = `data:image/svg+xml;base64,${btoa(`
                                            <svg width="320" height="240" xmlns="http://www.w3.org/2000/svg">
                                              <rect width="320" height="240" fill="#f8f9fa"/>
                                              <rect x="24" y="24" width="272" height="192" fill="white" stroke="#dee2e6" stroke-width="3"/>
                                              <text x="160" y="120" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" fill="#6c757d">Slide ${slide.slideNumber}</text>
                                              <text x="160" y="150" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="#adb5bd">Preview</text>
                                            </svg>
                                          `)}`;
                                        }}
                                      />
                                      <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                                        Slide {slide.slideNumber}
                                      </div>
                                    </div>
                                    <div className="mt-2 text-xs text-gray-600">
                                      <p className="font-medium">
                                        Quick Preview
                                      </p>
                                      <p className="text-gray-500">
                                        Click to view full size
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Transcript */}
                        <div className="flex-1">
                          <Label className="text-sm font-medium text-gray-700 mb-2">
                            Transcript & Notes
                          </Label>
                          {isEditing ? (
                            <textarea
                              value={slide.transcript}
                              onChange={(e) =>
                                handleTranscriptChange(slide.id, e.target.value)
                              }
                              className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm"
                              placeholder="Enter transcript or speaker notes for this slide..."
                            />
                          ) : (
                            <div className="w-full h-32 px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-700 overflow-y-auto text-sm">
                              {slide.transcript ||
                                'No transcript available for this slide.'}
                            </div>
                          )}
                          <div className="mt-2 text-xs text-gray-500">
                            {slide.transcript
                              ? `${slide.transcript.length} characters`
                              : 'No content'}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Video Information Form */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Video Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div>
                    <Label htmlFor="title">Video Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) =>
                        handleFormChange('title', e.target.value)
                      }
                      placeholder="Enter video title"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        handleFormChange('description', e.target.value)
                      }
                      placeholder="Enter video description"
                      className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) =>
                          handleFormChange('category', value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
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
                          handleFormChange('year', e.target.value)
                        }
                        min="2020"
                        max={new Date().getFullYear() + 1}
                        disabled={isNewPresentation}
                        className={
                          isNewPresentation
                            ? 'bg-gray-100 cursor-not-allowed'
                            : ''
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={formData.duration}
                      onChange={(e) =>
                        handleFormChange('duration', e.target.value)
                      }
                      placeholder="30"
                      min="1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) =>
                        handleFormChange('status', value)
                      }
                      disabled={isNewPresentation}
                    >
                      <SelectTrigger
                        className={
                          isNewPresentation
                            ? 'bg-gray-100 cursor-not-allowed'
                            : ''
                        }
                      >
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

                  <div className="border-t pt-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">
                      Author Information
                    </h3>

                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="authorName">Author Name</Label>
                        <Input
                          id="authorName"
                          value={formData.authorName}
                          onChange={(e) =>
                            handleFormChange('authorName', e.target.value)
                          }
                          placeholder="Enter author name"
                        />
                      </div>

                      <div>
                        <Label htmlFor="authorEmail">Author Email</Label>
                        <Input
                          id="authorEmail"
                          type="email"
                          value={formData.authorEmail}
                          onChange={(e) =>
                            handleFormChange('authorEmail', e.target.value)
                          }
                          placeholder="Enter author email"
                        />
                      </div>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Presentation Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Slides:</span>
                    <span className="font-medium">{slides.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estimated Duration:</span>
                    <span className="font-medium">{formData.duration} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        formData.status === 'published'
                          ? 'bg-green-100 text-green-800'
                          : formData.status === 'draft'
                          ? 'bg-yellow-100 text-yellow-800'
                          : formData.status === 'pending_review'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {formData.status}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Slide Zoom Modal */}
      {selectedSlide && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl max-h-full overflow-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">
                Slide {slides.find((s) => s.id === selectedSlide)?.slideNumber}{' '}
              </h3>
              <button
                onClick={() => setSelectedSlide(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            <div className="p-4">
              <Image
                src={slides.find((s) => s.id === selectedSlide)?.imageUrl || ''}
                alt={`Slide ${
                  slides.find((s) => s.id === selectedSlide)?.slideNumber
                }`}
                className="w-full h-auto max-h-96 object-contain"
                width={500}
                height={450}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `data:image/svg+xml;base64,${btoa(`
                    <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
                      <rect width="800" height="600" fill="#f8f9fa"/>
                      <rect x="64" y="64" width="672" height="472" fill="white" stroke="#dee2e6" stroke-width="8"/>
                      <text x="400" y="300" text-anchor="middle" font-family="Arial, sans-serif" font-size="48" fill="#6c757d">Slide ${
                        slides.find((s) => s.id === selectedSlide)?.slideNumber
                      }</text>
                      <text x="400" y="360" text-anchor="middle" font-family="Arial, sans-serif" font-size="32" fill="#adb5bd">{""}</text>
                    </svg>
                  `)}`;
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
