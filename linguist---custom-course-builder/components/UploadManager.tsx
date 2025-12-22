
import React, { useState, useRef } from 'react';
import { CourseData } from '../types';

interface UploadManagerProps {
  onCourseLoaded: (course: CourseData, mediaMap: Map<string, string>) => void;
}

const UploadManager: React.FC<UploadManagerProps> = ({ onCourseLoaded }) => {
  const [jsonFile, setJsonFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const handleJsonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setJsonFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!jsonFile || !folderInputRef.current?.files) {
      setError("Please select both a JSON file and a media folder.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 1. Read JSON
      const jsonText = await jsonFile.text();
      const courseData: CourseData = JSON.parse(jsonText);

      // 2. Map media files to local URLs
      const mediaMap = new Map<string, string>();
      const files = folderInputRef.current.files;
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        // Relative path logic depends on browser support for webkitRelativePath
        const path = file.webkitRelativePath || file.name;
        // Strip the top level directory if it's a folder upload
        const parts = path.split('/');
        const relativePath = parts.slice(1).join('/') || path;
        
        const url = URL.createObjectURL(file);
        mediaMap.set(relativePath, url);
        // Also map just the filename as a fallback
        mediaMap.set(file.name, url);
      }

      onCourseLoaded(courseData, mediaMap);
    } catch (err) {
      console.error(err);
      setError("Failed to process files. Ensure JSON is valid and media paths match.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 duo-card border-none bg-white space-y-6">
      <div className="text-center md:text-left">
        <h3 className="text-xl font-black text-gray-800">Upload Course Material</h3>
        <p className="text-sm text-gray-500 mt-1">Combine a JSON configuration with a directory of assets.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">Course JSON</label>
          <input 
            type="file" 
            accept=".json"
            onChange={handleJsonChange}
            className="w-full p-3 border-2 border-dashed rounded-2xl border-gray-200 focus:border-[#58cc02] outline-none text-xs"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">Media Assets Folder</label>
          <input 
            type="file" 
            ref={folderInputRef}
            // @ts-ignore - non-standard attributes for directory selection
            webkitdirectory="true"
            directory="true"
            multiple
            className="w-full p-3 border-2 border-dashed rounded-2xl border-gray-200 focus:border-[#58cc02] outline-none text-xs"
          />
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-500 rounded-xl text-xs font-bold border border-red-200">
          {error}
        </div>
      )}

      <div className="flex flex-col md:flex-row items-center gap-4">
        <button
          onClick={handleUpload}
          disabled={isLoading}
          className="w-full md:w-auto p-4 px-10 rounded-2xl font-extrabold text-white bg-[#58cc02] border-b-4 border-[#46a302] active:translate-y-1 active:border-b-0 transition-all uppercase tracking-wider text-sm"
        >
          {isLoading ? 'Processing...' : 'Sync Data'}
        </button>
        
        <div className="text-center md:text-left">
           <p className="text-[10px] text-gray-400 font-bold">Ensure media paths in JSON match the filenames in your folder.</p>
        </div>
      </div>
    </div>
  );
};

export default UploadManager;
