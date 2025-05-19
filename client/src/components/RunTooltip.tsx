import { useState, useEffect } from "react";

interface RunTooltipProps {
  isFirstVisit: boolean;
}

export function RunTooltip({ isFirstVisit }: RunTooltipProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isFirstVisit) {
      const timer = setTimeout(() => {
        setVisible(true);
      }, 1000);

      const hideTimer = setTimeout(() => {
        setVisible(false);
      }, 4000);

      return () => {
        clearTimeout(timer);
        clearTimeout(hideTimer);
      };
    }
  }, [isFirstVisit]);

  if (!isFirstVisit) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50" aria-hidden="true">
      <div
        className={`absolute bg-gray-800 text-white px-3 py-1.5 rounded shadow-lg text-sm pointer-events-none transition-opacity duration-200 transform translate-x-1/2 arrow-top ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        style={{ bottom: "110px", right: "50%" }}
      >
        Click to run your code and see the results
      </div>
    </div>
  );
}
