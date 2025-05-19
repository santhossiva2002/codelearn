import { useState } from "react";
import { Check, FileType, Code, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Language } from "@/types";

interface LanguageSelectorProps {
  selectedLanguage: Language;
  onLanguageChange: (language: Language) => void;
}

export function LanguageSelector({ selectedLanguage, onLanguageChange }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleSelect = (language: Language) => {
    onLanguageChange(language);
    setIsOpen(false);
  };
  
  // Language options with icons and colors
  const languages = [
    { id: "javascript", name: "JavaScript", icon: <Code className="h-4 w-4" />, color: "text-yellow-500" },
    { id: "python", name: "Python", icon: <FileType className="h-4 w-4" />, color: "text-blue-500" },
    { id: "java", name: "Java", icon: <Coffee className="h-4 w-4" />, color: "text-red-500" }
  ];
  
  const selectedLang = languages.find(lang => lang.id === selectedLanguage);
  
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="inline-flex items-center px-3 py-2 text-sm"
        >
          <span className={`mr-2 ${selectedLang?.color}`}>{selectedLang?.icon}</span>
          <span>{selectedLang?.name}</span>
          <span className="ml-2">▼</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.id}
            onClick={() => handleSelect(language.id as Language)}
            className="flex items-center"
          >
            <span className={`mr-2 ${language.color}`}>{language.icon}</span>
            <span>{language.name}</span>
            {selectedLanguage === language.id && (
              <Check className="h-4 w-4 ml-2" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
