
import { CourseData, ProficiencyLevel, CultureItem, Lesson } from './types';

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
    imageUrl: 'global/1_beginner.png'
  },
  {
    level: 2,
    name: 'Survival',
    description: 'Get by',
    imageUrl: 'global/2_survival.png'
  },
  {
    level: 3,
    name: 'Functional',
    description: 'Work/study',
    imageUrl: 'global/3_functional.png'
  },
  {
    level: 4,
    name: 'Professional',
    description: 'Argue, explain',
    imageUrl: 'global/4_professional.png'
  },
  {
    level: 5,
    name: 'Academic',
    description: 'Analyze & write',
    imageUrl: 'global/5_academic.png'
  },
  {
    level: 6,
    name: 'Near-native',
    description: 'Think in language',
    imageUrl: 'global/6_near-native.png'
  }
];

const generateDummyLessons = (unitId: string, count: number, startStatus: 'completed' | 'available' | 'locked' = 'locked'): Lesson[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `${unitId}-lesson-${i + 1}`,
    title: `Lesson ${i + 1}`,
    description: `Master the fundamentals of topic ${i + 1}.`,
    status: i === 0 && startStatus === 'locked' ? 'available' : startStatus,
    exercises: [
      {
        id: `${unitId}-ex-${i + 1}`,
        type: "multiple-choice",
        question: `Sample question for ${unitId} Lesson ${i + 1}?`,
        options: ["Option A", "Option B", "Option C", "Option D"],
        answer: "Option A"
      }
    ]
  }));
};

