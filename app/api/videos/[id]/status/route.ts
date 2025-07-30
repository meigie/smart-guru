import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config'

// PATCH /api/videos/[id]/status - Update video status
export async function PATCH(
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

    // Check if video exists
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

    // Only author or admin can update status
    if (existingVideo.authorId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { status } = body

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      )
    }

    // Validate status
    const validStatuses = ['DRAFT', 'PENDING_REVIEW', 'PUBLISHED', 'ARCHIVED']
    if (!validStatuses.includes(status.toUpperCase())) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      )
    }

    // Update video status
    const video = await prisma.video.update({
      where: { id: params.id },
      data: { 
        status: status.toUpperCase(),
        // If status is changing to draft, update year to current year
        ...(status.toUpperCase() === 'DRAFT' && {
          year: new Date().getFullYear()
        })
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
      },
    })

    return NextResponse.json(video)
  } catch (error) {
    console.error('Error updating video status:', error)
    return NextResponse.json(
      { error: 'Failed to update video status' },
      { status: 500 }
    )
  }
} 