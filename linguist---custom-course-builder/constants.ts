
import { CourseData, ProficiencyLevel, CultureItem, Lesson, AICharacter } from './types';

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

export const SIDEBAR_NAV_ITEMS = [
    { id: 'home', label: 'Learn', icon: '🏠' },
    { id: 'search', label: 'Search', icon: '🔍' },
    { id: 'vocabulary', label: 'Vocabulary', icon: '📖' },
    { id: 'my-lists', label: 'My Lists', icon: '📂' },
    { id: 'ai-chats', label: 'Ai Chats', icon: '💬' },
    { id: 'grammar', label: 'Grammar', icon: '📝' },
    { id: 'games', label: 'Games', icon: '🎮' },
    { id: 'writing', label: 'Writing', icon: '✏️' },
    { id: 'culture', label: 'Culture', icon: '🌍' },
    { id: 'notifications', label: 'Reminders', icon: '🔔' },
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
];

export const PROFICIENCY_LEVELS: LevelInfo[] = [
  {
    level: 1,
    name: 'Beginner',
    description: 'Recognize words',
    imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=200&auto=format&fit=crop'
  },
  {
    level: 2,
    name: 'Survival',
    description: 'Get by',
    imageUrl: 'https://images.unsplash.com/photo-1454165833767-027ffea9e78b?q=80&w=200&auto=format&fit=crop'
  },
  {
    level: 3,
    name: 'Functional',
    description: 'Work/study',
    imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=200&auto=format&fit=crop'
  },
  {
    level: 4,
    name: 'Professional',
    description: 'Argue, explain',
    imageUrl: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=200&auto=format&fit=crop'
  },
  {
    level: 5,
    name: 'Academic',
    description: 'Analyze & write',
    imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=200&auto=format&fit=crop'
  },
  {
    level: 6,
    name: 'Near-native',
    description: 'Think in language',
    imageUrl: 'https://images.unsplash.com/photo-1544652478-6653e09f18a2?q=80&w=200&auto=format&fit=crop'
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
      id: 'cp-v1',
      title: 'Shakespeare: The Animated Biography',
      category: 'Famous people',
      description: 'A quick and engaging visual biography of the Bard of Avon.',
      type: 'video',
      thumbnailUrl: 'https://img.youtube.com/vi/uO_mUat_6zE/maxresdefault.jpg',
      mediaUrl: 'https://www.youtube.com/watch?v=uO_mUat_6zE',
      platform: 'YouTube'
    },
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
      id: 'ca-v1',
      title: 'Understanding Van Gogh\'s Starry Night',
      category: 'Art & Masterpieces',
      description: 'An in-depth analysis of the techniques and symbolism in Van Gogh\'s most famous work.',
      type: 'video',
      thumbnailUrl: 'https://img.youtube.com/vi/Oatf3m9m6v4/maxresdefault.jpg',
      mediaUrl: 'https://www.youtube.com/watch?v=Oatf3m9m6v4',
      platform: 'YouTube'
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
      id: 'cb-v1',
      title: 'Top 10 Essential English Books',
      category: 'Books',
      description: 'A curated list of books every English learner should read to master the language.',
      type: 'video',
      thumbnailUrl: 'https://img.youtube.com/vi/E8T63tXInD0/maxresdefault.jpg',
      mediaUrl: 'https://www.youtube.com/watch?v=E8T63tXInD0',
      platform: 'YouTube'
    },
    {
      id: 'cm-v1',
      title: 'The Evolution of British TV',
      category: 'Movies & TV series',
      description: 'Discover how British television evolved from radio roots to modern global hits.',
      type: 'video',
      thumbnailUrl: 'https://img.youtube.com/vi/vF0lPez0r0A/maxresdefault.jpg',
      mediaUrl: 'https://www.youtube.com/watch?v=vF0lPez0r0A',
      platform: 'YouTube'
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
      id: 'cmu-v1',
      title: 'The Beatles: A Documentary Journey',
      category: 'Music & Artists',
      description: 'The story of the band that changed music history forever.',
      type: 'video',
      thumbnailUrl: 'https://img.youtube.com/vi/3Z2b7S-S5Y0/maxresdefault.jpg',
      mediaUrl: 'https://www.youtube.com/watch?v=3Z2b7S-S5Y0',
      platform: 'YouTube'
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
      id: 'cf-v1',
      title: 'Legends of British Folklore',
      category: 'Folklore & Traditions',
      description: 'Explore the myths of King Arthur, Robin Hood, and mysterious creatures of the Isles.',
      type: 'video',
      thumbnailUrl: 'https://img.youtube.com/vi/M5fE8PjL0-w/maxresdefault.jpg',
      mediaUrl: 'https://www.youtube.com/watch?v=M5fE8PjL0-w',
      platform: 'YouTube'
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
      id: 'ci-v1',
      title: 'Big Ben: The Restoration Secrets',
      category: 'Icons & Landmarks',
      description: 'Go inside the clock tower to see how London\'s most famous landmark was restored.',
      type: 'video',
      thumbnailUrl: 'https://img.youtube.com/vi/U8Vz6r-6Xsk/maxresdefault.jpg',
      mediaUrl: 'https://www.youtube.com/watch?v=U8Vz6r-6Xsk',
      platform: 'YouTube'
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
      id: 'cr-v1',
      title: 'The History of Westminster Abbey',
      category: 'Religion & Beliefs',
      description: 'The royal church that has seen every coronation since 1066.',
      type: 'video',
      thumbnailUrl: 'https://img.youtube.com/vi/qY_3Q6yE2b0/maxresdefault.jpg',
      mediaUrl: 'https://www.youtube.com/watch?v=qY_3Q6yE2b0',
      platform: 'YouTube'
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
      id: 'cfest-v1',
      title: 'The Magic of Glastonbury Festival',
      category: 'Festivals',
      description: 'Experience the atmosphere of the world\'s most famous music and performing arts festival.',
      type: 'video',
      thumbnailUrl: 'https://img.youtube.com/vi/7w8rQzPInCg/maxresdefault.jpg',
      mediaUrl: 'https://www.youtube.com/watch?v=7w8rQzPInCg',
      platform: 'YouTube'
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

export const MYTHICAL_CHARACTERS: AICharacter[] = [
  {
    id: 'zeus',
    name: 'Zeus',
    avatar: 'https://cdn-icons-png.flaticon.com/512/3253/3253215.png',
    role: 'King of Gods',
    description: 'The thunderbolt-wielding ruler of Mount Olympus.',
    personality: 'Majestic, authoritative, occasionally dramatic, but wise.'
  },
  {
    id: 'athena',
    name: 'Athena',
    avatar: 'https://cdn-icons-png.flaticon.com/512/3253/3253216.png',
    role: 'Goddess of Wisdom',
    description: 'Strategist and protector of civilization.',
    personality: 'Logical, insightful, encouraging of learners.'
  },
  {
    id: 'odin',
    name: 'Odin',
    avatar: 'https://cdn-icons-png.flaticon.com/512/3253/3253217.png',
    role: 'All-Father',
    description: 'Seeker of knowledge and master of runes.',
    personality: 'Mysterious, deeply philosophical, value-driven.'
  },
  {
    id: 'cleopatra',
    name: 'Cleopatra',
    avatar: 'https://cdn-icons-png.flaticon.com/512/3253/3253218.png',
    role: 'Pharaoh',
    description: 'The last active ruler of the Ptolemaic Kingdom of Egypt.',
    personality: 'Charismatic, brilliant linguist, politically astute.'
  },
  {
    id: 'da_vinci',
    name: 'Leonardo da Vinci',
    avatar: 'https://cdn-icons-png.flaticon.com/512/3253/3253219.png',
    role: 'Renaissance Master',
    description: 'Polymath, painter, inventor, and anatomist.',
    personality: 'Curious, imaginative, constantly sketching ideas.'
  }
];