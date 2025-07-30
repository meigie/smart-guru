import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-config";

// Mock data - in a real app, this would come from a database
const mockEnrollments = [
  {
    userId: "cmdbgcjto0000oftbzg7xvh7c", // admin user ID
    courseId: "1",
    enrolledAt: new Date("2025-01-01T00:00:00Z"),
  },
  // Note: User is NOT enrolled in course '3'
];

export async function GET(
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

    console.log("Checking enrollment - userId:", userId, "courseId:", courseId);
    console.log("Available enrollments:", mockEnrollments);

    // Check if user is enrolled in this course
    const enrollment = mockEnrollments.find(
      (e) => e.userId === userId && e.courseId === courseId
    );

    console.log("Found enrollment:", enrollment);

    return NextResponse.json({
      isEnrolled: !!enrollment,
      enrollment: enrollment || null,
    });
  } catch (error) {
    console.error("Error checking enrollment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
