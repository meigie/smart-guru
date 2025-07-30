import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();
  // process signup logic here
  return NextResponse.json({ message: 'User signed up successfully' });
}

// import { authOptions } from '@/lib/auth-config';
// // import { prisma } from '@/lib/prisma'
// import { getServerSession } from 'next-auth';
// import { NextRequest, NextResponse } from 'next/server';

// // GET /api/videos - Get all videos with filters
// export async function GET(request: NextRequest) {
//   //   try {
//   //     const { searchParams } = new URL(request.url);
//   //     const category = searchParams.get('category');
//   //     const year = searchParams.get('year');
//   //     const status = searchParams.get('status');
//   //     const search = searchParams.get('search');
//   //     const page = parseInt(searchParams.get('page') || '1');
//   //     const limit = parseInt(searchParams.get('limit') || '10');
//   //     const skip = (page - 1) * limit;
//   //     // Build where clause
//   //     const where: any = {};
//   //     if (category && category !== 'All') {
//   //       where.category = category;
//   //     }
//   //     if (year && year !== 'All') {
//   //       where.year = parseInt(year);
//   //     }
//   //     if (status && status !== 'All') {
//   //       where.status = status.toUpperCase();
//   //     }
//   //     if (search) {
//   //       where.OR = [
//   //         { title: { contains: search, mode: 'insensitive' } },
//   //         { description: { contains: search, mode: 'insensitive' } },
//   //       ];
//   //     }
//   //     // Get videos with author information
//   //     const videos = await prisma.video.findMany({
//   //       where,
//   //       include: {
//   //         author: {
//   //           select: {
//   //             id: true,
//   //             name: true,
//   //             email: true,
//   //             role: true,
//   //             department: true,
//   //           },
//   //         },
//   //         slides: {
//   //           select: {
//   //             id: true,
//   //             slideNumber: true,
//   //           },
//   //         },
//   //         _count: {
//   //           select: {
//   //             ratings: true,
//   //           },
//   //         },
//   //       },
//   //       orderBy: {
//   //         createdAt: 'desc',
//   //       },
//   //       skip,
//   //       take: limit,
//   //     });
//   //     // Get total count for pagination
//   //     const total = await prisma.video.count({ where });
//   //     return NextResponse.json({
//   //       videos,
//   //       pagination: {
//   //         page,
//   //         limit,
//   //         total,
//   //         pages: Math.ceil(total / limit),
//   //       },
//   //     });
//   //   } catch (error) {
//   //     console.error('Error fetching videos:', error);
//   //     return NextResponse.json(
//   //       { error: 'Failed to fetch videos' },
//   //       { status: 500 }
//   //     );
//   //   }
//   // }
//   // // POST /api/videos - Create new video
//   // export async function POST(request: NextRequest) {
//   //   try {
//   //     const session = await getServerSession(authOptions);
//   //     if (!session?.user?.id) {
//   //       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//   //     }
//   //     const body = await request.json();
//   //     const {
//   //       title,
//   //       description,
//   //       duration,
//   //       thumbnailUrl,
//   //       videoUrl,
//   //       category,
//   //       year,
//   //       status = 'DRAFT',
//   //       slides,
//   //     } = body;
//   //     // Validate required fields
//   //     if (!title || !description || !category || !year) {
//   //       return NextResponse.json(
//   //         { error: 'Missing required fields' },
//   //         { status: 400 }
//   //       );
//   //     }
//   //     // remove prisma
//   //     // Create video with slides
//   //     // const video = await prisma.video.create({
//   //     //   data: {
//   //     //     title,
//   //     //     description,
//   //     //     duration: duration || 0,
//   //     //     thumbnailUrl,
//   //     //     videoUrl,
//   //     //     category,
//   //     //     year: parseInt(year),
//   //     //     status: status.toUpperCase(),
//   //     //     authorId: session.user.id,
//   //     //     slides: slides ? {
//   //     //       create: slides.map((slide: any, index: number) => ({
//   //     //         slideNumber: index + 1,
//   //     //         imageUrl: slide.imageUrl,
//   //     //         transcript: slide.transcript || '',
//   //     //       }))
//   //     //     } : undefined,
//   //     //   },
//   //     //   include: {
//   //     //     author: {
//   //     //       select: {
//   //     //         id: true,
//   //     //         name: true,
//   //     //         email: true,
//   //     //         role: true,
//   //     //         department: true,
//   //     //       },
//   //     //     },
//   //     //     slides: true,
//   //     //   },
//   //     // })
//   //     return NextResponse.json(video, { status: 201 });
//   //   } catch (error) {
//   //     console.error('Error creating video:', error);
//   //     return NextResponse.json(
//   //       { error: 'Failed to create video' },
//   //       { status: 500 }
//   //     );
//   //   }
// }
