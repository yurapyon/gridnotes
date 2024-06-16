import {
  useRef,
  KeyboardEvent,
  useState,
  SetStateAction,
  Dispatch,
  useCallback,
} from "react";

/*
export const useTextEditor_ = () => {
  const desiredCursor = useRef({ x: 0, y: 0 });
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const currentTextBuffer = useRef<TextBuffer | null>(null);

  const moveCursorX = useCallback((offset: number) => {
    setCursor((cursor) => {
      const newCursor = { ...cursor };

      if (!currentTextBuffer.current) return newCursor;
      const thisLine = currentTextBuffer.current.lines[desiredCursor.current.y];

      if (thisLine) {
        const newX = cursor.x + offset;
        desiredCursor.current.x = Math.max(Math.min(thisLine.length, newX), 0);
      } else {
        desiredCursor.current.x = 0;
      }
      newCursor.x = desiredCursor.current.x;
      return newCursor;
    });
  }, []);

  const setCurrentTextBuffer = (textBuffer: TextBuffer) => {
    currentTextBuffer.current = textBuffer;
    setCursor({ x: 0, y: 0 });
  };

  const onKeyDown = () => {};

  return {
    cursor,
    moveCursorX,
    onKeyDown,
    setCurrentTextBuffer,
  };
};


export type TextEditor = ReturnType<typeof useTextEditor_>;
*/

interface Cursor {
  x: number;
  y: number;
}

export interface TextBuffer {
  lines: string[];
}

export class TextEditor {
  _currentMode: Mode;
  _desiredCursor: Cursor;
  _cursor: Cursor;
  _currentTextBuffer: TextBuffer;
  _currentTextBufferUpdater: Dispatch<SetStateAction<TextBuffer>>;

  _onCursorMove: CursorMoveCallback;
  _onModeChange: ModeChangeCallback;
  _onTextBufferChange: TextBufferChangeCallback;

  constructor(options: TextEditorOptions) {
    this._currentMode = new NormalMode();
    this._desiredCursor = { x: 0, y: 0 };
    this._cursor = { x: 0, y: 0 };
    this._currentTextBuffer = { lines: [] };
    this._currentTextBufferUpdater = () => {};

    this._onCursorMove = options.onCursorMove;
    this._onModeChange = options.onModeChange;
    this._onTextBufferChange = options.onTextBufferChange;
  }

  onKeyDown(e: KeyboardEvent) {
    return this._currentMode.onKeyDown(this, e);
  }

  moveCursorX(offset: number) {
    const thisLine = this._currentTextBuffer.lines[this._desiredCursor.y];
    if (thisLine) {
      const newX = this._cursor.x + offset;
      this._desiredCursor.x = Math.max(Math.min(thisLine.length, newX), 0);
    } else {
      // TODO how to handle if a note has no lines
      this._desiredCursor.x = 0;
    }
    this._cursor.x = this._desiredCursor.x;
    this._onCursorMove(this._cursor);
  }

  moveCursorY(offset: number) {
    const newY = this._desiredCursor.y + offset;
    this._desiredCursor.y = Math.max(
      Math.min(newY, this._currentTextBuffer.lines.length - 1),
      0
    );
    this._cursor.y = this._desiredCursor.y;

    const thisLine = this._currentTextBuffer.lines[this._desiredCursor.y];
    if (thisLine) {
      this._cursor.x = Math.min(thisLine.length, this._desiredCursor.x);
    } else {
      // TODO how to handle if a note has no lines
      this._cursor.x = 0;
    }
    this._onCursorMove(this._cursor);
  }

  setMode(nextMode: Mode) {
    this._currentMode = nextMode;
    this._onModeChange(nextMode);
  }

  setCurrentTextBuffer(
    textBuffer: TextBuffer,
    textBufferUpdater: Dispatch<SetStateAction<TextBuffer>>
  ) {
    // TODO recalculate cursor
    this._currentTextBuffer = textBuffer;
    this._currentTextBufferUpdater = textBufferUpdater;
    // this._onTextBufferChange(this._currentTextBuffer);
  }

  insertAtCursor(text: string) {
    // TODO handle paste, esp newlines in paste
    this._currentTextBufferUpdater((textBuffer) => {
      const newTextBuffer = { ...textBuffer };
      const line = newTextBuffer.lines[this._cursor.y];
      const insertPoint = this._cursor.x;
      newTextBuffer.lines[this._cursor.y] =
        line.slice(0, insertPoint) + text + line.slice(insertPoint);
      return newTextBuffer;
    });

    // const line = this._currentTextBuffer.lines[this._cursor.y];
    // const insertPoint = this._cursor.x;
    // this._currentTextBuffer.lines[this._cursor.y] =
    // line.slice(0, insertPoint) + text + line.slice(insertPoint);
    // this._onTextBufferChange(this._currentTextBuffer);
  }
}

