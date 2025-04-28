"use client";
import React, { useEffect, useState } from "react";
import SideBarNote from "./SideBarNote";
import TipTapEditor from "./TipTapEditor";
import type { Notes } from "@prisma/client";

type Props = {
  allNotes: Notes[];
  totalNotes: number;
};

function EditorNote({ allNotes, totalNotes }: Props) {
  const [currentNote, setCurrentNote] = useState<Notes | null>(allNotes[0]);
  const [notes, setNotes] = useState<Notes[]>(allNotes);
  const [tempNotes, setTempNotes] = useState<Notes[]>([]);

  return (
    <>
      <SideBarNote setTempNotes={setTempNotes} tempNotes={tempNotes} setCurrentNote={setCurrentNote} notes={notes} setNotes={setNotes}></SideBarNote>
      <TipTapEditor setTempNotes={setTempNotes} currentNote={currentNote} notes={notes} setNotes={setNotes}></TipTapEditor>
    </>
  );
}

export default EditorNote;
