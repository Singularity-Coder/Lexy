
import React, { useState } from 'react';
import { CourseData, CultureItem } from '../types';
import JSZip from 'jszip';

interface UploadManagerProps {
  onCourseLoaded: (course: CourseData, mediaMap: Map<string, string>) => void;
  existingCourses: { id: string, language: string }[]; 
}

const UploadManager: React.FC<UploadManagerProps> = ({ onCourseLoaded, existingCourses }) => {
  const [lexyFile, setLexyFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Custom Modal State
  const [showConflictModal, setShowConflictModal] = useState(false);
  const [pendingCourseData, setPendingCourseData] = useState<CourseData | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLexyFile(e.target.files[0]);
      setError(null);
    }
  };

  // Fixed React.DragOverEvent to React.DragEvent
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  // Fixed React.DragLeaveEvent to React.DragEvent
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setLexyFile(e.dataTransfer.files[0]);
      setError(null);
    }
  };

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const processFile = async (file: File) => {
    try {
      const zip = await JSZip.loadAsync(file);
      const manifestFile = zip.file("manifest.json");
      if (!manifestFile) {
        throw new Error("Invalid .lexy file: manifest.json not found.");
      }

      const manifestContent = await manifestFile.async("string");
      const manifest = JSON.parse(manifestContent);

      if (manifest.format !== "lexy-package") {
        throw new Error("Invalid file format. This is not a Lexy package.");
      }

      const manifestCourseId = manifest.courseId;
      // As per user requirement, courseId is the language name. 
      // manifest.fields.language is ignored or removed.
      const languageName = manifestCourseId || "Unknown";

      // 3. Process data files
      const dataFiles = manifest.dataFiles || {};
      const loadJson = async (path: string) => {
        const file = zip.file(path);
        if (!file) return [];
        return JSON.parse(await file.async("string"));
      };

      const dictionary = dataFiles.dictionary ? await loadJson(dataFiles.dictionary.path) : [];
      const grammar = dataFiles.grammar ? await loadJson(dataFiles.grammar.path) : [];
      const cultureItems = (dataFiles.culture ? await loadJson(dataFiles.culture.path) : []) as CultureItem[];
      const units = dataFiles.units ? await loadJson(dataFiles.units.path) : [];
      const aiCharacters = dataFiles.ai_chats ? await loadJson(dataFiles.ai_chats.path) : [];

      // Process assets
      for (const item of cultureItems) {
        if (item.thumbnailUrl && item.thumbnailUrl.startsWith('assets/')) {
          const file = zip.file(item.thumbnailUrl);
          if (file) {
            const blob = await file.async("blob");
            item.thumbnailUrl = await blobToBase64(blob);
          }
        }
        if (item.assets) {
          for (const asset of item.assets) {
            if (asset.value.startsWith('assets/')) {
              const file = zip.file(asset.value);
              if (file) {
                const blob = await file.async("blob");
                asset.value = await blobToBase64(blob);
              }
            }
          }
        }
      }

      const targetId = manifestCourseId || `course-${Date.now()}`;
      
      return {
        id: targetId,
        courseTitle: manifest.fields?.title || "Imported Course",
        language: languageName, // Synced with ID
        units: units,
        dictionary: dictionary,
        grammar: grammar,
        cultureItems: cultureItems,
        aiCharacters: aiCharacters
      } as CourseData;
      
    } catch (err: any) {
      throw err;
    }
  };

  const handleUpload = async () => {
    if (!lexyFile) {
      setError("Please select a .lexy course file.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const courseData = await processFile(lexyFile);
      
      // 1. CONFLICT CHECK: Match ONLY by courseId
      const conflict = existingCourses.find(c => courseData.id && c.id === courseData.id);

      if (conflict) {
        // Show Custom Conflict Modal instead of window.confirm
        setPendingCourseData(courseData);
        setShowConflictModal(true);
        setIsLoading(false);
        return; 
      }

      // No conflict, proceed
      onCourseLoaded(courseData, new Map());
      resetForm();
      
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to process .lexy file.");
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setLexyFile(null);
    setPendingCourseData(null);
    setShowConflictModal(false);
    const input = document.getElementById('lexy-upload-input') as HTMLInputElement;
    if (input) input.value = '';
    setIsLoading(false);
  };

  const confirmOverride = () => {
    if (pendingCourseData) {
      onCourseLoaded(pendingCourseData, new Map());
      resetForm();
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="space-y-2">
        <label 
          htmlFor="lexy-upload-input"
          onDragOver={handleDragOver}
          onDragEnter={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`w-full min-h-[140px] p-6 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center transition-all group overflow-hidden cursor-pointer ${
            isDragging 
              ? 'border-[#ad46ff] bg-purple-50' 
              : lexyFile ? 'border-[#ad46ff] bg-gray-50' : 'border-gray-200 bg-gray-50/30 hover:bg-gray-100 hover:border-[#ad46ff]'
          }`}
        >
          <input 
            id="lexy-upload-input"
            type="file" 
            accept=".lexy,.zip"
            onChange={handleFileChange}
            className="hidden"
          />
          {lexyFile ? (
            <div className="flex flex-col items-center text-center space-y-2 w-full animate-in zoom-in duration-200">
              <span className="text-4xl">📄</span>
              <div className="p-2 px-4 rounded-xl bg-white border-2 border-gray-100 shadow-sm max-w-full">
                <p className="text-xs font-black text-gray-700 truncate">{lexyFile.name}</p>
              </div>
              <span className="text-[10px] font-black text-[#ad46ff] uppercase tracking-widest">Selected & Ready</span>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-3 opacity-60 group-hover:opacity-100 transition-opacity">
               <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl transition-all ${isDragging ? 'bg-purple-100 scale-110' : 'bg-gray-100'}`}>📁</div>
               <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-gray-600 transition-colors text-center">
                 CLICK OR DRAG .LEXY FILE HERE
               </span>
            </div>
          )}
        </label>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-500 rounded-2xl text-[10px] font-bold border-2 border-red-100 flex items-center gap-3 overflow-hidden">
          <span className="text-lg shrink-0">⚠️</span>
          <span className="break-all">{error}</span>
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={isLoading || !lexyFile}
        className={`w-full p-4 rounded-2xl font-black text-white transition-all transform active:scale-95 hover:scale-105 uppercase tracking-widest text-xs ${
          !lexyFile 
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none' 
            : 'bg-[#ad46ff] shadow-[0_4px_0_#8439a3] hover:bg-[#8439a3] active:translate-y-1 active:shadow-none'
        }`}
      >
        {isLoading ? 'UPLOADING...' : 'IMPORT LEXY'}
      </button>

      {/* Custom Conflict Modal */}
      {showConflictModal && (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            <div className="p-10 text-center space-y-6">
              <div className="w-20 h-20 bg-orange-100 text-orange-500 rounded-[2rem] flex items-center justify-center text-4xl mx-auto shadow-inner border-2 border-orange-50">
                ⚠️
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-gray-800 tracking-tight leading-tight">Course Conflict!</h3>
                <p className="text-sm font-bold text-gray-400 leading-relaxed">
                  A course with ID <span className="text-purple-600">"{pendingCourseData?.id}"</span> already exists.
                  Overwriting will replace all your progress, lessons, and data for this course ID.
                </p>
              </div>
              
              <div className="flex flex-col gap-3 pt-4">
                <button
                  onClick={confirmOverride}
                  className="w-full p-4 bg-[#ad46ff] text-white rounded-2xl font-black shadow-[0_4px_0_#8439a3] hover:scale-105 active:translate-y-1 active:shadow-none transition-all uppercase tracking-widest text-xs"
                >
                  OVERWRITE & IMPORT
                </button>
                <button
                  onClick={resetForm}
                  className="w-full p-4 bg-white text-gray-400 rounded-2xl font-black border-2 border-gray-100 shadow-[0_4px_0_#e5e5e5] hover:bg-gray-50 active:translate-y-1 active:shadow-none transition-all uppercase tracking-widest text-xs"
                >
                  CANCEL
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadManager;
