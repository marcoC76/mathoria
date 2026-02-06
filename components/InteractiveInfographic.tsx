import React, { useState, useMemo } from 'react';
import { infographicPoints } from '../data/algebraContent';
import { InfographicPoint } from '../types';

const InteractiveInfographic: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [activePoint, setActivePoint] = useState<InfographicPoint | null>(null);

  // Calculate SVG path string to connect dots
  const pathData = useMemo(() => {
    if (infographicPoints.length < 2) return "";
    
    // Sort points by ID just in case
    const sorted = [...infographicPoints].sort((a, b) => a.id - b.id);
    
    // Start Move
    let d = `M ${sorted[0].x} ${sorted[0].y}`;
    
    for (let i = 1; i < sorted.length; i++) {
        const curr = sorted[i];
        d += ` L ${curr.x} ${curr.y}`;
    }
    return d;
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 overflow-hidden relative animate-fadeIn">
       {/* Background Grid */}
       <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-20 pointer-events-none"></div>
       
       <button 
        onClick={onBack}
        className="fixed top-24 left-4 z-50 px-4 py-2 bg-[#3e3226] border-2 border-[#8b6f56] rounded hover:bg-[#564534] font-pixel text-xs text-[#dcdcdc] shadow-lg transition-colors"
      >
        ← Volver
      </button>

      <h2 className="text-3xl font-pixel text-[#d4af37] mb-4 mt-8 text-center drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] z-10 relative tracking-widest">
          MAPA DE MATHORIA
      </h2>

      {/* Expanded Map Container: Dark Fantasy Parchment Style */}
      <div className="relative w-full max-w-[90vw] h-[75vh] bg-[#2b221b] rounded-lg border-[6px] border-[#5c4a3d] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] group select-none">
        
        {/* Paper Texture Overlay */}
        <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] pointer-events-none z-0"></div>
        
        {/* Vignette (Dark corners) */}
        <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,0.9)] pointer-events-none z-10 rounded-lg"></div>

        {/* --- GEOGRAPHY / LANDMASSES (Decorative Blobs) --- */}
        {/* Using absolute positioning and border-radius to simulate land shapes behind the path */}
        <div className="absolute z-0 w-full h-full pointer-events-none opacity-60 filter blur-sm">
            {/* South-West Continent (Start) */}
            <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[50%] bg-[#3a3026] rounded-[40%_60%_70%_30%/40%_50%_60%_50%] border-2 border-[#4e4033] border-dashed"></div>
            
            {/* Central Archipelago */}
            <div className="absolute top-[30%] left-[30%] w-[40%] h-[40%] bg-[#362c23] rounded-[60%_40%_30%_70%/60%_30%_70%_40%] border-2 border-[#4e4033] border-dashed"></div>
            
            {/* North-East Peaks */}
            <div className="absolute top-[-5%] right-[5%] w-[35%] h-[45%] bg-[#3e3226] rounded-[30%_70%_70%_30%/30%_30%_70%_70%] border-2 border-[#4e4033] border-dashed"></div>
            
            {/* Water texture effect (subtle noise) */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
        </div>

        {/* --- COMPASS ROSE DECORATION --- */}
        <div className="absolute bottom-8 right-8 w-24 h-24 opacity-30 pointer-events-none z-0 rotate-12">
            <svg viewBox="0 0 100 100" fill="none" stroke="#8b6f56" strokeWidth="2">
                <circle cx="50" cy="50" r="45" />
                <path d="M50 5 L55 45 L95 50 L55 55 L50 95 L45 55 L5 50 L45 45 Z" fill="#3e3226" />
                <path d="M50 5 L50 95 M5 50 L95 50" strokeWidth="1" />
            </svg>
        </div>

        {/* SVG Path Layer */}
        {/* Added viewBox and preserveAspectRatio so svg coordinates 0-100 match the % based positioning of divs */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path 
                d={pathData} 
                fill="none" 
                stroke="#5c4a3d" 
                strokeWidth="2" 
                strokeDasharray="3 2"
                vectorEffect="non-scaling-stroke"
                className="opacity-70"
            />
            {/* Main Path Glow */}
            <path 
                d={pathData} 
                fill="none" 
                stroke="#d4af37" 
                strokeWidth="1" 
                vectorEffect="non-scaling-stroke"
                className="drop-shadow-[0_0_2px_rgba(212,175,55,0.8)]"
            />
        </svg>

        {/* Interactive Points */}
        {infographicPoints.map((point) => (
          <div 
            key={point.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center group/point transition-transform duration-500"
            style={{ left: `${point.x}%`, top: `${point.y}%` }}
          >
             {/* The Point Icon Button */}
             <button
                onClick={() => setActivePoint(point)}
                className={`
                    w-12 h-12 md:w-16 md:h-16 rounded-full border-[3px] 
                    ${point.color === 'red' ? 'bg-[#5a1a1a] border-[#ff6b6b]' : 
                      point.color === 'emerald' ? 'bg-[#1a4031] border-[#4ade80]' :
                      point.color === 'indigo' ? 'bg-[#2e2a5a] border-[#818cf8]' :
                      'bg-[#4a3b2a] border-[#fbbf24]'}
                    flex items-center justify-center text-2xl md:text-3xl shadow-[0_4px_10px_rgba(0,0,0,0.6)] 
                    hover:scale-125 hover:brightness-125 transition-all duration-300 cursor-pointer animate-fadeIn
                    relative
                    hover:z-30
                `}
             >
               {point.icon}
               
               {/* Badge */}
               <span className="absolute -top-2 -right-2 w-6 h-6 bg-[#2b221b] border border-[#8b6f56] rounded-full text-[10px] flex items-center justify-center text-[#dcdcdc] font-bold">
                   {point.id}
               </span>
             </button>
          </div>
        ))}
      </div>
      
      <p className="mt-4 text-[#8b6f56] font-pixel text-[10px] md:text-xs z-10 text-center opacity-80">
          "EXPLORA LAS TIERRAS OLVIDADAS"
      </p>

      {/* MODAL OVERLAY */}
      {activePoint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn" onClick={() => setActivePoint(null)}>
            <div 
                className="bg-[#2b221b] w-full max-w-lg rounded-sm border-4 border-[#8b6f56] shadow-[0_0_30px_rgba(0,0,0,1)] relative overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Paper texture on modal */}
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] pointer-events-none"></div>

                {/* Decorative Corners */}
                <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#d4af37]"></div>
                <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#d4af37]"></div>
                <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#d4af37]"></div>
                <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#d4af37]"></div>

                <div className="p-8 text-center relative z-10">
                    <div className="text-6xl mb-4 filter drop-shadow-md animate-bounce">{activePoint.icon}</div>
                    
                    <h3 className="text-2xl md:text-3xl font-pixel text-[#d4af37] mb-2 uppercase tracking-wide">{activePoint.title}</h3>
                    
                    <div className="flex justify-center mb-6">
                         <span className="bg-[#3e3226] text-[#a8a29e] px-3 py-1 text-xs font-bold border border-[#5c4a3d] rounded">
                             ETAPA {activePoint.id}
                         </span>
                    </div>
                    
                    <p className="text-lg text-[#e5e5e5] italic mb-6 font-serif">
                        "{activePoint.description}"
                    </p>

                    <div className="bg-[#1a1512]/60 p-4 rounded border border-[#5c4a3d] text-left text-[#dcdcdc] text-sm leading-relaxed mb-6 font-mono shadow-inner">
                        {activePoint.details || "Los pergaminos no revelan más información por ahora."}
                    </div>

                    <button 
                        onClick={() => setActivePoint(null)}
                        className="px-8 py-3 bg-[#8b6f56] hover:bg-[#a68a6d] text-[#2b221b] font-bold font-pixel rounded shadow-[0_4px_0_#5c4a3d] active:shadow-none active:translate-y-1 transition-all"
                    >
                        Cerrar Pergamino
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveInfographic;