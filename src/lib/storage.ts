import { StepProgress } from "@/types/roadmap";

const STORAGE_KEY = "career-roadmap-progress";

export function loadProgress(careerKey: string): StepProgress {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY}-${careerKey}`);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveProgress(careerKey: string, progress: StepProgress) {
  localStorage.setItem(`${STORAGE_KEY}-${careerKey}`, JSON.stringify(progress));
}

export function getCareerKey(career: string, level: string): string {
  return `${career.toLowerCase().replace(/\s+/g, "-")}-${level.toLowerCase()}`;
}
