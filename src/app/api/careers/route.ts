import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Extract career application data from request body
    const { name, email, phone, position, message, cv } = body;

    // Validate required fields
    if (!name || !email || !phone || !cv) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create the career application record in the database
    const career = await prisma.careers.create({
      data: {
        name,
        email,
        phone,
        position,
        message,
        cv,
      },
    });

    return NextResponse.json({ career }, { status: 201 });
  } catch (error) {
    console.error("Error creating career application:", error);
    return NextResponse.json(
      { error: "Failed to create career application" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const careers = await prisma.careers.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ careers });
  } catch (error) {
    console.error("Error fetching career applications:", error);
    return NextResponse.json(
      { error: "Failed to fetch career applications" },
      { status: 500 }
    );
  }
}
