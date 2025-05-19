import { useTheme } from "@/hooks/useTheme"; // Adjust this path if needed
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

interface ThemeToggleProps {
  isMobile?: boolean;
}

export function ThemeToggle({ isMobile }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  
  if (isMobile) {
    return (
      <Button
        variant="outline"
        className="w-full justify-start"
        onClick={toggleTheme}
      >
        {theme === "light" ? (
          <>
            <Moon className="mr-2 h-4 w-4" />
            Dark Mode
          </>
        ) : (
          <>
            <Sun className="mr-2 h-4 w-4" />
            Light Mode
          </>
        )}
      </Button>
    );
  }
  
  // Default desktop view
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
    </Button>
  );
}