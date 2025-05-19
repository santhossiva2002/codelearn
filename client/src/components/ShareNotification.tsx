import { useState, useEffect } from "react";
import { X, CheckCircle } from "lucide-react";

interface ShareNotificationProps {
  isVisible: boolean;
  onClose: () => void;
}

export function ShareNotification({ isVisible, onClose }: ShareNotificationProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <div
      className={`fixed bottom-0 right-0 m-4 z-50 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-4 py-3 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 transform transition-all duration-300 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <CheckCircle className="text-green-500 mr-2 h-5 w-5" />
          <p className="text-sm font-medium">Share link copied to clipboard!</p>
        </div>
        <button
          className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
