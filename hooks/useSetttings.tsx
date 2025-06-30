import { create } from "zustand";

type SettingsStore = {
  settingsOpen: boolean
  onOpen: () => void
  onClose: () => void
}

export const useSettingsStore = create<SettingsStore>((set) => {
  return {
    settingsOpen: false,
    onOpen: () => set({ settingsOpen: true }),
    onClose: () => set({ settingsOpen: false }),
  }
})