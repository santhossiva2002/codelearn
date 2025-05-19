import { useState, useEffect } from "react";

type FontSize = "sm" | "md" | "lg";

export function useFontSize() {
  const [fontSize, setFontSize] = useState<FontSize>(
    () => (localStorage.getItem("fontSize") as FontSize) || "md"
  );

  useEffect(() => {
    localStorage.setItem("fontSize", fontSize);
  }, [fontSize]);

  return {
    fontSize,
    setFontSize,
  };
}
