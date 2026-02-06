import React, { useState, useEffect } from 'react';
import { World, Mission, PlayerProfile } from './types';
import { worldsData as initialWorldsData } from './data/algebraContent';
import { getHeroes, getCharacter } from './data/characters';
import WorldMap from './components/WorldMap';
import MissionSelect from './components/MissionSelect';
import CourseGame from './components/CourseGame';
import InteractiveMindMap from './components/InteractiveMindMap';
import InteractiveInfographic from './components/InteractiveInfographic';
import { playSound } from './utils/sound';

type Screen = 'lobby' | 'worlds' | 'missions' | 'game' | 'mindmap' | 'infographic';

const App: React.FC = () => {
  const [screen, setScreen] = useState<Screen>('lobby');
  
  // State with LocalStorage Initialization
  const [worlds, setWorlds] = useState<World[]>(() => {
      const saved = localStorage.getItem('mathoria_worlds');
      return saved ? JSON.parse(saved) : initialWorldsData;
  });
  
  const [userXp, setUserXp] = useState(() => {
      const saved = localStorage.getItem('mathoria_xp');
      return saved ? parseInt(saved) : 0;
  });

  const [playerProfile, setPlayerProfile] = useState<PlayerProfile>(() => {
      const saved = localStorage.getItem('mathoria_profile');
      return saved ? JSON.parse(saved) : { name: 'Viajero', characterId: 'wizard' };
  });

  const [selectedWorld, setSelectedWorld] = useState<World | null>(null);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  
  // God Mode State
  const [isGodMode, setIsGodMode] = useState(false);
  const [showGodModeModal, setShowGodModeModal] = useState(false);
  const [godModeInput, setGodModeInput] = useState("");
  const [godModeError, setGodModeError] = useState("");
  
  // Avatar Selection Modal
  const [showAvatarSelect, setShowAvatarSelect] = useState(false);

  // Persistence Effect
  useEffect(() => {
      localStorage.setItem('mathoria_worlds', JSON.stringify(worlds));
      localStorage.setItem('mathoria_xp', userXp.toString());
      localStorage.setItem('mathoria_profile', JSON.stringify(playerProfile));
  }, [worlds, userXp, playerProfile]);

  // Derived state: Logic for World Locking and Mission Locking
  const displayWorlds = worlds.map((world, index) => {
    // 1. Calculate World Locked Status
    let isWorldLocked = false;
    
    if (index > 0) {
        // A world is locked if the previous world's LAST mission (Boss) is NOT completed
        const prevWorld = worlds[index - 1];
        const prevBoss = prevWorld.missions[prevWorld.missions.length - 1];
        if (!prevBoss.completed) {
            isWorldLocked = true;
        }
    }

    // 2. God Mode Override for World
    if (isGodMode) isWorldLocked = false;

    // 3. Process Missions (Unlock all if God Mode)
    const processedMissions = world.missions.map(m => ({
        ...m,
        locked: isGodMode ? false : m.locked
    }));

    return {
        ...world,
        locked: isWorldLocked,
        missions: processedMissions
    };
  });

  // Find the selected world from the displayWorlds array
  const currentDisplayWorld = selectedWorld 
    ? displayWorlds.find(w => w.id === selectedWorld.id) || null 
    : null;
    
  // Get Current Character Asset
  const currentCharacter = getCharacter(playerProfile.characterId);
  const heroList = getHeroes();

  const handleGodModeClick = () => {
    playSound('click');
    if (isGodMode) {
      setIsGodMode(false);
      // Optional feedback
    } else {
      setShowGodModeModal(true);
      setGodModeInput("");
      setGodModeError("");
    }
  };

  const submitGodMode = (e: React.FormEvent) => {
    e.preventDefault();
    const pass = godModeInput.trim().toUpperCase();
    if (pass === "MATHORIA" || pass === "OMEGA") {
      setIsGodMode(true);
      setShowGodModeModal(false);
      playSound('success');
    } else {
      setGodModeError("Contraseña incorrecta. Los sellos permanecen cerrados.");
      playSound('error');
    }
  };

  const handleWorldSelect = (world: World) => {
    // Check if the world is locked in the derived state
    const displayWorld = displayWorlds.find(w => w.id === world.id);
    
    if (displayWorld?.locked) {
        playSound('error');
        return; 
    }
    playSound('click');
    setSelectedWorld(world);
    setScreen('missions');
  };

  const handleMissionSelect = (mission: Mission) => {
    if (mission.locked && !isGodMode) {
      alert("¡Esta misión está bloqueada! Completa las anteriores primero.");
      playSound('error');
      return;
    }
    playSound('start');
    setSelectedMission(mission);
    setScreen('game');
  };

  const handleMissionComplete = (starsEarned: number) => {
    if (!selectedWorld || !selectedMission) return;

    setUserXp(prev => prev + 100);

    // Create a deep copy of worlds to update state
    const newWorlds = worlds.map(world => {
      if (world.id !== selectedWorld.id) return world;

      const missionIndex = world.missions.findIndex(m => m.id === selectedMission.id);
      if (missionIndex === -1) return world;

      const newMissions = [...world.missions];
      
      const currentStars = newMissions[missionIndex].stars || 0;
      
      // 1. Mark current mission as completed and Update stars (only if better)
      newMissions[missionIndex] = { 
          ...newMissions[missionIndex], 
          completed: true,
          stars: Math.max(currentStars, starsEarned)
      };

      // 2. Unlock next mission if it exists
      if (missionIndex + 1 < newMissions.length) {
        newMissions[missionIndex + 1] = { ...newMissions[missionIndex + 1], locked: false };
      }

      return { ...world, missions: newMissions };
    });

    setWorlds(newWorlds);
    
    setScreen('missions');
    
    // Check if it was the last mission (Boss) to announce World Unlock
    if (worldIsCompleted(selectedWorld, selectedMission)) {
         setTimeout(() => {
             alert("¡REINO COMPLETADO! El sello del siguiente mundo se ha roto.");
             playSound('win');
         }, 500);
    }
  };

  // Helper to check if this was the final boss
  const worldIsCompleted = (world: World, mission: Mission) => {
      const lastMission = world.missions[world.missions.length - 1];
      return mission.id === lastMission.id;
  };

  const selectAvatar = (characterId: string) => {
      setPlayerProfile(prev => ({ ...prev, characterId }));
      setShowAvatarSelect(false);
      playSound('success');
  };
  
  const resetProgress = () => {
      if(confirm("¿Estás seguro de que quieres borrar todo tu progreso?")) {
          localStorage.clear();
          window.location.reload();
      }
  };

  return (
    <div className="bg-[#0f172a] min-h-screen text-slate-100 font-sans selection:bg-yellow-500 selection:text-black overflow-x-hidden relative">
      
      {/* --- CRT OVERLAY LAYERS --- */}
      <div className="crt-scanlines"></div>
      <div className="crt-vignette"></div>
      <div className="retro-screen-tint"></div>

      {/* Background Texture for the whole app */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-40"></div>
      
      {/* HUD / Top Bar */}
      <div className="fixed top-0 left-0 w-full z-50 p-4 pointer-events-none">
        <div className="max-w-7xl mx-auto flex justify-between items-start">
            
            {/* Logo Area */}
            <div 
                className="pointer-events-auto bg-slate-900/90 backdrop-blur-md border-2 border-slate-700 rounded-lg px-4 py-2 shadow-[0_0_15px_rgba(0,0,0,0.5)] flex items-center gap-3 cursor-pointer hover:border-yellow-500 transition-colors" 
                onClick={() => { playSound('click'); setScreen('lobby'); }}
            >
                <div className={`w-10 h-10 bg-gradient-to-br ${isGodMode ? 'from-purple-600 to-pink-600 animate-pulse' : 'from-yellow-500 to-orange-700'} rounded flex items-center justify-center text-xl shadow-inner border ${isGodMode ? 'border-purple-300' : 'border-yellow-300'}`}>
                    {isGodMode ? '⚡' : currentCharacter.avatar}
                </div>
                <div className="hidden md:block">
                    <h1 className={`font-pixel text-sm tracking-widest ${isGodMode ? 'text-purple-400' : 'text-yellow-400'}`}>
                        MATHORIA {isGodMode && <span className="text-[10px] text-white bg-purple-900 px-1 rounded ml-1">GOD MODE</span>}
                    </h1>
                    <p className="text-[10px] text-slate-400 font-mono uppercase">RPG Educativo</p>
                </div>
            </div>

            {/* Player Stats & Tools Area */}
            <div className="pointer-events-auto flex items-center gap-4">
                
                {/* Avatar / Profile Trigger */}
                <button 
                  onClick={() => setShowAvatarSelect(true)}
                  className="w-10 h-10 flex items-center justify-center bg-slate-800 rounded-lg border-2 border-slate-600 hover:border-blue-400 transition-all text-xl"
                  title="Cambiar Avatar"
                >
                   {currentCharacter.avatar}
                </button>

                {/* God Mode Trigger */}
                <button 
                  onClick={handleGodModeClick}
                  className={`
                    w-10 h-10 flex items-center justify-center rounded-lg border-2 transition-all shadow-lg
                    ${isGodMode 
                        ? 'bg-purple-900/80 border-purple-500 text-purple-200 shadow-[0_0_15px_rgba(168,85,247,0.5)]' 
                        : 'bg-slate-900/90 border-slate-700 text-slate-500 hover:text-yellow-400 hover:border-yellow-500'}
                  `}
                  title={isGodMode ? "Desactivar Modo Dios" : "Desbloquear Secretos"}
                >
                   {isGodMode ? '🔓' : '🔑'}
                </button>

                {/* XP Bar */}
                <div className="bg-slate-900/90 backdrop-blur-md border-2 border-slate-700 rounded-lg px-4 py-2 flex flex-col items-end shadow-lg">
                    <div className="flex justify-between w-full gap-8 mb-1">
                        <span className={`text-[10px] font-bold tracking-wider ${isGodMode ? 'text-purple-400' : 'text-yellow-500'}`}>
                            {isGodMode ? 'OMNIPOTENTE' : `NVL. ${Math.floor(userXp / 500) + 1}`}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                            {isGodMode ? '∞' : userXp} XP
                        </span>
                    </div>
                    <div className="w-32 md:w-48 h-2 bg-slate-800 rounded-full border border-slate-600 overflow-hidden relative">
                        <div 
                            className={`absolute inset-0 bg-gradient-to-r shadow-[0_0_10px_rgba(16,185,129,0.8)] ${isGodMode ? 'from-purple-500 to-pink-500 w-full animate-pulse' : 'from-green-600 to-emerald-400'}`} 
                            style={{ width: isGodMode ? '100%' : `${Math.min((userXp % 500) / 500 * 100, 100)}%` }}
                        ></div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      <div className="relative z-10 pt-24 pb-12 px-4">
        {screen === 'lobby' && (
          <div className="flex flex-col items-center justify-center min-h-[75vh] max-w-6xl mx-auto animate-fadeIn">
            
            <div className="text-center mb-16 relative">
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] blur-[100px] rounded-full pointer-events-none ${isGodMode ? 'bg-purple-500/30' : 'bg-blue-500/20'}`}></div>
                <h1 className={`text-5xl md:text-8xl font-pixel text-transparent bg-clip-text drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)] relative z-10 mb-4 transform hover:scale-105 transition-transform duration-500 cursor-default ${isGodMode ? 'bg-gradient-to-b from-purple-300 via-fuchsia-500 to-indigo-600' : 'bg-gradient-to-b from-yellow-300 via-yellow-500 to-orange-600'}`}>
                  MATHORIA
                </h1>
                <p className="text-lg md:text-2xl text-slate-300 font-mono tracking-widest uppercase text-shadow">
                    Presiona Start para Continuar
                </p>
                <div className="mt-4 flex justify-center gap-4">
                     <button onClick={() => { playSound('click'); setScreen('worlds'); }} className="animate-pulse text-yellow-500 font-pixel text-sm">
                         [ START GAME ]
                     </button>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full items-stretch">
              
              {/* 1. MAPA MUNDI (Left) */}
              <button 
                onClick={() => { playSound('click'); setScreen('infographic'); }}
                className="group relative bg-slate-800 rounded-2xl border-2 border-slate-600 p-1 overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(168,85,247,0.6)]"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-purple-900/50 to-slate-900 z-0"></div>
                <div className="relative z-10 bg-slate-900/80 h-full rounded-xl p-8 flex flex-col items-center text-center backdrop-blur-sm border border-slate-700 group-hover:border-purple-400 transition-colors">
                    <div className="w-20 h-20 bg-purple-900/50 rounded-full flex items-center justify-center text-5xl mb-6 shadow-[0_0_20px_rgba(168,85,247,0.4)] group-hover:scale-110 transition-transform">
                        🗺️
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold font-pixel text-purple-400 mb-3 group-hover:text-purple-300">MAPA MUNDI</h3>
                    <div className="h-px w-12 bg-purple-500/50 mb-4 group-hover:w-full transition-all duration-500"></div>
                    <p className="text-sm text-slate-400 font-mono leading-relaxed">
                        Visualiza las tierras conquistadas y tu ruta de viaje.
                    </p>
                </div>
              </button>

              {/* 2. MODO HISTORIA (Center - Main) */}
              <button 
                onClick={() => { playSound('click'); setScreen('worlds'); }}
                className={`
                   group relative bg-slate-800 rounded-2xl p-1 overflow-hidden transition-all duration-300 hover:-translate-y-4 transform scale-105 z-10
                   ${isGodMode ? 'border-4 border-purple-500 shadow-[0_0_50px_rgba(168,85,247,0.6)]' : 'border-4 border-yellow-600/50 hover:shadow-[0_0_50px_rgba(234,179,8,0.4)]'}
                `}
              >
                <div className={`absolute inset-0 bg-gradient-to-b z-0 animate-pulse-slow ${isGodMode ? 'from-purple-900/60 to-slate-900' : 'from-yellow-900/40 to-slate-900'}`}></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                
                <div className={`relative z-10 bg-slate-900/80 h-full rounded-xl p-8 flex flex-col items-center text-center backdrop-blur-sm border transition-colors ${isGodMode ? 'border-purple-500' : 'border-slate-700 group-hover:border-yellow-400'}`}>
                    <div className={`absolute top-4 right-4 animate-bounce ${isGodMode ? 'text-purple-400' : 'text-yellow-500'}`}>▼</div>
                    
                    <div className={`w-24 h-24 bg-gradient-to-br rounded-full flex items-center justify-center text-6xl mb-6 shadow-[0_0_30px_rgba(59,130,246,0.6)] group-hover:rotate-12 transition-transform border-4 border-slate-800 ring-4 ${isGodMode ? 'from-purple-600 to-indigo-900 ring-purple-500/50' : 'from-blue-600 to-blue-900 ring-yellow-500/30'}`}>
                        {isGodMode ? '⚡' : '⚔️'}
                    </div>
                    <h3 className={`text-2xl md:text-3xl font-bold font-pixel mb-2 drop-shadow-md ${isGodMode ? 'text-purple-300' : 'text-yellow-400 group-hover:text-yellow-200'}`}>MODO HISTORIA</h3>
                    <p className={`text-xs font-bold uppercase tracking-widest mb-4 ${isGodMode ? 'text-purple-500' : 'text-yellow-600'}`}>
                        {isGodMode ? 'ACCESO TOTAL' : 'JUGAR CAMPAÑA'}
                    </p>
                    
                    <p className="text-sm text-slate-300 font-mono leading-relaxed">
                        Entra en los 8 reinos, aprende hechizos y derrota a los jefes finales.
                    </p>
                    
                    <div className={`mt-6 px-6 py-2 text-slate-900 font-bold font-pixel text-xs rounded shadow-lg transition-colors ${isGodMode ? 'bg-purple-500 hover:bg-purple-400' : 'bg-yellow-600 group-hover:bg-yellow-400'}`}>
                        START
                    </div>
                </div>
              </button>

              {/* 3. GRIMORIO (Right) */}
              <button 
                onClick={() => { playSound('click'); setScreen('mindmap'); }}
                className="group relative bg-slate-800 rounded-2xl border-2 border-slate-600 p-1 overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(16,185,129,0.6)]"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/50 to-slate-900 z-0"></div>
                <div className="relative z-10 bg-slate-900/80 h-full rounded-xl p-8 flex flex-col items-center text-center backdrop-blur-sm border border-slate-700 group-hover:border-emerald-400 transition-colors">
                    <div className="w-20 h-20 bg-emerald-900/50 rounded-full flex items-center justify-center text-5xl mb-6 shadow-[0_0_20px_rgba(16,185,129,0.4)] group-hover:scale-110 transition-transform">
                        📜
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold font-pixel text-emerald-400 mb-3 group-hover:text-emerald-300">GRIMORIO</h3>
                    <div className="h-px w-12 bg-emerald-500/50 mb-4 group-hover:w-full transition-all duration-500"></div>
                    <p className="text-sm text-slate-400 font-mono leading-relaxed">
                        Consulta el árbol de habilidades y los secretos desbloqueados.
                    </p>
                </div>
              </button>
            </div>

            <div className="mt-12">
                 <button onClick={resetProgress} className="text-xs text-red-900 hover:text-red-500 transition-colors font-mono uppercase border-b border-dashed border-red-900 hover:border-red-500">
                     Borrar Progreso
                 </button>
            </div>
          </div>
        )}

        {screen === 'worlds' && (
          <WorldMap worlds={displayWorlds} onSelectWorld={handleWorldSelect} />
        )}

        {screen === 'missions' && currentDisplayWorld && (
          <MissionSelect 
            world={currentDisplayWorld} 
            onSelectMission={handleMissionSelect} 
            onBack={() => { playSound('click'); setScreen('worlds'); }} 
          />
        )}

        {screen === 'game' && selectedMission && (
          <CourseGame 
            mission={selectedMission} 
            onComplete={handleMissionComplete} 
            onBack={() => { playSound('click'); setScreen('missions'); }} 
          />
        )}

        {screen === 'mindmap' && (
          <InteractiveMindMap onBack={() => { playSound('click'); setScreen('lobby'); }} />
        )}

        {screen === 'infographic' && (
          <InteractiveInfographic onBack={() => { playSound('click'); setScreen('lobby'); }} />
        )}
      </div>

      {/* GOD MODE MODAL */}
      {showGodModeModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-slate-900 border-2 border-purple-500 rounded-xl p-8 max-w-sm w-full shadow-[0_0_50px_rgba(168,85,247,0.4)] relative">
            <button 
              onClick={() => setShowGodModeModal(false)}
              className="absolute top-2 right-2 text-slate-400 hover:text-white"
            >
              ✕
            </button>
            
            <div className="text-center mb-6">
              <div className="text-4xl mb-2">🔮</div>
              <h3 className="text-xl font-pixel text-purple-400">ACCESO DIVINO</h3>
              <p className="text-xs text-purple-300/70 font-mono mt-2">Introduce la runa de poder</p>
            </div>

            <form onSubmit={submitGodMode} className="flex flex-col gap-4">
              <input 
                type="password" 
                value={godModeInput}
                onChange={(e) => setGodModeInput(e.target.value)}
                placeholder="Contraseña..."
                className="w-full bg-slate-950 border border-purple-900 rounded p-3 text-center text-white font-mono focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                autoFocus
              />
              
              {godModeError && (
                <div className="text-red-400 text-xs text-center font-bold animate-pulse">
                  {godModeError}
                </div>
              )}

              <button 
                type="submit"
                className="w-full py-3 bg-purple-700 hover:bg-purple-600 text-white font-pixel text-xs rounded shadow-lg transition-all"
              >
                LIBERAR
              </button>
            </form>
          </div>
        </div>
      )}

      {/* AVATAR SELECTOR MODAL */}
      {showAvatarSelect && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="bg-slate-900 border-2 border-blue-500 rounded-xl p-8 max-w-2xl w-full relative">
                <button onClick={() => setShowAvatarSelect(false)} className="absolute top-2 right-2 text-slate-400 hover:text-white">✕</button>
                
                <h2 className="text-2xl font-pixel text-blue-400 text-center mb-8">ELIGE TU HÉROE</h2>
                <p className="text-slate-400 text-center font-mono mb-8 text-sm">Seleccionado de la Gran Biblioteca de Mathoria</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-h-[60vh] overflow-y-auto p-2">
                    {heroList.map((hero) => (
                        <div 
                            key={hero.id}
                            onClick={() => selectAvatar(hero.id)}
                            className={`
                                cursor-pointer flex flex-col items-center p-4 rounded-xl border-2 transition-all
                                ${playerProfile.characterId === hero.id 
                                    ? 'bg-blue-900/40 border-blue-400 scale-105 shadow-[0_0_20px_rgba(96,165,250,0.5)]' 
                                    : 'bg-slate-800 border-slate-700 hover:bg-slate-700 hover:border-slate-500'}
                            `}
                        >
                            <div className="text-5xl mb-4 transform hover:scale-110 transition-transform">{hero.avatar}</div>
                            <h3 className={`text-xs font-bold uppercase ${hero.color || 'text-slate-300'}`}>{hero.name}</h3>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      )}

    </div>
  );
};

export default App;