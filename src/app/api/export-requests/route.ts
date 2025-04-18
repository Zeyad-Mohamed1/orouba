import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate required fields
    const { name, email, phone, details } = body;

    if (!name || !email || !phone || !details) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create the export request
    const exportRequest = await prisma.exportRequest.create({
      data: {
        name,
        email,
        phone,
        details,
      },
    });

    return NextResponse.json(exportRequest, { status: 201 });
  } catch (error) {
    console.error("Error creating export request:", error);
    return NextResponse.json(
      { error: "Failed to create export request" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const exportRequests = await prisma.exportRequest.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(exportRequests);
  } catch (error) {
    console.error("Error fetching export requests:", error);
    return NextResponse.json(
      { error: "Failed to fetch export requests" },
      { status: 500 }
    );
  }
}
