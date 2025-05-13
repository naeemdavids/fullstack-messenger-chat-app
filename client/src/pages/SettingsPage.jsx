import React from "react";
import { THEMES } from "../themes";
import { useDaiseyUiThemeStore } from "../store/useDaiseyUiThemeStore.js";

//Settings page used to change the App color theme, uses DaiseyUi.
const SettingsPage = () => {
  const { theme, setTheme } = useDaiseyUiThemeStore();
  return (
    <div className="h-screen container mx-auto px-4 pt-20 max-w-5xl">
      <div className="space-y-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold">Theme</h2>
          <p className="text-sm text-base-content/70">Choose Interface Theme</p>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
          {THEMES.map((selectedTheme) => (
            <button
              key={selectedTheme}
              className={`group flex flex-col items-center gap-1.5 p-2 rounded-lg transition-colors cursor-pointer ${
                theme === selectedTheme ? "bg-base-300" : "hover:bg-base-200"
              }`}
              onClick={() => setTheme(selectedTheme)} // Change the app theme on selection.
            >
              <div
                className="relative h-8 w-full rounded-md overflow-hidden"
                data-theme={selectedTheme}
              >
                <div className="absolute inset-0 grid grid-cols-4 gap-px p-1">
                  <div className="rounded bg-primary"></div>
                  <div className="rounded bg-secondary"></div>
                  <div className="rounded bg-accent"></div>
                  <div className="rounded bg-neutral"></div>
                </div>
              </div>
              <span className="text-[11px] font-medium truncate w-full text-center">
                {selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1)}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
