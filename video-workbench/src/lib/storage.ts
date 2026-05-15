import type { VideoProject } from "./types";

const STORAGE_KEY = "video-workbench-project";

export function saveProject(project: VideoProject) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
}

export function loadProject(): VideoProject | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as VideoProject;
  } catch {
    return null;
  }
}
