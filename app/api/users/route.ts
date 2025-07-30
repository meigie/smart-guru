import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();
  // process signup logic here
  return NextResponse.json({ message: 'User signed up successfully' });
}

// import { NextRequest, NextResponse } from 'next/server';
// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/lib/auth-config';
// import bcrypt from 'bcryptjs';

// // GET /api/users - Get all users (admin only)
// export async function GET(request: NextRequest) {
//   //   try {
//   //     const session = await getServerSession(authOptions);
//   //     if (!session?.user?.id || session.user.role !== 'ADMIN') {
//   //       return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
//   //     }
//   //     const { searchParams } = new URL(request.url);
//   //     const page = parseInt(searchParams.get('page') || '1');
//   //     const limit = parseInt(searchParams.get('limit') || '10');
//   //     const search = searchParams.get('search');
//   //     const department = searchParams.get('department');
//   //     const role = searchParams.get('role');
//   //     const skip = (page - 1) * limit;
//   //     // Build where clause
//   //     const where: any = {};
//   //     if (search) {
//   //       where.OR = [
//   //         { name: { contains: search, mode: 'insensitive' } },
//   //         { email: { contains: search, mode: 'insensitive' } },
//   //       ];
//   //     }
//   //     if (department && department !== 'All') {
//   //       where.department = department.toUpperCase();
//   //     }
//   //     if (role && role !== 'All') {
//   //       where.role = role.toUpperCase();
//   //     }
//   //     //remove prisma
//   //     // Get users
//   //     // const users = await prisma.user.findMany({
//   //     //   where,
//   //     //   select: {
//   //     //     id: true,
//   //     //     name: true,
//   //     //     email: true,
//   //     //     role: true,
//   //     //     department: true,
//   //     //     createdAt: true,
//   //     //     updatedAt: true,
//   //     //     _count: {
//   //     //       select: {
//   //     //         videos: true,
//   //     //       },
//   //     //     },
//   //     //   },
//   //     //   orderBy: {
//   //     //     createdAt: 'desc',
//   //     //   },
//   //     //   skip,
//   //     //   take: limit,
//   //     // })
//   //     const users = {
//   //       email: 'test@test.com',
//   //       name: 'tester',
//   //       password: '123',
//   //       role: 'USER', // Default role for new users
//   //       department: 'ADD',
//   //     };
//   //     //remove prisma
//   //     // Get total count for pagination
//   //     //const total = await prisma.user.count({ where });
//   //     const total = 1;
//   //     return NextResponse.json({
//   //       users,
//   //       pagination: {
//   //         page,
//   //         limit,
//   //         total,
//   //         pages: Math.ceil(total / limit),
//   //       },
//   //     });
//   //   } catch (error) {
//   //     console.error('Error fetching users:', error);
//   //     return NextResponse.json(
//   //       { error: 'Failed to fetch users' },
//   //       { status: 500 }
//   //     );
//   //   }
//   // }
//   // // POST /api/users - Create new user (admin only)
//   // export async function POST(request: NextRequest) {
//   //   try {
//   //     const session = await getServerSession(authOptions);
//   //     if (!session?.user?.id || session.user.role !== 'ADMIN') {
//   //       return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
//   //     }
//   //     const body = await request.json();
//   //     const { name, email, password, role = 'USER', department } = body;
//   //     // Validate required fields
//   //     if (!name || !email || !password || !department) {
//   //       return NextResponse.json(
//   //         { error: 'Missing required fields' },
//   //         { status: 400 }
//   //       );
//   //     }
//   //     //remove prisma
//   //     // Check if user already exists
//   //     // const existingUser = await prisma.user.findUnique({
//   //     //   where: { email },
//   //     // });
//   //     const existingUser = true;
//   //     if (existingUser) {
//   //       return NextResponse.json(
//   //         { error: 'User already exists' },
//   //         { status: 409 }
//   //       );
//   //     }
//   //     // Hash password
//   //     const hashedPassword = bcrypt.hashSync(password, 10);
//   //     //remove prisma
//   //     // Create user
//   //     // const user = await prisma.user.create({
//   //     //   data: {
//   //     //     name,
//   //     //     email,
//   //     //     password: hashedPassword,
//   //     //     role: role.toUpperCase(),
//   //     //     department: department.toUpperCase(),
//   //     //   },
//   //     //   select: {
//   //     //     id: true,
//   //     //     name: true,
//   //     //     email: true,
//   //     //     role: true,
//   //     //     department: true,
//   //     //     createdAt: true,
//   //     //     updatedAt: true,
//   //     //   },
//   //     // });
//   //     return NextResponse.json(user, { status: 201 });
//   //   } catch (error) {
//   //     console.error('Error creating user:', error);
//   //     return NextResponse.json(
//   //       { error: 'Failed to create user' },
//   //       { status: 500 }
//   //     );
//   //   }
// }
