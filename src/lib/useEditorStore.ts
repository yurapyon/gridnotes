import { create, createStore } from "zustand";
import { TextBuffer } from "./text-editor/TextEditor";

interface EditorState {
  textBuffers: Map<string, TextBuffer>;
  focusedNoteId: string | null;
}

interface EditorActions {
  setTextBuffers: (textBuffers: Map<string, TextBuffer>) => void;
  clearTextBuffers: () => void;
  updateTextBuffer: (id: string) => void;
  focusNote: (id: string | null) => void;
}

export type EditorStore = EditorState & EditorActions;

export const createEditorStore = () => {
  return createStore<EditorStore>()((set) => ({
    textBuffers: new Map(),
    focusedNoteId: null,
    setTextBuffers: (textBuffers: Map<string, TextBuffer>) => {
      set(() => ({ textBuffers }));
    },
    clearTextBuffers: () => {
      set(() => ({ textBuffers: new Map() }));
    },
    updateTextBuffer: (id: string) => {
      set((state) => {
        const newTextBuffers = new Map(state.textBuffers);

        const textBuffer = newTextBuffers.get(id);
        if (!textBuffer) return state;

        const newTextBuffer = { ...textBuffer, lines: [...textBuffer.lines] };
        newTextBuffer.lines?.push("aaaa");
        newTextBuffers.set(id, newTextBuffer);

        return { textBuffers: newTextBuffers };
      });
    },
    focusNote: (id: string | null) => {
      set(() => ({ focusedNoteId: id }));
    },
  }));
};
