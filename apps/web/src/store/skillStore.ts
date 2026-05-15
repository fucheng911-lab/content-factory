import { create } from "zustand";
import { api } from "../services/api";
import type { Skill } from "../types/domain";

interface SkillState {
  skills: Skill[];
  selectedSkill: Skill | null;
  error: string;
  fetchSkills: () => Promise<void>;
  uploadSkillFile: (file: File) => Promise<void>;
  previewSkill: (id: string) => Promise<void>;
  deleteSkill: (id: string) => Promise<void>;
}

export const useSkillStore = create<SkillState>((set, get) => ({
  skills: [],
  selectedSkill: null,
  error: "",
  async fetchSkills() {
    const { skills } = await api.listSkills();
    set({ skills, error: "" });
  },
  async uploadSkillFile(file) {
    const markdown = await file.text();
    await api.uploadSkill(markdown);
    await get().fetchSkills();
  },
  async previewSkill(id) {
    set({ selectedSkill: await api.getSkill(id) });
  },
  async deleteSkill(id) {
    await api.deleteSkill(id);
    set({ selectedSkill: null });
    await get().fetchSkills();
  },
}));
