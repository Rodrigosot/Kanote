"use client";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import type { Notes } from "@prisma/client";
import NoteDialog from "./NoteDialog";
import { ContextMenu, ContextMenuItem, ContextMenuShortcut, ContextMenuTrigger, ContextMenuContent } from "@/components/ui/context-menu";

type props = {
  setCurrentNote: React.Dispatch<React.SetStateAction<Notes | null>>;
  notes: Notes[];
  setNotes: React.Dispatch<React.SetStateAction<Notes[]>>;
  setTempNotes: React.Dispatch<React.SetStateAction<Notes[]>>;
  tempNotes: Notes[];
};

function SideBarNote({ setCurrentNote, notes, setNotes, setTempNotes, tempNotes }: props) {
  const [hydrationLoad, setHydrationLoad] = useState(true);
  const [notesSearch, setNotesSearch] = useState<Notes[]>(notes);

  const deleteNote = async (noteId: string) => {
    const res = await fetch("/api/deleteNote", {
      method: "POST",
      body: JSON.stringify({ noteId }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = (await res.json()) as Notes[];
    data.map((data) => (data.createdAt = new Date(data.createdAt)));
    setNotes(data);

    if (data.length > 0) {
      setCurrentNote(notes[0]);
    } else {
      console.log("BRRR");
      setCurrentNote(null);
    }
  };

  const handleSearch = (term: string) => {
    console.log(term);
    if (term === "") {
      console.log(notesSearch);
      setNotes(tempNotes);
      return;
    }

    const notasCoincidentes = tempNotes.filter((nota) => nota.name.toLowerCase().includes(term.toLowerCase()));
    setNotes(notasCoincidentes);
  };

  useEffect(() => {
    setHydrationLoad(false);
    setNotesSearch(notes);
  }, []);

  if (hydrationLoad) return <div className="flex flex-col w-[20vw] overflow-auto scrollbar-none min-w-48 border-stone-200 shadow-xl border rounded-lg mr-2"></div>;

  const obtenerTextoHTML = (htmlString: string) => {
    let temporalDiv = document.createElement("div");
    temporalDiv.innerHTML = htmlString;
    return temporalDiv.textContent || temporalDiv.innerText || "";
  };

  return (
    <div className="flex flex-col w-[20vw] overflow-auto scrollbar-none min-w-48 border-stone-200 shadow-xl border rounded-lg mr-2">
      <div className="px-6 py-5">
        <div className="flex justify-between items-center">
          <p className="text-xl">General</p>
          <p className="text-sm">{notes.length} notes</p>
        </div>

        <Input onChange={(e) => handleSearch(e.target.value)} type="text" placeholder="Buscar nota..." className="mb-3"></Input>
        <NoteDialog setNotes={setNotes} notes={notes} setCurrentNote={setCurrentNote} setTempNotes={setTempNotes} />

        <div className="h-8"></div>
        {notes.map((note) => (
          <ContextMenu key={note.id}>
            <ContextMenuTrigger>
              <div className="flex flex-col w-full h-[100px] border-2 p-3 mb-2 hover:shadow-xl transition hover:-translate-y-1 cursor-pointer max-xl:p-2" onClick={() => setCurrentNote(note)}>
                <div className="mb-2">
                  <div className="flex justify-between flex-row max-lg:flex-col">
                    <div className="flex items-center max-sm:mb-1">
                      <div className="rounded-full bg-primary w-3 h-3"></div>
                      <div className="w-3"></div>
                      <p className="text-xs">General</p>
                    </div>

                    <p className="text-xs ">{note.createdAt.toDateString()}</p>
                  </div>
                  <h2 className="font-bold overflow-hidden whitespace-nowrap text-ellipsis">{note.name}</h2>
                  <p className="text-muted-foreground overflow-hidden whitespace-nowrap text-ellipsis">{obtenerTextoHTML(note.editorState)}</p>
                </div>
              </div>
            </ContextMenuTrigger>
            <ContextMenuContent className="w-32">
              <ContextMenuItem inset onClick={() => deleteNote(note.id)}>
                Eliminar
                <ContextMenuShortcut>⌘P</ContextMenuShortcut>
              </ContextMenuItem>
              <ContextMenuItem inset>
                Editar
                <ContextMenuShortcut>⌘</ContextMenuShortcut>
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        ))}
      </div>
    </div>
  );
}

export default SideBarNote;
