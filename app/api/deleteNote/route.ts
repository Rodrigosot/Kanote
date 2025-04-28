import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/app/lib/db";
import { Notes } from "@prisma/client";


// POST /api/deleteNote
// Delete a note by id and return the notes
// getKindeServerSession() is a helper function to get the user session
// Body: { noteId: string }
export async function POST(req: Request) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    const body = await req.json();

    const { noteId } = body;

    if (!noteId || !user) {
      return new NextResponse("Missing noteId or user", { status: 400 });
    }

    await prisma.notes.delete({ where: { id: noteId } });

    const notes = await prisma.notes.findMany({
      where: {
        userId: user.id,
      },
    });

    return NextResponse.json(notes);
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      sucess: false,
      status: 500,
    });
  }
}
