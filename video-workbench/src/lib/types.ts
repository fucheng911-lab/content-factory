export type ProjectInput = {
  title: string;
  idea: string;
  platform: string;
  duration: number;
  tone: string;
};

export type ChapterRow = {
  chapter: string;
  estimatedTime: string;
  purpose: string;
  voiceover: string;
  subtitle: string;
  visualBeat: string;
  assetNeed: string;
  transition: string;
};

export type StoryboardRow = {
  scene: string;
  start: number;
  duration: number;
  chapter: string;
  voiceover: string;
  text: string;
  visualJob: string;
  layoutState: string;
  assetNeed: string;
  motion: string;
  transition: string;
  audio: string;
};

export type TimedStoryboardRow = {
  scene: string;
  start: number;
  end: number;
  duration: number;
  recordingLine: string;
  subtitle: string;
  visualJob: string;
  layoutState: string;
  assetIds: string;
  motion: string;
  transition: string;
  notes: string;
};

export type AssetRow = {
  id: string;
  chapter: string;
  type: "image" | "video" | "audio" | "graphic" | "screenshot";
  status: "needed" | "found" | "downloaded" | "generated" | "user-supplied" | "blocked" | "replace";
  visualJob: string;
  description: string;
  sourceUrl: string;
  licenseNote: string;
  localPath: string;
  crop: string;
  fallbackPrompt: string;
};

export type VideoProject = {
  id: string;
  title: string;
  createdAt: string;
  input: ProjectInput;
  corePromise: string;
  spokenScript: string;
  subtitleLines: string;
  reviewNotes: string;
  chapterRows: ChapterRow[];
  storyboardRows: StoryboardRow[];
  timedStoryboardRows: TimedStoryboardRow[];
  assetRows: AssetRow[];
  designDoc: string;
  productionBrief: string;
  recording?: {
    name: string;
    duration: number;
    type: string;
  };
  recordingTranscript?: string;
};
