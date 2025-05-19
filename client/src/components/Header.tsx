import { useTheme } from "@/hooks/useTheme";
import { useFontSize } from "@/hooks/use-font-size";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Moon, Sun, Share, ALargeSmall, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface HeaderProps {
  onShare: () => void;
}

export function Header({ onShare }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const { fontSize, setFontSize } = useFontSize();
  const [fontMenuOpen, setFontMenuOpen] = useState(false);

  return (
    <header className="bg-white dark:bg-gray-800 shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="text-blue-500 text-2xl">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="16 18 22 12 16 6"></polyline>
              <polyline points="8 6 2 12 8 18"></polyline>
            </svg>
          </span>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">CodeLearn</h1>
        </div>

        {/* Desktop buttons - hidden on mobile */}
        <div className="hidden md:flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
          >
            {theme === "light" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>

          <DropdownMenu open={fontMenuOpen} onOpenChange={setFontMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Change font size"
              >
                <ALargeSmall className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setFontSize("sm")}>
                Small
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFontSize("md")}>
                Medium
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFontSize("lg")}>
                Large
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="outline"
            className="text-blue-700 bg-blue-100 hover:bg-blue-200 dark:text-blue-100 dark:bg-blue-800 dark:hover:bg-blue-700"
            onClick={onShare}
          >
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>

        {/* Mobile menu button - visible only on mobile */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>CodeLearn</SheetTitle>
              </SheetHeader>
              <div className="py-4 flex flex-col space-y-4">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={toggleTheme}
                >
                  {theme === "light" ? (
                    <>
                      <Moon className="h-4 w-4 mr-2" />
                      Dark Theme
                    </>
                  ) : (
                    <>
                      <Sun className="h-4 w-4 mr-2" />
                      Light Theme
                    </>
                  )}
                </Button>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Font Size</h3>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant={fontSize === "sm" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFontSize("sm")}
                    >
                      Small
                    </Button>
                    <Button
                      variant={fontSize === "md" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFontSize("md")}
                    >
                      Medium
                    </Button>
                    <Button
                      variant={fontSize === "lg" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFontSize("lg")}
                    >
                      Large
                    </Button>
                  </div>
                </div>

                <Button
                  className="w-full justify-start"
                  onClick={onShare}
                >
                  <Share className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}