import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const param = await params;
    const id = param.id;

    const exportRequest = await prisma.exportRequest.findUnique({
      where: { id },
    });

    if (!exportRequest) {
      return NextResponse.json(
        { error: "Export request not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(exportRequest);
  } catch (error) {
    console.error("Error fetching export request:", error);
    return NextResponse.json(
      { error: "Failed to fetch export request" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const param = await params;
    const id = param.id;

    // Check if the export request exists
    const existingRequest = await prisma.exportRequest.findUnique({
      where: { id },
    });

    if (!existingRequest) {
      return NextResponse.json(
        { error: "Export request not found" },
        { status: 404 }
      );
    }

    // Delete the export request
    await prisma.exportRequest.delete({
      where: { id },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error deleting export request:", error);
    return NextResponse.json(
      { error: "Failed to delete export request" },
      { status: 500 }
    );
  }
}