export const DUMMY_COURSE: CourseData = {
  id: "default-english",
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
          id: "u1-l1",
          title: "Hello & Hi",
          description: "Learn basic greetings",
          status: 'completed',
          exercises: [{ id: "ex-1", type: "multiple-choice", question: "How do you say 'Hello'?", options: ["Hello", "Goodbye", "Thank you", "Please"], answer: "Hello" }]
        },
        {
          id: "u1-l2",
          title: "Introductions",
          description: "Say your name",
          status: 'available',
          exercises: [{ id: "ex-2", type: "multiple-choice", question: "What's your name?", options: ["I am...", "You are...", "He is...", "They are..."], answer: "I am..." }]
        },
        ...generateDummyLessons("unit-1", 6, 'locked').slice(2)
      ]
    },
    {
      id: "unit-2",
      title: "Daily Life & Routine",
      color: "bg-[#1cb0f6]",
      level: 1,
      lessons: generateDummyLessons("unit-2", 8, 'locked')
    },
    {
      id: "unit-3",
      title: "Travel & Shopping",
      color: "bg-[#ff9600]",
      level: 1,
      lessons: generateDummyLessons("unit-3", 8, 'locked')
    },
    {
      id: "unit-4",
      title: "Work & Business",
      color: "bg-[#ce82ff]",
      level: 1,
      lessons: generateDummyLessons("unit-4", 8, 'locked')
    },
    {
      id: "unit-5",
      title: "Advanced Conversations",
      color: "bg-[#ff4b4b]",
      level: 1,
      lessons: generateDummyLessons("unit-5", 8, 'locked')
    }
  ],
  dictionary: [
    { id: 'w1', word: 'Hello', translation: 'Hola', definition: 'A common greeting used to begin a conversation.', example: 'Hello, how are you today?' },
    { id: 'w2', word: 'Apple', translation: 'Manzana', definition: 'A round fruit with red or green skin.', example: 'She ate a sweet red apple.' },
    { id: 'w3', word: 'Library', translation: 'Biblioteca', definition: 'A place where books are kept for people to read or borrow.', example: 'I went to the library to study.' },
    { id: 'w4', word: 'House', translation: 'Casa', definition: 'A building for human habitation.', example: 'They live in a big house.' },
    { id: 'w5', word: 'Street', translation: 'Calle', definition: 'A public road in a city or town.', example: 'The street was busy at noon.' }
  ],
  grammar: [
    { id: 'g1', title: 'Present Simple', content: 'Use the present simple to talk about things that are generally true or happen regularly.', examples: ['I drink coffee every morning.', 'She lives in London.'] },
    { id: 'g2', title: 'Personal Pronouns', content: 'Words used to replace nouns like people or things.', examples: ['I, You, He, She, It, We, They'] }
  ],
  books: [
    {
      id: 'b1',
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      description: 'A classic of American literature exploring themes of wealth and class.',
      imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400&auto=format&fit=crop',
      level: 'Advanced'
    },
    {
      id: 'b2',
      title: 'Charlotte\'s Web',
      author: 'E.B. White',
      description: 'A beautiful story perfect for intermediate learners to practice vocabulary.',
      imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=400&auto=format&fit=crop',
      level: 'Intermediate'
    }
  ],
  cultureItems: [
    {
      id: 'cp1',
      title: 'William Shakespeare',
      category: 'Famous people',
      description: 'Widely regarded as the greatest writer in the English language and the world\'s pre-eminent dramatist.',
      type: 'image',
      thumbnailUrl: 'https://images.unsplash.com/photo-1581344779180-25805586617c?q=80&w=800&auto=format&fit=crop',
      platform: 'Info'
    },
    {
      id: 'ca1',
      title: 'The Starry Night',
      category: 'Art & Masterpieces',
      description: 'An oil-on-canvas painting by the Dutch Post-Impressionist painter Vincent van Gogh.',
      type: 'image',
      thumbnailUrl: 'https://images.unsplash.com/photo-1541450805268-4822a3a774ca?q=80&w=800&auto=format&fit=crop',
      platform: 'Museum'
    },
    {
      id: 'cm1',
      title: 'Sherlock',
      category: 'Movies & TV series',
      description: 'A British crime drama television series based on Sir Arthur Conan Doyle\'s Sherlock Holmes detective stories.',
      type: 'video',
      thumbnailUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800&auto=format&fit=crop',
      platform: 'Netflix'
    },
    {
      id: 'cmu1',
      title: 'The Beatles',
      category: 'Music & Artists',
      description: 'An English rock band formed in Liverpool in 1960, who became the most influential band in history.',
      type: 'audio',
      thumbnailUrl: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=800&auto=format&fit=crop',
      platform: 'Spotify'
    },
    {
      id: 'cf1',
      title: 'Robin Hood',
      category: 'Folklore & Traditions',
      description: 'A legendary heroic outlaw originally depicted in English folklore and subsequently featured in literature and film.',
      type: 'image',
      thumbnailUrl: 'https://images.unsplash.com/photo-1599408162165-403294430f83?q=80&w=800&auto=format&fit=crop',
      platform: 'Folklore'
    },
    {
      id: 'ci1',
      title: 'Big Ben',
      category: 'Icons & Landmarks',
      description: 'The nickname for the Great Bell of the striking clock at the north end of the Palace of Westminster in London.',
      type: 'image',
      thumbnailUrl: 'https://images.unsplash.com/photo-1529655683826-aba9b3e77383?q=80&w=800&auto=format&fit=crop',
      platform: 'Landmark'
    },
    {
      id: 'cr1',
      title: 'Westminster Abbey',
      category: 'Religion & Beliefs',
      description: 'A large, mainly Gothic abbey church in the City of Westminster, London, England.',
      type: 'image',
      thumbnailUrl: 'https://images.unsplash.com/photo-1549114844-381603502224?q=80&w=800&auto=format&fit=crop',
      platform: 'Religion'
    },
    {
      id: 'cfest1',
      title: 'Glastonbury Festival',
      category: 'Festivals',
      description: 'A five-day festival of contemporary performing arts that takes place in Somerset, England.',
      type: 'image',
      thumbnailUrl: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=800&auto=format&fit=crop',
      platform: 'Festival'
    }
  ]
};
