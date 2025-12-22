
import React, { useState } from 'react';

interface CultureItem {
  id: string;
  title: string;
  subtitle?: string;
  category: 'Folklore' | 'Tradition' | 'Music' | 'Movie' | 'TV Series' | 'Language' | 'People' | 'Places' | 'Things' | 'Religion' | 'Art';
  description: string;
  type: 'video' | 'audio' | 'link' | 'image';
  mediaUrl?: string;
  thumbnailUrl: string;
  platform?: 'Netflix' | 'Spotify' | 'YouTube' | 'Disney+' | 'Amazon Prime' | 'Info' | 'Library';
}

const CULTURE_DATA: CultureItem[] = [
  // --- FOLKLORE & TRADITIONS ---
  {
    id: 's1',
    title: 'The Legend of Robin Hood',
    category: 'Folklore',
    description: 'The legendary heroic outlaw originally depicted in English folklore.',
    type: 'video',
    mediaUrl: 'https://www.youtube.com/embed/n787vTjUoF8',
    thumbnailUrl: 'https://images.unsplash.com/photo-1599408162165-403294430f83?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 's2',
    title: 'Afternoon Tea Etiquette',
    category: 'Tradition',
    description: 'Learn the history and social rules of the most famous British tradition.',
    type: 'video',
    mediaUrl: 'https://www.youtube.com/embed/MhH_ucrPMZc',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 's2b',
    title: 'Guy Fawkes Night',
    category: 'Tradition',
    description: 'Remember, remember, the fifth of November! A night of bonfires and fireworks.',
    type: 'image',
    thumbnailUrl: 'https://images.unsplash.com/photo-1540324155974-7523202daa3f?q=80&w=800&auto=format&fit=crop',
    platform: 'Info',
  },

  // --- RELIGION ---
  {
    id: 'r1',
    title: 'Canterbury Cathedral',
    subtitle: 'Anglican Heritage',
    category: 'Religion',
    description: 'A cathedral in Canterbury, Kent, is one of the oldest and most famous Christian structures in England.',
    type: 'image',
    thumbnailUrl: 'https://images.unsplash.com/photo-1543735811-9653896d8471?q=80&w=800&auto=format&fit=crop',
    platform: 'Info',
  },
  {
    id: 'r2',
    title: 'St Paul\'s Cathedral',
    subtitle: 'London Landmark',
    category: 'Religion',
    description: 'Designed by Christopher Wren, it has been the site of many important national events.',
    type: 'image',
    thumbnailUrl: 'https://images.unsplash.com/photo-1512470876302-972fad2aa9dd?q=80&w=800&auto=format&fit=crop',
    platform: 'Info',
  },

  // --- ART ---
  {
    id: 'a1',
    title: 'Girl with a Balloon',
    subtitle: 'Banksy - Street Art',
    category: 'Art',
    description: 'One of the most recognizable works of modern British street art, symbolizing hope.',
    type: 'image',
    thumbnailUrl: 'https://images.unsplash.com/photo-1615111784767-46797bc84056?q=80&w=800&auto=format&fit=crop',
    platform: 'Info',
  },
  {
    id: 'a2',
    title: 'The Fighting Temeraire',
    subtitle: 'J.M.W. Turner',
    category: 'Art',
    description: 'Voted the nation\'s favorite painting, it depicts a veteran warship being towed to its scrap heap.',
    type: 'image',
    thumbnailUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=800&auto=format&fit=crop',
    platform: 'Info',
  },
  {
    id: 'a3',
    title: 'The Tate Modern',
    subtitle: 'Contemporary Art Hub',
    category: 'Art',
    description: 'One of the largest museums of modern and contemporary art in the world, housed in a former power station.',
    type: 'image',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518998053574-53ee7537d40e?q=80&w=800&auto=format&fit=crop',
    platform: 'Info',
  },

  // --- ICONS & LANDMARKS ---
  {
    id: 'i1',
    title: 'Stonehenge',
    subtitle: 'Prehistoric Monument',
    category: 'Places',
    description: 'One of the most famous landmarks in the world, Stonehenge is the remains of a ring of standing stones.',
    type: 'image',
    thumbnailUrl: 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?q=80&w=800&auto=format&fit=crop',
    platform: 'Info',
  },
  {
    id: 'i3',
    title: 'The Red Telephone Box',
    subtitle: 'Cultural Icon',
    category: 'Things',
    description: 'Designed by Sir Giles Gilbert Scott, a familiar sight on the streets of the UK.',
    type: 'image',
    thumbnailUrl: 'https://images.unsplash.com/photo-1521124410521-36427329241b?q=80&w=800&auto=format&fit=crop',
    platform: 'Info',
  },
  {
    id: 'i4',
    title: 'Big Ben',
    subtitle: 'Political Landmark',
    category: 'Places',
    description: 'The nickname for the Great Bell of the striking clock in London.',
    type: 'image',
    thumbnailUrl: 'https://images.unsplash.com/photo-1529655683826-aba9b3e77383?q=80&w=800&auto=format&fit=crop',
    platform: 'Info',
  },

  // --- MOVIES & TV ---
  {
    id: 'm1',
    title: 'The Crown',
    subtitle: 'Historical Drama',
    category: 'TV Series',
    description: 'Perfect for learning formal British English and historical vocabulary.',
    type: 'video',
    mediaUrl: 'https://www.youtube.com/embed/JWtnJjn6ng0',
    thumbnailUrl: 'https://images.unsplash.com/photo-1543536448-d240e76717a1?q=80&w=800&auto=format&fit=crop',
    platform: 'Netflix',
  },
  {
    id: 'm2',
    title: 'Sherlock',
    subtitle: 'Crime / Mystery',
    category: 'TV Series',
    description: 'Fast-paced, witty dialogue great for advanced listening comprehension.',
    type: 'video',
    mediaUrl: 'https://www.youtube.com/embed/IrBKwzL3K7s',
    thumbnailUrl: 'https://images.unsplash.com/photo-1593115057322-e94b77572f20?q=80&w=800&auto=format&fit=crop',
    platform: 'Netflix',
  },

  // --- MUSIC ---
  {
    id: 'mu1',
    title: 'Adele - 30',
    subtitle: 'Soul / Pop',
    category: 'Music',
    description: 'Clear pronunciation and emotional storytelling through lyrics.',
    type: 'link',
    mediaUrl: 'https://open.spotify.com/album/2U8u9Y9o8fM6PxlNfW4I62',
    thumbnailUrl: 'https://images.unsplash.com/photo-1514525253361-bee8718a74a2?q=80&w=800&auto=format&fit=crop',
    platform: 'Spotify',
  },
  {
    id: 'mu2',
    title: 'Ed Sheeran - Equals',
    subtitle: 'Pop',
    category: 'Music',
    description: 'Modern colloquial English and storytelling in everyday language.',
    type: 'link',
    mediaUrl: 'https://open.spotify.com/album/37i9dQZF1DWXLeA8zs9m3C',
    thumbnailUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop',
    platform: 'Spotify',
  },

  // --- FAMOUS PEOPLE ---
  {
    id: 'p1',
    title: 'William Shakespeare',
    subtitle: 'The Bard of Avon',
    category: 'People',
    description: 'The world\'s pre-eminent dramatist and greatest writer in English.',
    type: 'image',
    thumbnailUrl: 'https://images.unsplash.com/photo-1581344779114-68f4477838d7?q=80&w=800&auto=format&fit=crop',
    platform: 'Info',
  },
  {
    id: 'p2',
    title: 'Winston Churchill',
    subtitle: 'Statesman',
    category: 'People',
    description: 'Inspirational leader, writer and orator who led Britain to victory in WWII.',
    type: 'image',
    thumbnailUrl: 'https://images.unsplash.com/photo-1447069387593-a5de0862481e?q=80&w=800&auto=format&fit=crop',
    platform: 'Info',
  },
  {
    id: 'p3',
    title: 'Diana, Princess of Wales',
    subtitle: 'People\'s Princess',
    category: 'People',
    description: 'International icon for her charity work and her style.',
    type: 'image',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop',
    platform: 'Info',
  }
];