export class NormalMode {
  type: "normal" = "normal";
  onKeyDown(textEditor: TextEditor, e: KeyboardEvent) {
    let eventWasHandled = false;
    switch (e.key) {
      case "h":
        textEditor.moveCursorX(-1);
        eventWasHandled = true;
        break;
      case "j":
        textEditor.moveCursorY(1);
        eventWasHandled = true;
        break;
      case "k":
        textEditor.moveCursorY(-1);
        eventWasHandled = true;
        break;
      case "l":
        textEditor.moveCursorX(1);
        eventWasHandled = true;
        break;
      case "i":
        textEditor.setMode(new InsertMode());
        eventWasHandled = true;
        break;
    }
    return eventWasHandled;
  }
}

export class InsertMode {
  type: "insert" = "insert";
  onKeyDown(textEditor: TextEditor, e: KeyboardEvent) {
    let eventWasHandled = false;
    switch (e.key) {
      case "Escape":
        e.preventDefault();
        textEditor.setMode(new NormalMode());
        eventWasHandled = true;
        break;
      default:
        textEditor.insertAtCursor(e.key);
        eventWasHandled = true;
        break;
    }
    return eventWasHandled;
  }
}

export type Mode = NormalMode | InsertMode;

type CursorMoveCallback = (newCursor: Cursor) => void;
type ModeChangeCallback = (newMode: Mode) => void;
type TextBufferChangeCallback = (buffer: TextBuffer) => void;

interface TextEditorOptions {
  onCursorMove: CursorMoveCallback;
  onModeChange: ModeChangeCallback;
  onTextBufferChange: TextBufferChangeCallback;
}

export const useTextEditor = () => {
  const [cursor, setCursor_] = useState<Cursor>({ x: 0, y: 0 });
  const [mode, setMode_] = useState();

  const textEditor = useRef(
    new TextEditor({
      onCursorMove: (newCursor) => {
        setCursor_({ ...newCursor });
      },
      onModeChange: () => {
        setMode_(undefined);
      },
      onTextBufferChange: (buffer) => {
        // setLines_([...newLines]);
      },
    })
  );

  return {
    textEditor,
    cursor,
    mode,
    // text,
    // setText
  };
};

/*
export const TextEdit: React.FC<{
  editorActive: boolean;
  modeType: Mode["type"];
  setModeType: Dispatch<SetStateAction<Mode["type"]>>;
  value: string;
  onChange: ((newText: string) => void) | ((newText: string) => Promise<void>);
  onFocus: () => void;
  onBlur: () => void;
  onUnhandledEvent: (e: KeyboardEvent) => void;
  className?: string;
}> = ({
  editorActive,
  modeType,
  setModeType,
  value,
  onChange,
  onFocus,
  onBlur,
  onUnhandledEvent,
  className = "",
}) => {
  const [cursor, setCursor] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  const editor = useRef(
    new TextEditor({
      onCursorMove: (newCoords) => {
        setCursor(newCoords);
      },
      onModeChange: (nextMode) => {
        setModeType(nextMode.type);
      },
    })
  );

  useEffect(() => {
    let newMode: Mode;
    switch (modeType) {
      case "normal":
        newMode = new NormalMode();
        break;
      case "insert":
        newMode = new InsertMode();
        break;
    }
    editor.current.currentMode = newMode;
  }, [modeType]);

  useEffect(() => {
    editor.current.text = value;
  }, [value]);

  const lines = value.split("\n");

  return (
    <div
      className={[
        "relative  bg-blue-200 outline-none",
        modeType === "normal" ? "focus:bg-blue-300" : "focus:bg-green-300",
        className,
      ].join(" ")}
      style={{ height: lines.length * 1.5 + "em" }}
      onKeyDown={(e) => {
        const eventWasHandled = editor.current.onKeyDown(e);
        if (!eventWasHandled) {
          onUnhandledEvent(e);
        }
      }}
      tabIndex={0}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      {editorActive && (
        <div
          className={["absolute bg-black w-[1ch] h-[1.5em] opacity-25"].join(
            " "
          )}
          style={{ top: cursor.y * 1.5 + "em", left: cursor.x + "ch" }}
        />
      )}
      <div className="absolute top-0 left-0 w-full h-full">
        {lines.map((line, i) => {
          // TODO figure out how to make OSlevel text hl work nicely
          return (
            <div key={i} className="h-[1.5em]">
              {line !== "" ? line : <>&nbsp;</>}
            </div>
          );
        })}
      </div>
    </div>
  );
};
*/
