import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

// Path to scripts database in public/data/scripts.json
const DATA_PATH = path.join(process.cwd(), "public", "data", "scripts.json");

export async function GET() {
  try {
    const fileContent = await fs.readFile(DATA_PATH, "utf-8");
    const data = JSON.parse(fileContent);
    return NextResponse.json(data);
  } catch (error) {
    // If file doesn't exist or error reading, return empty list
    return NextResponse.json([]);
  }
}

export async function POST(req: NextRequest) {
  try {
    const passwordHeader = req.headers.get("X-Admin-Password");
    const inputData = await req.json();
    
    // Local dev uses same default password
    const adminPassword = "ae-admin-123";
    const finalPassword = passwordHeader || inputData.password;
    
    if (finalPassword !== adminPassword) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Invalid admin password." },
        { status: 401 }
      );
    }
    
    // Extract scripts array
    const scripts = Array.isArray(inputData) ? inputData : inputData.scripts;
    
    if (!Array.isArray(scripts)) {
      return NextResponse.json(
        { success: false, error: "Bad Request: Data must be an array of scripts." },
        { status: 400 }
      );
    }
    
    // Ensure the data folder and file exists
    await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
    
    // Save to file
    await fs.writeFile(
      DATA_PATH,
      JSON.stringify(scripts, null, 2),
      "utf-8"
    );
    
    return NextResponse.json({
      success: true,
      message: "Scripts catalog updated successfully on Next.js dev server."
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: `Server Error: ${error.message}` },
      { status: 500 }
    );
  }
}
