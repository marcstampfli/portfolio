import { prisma } from "@/lib/prisma";
import { type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    const contact = await prisma.contactMessage.create({
      data: {
        name,
        email,
        message,
      },
    });

    return Response.json({ success: true, data: contact });
  } catch (error) {
    console.error("Failed to submit contact message:", error);
    return Response.json(
      { success: false, error: "Failed to submit contact message" },
      { status: 500 },
    );
  }
}
