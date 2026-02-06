import React from 'react';
import { Mission, World } from '../types';

interface MissionSelectProps {
  world: World;
  onSelectMission: (mission: Mission) => void;
  onBack: () => void;
}

const MissionSelect: React.FC<MissionSelectProps> = ({ world, onSelectMission, onBack }) => {
  // Calculate Progress
  const totalMissions = world.missions.length;
  const completedMissions = world.missions.filter(m => m.completed).length;
  const progressPercentage = Math.round((completedMissions / totalMissions) * 100);

  return (
    <div className="animate-fadeIn pb-20">
      
      {/* Header Banner */}
      <div className={`relative rounded-xl overflow-hidden mb-10 border-4 border-slate-700 shadow-2xl`}>
         <div className={`absolute inset-0 bg-gradient-to-r ${world.bgGradient} opacity-80`}></div>
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-30"></div>
         
         <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
             <button 
                onClick={onBack}
                className="absolute top-4 left-4 px-4 py-2 bg-black/40 hover:bg-black/60 text-white rounded font-pixel text-xs border border-white/20 transition-colors"
             >
                ← Mapa
             </button>

             <div className="text-8xl md:text-9xl filter drop-shadow-[0_0_20px_rgba(255,255,255,0.4)] animate-float">
                {world.emoji}
             </div>
             
             <div className="text-center md:text-left flex-grow">
                 <h1 className="text-4xl md:text-6xl font-pixel text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] mb-2">
                    {world.name}
                 </h1>
                 <p className="text-lg text-slate-200 font-mono bg-black/30 inline-block px-4 py-1 rounded backdrop-blur-sm border border-white/10 mb-4">
                    {world.description}
                 </p>
                 
                 {/* Kingdom Progress Bar */}
                 <div className="max-w-md mx-auto md:mx-0">
                    <div className="flex justify-between text-xs font-bold text-white mb-1 uppercase tracking-wider">
                        <span>Progreso del Reino</span>
                        <span>{progressPercentage}%</span>
                    </div>
                    <div className="w-full h-3 bg-black/50 rounded-full border border-white/20 overflow-hidden relative">
                        <div 
                            className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(250,204,21,0.6)]"
                            style={{ width: `${progressPercentage}%` }}
                        />
                    </div>
                 </div>
             </div>
         </div>
      </div>

      {/* Quest List Container */}
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6 px-2">
            <h2 className="text-2xl font-pixel text-yellow-500">TABLÓN DE MISIONES</h2>
            <div className="text-xs font-mono text-slate-400">{completedMissions} / {totalMissions} Completadas</div>
        </div>

        <div className="space-y-4">
            {world.missions.map((mission, idx) => (
            <div 
                key={mission.id}
                onClick={() => onSelectMission(mission)}
                className={`
                group relative p-1 rounded-lg transition-all duration-300
                ${mission.locked 
                    ? 'opacity-60 grayscale cursor-not-allowed' 
                    : 'cursor-pointer hover:scale-[1.02]'}
                `}
            >
                {/* Card Background & Border */}
                <div className={`
                    absolute inset-0 rounded-lg border-2 transition-colors
                    ${mission.completed 
                        ? 'border-green-500 bg-green-900/20 shadow-[0_0_15px_rgba(34,197,94,0.3)]' 
                        : mission.locked 
                            ? 'border-slate-700 bg-slate-800' 
                            : 'border-slate-600 bg-slate-800 group-hover:border-yellow-500 group-hover:bg-slate-700'} 
                `}></div>

                {/* Content */}
                <div className="relative z-10 flex items-center p-4 gap-4 md:gap-6">
                    
                    {/* Icon / Number */}
                    <div className={`
                        w-16 h-16 flex-shrink-0 flex items-center justify-center rounded-lg border-2 font-bold text-2xl shadow-inner relative overflow-hidden
                        ${mission.completed ? 'bg-green-800 border-green-400 text-green-200' :
                          mission.locked ? 'bg-slate-900 border-slate-700 text-slate-600' : 
                          mission.type === 'Jefe Final' ? 'bg-red-900/50 border-red-500 text-red-200' : 
                          mission.type === 'Puzzle' ? 'bg-purple-900/50 border-purple-500 text-purple-200' :
                          'bg-slate-900 border-blue-500 text-blue-200'}
                    `}>
                        {mission.completed && <div className="absolute inset-0 bg-green-500 opacity-20 animate-pulse"></div>}
                        {mission.completed ? '✓' : mission.locked ? '🔒' : mission.type === 'Jefe Final' ? '💀' : mission.type === 'Puzzle' ? '🧩' : (idx + 1)}
                    </div>

                    {/* Text Info */}
                    <div className="flex-grow">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-1">
                            <h3 className={`text-lg md:text-xl font-bold font-pixel ${mission.completed ? 'text-green-400' : mission.locked ? 'text-slate-500' : 'text-white group-hover:text-yellow-400'}`}>
                                {mission.title}
                            </h3>
                            
                            {/* Badges & Stars */}
                            <div className="flex items-center gap-3">
                                {mission.completed && (
                                    <div className="flex gap-1 text-yellow-400 text-sm">
                                        {[...Array(3)].map((_, i) => (
                                            <span key={i} className={i < (mission.stars || 1) ? "opacity-100" : "opacity-30 text-slate-500"}>★</span>
                                        ))}
                                    </div>
                                )}
                                <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded border ${
                                    mission.difficulty === 'Fácil' ? 'bg-green-900/40 border-green-700 text-green-400' :
                                    mission.difficulty === 'Medio' ? 'bg-yellow-900/40 border-yellow-700 text-yellow-400' :
                                    mission.difficulty === 'Legendario' ? 'bg-red-900/40 border-red-700 text-red-400' :
                                    'bg-purple-900/40 border-purple-700 text-purple-400'
                                }`}>
                                    {mission.difficulty}
                                </span>
                            </div>
                        </div>
                        <p className="text-sm text-slate-400 font-mono truncate">
                            {mission.description}
                        </p>
                    </div>

                    {/* Arrow */}
                    {!mission.locked && (
                        <div className="hidden md:flex text-yellow-500 text-xl opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300">
                            ▶
                        </div>
                    )}
                </div>
            </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default MissionSelect;