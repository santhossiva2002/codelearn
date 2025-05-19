import { useState, useEffect } from "react";
import { AlertCircle, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function NewUserTooltip() {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Check if tip was previously dismissed
    const tipDismissed = localStorage.getItem('tipDismissed') === 'true';
    if (!tipDismissed) {
      // Show tip after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, []);
  
  const handleDismiss = () => {
    localStorage.setItem('tipDismissed', 'true');
    setIsVisible(false);
  };
  
  const handleClose = () => {
    setIsVisible(false);
  };
  
  if (!isVisible) return null;
  
  return (
    <div className="fixed bottom-4 right-4 max-w-xs z-50 animate-fadeIn">
      <Card className="border-primary-100">
        <CardHeader className="pb-2">
          <div className="flex justify-between">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
              <CardTitle className="text-sm">Quick Tip</CardTitle>
            </div>
            <Button variant="ghost" size="icon" onClick={handleClose} className="h-6 w-6">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription>
            Click the <strong>Run</strong> button to execute your code and see the results in the console below.
          </CardDescription>
        </CardContent>
        <CardFooter>
          <Button 
            variant="link" 
            size="sm" 
            onClick={handleDismiss}
            className="text-primary-600 p-0 h-auto"
          >
            Got it
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
