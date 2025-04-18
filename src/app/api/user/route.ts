import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const recipes = await prisma.user.findMany();
  return NextResponse.json("Hello World!");
}
