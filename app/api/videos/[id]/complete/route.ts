import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split("/").filter(Boolean).pop(); // Get `id` from URL

    console.log(`Marking video ${id} as completed`);

    return NextResponse.json({
      success: true,
      message: "Video marked as completed",
      videoId: id,
      completedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error marking video as completed:", error);
    return NextResponse.json(
      { error: "Failed to mark video as completed" },
      { status: 500 }
    );
  }
}
