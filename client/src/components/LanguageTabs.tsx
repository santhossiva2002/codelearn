import { Language } from "@/lib/codeExamples";

interface LanguageTabsProps {
  currentLanguage: Language;
  onLanguageChange: (language: Language) => void;
}

export function LanguageTabs({ currentLanguage, onLanguageChange }: LanguageTabsProps) {
  const languages: { id: Language; name: string }[] = [
    { id: "javascript", name: "JavaScript" },
    { id: "python", name: "Python" },
    { id: "java", name: "Java" },
  ];

  return (
    <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
      <ul className="flex flex-wrap -mb-px">
        {languages.map((language) => (
          <li className="mr-2" key={language.id}>
            <button
              className={`inline-block py-2 px-4 text-sm font-medium text-center rounded-t-lg border-b-2 ${
                currentLanguage === language.id
                  ? "text-blue-600 border-blue-600"
                  : "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
              }`}
              onClick={() => onLanguageChange(language.id)}
            >
              {language.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
