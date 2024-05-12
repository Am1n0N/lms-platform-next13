import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";


export async function GET(
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();
    const courseId  = params?.courseId; // Add null check for params object
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const comments = await db.comment.findMany({
      where: {
        courseId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    console.log("comments", comments);
    return NextResponse.json(comments);
  } catch (error) {

    console.log("[Comments]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(
  req: Request,
) {
  try {
    const { userId } = auth();
    const { text, parentId, courseId } = await req.json();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const comment = await db.comment.create({
      data: {
        userId,
        text,
        parentId,
        courseId,
      },
    });

    return NextResponse.json(comment);
  } catch (error) {
    console.log("[Comments]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
) {
  try {
    const { userId } = auth();
    const { id } = await req.json();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const comment = await db.comment.findUnique({
      where: {
        id,
      },
    });

    if (!comment) {
      return new NextResponse("Not Found", { status: 404 });
    }

    if (comment.userId !== userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await db.comment.delete({
      where: {
        id,
      },
    });

    return new NextResponse("Deleted", { status: 201 });
  } catch (error) {
    console.log("[Comments]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}