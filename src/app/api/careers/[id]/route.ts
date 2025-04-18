import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { deleteImageFile } from "@/lib/fileUtils";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // Find the career application by ID
    const career = await prisma.careers.findUnique({
      where: { id },
    });

    if (!career) {
      return NextResponse.json(
        { error: "Career application not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ career });
  } catch (error) {
    console.error("Error fetching career application:", error);
    return NextResponse.json(
      { error: "Failed to fetch career application" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // Find the career application first to get the CV file path
    const career = await prisma.careers.findUnique({
      where: { id },
    });

    if (!career) {
      return NextResponse.json(
        { error: "Career application not found" },
        { status: 404 }
      );
    }

    // Delete the CV file if it exists
    if (career.cv) {
      await deleteImageFile(career.cv);
    }

    // Delete the career application from the database
    await prisma.careers.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Career application deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting career application:", error);
    return NextResponse.json(
      { error: "Failed to delete career application" },
      { status: 500 }
    );
  }
}