const CultureView: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<CultureItem | null>(null);
  const [viewAllCategory, setViewAllCategory] = useState<{title: string, filter: string | string[]} | null>(null);

  const renderCard = (item: CultureItem, isFullWidth: boolean = false) => (
    <div 
      key={item.id} 
      className={`duo-card overflow-hidden group hover:border-[#1cb0f6] transition-all flex flex-col cursor-pointer bg-white shrink-0 ${isFullWidth ? 'w-full' : 'w-72 sm:w-80'}`}
      onClick={() => setSelectedItem(item)}
    >
      <div className="relative h-48 w-full overflow-hidden bg-gray-100">
        <img 
          src={item.thumbnailUrl} 
          alt={item.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {item.platform && (
          <div className="absolute top-4 right-4 bg-black/70 text-white text-[10px] font-black px-2 py-1 rounded-md uppercase backdrop-blur-sm">
            {item.platform}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#1cb0f6] shadow-xl">
            {item.type === 'video' ? '▶' : item.type === 'image' ? '👁️' : '🎧'}
          </div>
        </div>
      </div>
      <div className="p-5 space-y-1 flex-1 flex flex-col">
        <span className="text-[10px] font-black text-[#1cb0f6] uppercase tracking-widest">{item.category}</span>
        <h3 className="text-lg font-black text-gray-800 leading-tight truncate">{item.title}</h3>
        {item.subtitle && <p className="text-[10px] font-bold text-gray-400 truncate">{item.subtitle}</p>}
        <p className="text-gray-500 font-bold text-xs line-clamp-2 mt-2">{item.description}</p>
      </div>
    </div>
  );

  const renderSection = (title: string, categoryFilter: string | string[]) => {
    const items = CULTURE_DATA.filter(item => 
      Array.isArray(categoryFilter) 
        ? categoryFilter.includes(item.category) 
        : item.category === categoryFilter
    );

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-black text-gray-800 uppercase tracking-widest">{title}</h2>
            <div className="hidden sm:block h-1 w-20 bg-gray-100 rounded-full"></div>
          </div>
          <button 
            onClick={() => setViewAllCategory({title, filter: categoryFilter})}
            className="text-[#1cb0f6] font-black text-xs uppercase tracking-widest hover:underline"
          >
            View More
          </button>
        </div>
        
        <div className="flex overflow-x-auto pb-6 gap-6 scrollbar-hide snap-x px-2 -mx-2">
          {items.map((item) => renderCard(item))}
          
          <button 
            onClick={() => setViewAllCategory({title, filter: categoryFilter})}
            className="w-48 shrink-0 duo-card bg-gray-50 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:text-[#1cb0f6] hover:border-[#1cb0f6] transition-all"
          >
            <span className="text-3xl mb-2">➕</span>
            <span className="font-black text-xs uppercase">View All</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-6 space-y-16 animate-in fade-in slide-in-from-bottom duration-500 pb-32">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-black text-gray-800 tracking-tight">Culture Explorer</h1>
        <p className="text-lg text-gray-500 font-bold max-w-2xl mx-auto">
          Deepen your learning by discovering the cultural soul behind the language.
        </p>
      </div>

      <div className="space-y-20">
        {renderSection("Folklore & Traditions", ["Folklore", "Tradition"])}
        {renderSection("Dominant Religion", "Religion")}
        {renderSection("Art & Masterpieces", "Art")}
        {renderSection("Icons & Landmarks", ["Places", "Things"])}
        {renderSection("Movies & TV Series", ["Movie", "TV Series"])}
        {renderSection("Music & Artists", "Music")}
        {renderSection("Famous People", "People")}
      </div>

      {/* View All Modal */}
      {viewAllCategory && (
        <div className="fixed inset-0 z-[110] bg-black/80 flex items-center justify-center p-4 backdrop-blur-md">
          <div className="bg-white w-full max-w-5xl h-[85vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col animate-in zoom-in duration-300">
            <div className="p-8 border-b-2 border-gray-100 flex justify-between items-center bg-white sticky top-0">
              <h2 className="text-3xl font-black text-gray-800">{viewAllCategory.title}</h2>
              <button onClick={() => setViewAllCategory(null)} className="text-4xl text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 bg-gray-50/50">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {CULTURE_DATA.filter(item => 
                   Array.isArray(viewAllCategory.filter) 
                    ? viewAllCategory.filter.includes(item.category) 
                    : item.category === viewAllCategory.filter
                ).map(item => renderCard(item, true))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Media Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-[120] bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            <div className="p-6 border-b-2 border-gray-100 flex justify-between items-center bg-gray-50">
              <div>
                <span className="text-xs font-black text-[#1cb0f6] uppercase tracking-widest">{selectedItem.category}</span>
                <h2 className="text-2xl font-black">{selectedItem.title}</h2>
              </div>
              <button onClick={() => setSelectedItem(null)} className="text-3xl font-bold text-gray-400 hover:text-gray-600 transition-colors">✕</button>
            </div>
            
            <div className="p-0">
              {selectedItem.type === 'video' && selectedItem.mediaUrl ? (
                <div className="w-full aspect-video bg-black shadow-inner">
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src={selectedItem.mediaUrl} 
                    title={selectedItem.title}
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  />
                </div>
              ) : selectedItem.type === 'link' ? (
                <div className="p-12 flex flex-col items-center text-center space-y-8">
                  <img src={selectedItem.thumbnailUrl} className="w-48 h-48 rounded-2xl shadow-2xl object-cover" />
                  <div className="space-y-4">
                    <h3 className="text-3xl font-black">{selectedItem.title}</h3>
                    <p className="text-gray-500 font-bold max-w-md">{selectedItem.description}</p>
                  </div>
                  <a 
                    href={selectedItem.mediaUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-[#1db954] text-white p-4 px-12 rounded-full font-black shadow-lg hover:scale-105 transition-transform flex items-center space-x-3"
                  >
                    <span>LISTEN NOW</span>
                  </a>
                </div>
              ) : selectedItem.type === 'image' ? (
                <div className="p-0 flex flex-col">
                  <div className="w-full max-h-[50vh] overflow-hidden">
                    <img src={selectedItem.thumbnailUrl} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-10 space-y-4">
                    <h3 className="text-3xl font-black">{selectedItem.title}</h3>
                    <p className="text-gray-600 font-bold text-lg leading-relaxed">{selectedItem.description}</p>
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center">
                  <p className="text-gray-500 font-bold">Content preview not available.</p>
                </div>
              )}
            </div>
            
            <div className="p-6 bg-gray-50 border-t-2 border-gray-100 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-gray-400 font-bold text-xs uppercase">
                <span>Category:</span>
                <span className="text-gray-600">{selectedItem.category}</span>
              </div>
              <button 
                onClick={() => setSelectedItem(null)}
                className="bg-[#1cb0f6] text-white p-3 px-10 rounded-xl font-black shadow-[0_4px_0_#1899d6] active:translate-y-1 active:shadow-none transition-all"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="duo-card p-12 bg-indigo-50 border-indigo-200 flex flex-col md:flex-row items-center gap-10">
        <div className="text-7xl">🌏</div>
        <div className="space-y-4">
          <h3 className="text-2xl font-black text-indigo-800 italic">"Language is the roadmap of a culture."</h3>
          <p className="text-indigo-600 font-bold leading-relaxed">
            Exploring icons, landmarks, and modern media helps you connect the words you learn with real-world context and cultural heritage.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CultureView;
