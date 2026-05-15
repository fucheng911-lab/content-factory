import type { CreateProjectData, Project, ScriptVersion, Skill } from "../types/domain";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: { message: string };
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`/api${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  const json = (await response.json().catch(() => null)) as ApiResponse<T> | null;
  if (!response.ok || !json?.success) {
    throw new Error(json?.error?.message || `请求失败：HTTP ${response.status}`);
  }
  return json.data;
}

export const api = {
  listProjects: () => request<{ projects: Project[] }>("/projects"),
  createProject: (data: CreateProjectData) =>
    request<Project>("/projects", { method: "POST", body: JSON.stringify(data) }),
  getProject: (id: string) => request<Project>(`/projects/${id}`),
  updateProject: (id: string, data: Partial<Project>) =>
    request<Project>(`/projects/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteProject: (id: string) => request<{ deleted: boolean }>(`/projects/${id}`, { method: "DELETE" }),

  listSkills: () => request<{ skills: Skill[] }>("/skills"),
  getSkill: (id: string) => request<Skill>(`/skills/${id}`),
  uploadSkill: (markdown: string) =>
    request<Skill>("/skills", { method: "POST", body: JSON.stringify({ markdown }) }),
  deleteSkill: (id: string) => request<{ deleted: boolean }>(`/skills/${id}`, { method: "DELETE" }),

  listVersions: (projectId: string) => request<{ versions: ScriptVersion[] }>(`/projects/${projectId}/versions`),
  saveVersion: (projectId: string, content: string, instruction = "手动保存") =>
    request<ScriptVersion>(`/projects/${projectId}/versions`, {
      method: "POST",
      body: JSON.stringify({ source: "user-save", instruction, content }),
    }),
  restoreVersion: (projectId: string, versionId: string) =>
    request<ScriptVersion>(`/projects/${projectId}/versions/${versionId}/restore`, { method: "POST" }),
  saveFinalScript: (projectId: string, content: string) =>
    request<ScriptVersion>(`/projects/${projectId}/final-script`, {
      method: "POST",
      body: JSON.stringify({ content }),
    }),

  generateScript: (projectId: string, instruction?: string) =>
    request<{ content: string; version: ScriptVersion }>(`/projects/${projectId}/generate-script`, {
      method: "POST",
      body: JSON.stringify({ instruction }),
    }),
  rewriteFull: (projectId: string, currentScript: string, instruction: string) =>
    request<{ content: string; version: ScriptVersion }>(`/projects/${projectId}/rewrite-full`, {
      method: "POST",
      body: JSON.stringify({ currentScript, instruction }),
    }),
  rewriteSelection: (projectId: string, currentScript: string, selectedText: string, instruction: string) =>
    request<{ content: string; version: ScriptVersion }>(`/projects/${projectId}/rewrite-selection`, {
      method: "POST",
      body: JSON.stringify({ currentScript, selectedText, instruction }),
    }),
};
