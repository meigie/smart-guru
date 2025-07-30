import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();
  // process signup logic here
  return NextResponse.json({ message: 'User signed up successfully' });
}

// import { DEPARTMENTS } from '@/lib/constants';
// import { Department } from '@/types';
// import bcrypt from 'bcryptjs';
// import { NextRequest, NextResponse } from 'next/server';

// export async function POST(request: NextRequest) {
//   try {
//     const { name, email, password, department } = await request.json();

//     // Validation
//     if (!name || !email || !password || !department) {
//       return NextResponse.json(
//         { error: 'Name, email, password, and department are required' },
//         { status: 400 }
//       );
//     }

//     if (password.length < 6) {
//       return NextResponse.json(
//         { error: 'Password must be at least 6 characters long' },
//         { status: 400 }
//       );
//     }

//     // Validate department
//     if (!DEPARTMENTS.includes(department as Department)) {
//       return NextResponse.json(
//         { error: 'Invalid department selected' },
//         { status: 400 }
//       );
//     }

//     // remove prisma
//     // Check if user already exists
//     // const existingUser = await prisma.user.findUnique({
//     //   where: { email }
//     // })
//     const existingUser = true;

//     if (existingUser) {
//       return NextResponse.json(
//         { error: 'User with this email already exists' },
//         { status: 409 }
//       );
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     //remove prisma
//     // Create new user in database
//     // const newUser = await prisma.user.create({
//     //   data: {
//     //     email,
//     //     name,
//     //     password: hashedPassword,
//     //     role: 'USER', // Default role for new users
//     //     department,
//     //   },
//     // });
//     const newUser = {
//       email: 'admin@example.com',
//       name: 'Tan Ah Kaw',
//       password: 'cmdbgcjto0000oftbzg7xvh7c',
//       role: 'USER', // Default role for new users
//       department: 'AAD',
//     };

//     // Return success (don't return the password)
//     const { password: _, ...userWithoutPassword } = newUser;
//     return NextResponse.json(
//       {
//         message: 'User created successfully',
//         user: userWithoutPassword,
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error('Signup error:', error);
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }
