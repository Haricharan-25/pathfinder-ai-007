export interface RoadmapResource {
  title: string;
  url: string;
  type: "video" | "docs" | "course";
}

export interface RoadmapStep {
  id: number;
  title: string;
  description: string;
  estimatedHours: number;
  resources: RoadmapResource[];
  skills: string[];
}

export interface Roadmap {
  title: string;
  totalWeeks: number;
  skillGapAnalysis: string;
  industryBenchmark: string;
  steps: RoadmapStep[];
}

export interface StepProgress {
  [stepId: number]: boolean;
}
