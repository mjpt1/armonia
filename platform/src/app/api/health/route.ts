import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "armonia-platform",
    time: new Date().toISOString(),
  });
}
