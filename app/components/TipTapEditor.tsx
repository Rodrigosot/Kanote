"use client";
import React, { useEffect, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { Button } from "@/components/ui/button";
import TipTapMenuBar from "./TipTapMenuBar";
import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import { Notes } from "@prisma/client";
import { useDebounce } from "../lib/useDebounce";

type Props = {
  currentNote: Notes | null;
  notes: Notes[];
  setNotes: React.Dispatch<React.SetStateAction<Notes[]>>;
  setTempNotes: React.Dispatch<React.SetStateAction<Notes[]>>;
};

function TipTapEditor({ currentNote, notes, setNotes, setTempNotes }: Props) {
  const [editorState, setEditorState] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const debounceEditorState = useDebounce(editorState, 700);

  useEffect(() => {
    if (currentNote) {
      const updateNote = async () => {
        setIsLoading(true);
        const res = await fetch("/api/saveNote", {
          method: "POST",
          body: JSON.stringify({ noteId: currentNote.id, editorState: debounceEditorState }),
        });
        const data = (await res.json()) as Notes[];
        data.map((note) => (note.createdAt = new Date(note.createdAt)));
        setNotes(data);
        setTempNotes(data);
        setIsLoading(false);
      };

      updateNote();
    }
  }, [debounceEditorState]);

  useEffect(() => {
    if (currentNote) {
      console.log(currentNote.editorState);
      editor?.commands.setContent(currentNote.editorState);
      setEditorState(currentNote.editorState);
    } else {
      setEditorState("");
    }
  }, []);

  useEffect(() => {
    if (currentNote) {
      setEditorState(currentNote.editorState);
      editor?.commands.setContent(currentNote.editorState);
    }
  }, [currentNote]);

  const editor = useEditor({
    autofocus: true,
    extensions: [
      StarterKit,
      CodeBlockLowlight.configure({
        lowlight: createLowlight(common),
      }),
    ],
    content: currentNote?.editorState,
    onUpdate: ({ editor }) => {
      setEditorState(editor.getHTML());
    },
  });

  return (
    <div className="w-[55vw] p-5 overflow-auto scrollbar-none mx-auto border-stone-200 shadow-xl border rounded-lg px-16 py-8">
      {currentNote ? (
        <div>
          <div className="flex mb-5 justify-between">
            {editor && <TipTapMenuBar editor={editor!}></TipTapMenuBar>}
            {isLoading ? <Button disabled>Guardando...</Button> : <Button>Guardar</Button>}
          </div>
          <h1 className="mb-5 text-4xl font-bold">{currentNote ? currentNote.name : "xd"}</h1>
          <div className="prose">
            <EditorContent spellCheck="false" editor={editor}></EditorContent>
          </div>
        </div>
      ) : (
        <div className="justify-center flex text-center items-center h-full">
          <p className="text-3xl text-gray-500">No tienes notas aun</p>
        </div>
      )}
    </div>
  );
}

export default TipTapEditor;
