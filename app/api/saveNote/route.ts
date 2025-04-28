import { NextResponse } from "next/server";
import prisma from "@/app/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";


// POST /api/saveNote
// Save the editorState of a note and return the notes
// getKindeServerSession() is a helper function to get the user session
// Body: { noteId: string, editorState: string }
// Response: { id: string, name: string, editorState: string, userId: string, createdAt: string }[]
export async function POST(req: Request) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    const body = await req.json();
    let { noteId, editorState } = body;
    if (!editorState || !noteId) {
      return new NextResponse("Missing editorState or noteId", { status: 400 });
    }

    const note = await prisma.notes.findUnique({
      where: {
        id: noteId,
      },
    });

    // If note not found return 404
    if (!note) {
      return new NextResponse("Note not found", { status: 404 });
    }

    if (note.editorState !== editorState) {
      await prisma.notes.update({ data: { editorState }, where: { id: noteId } });
    }

    const notes = await prisma.notes.findMany({
      where: {
        userId: user?.id,
      },
    });

    return NextResponse.json(notes);
  } catch (error) {

    // Log the error
    console.error(error);
    return NextResponse.json({
      sucess: false,
      status: 500,
    });
  }
}
