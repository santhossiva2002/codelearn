import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { LanguageTabs } from "@/components/LanguageTabs";
import { ActionBar } from "@/components/ActionBar";
import { EditorSection } from "@/components/EditorSection";
import { OutputSection } from "@/components/OutputSection";
import { Footer } from "@/components/Footer";
import { SaveFileModal } from "@/components/SaveFileModal";
import { LoadFileModal } from "@/components/LoadFileModal";
import { ShareNotification } from "@/components/ShareNotification";
import { RunTooltip } from "@/components/RunTooltip";
import { Language, getDefaultExample, getExampleById } from "@/lib/codeExamples";
import { executeCode, parseUrlParams, generateShareUrl } from "@/lib/codeExecution";
import { useCodeStorage } from "@/hooks/use-code-storage";

export default function Home() {
  const [language, setLanguage] = useState<Language>("javascript");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isLoadModalOpen, setIsLoadModalOpen] = useState(false);
  const [isShareNotificationVisible, setIsShareNotificationVisible] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  
  const { savedFiles, saveFile, deleteFile, getFileById } = useCodeStorage();

  // Load initial code example or from URL params
  useEffect(() => {
    // Check if this is first visit
    const hasVisitedBefore = localStorage.getItem("codeLearn-visited");
    if (!hasVisitedBefore) {
      localStorage.setItem("codeLearn-visited", "true");
    } else {
      setIsFirstVisit(false);
    }

    // Try to load from URL params
    const urlParams = parseUrlParams();
    
    if (urlParams.language && urlParams.code) {
      setLanguage(urlParams.language);
      setCode(urlParams.code);
    } else {
      // Load default example
      const defaultExample = getDefaultExample("javascript");
      setCode(defaultExample.code);
    }
  }, []);

  const handleLanguageChange = (newLanguage: Language) => {
    // If empty code or just switched to the language, load default example for that language
    if (code.trim() === "" || language !== newLanguage) {
      const defaultExample = getDefaultExample(newLanguage);
      setCode(defaultExample.code);
    }
    setLanguage(newLanguage);
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput("Running...");
    
    try {
      const result = await executeCode(code, language);
      
      if (result.error) {
        setOutput(`Error: ${result.error}`);
      } else {
        setOutput(result.output);
      }
    } catch (error) {
      setOutput(`Error: ${error instanceof Error ? error.message : "An unknown error occurred"}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleNewFile = () => {
    setCode("");
  };

  const handleSaveFile = () => {
    setIsSaveModalOpen(true);
  };

  const handleSaveFileSubmit = (fileName: string) => {
    saveFile(fileName, language, code);
    setIsSaveModalOpen(false);
  };

  const handleLoadFile = () => {
    setIsLoadModalOpen(true);
  };

  const handleLoadSavedFile = (fileId: string) => {
    const file = getFileById(fileId);
    if (file) {
      setLanguage(file.language as Language);
      setCode(file.code);
      setIsLoadModalOpen(false);
    }
  };

  const handleDeleteSavedFile = (fileId: string) => {
    deleteFile(fileId);
  };

  const handleLoadExample = (exampleId: string) => {
    const example = getExampleById(exampleId);
    if (example) {
      setLanguage(example.language);
      setCode(example.code);
    }
  };

  const handleShare = () => {
    const shareUrl = generateShareUrl(code, language);
    
    // Copy to clipboard
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        setIsShareNotificationVisible(true);
      })
      .catch(err => {
        console.error("Failed to copy share URL:", err);
      });
  };

  const handleClearOutput = () => {
    setOutput("");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header onShare={handleShare} />
      
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <LanguageTabs
          currentLanguage={language}
          onLanguageChange={handleLanguageChange}
        />
        
        <ActionBar
          onRun={handleRunCode}
          onNewFile={handleNewFile}
          onSaveFile={handleSaveFile}
          onLoadFile={handleLoadFile}
          onLoadExample={handleLoadExample}
          isRunning={isRunning}
          currentLanguage={language}
        />
        
        <EditorSection
          language={language}
          code={code}
          onChange={setCode}
        />
        
        <OutputSection
          output={output}
          onClear={handleClearOutput}
        />
      </main>
      
      <Footer />
      
      <SaveFileModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        onSave={handleSaveFileSubmit}
        language={language}
      />
      
      <LoadFileModal
        isOpen={isLoadModalOpen}
        onClose={() => setIsLoadModalOpen(false)}
        onLoad={handleLoadSavedFile}
        onDelete={handleDeleteSavedFile}
        savedFiles={savedFiles}
      />
      
      <ShareNotification
        isVisible={isShareNotificationVisible}
        onClose={() => setIsShareNotificationVisible(false)}
      />
      
      <RunTooltip isFirstVisit={isFirstVisit} />
    </div>
  );
}
