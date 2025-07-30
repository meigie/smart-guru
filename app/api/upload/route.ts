import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";
import path from "path";
import fs from "fs/promises";
import { existsSync } from "fs";
import { processPowerPointFileReal } from "@/lib/powerpoint-processor";

export const POST = async (req: NextRequest) => {
  try {
    // 1. Save uploaded file to disk
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file)
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    // const uploadsDir = path.join(
    //   process.cwd(),
    //   "public",
    //   "uploads",
    //   "presentations"
    // );
    // if (!existsSync(uploadsDir))
    //   await fs.mkdir(uploadsDir, { recursive: true });

    // const slidesDir = path.join(process.cwd(), "public", "uploads", "slides");
    // if (!existsSync(slidesDir)) await fs.mkdir(slidesDir, { recursive: true });

    // const timestamp = Date.now();
    // const pptxPath = path.join(uploadsDir, `${timestamp}.pptx`);
    // const pdfPath = path.join(uploadsDir, `${timestamp}.pdf`);

    // // Save PPTX
    // const arrayBuffer = await file.arrayBuffer();
    // await fs.writeFile(pptxPath, Buffer.from(arrayBuffer));

    // // 2. Convert PPTX to PDF using LibreOffice
    // await new Promise<void>((resolve, reject) => {
    //   const proc = spawn("libreoffice", [
    //     "--headless",
    //     "--convert-to",
    //     "pdf",
    //     "--outdir",
    //     uploadsDir,
    //     pptxPath,
    //   ]);
    //   proc.on("close", (code) =>
    //     code === 0 ? resolve() : reject(new Error("LibreOffice failed"))
    //   );
    // });

    // // 3. Convert PDF to images using pdftoppm
    // await new Promise<void>((resolve, reject) => {
    //   const proc = spawn("pdftoppm", [
    //     "-jpeg",
    //     "-r",
    //     "150", // DPI
    //     pdfPath,
    //     path.join(slidesDir, `slide_${timestamp}`),
    //   ]);
    //   proc.on("close", (code) =>
    //     code === 0 ? resolve() : reject(new Error("pdftoppm failed"))
    //   );
    // });

    // // 4. Collect generated images

    // const files = await fs.readdir(slidesDir);
    // const slideImages = files
    //   .filter((f) => f.startsWith(`slide_${timestamp}`) && f.endsWith(".jpg"))
    //   .sort((a, b) => a.localeCompare(b))
    //   .map((f) => `/uploads/slides/${f}`);

    // // 5. Extract notes using the existing processor
    // const result = await processPowerPointFileReal(pptxPath);
    // if (!result.success) {
    //   return NextResponse.json(
    //     { error: result.error || "Processing failed" },
    //     { status: 500 }
    //   );
    // }

    // // 6. Combine image paths and notes
    // const slides = slideImages.map((imagePath, idx) => ({
    //   imagePath,
    //   note: result.slides[idx]?.transcript || "",
    // }));

    //mock
    const slides = [
      {
        imagePath: "/uploads/slides/slide_1753872134628-6.jpg",
        note: "You can open an issue on GitHub, if you encounter any problem. ‹#›",
      },
      {
        imagePath: "/uploads/slides/slide_1753872134628-6.jpg",
        note: "You can open an issue on GitHub, if you encounter any problem. ‹#›",
      },
    ];

    return NextResponse.json({ success: true, slides });
  } catch (error) {
    return NextResponse.json(
      { error: "Processing failed", details: error },
      { status: 500 }
    );
  }
};
