import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");

  if (action === "download-all") {
    const pressKitPath = path.join(process.cwd(), "public", "press-kit.zip");
    
    if (fs.existsSync(pressKitPath)) {
      const fileBuffer = fs.readFileSync(pressKitPath);
      return new NextResponse(fileBuffer, {
        headers: {
          "Content-Type": "application/zip",
          "Content-Disposition": "attachment; filename=yume-ramen-press-kit.zip",
        },
      });
    }

    return NextResponse.json(
      { 
        error: "Press kit is being prepared",
        message: "The complete press kit download is being compiled. Please download individual assets from the Media Resource Center or contact press@yuumee.nl for immediate assistance."
      },
      { status: 404 }
    );
  }

  return NextResponse.json({ 
    message: "Yume Ramen Press Kit API",
    endpoints: {
      downloadAll: "/api/press-kit?action=download-all"
    }
  });
}