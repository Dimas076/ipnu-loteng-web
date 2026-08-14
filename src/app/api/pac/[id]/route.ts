import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const pac = await prisma.pAC.findUnique({
      where: { id: parseInt(id) },
    });

    if (!pac) {
      return NextResponse.json({ error: "PAC not found" }, { status: 404 });
    }

    return NextResponse.json(pac);
  } catch (error) {
    console.error("Error fetching PAC:", error);
    return NextResponse.json({ error: "Failed to fetch PAC" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, chairman, region, members, pk, pr, status } = body;

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

    const pac = await prisma.pAC.update({
      where: { id: parseInt(id) },
      data: {
        name,
        slug,
        chairman,
        region,
        members: parseInt(members) || 0,
        pk: parseInt(pk) || 0,
        pr: parseInt(pr) || 0,
        status,
      },
    });

    return NextResponse.json(pac);
  } catch (error) {
    console.error("Error updating PAC:", error);
    return NextResponse.json({ error: "Failed to update PAC" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.pAC.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting PAC:", error);
    return NextResponse.json({ error: "Failed to delete PAC" }, { status: 500 });
  }
}
