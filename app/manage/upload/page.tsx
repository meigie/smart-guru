'use client';

import { useState } from 'react';
import { Navigation } from '@/components/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileText, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';

export default function UploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check if file is a PowerPoint file
      const validTypes = [
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      ];

      if (
        validTypes.includes(file.type) ||
        file.name.endsWith('.ppt') ||
        file.name.endsWith('.pptx')
      ) {
        setSelectedFile(file);
      } else {
        alert('Please select a valid PowerPoint file (.ppt or .pptx)');
        event.target.value = '';
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      alert('Please select a file to upload');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', selectedFile);

      // Upload file to API
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      console.log(response);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const result = await response.json();

      if (result.success) {
        setUploadProgress(100);

        // Store the processed slides data in sessionStorage for the presentation page
        sessionStorage.setItem(
          'processedSlides',
          JSON.stringify(result.slides)
        );
        sessionStorage.setItem('originalFile', result.originalFile);

        // Show success message and redirect
        setTimeout(() => {
          alert('File uploaded and processed successfully!');
          setSelectedFile(null);
          setIsUploading(false);
          setUploadProgress(0);
          // Reset file input
          const fileInput = document.getElementById(
            'file-input'
          ) as HTMLInputElement;
          if (fileInput) fileInput.value = '';
          // Redirect to presentation page
          window.location.href = '/manage/presentation';
        }, 500);
      } else {
        throw new Error(result.error || 'Processing failed');
      }
    } catch (error) {
      setIsUploading(false);
      setUploadProgress(0);
      alert(
        `Upload failed: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link href="/manage" className="mr-4">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Manage
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Upload PowerPoint
            </h1>
            <p className="text-gray-600">
              Upload your PowerPoint presentation (.ppt or .pptx)
            </p>
          </div>
        </div>

        {/* Upload Form */}
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Upload Presentation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* File Upload Area */}
              <div>
                <Label
                  htmlFor="file-input"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Select PowerPoint File
                </Label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-input"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-input"
                          name="file-input"
                          type="file"
                          className="sr-only"
                          accept=".ppt,.pptx,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
                          onChange={handleFileSelect}
                          disabled={isUploading}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PPT, PPTX up to 50MB
                    </p>
                  </div>
                </div>
              </div>

              {/* Selected File Display */}
              {selectedFile && (
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-blue-600 mr-2" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-blue-900">
                        {selectedFile.name}
                      </p>
                      <p className="text-sm text-blue-700">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedFile(null);
                        const fileInput = document.getElementById(
                          'file-input'
                        ) as HTMLInputElement;
                        if (fileInput) fileInput.value = '';
                      }}
                      disabled={isUploading}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              )}

              {/* Upload Progress */}
              {isUploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end space-x-3">
                <Link href="/manage">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isUploading}
                  >
                    Cancel
                  </Button>
                </Link>
                <Button
                  type="submit"
                  disabled={!selectedFile || isUploading}
                  className="min-w-[120px]"
                >
                  {isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="max-w-2xl mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Upload Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                Supported formats: .ppt and .pptx files
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                Maximum file size: 50MB
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                Ensure your presentation is complete and ready for upload
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                Upload may take a few minutes depending on file size
              </li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
