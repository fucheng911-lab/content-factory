import { create } from "zustand";
import { api } from "../services/api";
import type { CreateProjectData, Project } from "../types/domain";

interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  loading: boolean;
  error: string;
  fetchProjects: () => Promise<void>;
  fetchProject: (id: string) => Promise<Project>;
  createProject: (data: CreateProjectData) => Promise<Project>;
  updateProject: (id: string, data: Partial<Project>) => Promise<Project>;
  deleteProject: (id: string) => Promise<void>;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  currentProject: null,
  loading: false,
  error: "",
  async fetchProjects() {
    set({ loading: true, error: "" });
    try {
      const { projects } = await api.listProjects();
      set({ projects, loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "加载项目失败", loading: false });
    }
  },
  async fetchProject(id) {
    const project = await api.getProject(id);
    set({ currentProject: project });
    return project;
  },
  async createProject(data) {
    const project = await api.createProject(data);
    set({ projects: [project, ...get().projects], currentProject: project });
    return project;
  },
  async updateProject(id, data) {
    const project = await api.updateProject(id, data);
    set({
      currentProject: get().currentProject?.id === id ? project : get().currentProject,
      projects: get().projects.map((item) => (item.id === id ? project : item)),
    });
    return project;
  },
  async deleteProject(id) {
    await api.deleteProject(id);
    set({ projects: get().projects.filter((project) => project.id !== id) });
  },
}));
