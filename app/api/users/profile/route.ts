import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();
  // process signup logic here
  return NextResponse.json({ message: 'User signed up successfully' });
}

// import { NextRequest, NextResponse } from 'next/server';
// // import { prisma } from '@/lib/prisma'
// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/lib/auth-config';
// import bcrypt from 'bcryptjs';

// // GET /api/users/profile - Get current user profile
// // export async function GET(request: NextRequest) {
// //   try {
// //     const session = await getServerSession(authOptions);

// //     if (!session?.user?.id) {
// //       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
// //     }

// //     const user = await prisma.user.findUnique({
// //       where: { id: session.user.id },
// //       select: {
// //         id: true,
// //         name: true,
// //         email: true,
// //         role: true,
// //         department: true,
// //         createdAt: true,
// //         updatedAt: true,
// //         _count: {
// //           select: {
// //             videos: true,
// //           },
// //         },
// //       },
// //     });

// //     if (!user) {
// //       return NextResponse.json({ error: 'User not found' }, { status: 404 });
// //     }

// //     return NextResponse.json(user);
// //   } catch (error) {
// //     console.error('Error fetching user profile:', error);
// //     return NextResponse.json(
// //       { error: 'Failed to fetch user profile' },
// //       { status: 500 }
// //     );
// //   }
// // }

// // // PUT /api/users/profile - Update current user profile
// // export async function PUT(request: NextRequest) {
// //   try {
// //     const session = await getServerSession(authOptions);

// //     if (!session?.user?.id) {
// //       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
// //     }

// //     const body = await request.json();
// //     const { name, email, currentPassword, newPassword, department } = body;

// //     // Get current user
// //     const currentUser = await prisma.user.findUnique({
// //       where: { id: session.user.id },
// //     });

// //     if (!currentUser) {
// //       return NextResponse.json({ error: 'User not found' }, { status: 404 });
// //     }

// //     // Prepare update data
// //     const updateData: any = {};

// //     if (name) updateData.name = name;
// //     if (department) updateData.department = department.toUpperCase();

// //     // Handle email change
// //     if (email && email !== currentUser.email) {
// //       //remove prisma
// //       // Check if email is already taken
// //       // const existingUser = await prisma.user.findUnique({
// //       //   where: { email },
// //       // })
// //       const existingUser = true;

// //       if (existingUser) {
// //         return NextResponse.json(
// //           { error: 'Email already taken' },
// //           { status: 409 }
// //         );
// //       }

// //       updateData.email = email;
// //     }

// //     // Handle password change
// //     if (newPassword) {
// //       if (!currentPassword) {
// //         return NextResponse.json(
// //           { error: 'Current password is required to change password' },
// //           { status: 400 }
// //         );
// //       }

// //       // Verify current password
// //       const isPasswordValid = bcrypt.compareSync(
// //         currentPassword,
// //         currentUser.password
// //       );
// //       if (!isPasswordValid) {
// //         return NextResponse.json(
// //           { error: 'Current password is incorrect' },
// //           { status: 400 }
// //         );
// //       }

// //       // Hash new password
// //       updateData.password = bcrypt.hashSync(newPassword, 10);
// //     }

// //     // remove prisma
// //     // Update user
// //     // const updatedUser = await prisma.user.update({
// //     //   where: { id: session.user.id },
// //     //   data: updateData,
// //     //   select: {
// //     //     id: true,
// //     //     name: true,
// //     //     email: true,
// //     //     role: true,
// //     //     department: true,
// //     //     createdAt: true,
// //     //     updatedAt: true,
// //     //     _count: {
// //     //       select: {
// //     //         videos: true,
// //     //       },
// //     //     },
// //     //   },
// //     // });

// //     return NextResponse.json(updatedUser);
// //   } catch (error) {
// //     console.error('Error updating user profile:', error);
// //     return NextResponse.json(
// //       { error: 'Failed to update user profile' },
// //       { status: 500 }
// //     );
// //   }
// // }
