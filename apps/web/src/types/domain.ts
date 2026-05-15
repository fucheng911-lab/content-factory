export interface Project {
  id: string;
  title: string;
  platform: string;
  contentType: string;
  audience: string;
  targetDuration: number;
  goal: string;
  rawIdea: string;
  notes: string;
  references: string;
  avoid: string;
  tone: string;
  enabledSkillIds: string[];
  draftScript: string;
  finalScript: string;
  status: "draft" | "generated" | "editing" | "final";
  currentVersion: number;
  createdAt: string;
  updatedAt: string;
}

export type CreateProjectData = Omit<
  Project,
  "id" | "enabledSkillIds" | "draftScript" | "finalScript" | "status" | "currentVersion" | "createdAt" | "updatedAt"
>;

export interface Skill {
  id: string;
  name: string;
  displayName: string;
  description: string;
  type: string;
  version: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface ScriptVersion {
  id: string;
  projectId: string;
  versionNumber: number;
  source: string;
  instruction: string;
  enabledSkillIds: string[];
  content: string;
  wordCount: number;
  isFinal: boolean;
  createdAt: string;
}
