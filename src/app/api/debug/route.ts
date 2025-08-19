import { NextResponse } from "next/server";

export async function GET() {
  try {
    const envVars = {
      NODE_ENV: process.env.NODE_ENV,
      DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'NOT_SET',
      DATABASE_URL_PREFIX: process.env.DATABASE_URL?.substring(0, 30) || 'N/A',
    };
    
    return NextResponse.json({
      message: "Debug info",
      environment: envVars,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Debug endpoint error:", error);
    return NextResponse.json(
      { error: "Debug failed", details: String(error) },
      { status: 500 },
    );
  }
}