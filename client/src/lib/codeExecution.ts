import { Language } from "./codeExamples";

interface ExecutionResult {
  output: string;
  error?: string;
}

export async function executeCode(code: string, language: Language): Promise<ExecutionResult> {
  try {
    const response = await fetch("/api/execute", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code,
        language,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Failed to execute code");
    }

    return await response.json();
  } catch (error) {
    console.error("Error executing code:", error);
    return {
      output: "",
      error: error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}

export function parseUrlParams(): { language?: Language; code?: string } {
  if (typeof window === "undefined") return {};

  const params = new URLSearchParams(window.location.search);
  const codeParam = params.get("code");
  const languageParam = params.get("language") as Language | null;

  const result: { language?: Language; code?: string } = {};

  if (languageParam && ["javascript", "python", "java"].includes(languageParam)) {
    result.language = languageParam;
  }

  if (codeParam) {
    try {
      result.code = atob(codeParam);
    } catch (e) {
      console.error("Failed to decode code parameter:", e);
    }
  }

  return result;
}

export function generateShareUrl(code: string, language: Language): string {
  const baseUrl = window.location.origin;
  const encodedCode = btoa(code);
  return `${baseUrl}/?language=${language}&code=${encodedCode}`;
}
