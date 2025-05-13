import { create } from "zustand";

// Manage the theme state and persist the user preference in local storage.
// This enables the interface theme to be remembered across sessions.
export const useDaiseyUiThemeStore = create((set) => ({
  theme: localStorage.getItem("messenger-theme") || "night",
  setTheme: (theme) => {
    localStorage.getItem("messenger-theme", theme);
    set({ theme });
  },
}));
