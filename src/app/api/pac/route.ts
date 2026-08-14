import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const pacs = await prisma.pAC.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json(pacs);
  } catch (error) {
    console.error("Error fetching PACs:", error);
    return NextResponse.json({ error: "Failed to fetch PACs" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, chairman, region, members, pk, pr, status } = body;

    // Generate slug from name
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

    const pac = await prisma.pAC.create({
      data: {
        name,
        slug,
        chairman,
        region,
        members: parseInt(members) || 0,
        pk: parseInt(pk) || 0,
        pr: parseInt(pr) || 0,
        status: status || "Aktif",
      },
    });

    return NextResponse.json(pac);
  } catch (error) {
    console.error("Error creating PAC:", error);
    return NextResponse.json({ error: "Failed to create PAC" }, { status: 500 });
  }
}
