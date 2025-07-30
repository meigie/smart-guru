import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-config";

// Mock data - in a real app, this would come from a database
let mockEnrollments = [
  {
    userId: "cmdbgcjto0000oftbzg7xvh7c", // admin user ID
    courseId: "1",
    enrolledAt: new Date("2025-01-01T00:00:00Z"),
  },

  // Note: User is NOT enrolled in course '3'
];

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ courseId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { courseId } = await context.params;
    const userId = session.user.id;

    // Check if user is already enrolled
    const existingEnrollment = mockEnrollments.find(
      (e) => e.userId === userId && e.courseId === courseId
    );

    //do not throw error if user is already enrolled.. temporary mock
    // if (existingEnrollment) {
    //   return NextResponse.json(
    //     { error: "User is already enrolled in this course" },
    //     { status: 400 }
    //   );
    // }

    if (existingEnrollment) {
      return NextResponse.json({ message: "Have enrolled" });
    }

    // Add enrollment
    const newEnrollment = {
      userId,
      courseId,
      enrolledAt: new Date(),
    };

    mockEnrollments.push(newEnrollment);

    return NextResponse.json({
      message: "Successfully enrolled in course",
      enrollment: newEnrollment,
    });
  } catch (error) {
    console.error("Error enrolling in course:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ courseId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { courseId } = await context.params;
    const userId = session.user.id;

    // Remove enrollment
    mockEnrollments = mockEnrollments.filter(
      (e) => !(e.userId === userId && e.courseId === courseId)
    );

    return NextResponse.json({
      message: "Successfully unenrolled from course",
    });
  } catch (error) {
    console.error("Error unenrolling from course:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
