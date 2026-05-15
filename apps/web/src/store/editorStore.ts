import { create } from "zustand";
import { api } from "../services/api";
import type { ScriptVersion } from "../types/domain";

interface EditorState {
  content: string;
  selectedText: string;
  versions: ScriptVersion[];
  busy: boolean;
  setContent: (content: string) => void;
  setSelectedText: (text: string) => void;
  fetchVersions: (projectId: string) => Promise<void>;
  saveVersion: (projectId: string) => Promise<void>;
  saveFinal: (projectId: string) => Promise<void>;
  restoreVersion: (projectId: string, versionId: string) => Promise<string>;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  content: "",
  selectedText: "",
  versions: [],
  busy: false,
  setContent: (content) => set({ content }),
  setSelectedText: (selectedText) => set({ selectedText }),
  async fetchVersions(projectId) {
    const { versions } = await api.listVersions(projectId);
    set({ versions });
  },
  async saveVersion(projectId) {
    const version = await api.saveVersion(projectId, get().content);
    set({ versions: [version, ...get().versions] });
  },
  async saveFinal(projectId) {
    const version = await api.saveFinalScript(projectId, get().content);
    set({ versions: [version, ...get().versions] });
  },
  async restoreVersion(projectId, versionId) {
    const version = await api.restoreVersion(projectId, versionId);
    set({ content: version.content, versions: [version, ...get().versions] });
    return version.content;
  },
}));
