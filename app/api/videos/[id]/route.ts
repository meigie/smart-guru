import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config'

// GET /api/videos/[id] - Get single video
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const video = await prisma.video.findUnique({
      where: { id: params.id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            department: true,
          },
        },
        slides: {
          orderBy: {
            slideNumber: 'asc',
          },
        },
        ratings: {
          include: {
            video: {
              select: {
                title: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        _count: {
          select: {
            ratings: true,
          },
        },
      },
    })

    if (!video) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      )
    }

    // Increment view count
    await prisma.video.update({
      where: { id: params.id },
      data: { viewCount: { increment: 1 } },
    })

    return NextResponse.json(video)
  } catch (error) {
    console.error('Error fetching video:', error)
    return NextResponse.json(
      { error: 'Failed to fetch video' },
      { status: 500 }
    )
  }
}

// PUT /api/videos/[id] - Update video
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if video exists and user has permission
    const existingVideo = await prisma.video.findUnique({
      where: { id: params.id },
      include: { author: true },
    })

    if (!existingVideo) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      )
    }

    // Only author or admin can update
    if (existingVideo.authorId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const {
      title,
      description,
      duration,
      thumbnailUrl,
      videoUrl,
      category,
      year,
      status,
      slides,
    } = body

    // Update video
    const video = await prisma.video.update({
      where: { id: params.id },
      data: {
        title,
        description,
        duration,
        thumbnailUrl,
        videoUrl,
        category,
        year: year ? parseInt(year) : undefined,
        status: status ? status.toUpperCase() : undefined,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            department: true,
          },
        },
        slides: true,
      },
    })

    // Update slides if provided
    if (slides) {
      // Delete existing slides
      await prisma.slide.deleteMany({
        where: { videoId: params.id },
      })

      // Create new slides
      await prisma.slide.createMany({
        data: slides.map((slide: any, index: number) => ({
          videoId: params.id,
          slideNumber: index + 1,
          imageUrl: slide.imageUrl,
          transcript: slide.transcript || '',
        })),
      })
    }

    return NextResponse.json(video)
  } catch (error) {
    console.error('Error updating video:', error)
    return NextResponse.json(
      { error: 'Failed to update video' },
      { status: 500 }
    )
  }
}

// DELETE /api/videos/[id] - Delete video
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if video exists and user has permission
    const existingVideo = await prisma.video.findUnique({
      where: { id: params.id },
      include: { author: true },
    })

    if (!existingVideo) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      )
    }

    // Only author or admin can delete
    if (existingVideo.authorId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    // Delete video (cascades to slides and ratings)
    await prisma.video.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Video deleted successfully' })
  } catch (error) {
    console.error('Error deleting video:', error)
    return NextResponse.json(
      { error: 'Failed to delete video' },
      { status: 500 }
    )
  }
} 