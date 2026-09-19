import React, { useState } from 'react';
import { 
  FileCode, 
  Copy, 
  Check, 
  FolderTree, 
  Terminal, 
  ExternalLink,
  Layers,
  Sparkles
} from 'lucide-react';
import { FlutterFile } from '../types';

interface FileBrowserProps {
  files: FlutterFile[];
}

export const FileBrowser: React.FC<FileBrowserProps> = ({ files }) => {
  const [selectedFile, setSelectedFile] = useState<FlutterFile>(files[0]);
  const [copied, setCopied] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredFiles = filterCategory === 'all'
    ? files
    : files.filter(f => f.category === filterCategory);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col h-full">
      {/* Header with Filter Categories */}
      <div className="px-4 py-3 bg-slate-950/60 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <FolderTree className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
            Phase 1 Codebase Artifacts
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
            {files.length} Files Ready
          </span>
        </div>

        <div className="flex items-center gap-1 overflow-x-auto text-xs">
          {['all', 'config', 'app', 'core', 'screens'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-2.5 py-1 rounded-lg capitalize text-xs font-medium transition-colors ${
                filterCategory === cat
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Split: File List & Code Editor */}
      <div className="grid grid-cols-1 md:grid-cols-12 flex-1 min-h-[460px]">
        {/* File Navigator Sidebar */}
        <div className="md:col-span-4 border-r border-slate-800 p-2.5 space-y-1 bg-slate-950/40 overflow-y-auto max-h-[500px]">
          {filteredFiles.map((file) => {
            const isSelected = selectedFile.path === file.path;
            return (
              <button
                key={file.path}
                id={`file-item-${file.name.replace(/[^a-zA-Z0-9]/g, '-')}`}
                onClick={() => setSelectedFile(file)}
                className={`w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-start gap-2.5 ${
                  isSelected
                    ? 'bg-amber-500/10 border border-amber-500/30 text-amber-300 shadow-xs'
                    : 'text-slate-300 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <FileCode className={`w-4 h-4 mt-0.5 shrink-0 ${isSelected ? 'text-amber-400' : 'text-slate-500'}`} />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-mono font-medium truncate">
                    {file.name}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate mt-0.5">
                    {file.path}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Code Viewer Panel */}
        <div className="md:col-span-8 flex flex-col bg-slate-950/80">
          {/* File Meta Header */}
          <div className="px-4 py-2.5 border-b border-slate-800 flex items-center justify-between bg-slate-900/40">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-semibold text-slate-200 truncate">
                  jk_lodu/{selectedFile.path}
                </span>
                <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                  {selectedFile.category}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {selectedFile.description}
              </p>
            </div>

            <button
              id="copy-code-button"
              onClick={() => handleCopy(selectedFile.content)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-medium transition-all shrink-0 active:scale-95"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>
          </div>

          {/* Syntax Highlighted Box */}
          <div className="flex-1 p-4 overflow-auto font-mono text-xs text-slate-300 leading-relaxed bg-[#0B0F19] max-h-[460px]">
            <pre className="whitespace-pre overflow-x-auto selection:bg-amber-500/30">
              {selectedFile.content}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
