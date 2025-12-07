import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { saveSession } from "@/lib/pdf-session-store";
import { ItineraryDataSchema } from "@/app/api/generate-itinerary/route";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const itinerary = ItineraryDataSchema.safeParse(body);

    if (!itinerary.success) {
      return NextResponse.json({ error: "Invalid itinerary" }, { status: 400 });
    }

    const id = nanoid(10);
    saveSession(id, itinerary.data);

    return NextResponse.json({ sessionId: id }, { status: 201 });
  } catch (err) {
    console.error("POST /api/pdf-session error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
