
import { CourseData, ProficiencyLevel, CultureItem, Lesson, AICharacter } from './types';

export const COLORS = {
  primary: '#ad46ff',
  primaryDark: '#00d4c2',
  secondary: '#ad46ff', // Changed from #1cb0f6 to purple
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

export const FONT_OPTIONS = [
    { id: 'Pacifico, cursive', name: 'Bouncy Cat' },
    { id: 'Lobster, cursive', name: 'Painter Retro' },
    { id: 'Great Vibes, cursive', name: 'Chapel Elegant' },
    { id: 'Dancing Script, cursive', name: 'Handmade Play' },
    { id: 'Satisfy, cursive', name: 'Polaroid Brush' },
    { id: 'Caveat, cursive', name: 'Modern Signature' },
    { id: 'Playfair Display, serif', name: 'Luxury Casko' },
    { id: 'Abril Fatface, serif', name: 'April Monde' },
    { id: 'Yellowtail, cursive', name: 'Vintage Sign' },
    { id: 'Oleo Script, cursive', name: 'Soft Bouncy' },
    { id: 'Marcellus, serif', name: 'Classical Myth' }
];

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

export const MASCOTS = [
  { id: 'girl', name: 'Lexy', icon: '👧' },
  { id: 'bird', name: 'Lingo', icon: '🐦' },
  { id: 'robot', name: 'Byte', icon: '🤖' },
  { id: 'cat', name: 'Whiskers', icon: '🐱' },
  { id: 'fox', name: 'Foxy', icon: '🦊' },
  { id: 'panda', name: 'Pan', icon: '🐼' },
  { id: 'bear', name: 'Barry', icon: '🐻' },
  { id: 'dino', name: 'Roar', icon: 'Rex' },
];

export const PROFICIENCY_LEVELS: LevelInfo[] = [
  {
    level: 1,
    name: 'Beginner',
    description: 'Recognize words',
    imageUrl: 'https://i.pinimg.com/736x/f9/33/44/f9334419227bf506ce63900a08c6e7a8.jpg'
  },
  {
    level: 2,
    name: 'Survival',
    description: 'Get by',
    imageUrl: 'https://i.pinimg.com/736x/d2/65/8a/d2658a939e4fee6550d76f44d1402577.jpg'
  },
  {
    level: 3,
    name: 'Functional',
    description: 'Work/study',
    imageUrl: 'https://i.pinimg.com/736x/12/62/5e/12625eeaf314e9a6bdb63d81fa3573fc.jpg'
  },
  {
    level: 4,
    name: 'Professional',
    description: 'Argue, explain',
    imageUrl: 'https://i.pinimg.com/736x/22/37/7e/22377e42213fb638fc30df2ded044c9f.jpg'
  },
  {
    level: 5,
    name: 'Academic',
    description: 'Analyze & write',
    imageUrl: 'https://i.pinimg.com/736x/13/b7/1f/13b71f26513f5280bdf45a8e7709751b.jpg'
  },
  {
    level: 6,
    name: 'Near-native',
    description: 'Think in language',
    imageUrl: 'https://i.pinimg.com/736x/57/0a/b5/570ab539a7e65f540de285ac1795687a.jpg'
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
  id: "English", // ID is now strictly the language name
  courseTitle: "English Mastery",
  language: "English",
  units: [
    {
      id: "unit-1",
      title: "Essential Greetings",
      color: "bg-[#ad46ff]",
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
      color: "bg-[#58cc02]",
      level: 1,
      lessons: generateDummyLessons("unit-2", 8, 'locked')
    },
    {
      id: "unit-3",
      title: "Travel & Shopping",
      color: "bg-[#ffc800]",
      level: 1,
      lessons: generateDummyLessons("unit-3", 8, 'locked')
    },
    {
      id: "unit-4",
      title: "Work & Business",
      color: "bg-[#1cb0f6]",
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
    avatar: 'https://i.pinimg.com/736x/d1/f4/b3/d1f4b350c48dc8dc2b376c1b73a7b250.jpg',
    role: 'King of Gods',
    description: 'The thunderbolt-wielding ruler of Mount Olympus.',
    personality: 'Majestic, authoritative, occasionally dramatic, but wise.'
  },
  {
    id: 'athena',
    name: 'Athena',
    avatar: 'https://i.pinimg.com/736x/61/9e/91/619e91505a96e17b9be3108f091b67cb.jpg',
    role: 'Goddess of Wisdom',
    description: 'Strategist and protector of civilization.',
    personality: 'Logical, insightful, encouraging of learners.'
  },
  {
    id: 'odin',
    name: 'Odin',
    avatar: 'https://i.pinimg.com/736x/5b/1d/ca/5b1dca1ae91aa485cead3818ce22e2a4.jpg',
    role: 'All-Father',
    description: 'Seeker of knowledge and master of runes.',
    personality: 'Mysterious, deeply philosophical, value-driven.'
  },
  {
    id: 'cleopatra',
    name: 'Cleopatra',
    avatar: 'https://i.pinimg.com/736x/3d/89/c6/3d89c62796b132b741d574fc58740f64.jpg',
    role: 'Pharaoh',
    description: 'The last active ruler of the Ptolemaic Kingdom of Egypt.',
    personality: 'Charismatic, brilliant linguist, politically astute.'
  },
  {
    id: 'da_vinci',
    name: 'Leonardo da Vinci',
    avatar: 'https://i.pinimg.com/736x/38/7e/01/387e0126b1205b5c40de13adad0fc90c.jpg',
    role: 'Renaissance Master',
    description: 'Polymath, painter, inventor, and anatomist.',
    personality: 'Curious, imaginative, constantly sketching ideas.'
  },
  {
    id: 'napoleon',
    name: 'Napoleon Bonaparte',
    avatar: 'https://i.pinimg.com/736x/8b/b3/f6/8bb3f61671ce6a14f415d2b19bb51e65.jpg',
    role: 'Emperor',
    description: 'Master strategist and French leader who shaped modern Europe.',
    personality: 'Ambitious, formal, confident, and highly articulate.'
  },
  {
    id: 'valkyrie',
    name: 'Valkyrie',
    avatar: 'https://i.pinimg.com/736x/fb/48/ef/fb48ef1722d3e5a229161aea85755cfa.jpg',
    role: 'Chooser of Slain',
    description: 'Shield-maiden of Valhalla who guides heroes to the afterlife.',
    personality: 'Fearless, ethereal, fierce, and deeply loyal.'
  },
  {
    id: 'joan',
    name: 'Joan of Arc',
    avatar: 'https://i.pinimg.com/736x/6f/fd/53/6ffd535445915a4fcc2b464edcae7e38.jpg',
    role: 'Saint of Orléans',
    description: 'The young peasant girl who led the French army to victory.',
    personality: 'Pious, determined, inspiring, and remarkably brave.'
  },
  {
    id: 'king_arthur',
    name: 'King Arthur',
    avatar: 'https://i.pinimg.com/736x/25/95/0c/25950cda0b3171ad8c0f65ce7e165d3c.jpg',
    role: 'The High King',
    description: 'The legendary sovereign of Camelot and wielder of Excalibur.',
    personality: 'Noble, chivalrous, determined, and deeply just.'
  },
  {
    id: 'merlin',
    name: 'Merlin',
    avatar: 'https://i.pinimg.com/736x/fe/3e/df/fe3edf9ece39a05d51c812e5542520b9.jpg',
    role: 'Wizard of Britain',
    description: 'The master of prophecy, magic, and advisor to the Round Table.',
    personality: 'Enigmatic, eccentric, incredibly wise, and multi-faceted.'
  },
  {
    id: 'robin_hood',
    name: 'Robin Hood',
    avatar: 'https://i.pinimg.com/736x/ea/59/5b/ea595b7b44e2669606143129920c5ba7.jpg',
    role: 'Legendary Outlaw',
    description: 'The heroic archer of Sherwood Forest who steals from the rich.',
    personality: 'Merry, defiant, highly skilled, and compassionate.'
  },
  {
    id: 'black_shuck',
    name: 'Black Shuck',
    avatar: 'https://i.pinimg.com/736x/cb/8a/26/cb8a261f8141c5cd5443611176319fee.jpg',
    role: 'Spectral Hound',
    description: 'The terrifying ghostly black dog that haunts the English coastline.',
    personality: 'Ominous, growling, ancient, yet strangely poetic in speech.'
  },
  {
    id: 'puck',
    name: 'Puck',
    avatar: 'https://i.pinimg.com/736x/b3/8d/c4/b38dc4529e3e6f4c0b535927dac9c15a.jpg',
    role: 'Trickster Sprite',
    description: 'Also known as Robin Goodfellow, a mischievous nature spirit.',
    personality: 'Prankish, lighthearted, fast-talking, and easily amused.'
  }
];
