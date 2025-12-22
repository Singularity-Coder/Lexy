
import React, { useState } from 'react';
import { BookRecommendation, CultureItem } from '../types';

interface CultureViewProps {
  books?: BookRecommendation[];
  cultureItems?: CultureItem[];
}

const CultureView: React.FC<CultureViewProps> = ({ books = [], cultureItems = [] }) => {
  const [selectedItem, setSelectedItem] = useState<CultureItem | BookRecommendation | null>(null);

  const categories = [
    'Famous people',
    'Art & Masterpieces',
    'Books',
    'Movies & TV series',
    'Music & Artists',
    'Folklore & Traditions',
    'Icons & Landmarks',
    'Religion & Beliefs',
    'Festivals'
  ] as const;

  const renderCard = (item: CultureItem | BookRecommendation, category: string) => {
    const isBook = 'author' in item;
    const title = item.title;
    const description = item.description;
    const thumb = isBook ? (item as BookRecommendation).imageUrl : (item as CultureItem).thumbnailUrl;
    const subtitle = isBook ? `by ${(item as BookRecommendation).author}` : (item as CultureItem).subtitle;
    const platform = !isBook ? (item as CultureItem).platform : 'Book';

    return (
      <div 
        key={item.id} 
        className="duo-card overflow-hidden group hover:border-[#1cb0f6] transition-all flex flex-col cursor-pointer bg-white shrink-0 w-72 sm:w-80"
        onClick={() => setSelectedItem(item)}
      >
        <div className="relative h-48 w-full overflow-hidden bg-gray-100">
          <img 
            src={thumb} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {platform && (
            <div className="absolute top-4 right-4 bg-black/70 text-white text-[10px] font-black px-2 py-1 rounded-md uppercase backdrop-blur-sm">
              {platform}
            </div>
          )}
        </div>
        <div className="p-5 space-y-1 flex-1 flex flex-col">
          <span className="text-[10px] font-black text-[#1cb0f6] uppercase tracking-widest">{category}</span>
          <h3 className="text-lg font-black text-gray-800 leading-tight truncate">{title}</h3>
          {subtitle && <p className="text-[10px] font-bold text-gray-400 truncate">{subtitle}</p>}
          <p className="text-gray-500 font-bold text-xs line-clamp-2 mt-2">{description}</p>
        </div>
      </div>
    );
  };

  const renderSection = (category: typeof categories[number]) => {
    let items: (CultureItem | BookRecommendation)[] = [];
    
    if (category === 'Books') {
      items = books;
    } else {
      items = cultureItems.filter(item => item.category === category);
    }

    if (items.length === 0) return null;

    return (
      <div key={category} className="space-y-6">
        <div className="flex items-center justify-between px-2 border-l-4 border-[#1cb0f6] pl-4">
          <h2 className="text-xl font-black text-gray-800 uppercase tracking-widest">{category}</h2>
          <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{items.length} Items</span>
        </div>
        <div className="flex overflow-x-auto pb-6 gap-6 scrollbar-hide snap-x px-2 -mx-2">
          {items.map((item) => renderCard(item, category))}
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
        {categories.map(renderSection)}
      </div>

      {/* Detail Modal Overlay */}
      {selectedItem && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-6 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setSelectedItem(null)}>
          <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl animate-in zoom-in duration-300" onClick={e => e.stopPropagation()}>
            <div className="relative h-80 bg-gray-100">
              <img 
                src={'author' in selectedItem ? selectedItem.imageUrl : selectedItem.thumbnailUrl} 
                className="w-full h-full object-cover" 
                alt={selectedItem.title} 
              />
              <button 
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white w-10 h-10 rounded-full flex items-center justify-center text-xl backdrop-blur-md transition-all"
              >
                ✕
              </button>
            </div>
            <div className="p-10 space-y-6">
              <div className="space-y-2">
                <span className="px-3 py-1 bg-blue-50 text-[#1cb0f6] rounded-full text-[10px] font-black uppercase tracking-widest">
                  {'category' in selectedItem ? selectedItem.category : 'Recommended Reading'}
                </span>
                <h2 className="text-4xl font-black text-gray-800 leading-tight">{selectedItem.title}</h2>
                {'author' in selectedItem && <p className="text-xl font-bold text-gray-500">by {selectedItem.author}</p>}
                {'subtitle' in selectedItem && selectedItem.subtitle && <p className="text-lg font-bold text-gray-400">{selectedItem.subtitle}</p>}
              </div>
              <p className="text-gray-600 text-lg font-medium leading-relaxed">
                {selectedItem.description}
              </p>
              <div className="pt-6 flex gap-4">
                {'mediaUrl' in selectedItem && selectedItem.mediaUrl && (
                  <a 
                    href={selectedItem.mediaUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1 bg-[#1cb0f6] text-white p-4 rounded-2xl font-black text-center shadow-[0_4px_0_#1899d6] hover:bg-[#1899d6] active:translate-y-1 active:shadow-none transition-all"
                  >
                    EXPLORE CONTENT
                  </a>
                )}
                {'buyUrl' in selectedItem && selectedItem.buyUrl && (
                  <a 
                    href={selectedItem.buyUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1 bg-[#58cc02] text-white p-4 rounded-2xl font-black text-center shadow-[0_4px_0_#46a302] hover:bg-[#46a302] active:translate-y-1 active:shadow-none transition-all"
                  >
                    GET THE BOOK
                  </a>
                )}
                <button 
                  onClick={() => setSelectedItem(null)}
                  className="px-8 bg-gray-100 text-gray-500 p-4 rounded-2xl font-black border-2 border-gray-200 hover:bg-gray-200 transition-all"
                >
                  CLOSE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CultureView;
