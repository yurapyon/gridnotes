"use client";

import { EditorStore } from "@/lib/useEditorStore";
import { createEditorStore } from "@/lib/useEditorStore";
import { PropsWithChildren, createContext, useContext, useRef } from "react";
import { useStore } from "zustand";

type EditorStoreApi = ReturnType<typeof createEditorStore>;

const EditorStoreContext = createContext<EditorStoreApi | undefined>(undefined);

export const EditorStoreProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const storeRef = useRef<EditorStoreApi>();
  if (!storeRef.current) {
    storeRef.current = createEditorStore();
  }

  return (
    <EditorStoreContext.Provider value={storeRef.current}>
      {children}
    </EditorStoreContext.Provider>
  );
};

export const useEditorStore = <T,>(selector: (store: EditorStore) => T): T => {
  const counterStoreContext = useContext(EditorStoreContext);

  if (!counterStoreContext) {
    throw new Error(`useEditorStore must be used within EditorStoreProvider`);
  }

  return useStore(counterStoreContext, selector);
};
