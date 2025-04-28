import EditorNote from "@/app/components/EditorNote";
import React from "react";
import prisma from "@/app/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

async function Home() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  const totalNotes = await prisma.notes.count({});
  const notes = await prisma.notes.findMany({
    where: {
      userId: user?.id,
    },
    select: {
      id: true,
      name: true,
      editorState: true,
      createdAt: true,
      userId: true,
    },
  });

  return (
    <div>
      <div className="flex w-full h-[93vh]">
        <EditorNote allNotes={notes} totalNotes={totalNotes}></EditorNote>
      </div>
    </div>
  );
}

export default Home;
