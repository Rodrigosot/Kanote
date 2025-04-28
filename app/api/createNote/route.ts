import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { NextResponse } from 'next/server';
import prisma from '@/app/lib/db';
import { Notes } from '@prisma/client';

// POST /api/createNote
// Create a new note return the note created
// getKindeServerSession() is a helper function to get the user session
// Body: { name: string }
// Response: { id: string, name: string, editorState: string, userId: string, createdAt: string }
// application/json { name: "My new note" } => { id: "1", name: "My new note", editorState: "", userId: "1", createdAt: "2021-10-10T10:10:10.000Z" }

export async function POST(req: Request) {
	const { getUser } = getKindeServerSession();
	const user = await getUser();
	if (!user) {
		return new Response('Unauthorized', { status: 401 });
	}

	const body = await req.json();
	const { name } = body;

	const note = (await prisma.notes.create({
		data: {
			name: name,
			editorState: '',
			userId: user.id,
		},
		select: {
			createdAt: true,
			id: true,
			name: true,
			editorState: true,
			userId: true,
		},
	})) as Notes;

	return NextResponse.json(note);
}
