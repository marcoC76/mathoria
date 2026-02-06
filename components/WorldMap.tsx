import React from 'react';
import { World } from '../types';

interface WorldMapProps {
  worlds: World[];
  onSelectWorld: (world: World) => void;
}

const WorldMap: React.FC<WorldMapProps> = ({ worlds, onSelectWorld }) => {
  return (
    <div className="max-w-7xl mx-auto pb-20 animate-fadeIn">
      <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-pixel text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 mb-4 filter drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
            SELECCIONA TU REINO
          </h2>
          <p className="text-slate-400 font-mono uppercase tracking-widest text-sm">Elige tu destino y comienza la aventura</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {worlds.map((world) => (
          <div
            key={world.id}
            onClick={() => onSelectWorld(world)}
            className={`
              relative h-80 rounded-2xl overflow-hidden border-4 
              transition-all duration-500 
              ${world.locked 
                ? 'border-slate-800 cursor-not-allowed opacity-75 grayscale' 
                : 'border-slate-800 cursor-pointer group hover:-translate-y-2 hover:shadow-[0_0_40px_rgba(250,204,21,0.3)] shadow-[0_0_20px_rgba(0,0,0,0.5)]'}
              bg-slate-900
            `}
          >
            {/* Background Gradient Image Simulation */}
            <div className={`absolute inset-0 bg-gradient-to-br ${world.bgGradient} opacity-60 ${world.locked ? 'opacity-20' : 'group-hover:opacity-80'} transition-opacity duration-500`}></div>
            
            {/* Decorative pattern overlay */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] opacity-30"></div>

            {/* LOCKED OVERLAY - CHAINS */}
            {world.locked && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60 backdrop-blur-[2px]">
                    {/* Chain Graphics (CSS borders) */}
                    <div className="absolute top-[20%] -left-4 w-[120%] h-4 border-y-4 border-slate-600 bg-slate-800 transform rotate-12 flex items-center justify-around shadow-xl">
                        {[...Array(6)].map((_, i) => <div key={`c1-${i}`} className="w-2 h-2 rounded-full bg-slate-500"></div>)}
                    </div>
                    <div className="absolute top-[70%] -left-4 w-[120%] h-4 border-y-4 border-slate-600 bg-slate-800 transform -rotate-12 flex items-center justify-around shadow-xl">
                        {[...Array(6)].map((_, i) => <div key={`c2-${i}`} className="w-2 h-2 rounded-full bg-slate-500"></div>)}
                    </div>

                    <div className="text-6xl mb-2 filter drop-shadow-[0_0_15px_black]">🔒</div>
                    <div className="font-pixel text-slate-400 text-xs uppercase tracking-widest border border-slate-600 px-3 py-1 rounded bg-black/80">
                        Sellado
                    </div>
                </div>
            )}

            {/* Inner Content */}
            <div className={`relative z-10 h-full flex flex-col items-center justify-center p-6 text-center ${world.locked ? 'opacity-40 blur-[1px]' : ''}`}>
                
                {/* Floating Icon */}
                <div className={`text-7xl mb-6 transform transition-transform duration-500 filter drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] ${!world.locked && 'group-hover:scale-125 group-hover:rotate-6'}`}>
                    {world.emoji}
                </div>
                
                <h3 className={`text-xl md:text-2xl font-bold font-pixel text-white mb-2 drop-shadow-md transition-colors ${!world.locked && 'group-hover:text-yellow-300'}`}>
                  {world.name}
                </h3>
                
                <div className={`w-12 h-1 bg-white/20 rounded-full mb-4 transition-all duration-500 ${!world.locked && 'group-hover:w-24 group-hover:bg-yellow-400'}`}></div>

                <p className={`text-xs text-slate-200 font-mono transition-all duration-500 ${!world.locked ? 'opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0' : 'opacity-100'}`}>
                  {world.description}
                </p>

                {/* "Play" hint */}
                {!world.locked && (
                    <div className="absolute bottom-4 text-xs font-bold text-yellow-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                        Click para entrar
                    </div>
                )}
            </div>

            {/* Border Glow Effect on Hover (Only if Unlocked) */}
            {!world.locked && (
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-yellow-400/50 rounded-2xl transition-colors duration-500 pointer-events-none"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorldMap;