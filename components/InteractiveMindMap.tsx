import React, { useState } from 'react';
import { algebraMindMap } from '../data/algebraContent';
import { MindMapNode } from '../types';

// Map colors to Tailwind classes
const getColorClass = (colorName?: string, depth: number = 0) => {
  const base = depth === 0 ? 'scale-110 shadow-lg' : depth === 1 ? 'scale-100 shadow-md' : 'scale-95 shadow-sm';
  
  switch (colorName) {
    case 'emerald': return `${base} border-emerald-500 bg-emerald-900/60 text-emerald-300 hover:shadow-emerald-500/40`;
    case 'blue': return `${base} border-blue-500 bg-blue-900/60 text-blue-300 hover:shadow-blue-500/40`;
    case 'orange': return `${base} border-orange-500 bg-orange-900/60 text-orange-300 hover:shadow-orange-500/40`;
    case 'purple': return `${base} border-purple-500 bg-purple-900/60 text-purple-300 hover:shadow-purple-500/40`;
    case 'yellow': return `${base} border-yellow-500 bg-yellow-900/60 text-yellow-300 hover:shadow-yellow-500/40`;
    default: return `${base} border-slate-500 bg-slate-800/60 text-slate-300 hover:shadow-slate-500/40`;
  }
};

const getLineColor = (colorName?: string) => {
   switch (colorName) {
    case 'emerald': return 'bg-emerald-500/50 shadow-[0_0_8px_rgba(16,185,129,0.5)]';
    case 'blue': return 'bg-blue-500/50 shadow-[0_0_8px_rgba(59,130,246,0.5)]';
    case 'orange': return 'bg-orange-500/50 shadow-[0_0_8px_rgba(249,115,22,0.5)]';
    case 'purple': return 'bg-purple-500/50 shadow-[0_0_8px_rgba(168,85,247,0.5)]';
    case 'yellow': return 'bg-yellow-500/50 shadow-[0_0_8px_rgba(234,179,8,0.5)]';
    default: return 'bg-slate-600';
  }
};

const TreeNode: React.FC<{ 
    node: MindMapNode; 
    depth: number; 
    onSelect: (node: MindMapNode) => void;
    isLastChild?: boolean;
}> = ({ node, depth, onSelect, isLastChild }) => {
  const [isOpen, setIsOpen] = useState(depth < 1); // Auto-open root children

  const colorClass = getColorClass(node.color, depth);
  const lineColor = getLineColor(node.color);

  const handleInteraction = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (node.children) setIsOpen(!isOpen);
    onSelect(node); 
  };

  return (
    <div className="relative animate-fadeIn flex flex-col items-start w-full">
      
      <div className={`flex items-center group ${depth > 0 ? 'ml-8 md:ml-16' : ''} relative py-4`}>
        
        {/* Connection Branch Visualization */}
        {depth > 0 && (
            <>
                {/* Vertical segment connecting from parent's vertical trunk */}
                <div className={`absolute -left-[30px] md:-left-[40px] top-[-50%] bottom-[50%] w-0.5 bg-slate-700/50 ${isLastChild ? 'h-[100%]' : 'h-full'}`}></div>
                
                {/* Elbow / Horizontal branch to current node */}
                <div className={`absolute -left-[30px] md:-left-[40px] top-1/2 w-[30px] md:w-[40px] h-0.5 ${lineColor} rounded-full`}></div>
                
                {/* Little glow dot at the joint */}
                <div className={`absolute -left-[31px] md:-left-[41px] top-[calc(50%-2px)] w-1.5 h-1.5 rounded-full ${lineColor} blur-[1px]`}></div>
            </>
        )}

        {/* Node UI */}
        <div 
          onClick={handleInteraction}
          className={`
              relative cursor-pointer transition-all duration-300
              flex items-center gap-4 p-4 rounded-xl border-2 backdrop-blur-md z-10
              ${colorClass}
              hover:translate-x-2 border-opacity-60
              min-w-[180px] md:min-w-[240px] max-w-sm
          `}
        >
          <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-black/40 flex items-center justify-center text-3xl shadow-inner border border-white/10">
              {node.icon || '📜'}
          </div>
          
          <div className="flex-grow text-left">
              <h4 className={`font-pixel text-[10px] md:text-xs tracking-tighter ${depth === 0 ? 'text-yellow-400' : 'text-white'}`}>
                  {node.name}
              </h4>
              <p className="text-[9px] font-mono text-slate-400 mt-1 uppercase line-clamp-1">{node.description}</p>
          </div>

          {node.children && (
            <div className={`ml-auto w-6 h-6 rounded-full flex items-center justify-center border border-white/20 transition-transform ${isOpen ? 'rotate-180 bg-white/10' : 'bg-black/20'}`}>
                {isOpen ? '▲' : '▼'}
            </div>
          )}
        </div>
      </div>

      {/* Vertical Trunk Line for children */}
      {isOpen && node.children && (
        <div className="relative w-full">
          {node.children.map((child, idx) => (
            <TreeNode 
                key={child.id} 
                node={child} 
                depth={depth + 1} 
                onSelect={onSelect} 
                isLastChild={idx === (node.children?.length || 0) - 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const InteractiveMindMap: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [selectedNode, setSelectedNode] = useState<MindMapNode | null>(null);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 overflow-x-hidden relative animate-fadeIn selection:bg-yellow-500 selection:text-black">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-30 pointer-events-none"></div>
      <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-blue-500/10 blur-[150px] pointer-events-none rounded-full"></div>
      <div className="absolute bottom-0 right-1/4 w-1/2 h-1/2 bg-purple-500/10 blur-[150px] pointer-events-none rounded-full"></div>

      {/* Navigation */}
      <nav className="fixed top-24 left-4 z-40 flex items-center gap-4">
        <button 
          onClick={onBack}
          className="px-4 py-2 bg-slate-900/80 backdrop-blur-md border border-slate-700 rounded-lg hover:border-yellow-500 text-yellow-500 font-pixel text-xs shadow-xl transition-all active:scale-95"
        >
          ← RETORNAR
        </button>
      </nav>

      <div className="flex flex-col items-center pt-8 pb-32 px-4 md:px-12 max-w-7xl mx-auto">
         <header className="text-center mb-16 relative">
             <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent"></div>
             <h2 className="text-3xl md:text-5xl font-pixel text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-yellow-500 to-orange-600 drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">
                GRIMORIO DE HABILIDADES
             </h2>
             <p className="mt-4 font-mono text-slate-400 tracking-[0.3em] uppercase text-xs">Consulta el árbol sagrado del conocimiento</p>
         </header>
         
         <div className="w-full flex justify-start pl-4 md:pl-20 border-l border-slate-800/50">
            <TreeNode 
                node={algebraMindMap} 
                depth={0} 
                onSelect={setSelectedNode} 
            />
         </div>
      </div>

      {/* NODE DETAILS MODAL */}
      {selectedNode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn" onClick={() => setSelectedNode(null)}>
            <div 
                className="bg-slate-900 w-full max-w-2xl rounded-2xl border-2 border-slate-700 shadow-[0_0_60px_rgba(0,0,0,1)] overflow-hidden relative animate-pop"
                onClick={(e) => e.stopPropagation()}
            >
                {/* CLOSE */}
                <button 
                    onClick={() => setSelectedNode(null)}
                    className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors bg-black/40 hover:bg-black/60 w-10 h-10 rounded-full flex items-center justify-center font-bold z-10"
                >
                    ✕
                </button>

                {/* MODAL HEADER */}
                <div className={`relative p-8 overflow-hidden`}>
                    {/* Atmospheric Glow */}
                    <div className={`absolute top-0 left-0 w-full h-full opacity-20 bg-gradient-to-br ${selectedNode.color === 'emerald' ? 'from-emerald-600' : selectedNode.color === 'blue' ? 'from-blue-600' : 'from-yellow-600'} to-transparent`}></div>
                    
                    <div className="relative z-10 flex items-start gap-6">
                        <div className="text-7xl p-4 bg-black/40 rounded-2xl border border-white/10 shadow-inner flex-shrink-0 animate-float">
                            {selectedNode.icon}
                        </div>
                        <div className="pt-2">
                            <h3 className={`text-2xl md:text-4xl font-pixel ${selectedNode.color ? `text-${selectedNode.color}-400` : 'text-white'} drop-shadow-md`}>
                                {selectedNode.name}
                            </h3>
                            <div className="mt-3 flex items-center gap-2">
                                <span className="h-px w-8 bg-white/20"></span>
                                <p className="text-slate-400 font-mono italic text-sm">"{selectedNode.description}"</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* MODAL BODY */}
                <div className="px-8 pb-8 max-h-[50vh] overflow-y-auto scrollbar-hide">
                    <div className="bg-black/30 p-6 rounded-xl border border-slate-800 shadow-inner">
                        <p className="text-base md:text-lg leading-relaxed text-slate-300 font-serif whitespace-pre-wrap">
                            {selectedNode.details?.split('\n').map((line, i) => (
                                <span key={i} className="block mb-4">
                                    {line.includes('**') ? 
                                        line.split(/(\*\*.*?\*\*)/g).map((part, j) => 
                                            part.startsWith('**') ? <strong key={j} className="text-yellow-500">{part.slice(2,-2)}</strong> : part
                                        ) 
                                        : line
                                    }
                                </span>
                            ))}
                        </p>
                    </div>

                    {/* HIERARCHY HINT */}
                    {selectedNode.children && selectedNode.children.length > 0 && (
                        <div className="mt-8">
                            <h4 className="text-[10px] font-pixel text-slate-500 mb-3 tracking-widest uppercase">Derivaciones:</h4>
                            <div className="grid grid-cols-2 gap-3">
                                {selectedNode.children.map(child => (
                                    <div key={child.id} className="flex items-center gap-2 p-2 rounded bg-slate-800/50 border border-slate-700/50">
                                        <span className="text-xl">{child.icon}</span>
                                        <span className="text-[10px] font-pixel text-slate-300 truncate">{child.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* FOOTER */}
                <div className="p-6 bg-slate-950/50 border-t border-slate-800 flex justify-end items-center gap-4">
                    <span className="text-[9px] font-mono text-slate-600 uppercase">Mathoria Encyclopedia v1.0</span>
                    <button 
                        onClick={() => setSelectedNode(null)}
                        className="px-10 py-3 bg-yellow-600 hover:bg-yellow-500 text-black font-bold rounded font-pixel text-xs transition-all shadow-[0_4px_0_rgba(180,83,9,1)] active:translate-y-1 active:shadow-none"
                    >
                        DOMINADO
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveMindMap;