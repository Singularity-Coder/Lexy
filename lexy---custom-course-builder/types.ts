
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
  wordBank?: string[]; 
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
  level?: ProficiencyLevel;
}

export interface AlphabetItem {
  id: string;
  character: string;
  phonetic?: string;
  audioUrl?: string; // base64
}

export interface DictionaryEntry {
  id: string;
  word: string;
  translation: string;
  definition?: string;
  example?: string;
  isPhrase?: boolean;
}

export interface GrammarLesson {
  id: string;
  title: string;
  content: string;
  examples: string[];
}

export interface BookRecommendation {
  id: string;
  title: string;
  author: string;
  description: string;
  imageUrl: string;
  buyUrl?: string;
  level: string;
}

export interface CultureAsset {
  type: 'video' | 'audio' | 'pdf' | 'image' | 'youtube' | 'link';
  value: string; // URL or Base64 data string
  name: string;
}

export interface CultureItem {
  id: string;
  title: string;
  subtitle?: string;
  category: 'Famous people' | 'Art & Masterpieces' | 'Books' | 'Movies & TV series' | 'Music & Artists' | 'Folklore & Traditions' | 'Icons & Landmarks' | 'Religion & Beliefs' | 'Festivals';
  description: string;
  assets?: CultureAsset[];
  thumbnailUrl: string;
  type?: 'video' | 'audio' | 'pdf' | 'image' | 'youtube' | 'link';
  mediaUrl?: string;
  platform?: string;
}

export interface CourseData {
  id: string;
  courseTitle: string;
  language: string;
  units: Unit[];
  alphabet?: AlphabetItem[];
  dictionary?: DictionaryEntry[];
  grammar?: GrammarLesson[];
  books?: BookRecommendation[];
  cultureItems?: CultureItem[];
  aiCharacters?: AICharacter[];
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

export interface NotificationSettings {
  remindersEnabled: boolean;
  reminderTime: string;
  soundEnabled: boolean;
  motivationalAlerts: boolean;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

export interface AICharacter {
  id: string;
  name: string;
  avatar: string;
  role: string;
  description: string;
  personality: string;
}

export interface UserStats {
  xp: number;
  level: number;
  proficiencyLevel: ProficiencyLevel;
  streak: number;
  hearts: number;
  gems: number;
  lastActiveDate: string;
  achievements: Achievement[];
  failedExercises: Exercise[];
  savedWordIds: Record<string, string[]>; // Map of language -> array of word IDs
  currentCourseId: string;
  selectedMascotId: string;
  brandFont: string;
  notifications: NotificationSettings;
  lessonsCompleted: number;
  totalTimeMinutes: number;
  accuracy: number; // percentage
  perfectLessons: number;
}

export type ViewType = 'home' | 'settings' | 'profile' | 'vocabulary' | 'review' | 'writing' | 'culture' | 'grammar' | 'games' | 'search' | 'notifications' | 'my-lists' | 'ai-chats' | 'course-builder';
