import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Type } from "lucide-react";
import { FontSize } from "@/types";

interface FontSizeSelectorProps {
  fontSize: FontSize;
  onFontSizeChange: (size: FontSize) => void;
}

export function FontSizeSelector({ fontSize, onFontSizeChange }: FontSizeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleSelect = (size: FontSize) => {
    onFontSizeChange(size);
    setIsOpen(false);
  };
  
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Type className="h-[1.2rem] w-[1.2rem]" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          onClick={() => handleSelect("small")}
          className={fontSize === "small" ? "bg-secondary" : ""}
        >
          Small
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleSelect("medium")}
          className={fontSize === "medium" ? "bg-secondary" : ""}
        >
          Medium
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleSelect("large")}
          className={fontSize === "large" ? "bg-secondary" : ""}
        >
          Large
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
