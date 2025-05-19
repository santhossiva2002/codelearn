import { useEffect, useRef } from "react";
import * as monaco from "monaco-editor";
import { useFontSize } from "@/hooks/use-font-size";
import { Language } from "@/lib/codeExamples";

interface EditorSectionProps {
  language: Language;
  code: string;
  onChange: (value: string) => void;
}

export function EditorSection({ language, code, onChange }: EditorSectionProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const monacoEditorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const { fontSize } = useFontSize();

  // Get Monaco language ID
  const getLanguageId = (lang: Language): string => {
    switch (lang) {
      case "javascript":
        return "javascript";
      case "python":
        return "python";
      case "java":
        return "java";
      default:
        return "javascript";
    }
  };

  useEffect(() => {
    if (editorRef.current) {
      if (monacoEditorRef.current) {
        monacoEditorRef.current.dispose();
      }

      monacoEditorRef.current = monaco.editor.create(editorRef.current, {
        value: code,
        language: getLanguageId(language),
        theme: document.documentElement.classList.contains("dark") ? "vs-dark" : "vs",
        automaticLayout: true,
        minimap: {
          enabled: false,
        },
        scrollBeyondLastLine: false,
        fontSize: fontSize === "sm" ? 13 : fontSize === "md" ? 15 : 17,
        fontFamily: "'JetBrains Mono', monospace",
        lineNumbers: "on",
        roundedSelection: true,
        scrollbar: {
          useShadows: false,
          verticalHasArrows: false,
          horizontalHasArrows: false,
          vertical: "visible",
          horizontal: "visible",
          verticalScrollbarSize: 12,
          horizontalScrollbarSize: 12,
        },
      });

      monacoEditorRef.current.onDidChangeModelContent(() => {
        onChange(monacoEditorRef.current?.getValue() || "");
      });

      return () => {
        monacoEditorRef.current?.dispose();
      };
    }
  }, [editorRef, language, fontSize]);

  // Update editor content if code prop changes from outside
  useEffect(() => {
    if (monacoEditorRef.current) {
      const currentValue = monacoEditorRef.current.getValue();
      if (currentValue !== code) {
        monacoEditorRef.current.setValue(code);
      }
    }
  }, [code]);

  // Update editor language if language prop changes
  useEffect(() => {
    if (monacoEditorRef.current) {
      monaco.editor.setModelLanguage(
        monacoEditorRef.current.getModel()!,
        getLanguageId(language)
      );
    }
  }, [language]);

  // Update editor theme when theme changes
  useEffect(() => {
    const handleThemeChange = () => {
      if (monacoEditorRef.current) {
        monaco.editor.setTheme(
          document.documentElement.classList.contains("dark") ? "vs-dark" : "vs"
        );
      }
    };

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.attributeName === "class" &&
          mutation.target === document.documentElement
        ) {
          handleThemeChange();
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="bg-white dark:bg-[var(--editor-dark)] border border-gray-300 dark:border-[var(--editor-dark-border)] rounded-lg shadow-sm overflow-hidden mb-4">
      <div ref={editorRef} className="editor-container monaco-editor-container" />
    </div>
  );
}
