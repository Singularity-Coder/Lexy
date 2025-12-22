
export type ExerciseType = 'multiple-choice' | 'audio-match' | 'video-lesson' | 'text-translate' | 'word-sort' | 'speech-check';

export type ProficiencyLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface Exercise {
  id: string;
  type: ExerciseType;
  question: string;
  options?: string[];
  answer: string;
  mediaPath?: string;
  explanation?: string;
  wordBank?: string[]; // For word-sort
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  exercises: Exercise[];
  status: 'locked' | 'available' | 'completed';
}

export interface Unit {
  id: string;
  title: string;
  color: string;
  lessons: Lesson[];
  level?: ProficiencyLevel; // Optional level tag for filtering
}

export interface CourseData {
  courseTitle: string;
  language: string;
  units: Unit[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  requirement: number;
  currentValue: number;
  unlocked: boolean;
}

export interface UserStats {
  xp: number;
  level: number; // XP based level
  proficiencyLevel: ProficiencyLevel; // Learning stage level (Beginner to Near-native)
  streak: number;
  hearts: number;
  gems: number;
  lastActiveDate: string;
  achievements: Achievement[];
  failedExercises: Exercise[]; // For the "Mistakes Review" feature
}
