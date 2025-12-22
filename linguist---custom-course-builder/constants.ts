
import { CourseData, ProficiencyLevel } from './types';

export const COLORS = {
  primary: '#58cc02',
  primaryDark: '#46a302',
  secondary: '#1cb0f6',
  accent: '#ffc800',
  error: '#ff4b4b',
  text: '#4b4b4b',
  border: '#e5e5e5',
};

export const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export interface LevelInfo {
  level: ProficiencyLevel;
  name: string;
  description: string;
  imageUrl: string;
}

export const PROFICIENCY_LEVELS: LevelInfo[] = [
  {
    level: 1,
    name: 'Beginner',
    description: 'Recognize words',
    imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=400&auto=format&fit=crop'
  },
  {
    level: 2,
    name: 'Survival',
    description: 'Get by',
    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=400&auto=format&fit=crop'
  },
  {
    level: 3,
    name: 'Functional',
    description: 'Work/study',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=400&auto=format&fit=crop'
  },
  {
    level: 4,
    name: 'Professional',
    description: 'Argue, explain',
    imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=400&auto=format&fit=crop'
  },
  {
    level: 5,
    name: 'Academic',
    description: 'Analyze & write',
    imageUrl: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=400&auto=format&fit=crop'
  },
  {
    level: 6,
    name: 'Near-native',
    description: 'Think in language',
    imageUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=400&auto=format&fit=crop'
  }
];

export const DUMMY_COURSE: CourseData = {
  courseTitle: "English Mastery",
  language: "English",
  units: [
    {
      id: "unit-1",
      title: "Essential Greetings",
      color: "bg-[#58cc02]",
      level: 1,
      lessons: [
        {
          id: "lesson-1",
          title: "First Encounters",
          description: "Learn basic greetings",
          status: 'available',
          exercises: [
            {
              id: "ex-1",
              type: "multiple-choice",
              question: "How do you say 'Hello'?",
              options: ["Hello", "Goodbye", "Thank you", "Please"],
              answer: "Hello"
            },
            {
              id: "ex-2",
              type: "word-sort",
              question: "Assemble the sentence: 'Hello, how are you?'",
              wordBank: ["Hello,", "how", "are", "you?", "goodbye"],
              answer: "Hello, how are you?"
            }
          ]
        }
      ]
    },
    {
      id: "unit-2",
      title: "The Marketplace",
      color: "bg-[#1cb0f6]",
      level: 2,
      lessons: [
        {
          id: "lesson-3",
          title: "Buying Groceries",
          description: "Basic shopping phrases",
          status: 'locked',
          exercises: []
        }
      ]
    },
    {
      id: "unit-3",
      title: "Office Basics",
      color: "bg-[#ce82ff]",
      level: 3,
      lessons: [
        {
          id: "lesson-4",
          title: "Meeting Colleagues",
          description: "Professional introductions",
          status: 'locked',
          exercises: []
        }
      ]
    },
    {
      id: "unit-4",
      title: "Business Negotiations",
      color: "bg-[#ff9600]",
      level: 4,
      lessons: [
        {
          id: "lesson-5",
          title: "Pitching Ideas",
          description: "Advanced persuasive language",
          status: 'locked',
          exercises: []
        }
      ]
    },
    {
      id: "unit-5",
      title: "Research Ethics",
      color: "bg-[#4b4b4b]",
      level: 5,
      lessons: [
        {
          id: "lesson-6",
          title: "Critical Analysis",
          description: "Writing formal abstracts",
          status: 'locked',
          exercises: []
        }
      ]
    },
    {
      id: "unit-6",
      title: "Deep Philosophy",
      color: "bg-[#1cb0f6]",
      level: 6,
      lessons: [
        {
          id: "lesson-7",
          title: "Inner Monologue",
          description: "Thinking naturally in the target language",
          status: 'locked',
          exercises: []
        }
      ]
    }
  ]
};
