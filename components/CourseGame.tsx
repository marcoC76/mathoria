import React, { useState, useEffect, useRef } from 'react';
import { Mission, CourseStep } from '../types';
import { playSound } from '../utils/sound';
import { getCharacter } from '../data/characters';

interface CourseGameProps {
  mission: Mission;
  onComplete: (stars: number) => void;
  onBack: () => void;
}

// Interface for floating damage text
interface FloatingText {
  id: number;
  x: number;
  y: number;
  text: string;
  color: string;
}

// Interface for confetti particles
interface Particle {
  id: number;
  x: number;
  y: number; // Start Y (randomized top offset)
  color: string;
  rotation: number;
  delay: number;
}

// Memory Game Card Interface - Simplified to read-only data
interface MemoryCard {
  uniqueId: number;
  pairId: number;
  content: string;
}

// Helper to shuffle arrays
const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

const CourseGame: React.FC<CourseGameProps> = ({ mission, onComplete, onBack }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showTheory, setShowTheory] = useState(false);
  const [mistakes, setMistakes] = useState(0); // Track mistakes for star rating
  
  // Game States
  const [minigameCompleted, setMinigameCompleted] = useState(false);
  
  // Puzzle States
  const [puzzleSelection, setPuzzleSelection] = useState<number[]>([]);
  const [puzzleCompleted, setPuzzleCompleted] = useState(false);

  // Memory Game States (REFACTORED)
  const [memoryCards, setMemoryCards] = useState<MemoryCard[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedIndices, setMatchedIndices] = useState<number[]>([]);
  const [memoryProcessing, setMemoryProcessing] = useState(false);

  // Alchemy Game States (NEW)
  const [alchemyCauldron, setAlchemyCauldron] = useState<string[]>([]); // Array of Ingredient IDs
  const [alchemyCompleted, setAlchemyCompleted] = useState(false);
  const [isMixing, setIsMixing] = useState(false);

  // Cryptex States (NEW)
  const [cryptexValues, setCryptexValues] = useState<number[]>([]);
  const [cryptexCompleted, setCryptexCompleted] = useState(false);

  // Maze States (NEW)
  const [mazePlayerPos, setMazePlayerPos] = useState(0);
  const [mazeCompleted, setMazeCompleted] = useState(false);

  // RPG Boss States
  const [bossHp, setBossHp] = useState(100);
  const [playerHp, setPlayerHp] = useState(100);
  const [bossCurrentQ, setBossCurrentQ] = useState(0);
  const [combatLog, setCombatLog] = useState<string[]>([]);
  const [combatState, setCombatState] = useState<'player_turn' | 'enemy_turn' | 'victory' | 'defeat'>('player_turn');
  const [shake, setShake] = useState(false); // Visual effect
  const [bossSeed, setBossSeed] = useState(""); // Random seed for boss appearance
  const [isBossHit, setIsBossHit] = useState(false); // Boss damage animation state

  // --- SHUFFLE STATES ---
  const [shuffledQuizOptions, setShuffledQuizOptions] = useState<{text: string, originalIndex: number}[]>([]);
  const [shuffledMinigameOptions, setShuffledMinigameOptions] = useState<any[]>([]);
  const [shuffledPuzzleItems, setShuffledPuzzleItems] = useState<{text: string, originalIndex: number}[]>([]);
  const [shuffledBossOptions, setShuffledBossOptions] = useState<{text: string, originalIndex: number}[]>([]);
  const [shuffledAlchemyIngredients, setShuffledAlchemyIngredients] = useState<any[]>([]);

  // --- GAME JUICE STATES ---
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const floatIdCounter = useRef(0);

  const step = mission.steps[currentStepIndex];
  const progress = ((currentStepIndex + 1) / mission.steps.length) * 100;

  // Reset states and SHUFFLE options on step change
  useEffect(() => {
    setFeedback(null);
    setShowTheory(false);
    setMinigameCompleted(false);
    setPuzzleSelection([]);
    setPuzzleCompleted(false);
    setShowConfetti(false);
    
    // Memory Reset
    setFlippedIndices([]);
    setMatchedIndices([]);
    setMemoryProcessing(false);

    // Alchemy Reset
    setAlchemyCauldron([]);
    setAlchemyCompleted(false);
    setIsMixing(false);

    // Cryptex Reset
    setCryptexValues([]);
    setCryptexCompleted(false);

    // Maze Reset
    setMazeCompleted(false);
    if (step.type === 'maze' && step.mazeData) {
        setMazePlayerPos(step.mazeData.startIdx);
    }

    // Randomize Quiz Options
    if (step.type === 'quiz' && step.quizData) {
      const opts = step.quizData.options.map((text, index) => ({ text, originalIndex: index }));
      setShuffledQuizOptions(shuffleArray(opts));
    }

    // Randomize Minigame Options
    if (step.type === 'minigame' && step.minigameData) {
      setShuffledMinigameOptions(shuffleArray(step.minigameData.options));
    }

    // Randomize Puzzle Items
    if (step.type === 'puzzle' && step.puzzleData) {
      const items = step.puzzleData.items.map((text, index) => ({ text, originalIndex: index }));
      setShuffledPuzzleItems(shuffleArray(items));
    }

    // Initialize Memory Cards
    if (step.type === 'memory' && step.memoryData) {
      const generatedCards: MemoryCard[] = [];
      let uniqueIdCounter = 0;
      step.memoryData.pairs.forEach(pair => {
        generatedCards.push({ uniqueId: uniqueIdCounter++, pairId: pair.id, content: pair.term });
        generatedCards.push({ uniqueId: uniqueIdCounter++, pairId: pair.id, content: pair.definition });
      });
      setMemoryCards(shuffleArray(generatedCards));
    }

    // Initialize Alchemy
    if (step.type === 'alchemy' && step.alchemyData) {
        setShuffledAlchemyIngredients(shuffleArray(step.alchemyData.ingredients));
    }

    // Initialize Cryptex
    if (step.type === 'cryptex' && step.cryptexData) {
        // Initialize wheels to 0
        setCryptexValues(new Array(step.cryptexData.wheels.length).fill(0));
    }

  }, [currentStepIndex, step]);

  // --- MEMORY GAME LOOP EFFECT ---
  // This watches 'flippedIndices' and handles matching logic automatically
  useEffect(() => {
    if (flippedIndices.length === 2) {
      setMemoryProcessing(true); // Lock input

      const idx1 = flippedIndices[0];
      const idx2 = flippedIndices[1];
      const card1 = memoryCards[idx1];
      const card2 = memoryCards[idx2];

      if (card1 && card2 && card1.pairId === card2.pairId) {
        // MATCH!
        setTimeout(() => {
          setMatchedIndices(prev => [...prev, idx1, idx2]);
          setFlippedIndices([]);
          setMemoryProcessing(false);
          triggerConfetti();
          spawnFloatingText(50, 50, "¡MATCH!", "#facc15");
          playSound('success');

          // Check Win (using updated logic inside timeout)
          if (matchedIndices.length + 2 === memoryCards.length) {
              setFeedback("¡Memoria Perfecta! Has conectado las runas.");
              playSound('win');
              setTimeout(handleNext, 2500);
          }
        }, 800);
      } else {
        // NO MATCH
        setTimeout(() => {
          setFlippedIndices([]); // Flip back
          setMemoryProcessing(false);
          triggerScreenShake();
          setMistakes(prev => prev + 1);
          playSound('error');
        }, 1200);
      }
    }
  }, [flippedIndices, memoryCards]);


  // Boss Logic Init & Shuffle
  useEffect(() => {
    if (step.type === 'boss' && step.bossData) {
      setBossHp(step.bossData.hp);
      setPlayerHp(step.bossData.playerMaxHp || 100);
      setBossCurrentQ(0);
      setCombatLog(["¡El Jefe ha aparecido!"]);
      setCombatState('player_turn');
      setBossSeed(`${step.bossData.name}-${Date.now()}-${Math.floor(Math.random() * 1000)}`);
      playSound('start');
    }
  }, [step]);

  // Randomize Boss Options whenever the question changes
  useEffect(() => {
    if (step.type === 'boss' && step.bossData) {
      const currentQuestion = step.bossData.questions[bossCurrentQ];
      if (currentQuestion) {
        const opts = currentQuestion.options.map((text, index) => ({ text, originalIndex: index }));
        setShuffledBossOptions(shuffleArray(opts));
      }
    }
  }, [bossCurrentQ, step]);

  // --- JUICE FUNCTIONS ---
  
  const spawnFloatingText = (x: number, y: number, text: string, color: string) => {
    const id = floatIdCounter.current++;
    setFloatingTexts(prev => [...prev, { id, x, y, text, color }]);
    
    // Auto remove after animation
    setTimeout(() => {
      setFloatingTexts(prev => prev.filter(ft => ft.id !== id));
    }, 1000);
  };

  const triggerConfetti = () => {
    setShowConfetti(true);
    const newParticles: Particle[] = [];
    const colors = ['#f43f5e', '#ec4899', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b'];
    
    for (let i = 0; i < 50; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100, // % width
        y: Math.random() * -20, // Start above screen
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        delay: Math.random() * 2
      });
    }
    setParticles(newParticles);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const triggerScreenShake = () => {
      setShake(true);
      setTimeout(() => setShake(false), 400); // Matches CSS animation duration
  };

  const triggerBossHit = () => {
    setIsBossHit(true);
    playSound('attack');
    setTimeout(() => setIsBossHit(false), 500);
  };

  const handleNext = () => {
    setFeedback(null);
    if (currentStepIndex < mission.steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      playSound('click');
    } else {
      // Calculate Stars
      let stars = 1;
      if (mistakes === 0) stars = 3;
      else if (mistakes <= 2) stars = 2;
      
      onComplete(stars);
    }
  };

  // --- QUIZ LOGIC ---
  const handleQuizAnswer = (originalIndex: number) => {
    if (!step.quizData) return;
    if (originalIndex === step.quizData.correctIndex) {
      triggerConfetti(); // JUICE: Burst on correct answer
      setFeedback(`¡Correcto! ${step.quizData.explanation}`);
      playSound('success');
      setTimeout(handleNext, 2500); 
    } else {
      triggerScreenShake(); // JUICE: Shake on wrong answer
      setFeedback("Incorrecto. Consulta el grimorio si necesitas ayuda.");
      setMistakes(prev => prev + 1);
      playSound('error');
    }
  };

  // --- MINIGAME LOGIC ---
  const handleMinigameOption = (isCorrect: boolean, feedbackText: string) => {
    if (minigameCompleted) return;

    if (isCorrect) {
      setMinigameCompleted(true);
      triggerConfetti();
      setFeedback(`¡Excelente! ${feedbackText}`);
      playSound('success');
      setTimeout(handleNext, 2000);
    } else {
      triggerScreenShake();
      setFeedback(`Oops: ${feedbackText}`);
      setMistakes(prev => prev + 1);
      playSound('error');
    }
  };

  // --- PUZZLE LOGIC ---
  const handlePuzzleItemClick = (originalIndex: number) => {
    if (puzzleCompleted) return;
    playSound('click');
    if (puzzleSelection.includes(originalIndex)) {
      setPuzzleSelection(puzzleSelection.filter(i => i !== originalIndex)); 
    } else {
      setPuzzleSelection([...puzzleSelection, originalIndex]);
    }
  };

  const checkPuzzleOrder = () => {
    if (!step.puzzleData) return;
    const isCorrect = JSON.stringify(puzzleSelection) === JSON.stringify(step.puzzleData.correctOrder);
    
    if (isCorrect) {
      setPuzzleCompleted(true);
      triggerConfetti();
      setFeedback("¡Secuencia Correcta! Lógica verificada.");
      playSound('success');
      setTimeout(handleNext, 2000);
    } else {
      triggerScreenShake();
      setFeedback("Orden incorrecto. Revisa la teoría e inténtalo de nuevo.");
      setPuzzleSelection([]); 
      setMistakes(prev => prev + 1);
      playSound('error');
    }
  };

  // --- MEMORY CLICK HANDLER ---
  const handleCardClick = (index: number) => {
    // 1. Guards
    if (memoryProcessing) return; // Wait for animation
    if (matchedIndices.includes(index)) return; // Already matched
    if (flippedIndices.includes(index)) return; // Already flipped
    if (flippedIndices.length >= 2) return; // Already processing 2 cards

    playSound('click');
    // 2. Just add to flipped list, let useEffect handle the rest
    setFlippedIndices(prev => [...prev, index]);
  };

  // --- ALCHEMY LOGIC ---
  const handleAlchemyIngredientClick = (ingId: string) => {
    if (alchemyCompleted || isMixing) return;
    playSound('click');
    
    // Toggle ingredient in cauldron
    if (alchemyCauldron.includes(ingId)) {
        setAlchemyCauldron(prev => prev.filter(id => id !== ingId));
    } else {
        // Limit max ingredients: INCREASED TO 6 to allow for complex formulas
        if (alchemyCauldron.length < 6) {
            setAlchemyCauldron(prev => [...prev, ingId]);
        } else {
            // Visual feedback: cauldron full?
            triggerScreenShake();
        }
    }
  };

  const mixAlchemyPotion = () => {
    if (!step.alchemyData) return;
    setIsMixing(true);
    playSound('start'); // Mixing sound

    // Simple comparison: Sort both arrays and compare
    const currentSort = [...alchemyCauldron].sort().join(',');
    const targetSort = [...step.alchemyData.correctCombination].sort().join(',');

    setTimeout(() => {
        if (currentSort === targetSort) {
            setAlchemyCompleted(true);
            triggerConfetti();
            setFeedback(step.alchemyData.feedbackSuccess);
            spawnFloatingText(50, 40, "¡ÉXITO!", "#bef264");
            playSound('success');
            setTimeout(handleNext, 3000);
        } else {
            triggerScreenShake();
            setFeedback(step.alchemyData.feedbackError);
            spawnFloatingText(50, 40, "FALLO", "#ef4444");
            setMistakes(prev => prev + 1);
            playSound('error');
            // Clear cauldron on fail? Optional. Let's keep them so user can adjust.
            // setAlchemyCauldron([]); 
        }
        setIsMixing(false);
    }, 1500); // Fake mixing time
  };

  // --- CRYPTEX LOGIC ---
  const handleCryptexChange = (wheelIndex: number, direction: 'up' | 'down') => {
    if (cryptexCompleted) return;
    playSound('click');
    
    setCryptexValues(prev => {
        const newValues = [...prev];
        if (direction === 'up') {
            newValues[wheelIndex] = (newValues[wheelIndex] + 1) % 10;
        } else {
            newValues[wheelIndex] = (newValues[wheelIndex] - 1 + 10) % 10;
        }
        return newValues;
    });
  };

  const checkCryptex = () => {
    if (!step.cryptexData) return;

    const isCorrect = step.cryptexData.wheels.every((wheel, idx) => wheel.correctValue === cryptexValues[idx]);

    if (isCorrect) {
        setCryptexCompleted(true);
        triggerConfetti();
        setFeedback(step.cryptexData.feedbackSuccess);
        playSound('success');
        setTimeout(handleNext, 3000);
    } else {
        triggerScreenShake();
        setFeedback("Cierre bloqueado. Las variables no coinciden.");
        setMistakes(prev => prev + 1);
        playSound('error');
    }
  };

  // --- MAZE LOGIC ---
  const handleMazeMove = (targetIdx: number) => {
      if (mazeCompleted || !step.mazeData) return;

      const size = step.mazeData.gridSize;
      const currentR = Math.floor(mazePlayerPos / size);
      const currentC = mazePlayerPos % size;
      const targetR = Math.floor(targetIdx / size);
      const targetC = targetIdx % size;

      // Check adjacency (Manhattan distance = 1)
      const dist = Math.abs(currentR - targetR) + Math.abs(currentC - targetC);
      
      if (dist === 1) {
          // Check validity
          const targetCell = step.mazeData.cells[targetIdx];
          if (targetCell.isValid) {
              setMazePlayerPos(targetIdx);
              playSound('click');
              // Check Win
              if (targetIdx === step.mazeData.endIdx) {
                  setMazeCompleted(true);
                  triggerConfetti();
                  setFeedback(step.mazeData.feedbackSuccess);
                  playSound('success');
                  setTimeout(handleNext, 2500);
              }
          } else {
              triggerScreenShake();
              setFeedback(step.mazeData.feedbackError);
              setMistakes(prev => prev + 1);
              playSound('error');
          }
      }
  };


  // --- RPG BOSS LOGIC ---
  const handleBossAttack = (damage: number) => {
    triggerScreenShake();
    
    // JUICE: Floating Damage on Player (Bottom Left area approx)
    spawnFloatingText(20 + Math.random() * 10, 60, `-${damage}`, '#ef4444');
    playSound('damage');

    setPlayerHp(prev => Math.max(0, prev - damage));
  };

  const handleBossAnswer = (originalIndex: number) => {
    if (!step.bossData || combatState !== 'player_turn') return;
    
    const currentQuestion = step.bossData.questions[bossCurrentQ];
    const isCorrect = originalIndex === currentQuestion.correct;

    if (isCorrect) {
      // Player Hits Boss
      const dmg = currentQuestion.damageToBoss;
      triggerBossHit(); // Trigger Boss Animation
      
      // JUICE: Floating Damage on Boss (Center screen approx)
      spawnFloatingText(50 + (Math.random() * 10 - 5), 30, `CRÍTICO -${dmg}`, '#fbbf24');
      
      setBossHp(prev => Math.max(0, prev - dmg));
      setCombatLog([`¡Ataque exitoso! -${dmg} HP al jefe.`]); // Only current log
      
      if (bossHp - dmg <= 0) {
        setCombatState('victory');
        triggerConfetti(); // JUICE: Massive confetti
        setFeedback("¡VICTORIA! El conocimiento ha triunfado.");
        playSound('win');
        setTimeout(handleNext, 4000);
      } else {
        // Next Question preparation
        if (bossCurrentQ < step.bossData.questions.length - 1) {
           setTimeout(() => setBossCurrentQ(prev => prev + 1), 1000);
        } else {
           setCombatState('victory'); 
           triggerConfetti();
           setFeedback("¡El Jefe huye ante tu intelecto!");
           playSound('win');
           setTimeout(handleNext, 4000);
        }
      }
    } else {
      // Player Misses
      setCombatState('enemy_turn');
      setCombatLog(["¡Fallaste! Contraataque inminente..."]);
      setMistakes(prev => prev + 1);
      
      setTimeout(() => {
        const dmg = currentQuestion.damageToPlayer;
        handleBossAttack(dmg);
        setCombatLog([`¡GOLPE RECIBIDO! -${dmg} HP.`]);
        
        if (playerHp - dmg <= 0) {
            setCombatState('defeat');
            playSound('error');
        } else {
            setCombatState('player_turn');
        }
      }, 1500);
    }
  };

  const retryBoss = () => {
    if (!step.bossData) return;
    setBossHp(step.bossData.hp);
    setPlayerHp(step.bossData.playerMaxHp || 100);
    setBossCurrentQ(0);
    setCombatState('player_turn');
    setCombatLog(["¡Reintentando combate!"]);
    setBossSeed(`${step.bossData.name}-${Date.now()}-${Math.floor(Math.random() * 1000)}`);
    playSound('start');
  };

  // Helper to render text with **bold** support
  const renderFormattedText = (text: string) => {
    if (!text) return null;
    return text.split('\n').map((line, i) => (
      <div key={i} className={`min-h-[1em] mb-2 break-words`}>
        {renderInlineText(line)}
      </div>
    ));
  };

  const renderInlineText = (text: string) => {
     if (!text) return null;
     return text.split(/(\*\*.*?\*\*)/g).map((part, j) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={j} className="text-yellow-400 font-bold">{part.slice(2, -2)}</strong>;
        }
        return <span key={j}>{part}</span>;
     });
  };

  // Determine if the current feedback is a success message or not
  const isSuccessFeedback = feedback && (
      feedback.includes("Correcto") || 
      feedback.includes("Excelente") || 
      feedback.includes("Secuencia Correcta") || 
      feedback.includes("Perfecta") || 
      feedback.includes("ÉXITO") ||
      feedback.includes("Código Aceptado") || 
      feedback.includes("exitosa") ||
      feedback.includes("Cruzaste") // Covers Maze success
  );

  return (
    <div className={`fixed inset-0 z-[100] bg-[#0a0a0a] flex flex-col items-center justify-center p-4 relative overflow-hidden animate-fadeIn`}>
      
      {/* CONFETTI LAYER */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none z-[200] overflow-hidden">
          {particles.map((p) => (
            <div 
              key={p.id}
              className="confetti-piece"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                backgroundColor: p.color,
                animationDelay: `${p.delay}s`,
                transform: `rotate(${p.rotation}deg)`
              }}
            ></div>
          ))}
        </div>
      )}

      {/* FLOATING TEXT LAYER */}
      <div className="absolute inset-0 pointer-events-none z-[150] overflow-hidden">
        {floatingTexts.map(ft => (
          <div 
            key={ft.id}
            className="absolute font-pixel font-bold text-2xl md:text-4xl text-shadow animate-float-text"
            style={{ 
              left: `${ft.x}%`, 
              top: `${ft.y}%`, 
              color: ft.color,
              textShadow: '2px 2px 0px #000'
            }}
          >
            {ft.text}
          </div>
        ))}
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 z-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>
      {/* Radial Gradient overlay */}
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-black via-transparent to-black pointer-events-none"></div>

      {/* Main Game Container - SHAKE ANIMATION APPLIED HERE */}
      <div className={`relative z-10 w-full max-w-5xl bg-slate-900 rounded-lg border-2 border-slate-700 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col h-[85vh] md:h-[80vh] transition-transform duration-100 ${shake ? 'animate-shake-hard' : ''}`}>
        
        {/* Header HUD */}
        <div className="bg-slate-950 p-3 border-b-2 border-slate-700 flex justify-between items-center relative z-20">
          <div className="flex flex-col flex-grow min-w-0 mr-4">
              <div className="text-xs text-slate-500 font-mono mb-1 uppercase tracking-widest">Misión Activa</div>
              <h2 className="text-lg md:text-xl font-pixel text-white truncate">{mission.title}</h2>
          </div>
          
          <div className="flex items-center gap-3 flex-shrink-0">
              {/* Theory Button */}
              {step.theory && (
                <button 
                  onClick={() => { playSound('click'); setShowTheory(true); }} 
                  className="px-3 py-1 bg-blue-900/50 hover:bg-blue-800 text-blue-200 text-xs font-pixel rounded border border-blue-700 transition-all whitespace-nowrap flex items-center gap-1 active:scale-95"
                >
                  <span className="text-lg">📖</span> <span className="hidden md:inline">GRIMORIO</span>
                </button>
              )}

              <div className="w-20 md:w-32 h-2 bg-slate-800 rounded-full border border-slate-600 overflow-hidden relative">
                    <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]"
                        style={{ width: `${progress}%` }}
                    />
              </div>
              <button onClick={onBack} className="px-3 py-1 bg-red-900/50 hover:bg-red-800 text-red-200 text-xs font-pixel rounded border border-red-700 transition-all whitespace-nowrap active:scale-95">
                  HUIR
              </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 md:p-10 flex flex-col items-center justify-center w-full overflow-y-auto relative bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
          
          {step.type === 'content' && (
            <div className="animate-pop w-full max-w-3xl bg-slate-900/90 border-2 border-slate-600 p-8 rounded-xl shadow-2xl relative my-auto">
              {/* Decorative corners */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-yellow-500"></div>
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-yellow-500"></div>
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-yellow-500"></div>
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-yellow-500"></div>

              <h1 className="text-3xl md:text-4xl font-bold mb-6 text-emerald-400 font-pixel drop-shadow-md text-center">{step.title}</h1>
              
              {step.image && (
                <div className="w-full h-64 mb-6 rounded-lg overflow-hidden border-2 border-slate-700 shadow-inner relative group">
                     <div className="absolute inset-0 bg-blue-900/20 group-hover:bg-transparent transition-colors z-10"></div>
                    <img src={step.image} alt="Topic" className="w-full h-full object-cover" />
                </div>
              )}
              
              <div className="text-lg text-slate-200 font-mono leading-relaxed bg-black/40 p-4 rounded border border-slate-700 shadow-inner">
                {renderFormattedText(step.content || '')}
              </div>
              
              <button 
                onClick={handleNext}
                className="mt-8 w-full py-4 bg-blue-700 hover:bg-blue-600 border-b-4 border-blue-900 hover:border-blue-800 text-white font-bold rounded font-pixel transition-all active:translate-y-1 active:border-b-0 active:scale-[0.99] shadow-lg hover:shadow-blue-500/50"
              >
                CONTINUAR ▶
              </button>
            </div>
          )}

          {step.type === 'quiz' && step.quizData && (
            <div className="w-full max-w-3xl animate-pop my-auto">
              <div className="text-center mb-8">
                  <h3 className="text-2xl font-pixel text-purple-400 mb-2">DESAFÍO DE CONOCIMIENTO</h3>
                  <div className="h-1 w-24 bg-purple-600 mx-auto rounded-full"></div>
              </div>
              
              <div className="bg-slate-800/90 p-8 rounded-xl border-2 border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.2)] mb-8 min-h-[120px] flex items-center justify-center relative transform hover:scale-[1.01] transition-transform">
                <div className="text-xl md:text-2xl font-serif text-center text-white">
                    {renderFormattedText(step.quizData.question)}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {shuffledQuizOptions.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuizAnswer(opt.originalIndex)}
                    className="group relative p-4 bg-slate-900 border-2 border-slate-700 hover:border-purple-400 rounded-lg text-left transition-all active:scale-95 active:bg-slate-800"
                  >
                    <div className="absolute inset-0 bg-purple-900/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative z-10 flex items-center">
                        <span className="w-8 h-8 flex items-center justify-center bg-slate-800 border border-slate-600 rounded mr-3 font-bold text-purple-400 group-hover:bg-purple-900 group-hover:text-white transition-colors">
                            {String.fromCharCode(65 + idx)}
                        </span> 
                        <span className="text-slate-200 group-hover:text-white font-mono text-sm md:text-base break-words">{renderInlineText(opt.text)}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step.type === 'minigame' && step.minigameData && (
            <div className="animate-pop w-full flex flex-col items-center my-auto">
              <h3 className="text-4xl font-pixel text-yellow-400 mb-2 drop-shadow-lg">SIMULACIÓN</h3>
              <p className="text-slate-400 mb-8 font-mono text-sm uppercase">Entrenamiento Táctico</p>
              
              <div className="bg-slate-800/80 p-6 rounded-lg border border-slate-600 mb-8 max-w-2xl text-center shadow-lg">
                 <div className="text-xl md:text-2xl text-white font-serif">
                     {renderFormattedText(step.minigameData.instruction)}
                 </div>
              </div>
              
              <div className="flex flex-wrap justify-center gap-6 w-full">
                {shuffledMinigameOptions.map((opt, idx) => (
                   <div 
                      key={idx}
                      onClick={() => handleMinigameOption(opt.isCorrect, opt.feedback)}
                      className={`
                        w-40 h-40 md:w-60 md:h-60 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border-4 
                        cursor-pointer transition-all duration-300 hover:scale-110 hover:-translate-y-2 active:scale-95
                        flex items-center justify-center p-6 shadow-xl group relative overflow-hidden
                        ${minigameCompleted && opt.isCorrect ? 'border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.5)]' : 'border-slate-600 hover:border-yellow-400'}
                      `}
                   >
                      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-10"></div>
                      <span className="relative z-10 text-xl md:text-3xl font-bold text-slate-300 group-hover:text-white text-center break-words drop-shadow-md">
                        {renderInlineText(opt.text)}
                      </span>
                   </div>
                ))}
              </div>
            </div>
          )}

          {step.type === 'puzzle' && step.puzzleData && (
            <div className="animate-pop w-full max-w-3xl flex flex-col items-center my-auto">
                <h3 className="text-3xl font-pixel text-cyan-400 mb-2">DESCIFRADO LÓGICO</h3>
                <div className="w-full bg-slate-900/50 p-6 rounded border border-cyan-900/50 mb-8 text-center">
                    <div className="text-slate-200 text-lg font-mono">
                        {renderFormattedText(step.puzzleData.instruction)}
                    </div>
                </div>

                <div className="flex flex-col gap-3 w-full mb-8">
                    {shuffledPuzzleItems.map((item, idx) => {
                        const selectionOrder = puzzleSelection.indexOf(item.originalIndex);
                        const isSelected = selectionOrder !== -1;
                        return (
                            <div 
                                key={idx}
                                onClick={() => handlePuzzleItemClick(item.originalIndex)}
                                className={`
                                    p-5 rounded-lg border-2 cursor-pointer transition-all flex justify-between items-center relative overflow-hidden active:scale-[0.98]
                                    ${isSelected ? 'bg-cyan-900/40 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)]' : 'bg-slate-800 border-slate-600 hover:bg-slate-700'}
                                    ${puzzleCompleted ? 'border-green-500 bg-green-900/30' : ''}
                                `}
                            >
                                <span className="relative z-10 text-lg font-mono text-white break-words">{renderInlineText(item.text)}</span>
                                {isSelected && (
                                    <div className="animate-pop">
                                        <span className="w-8 h-8 rounded border-2 border-cyan-400 bg-cyan-900 text-cyan-200 flex items-center justify-center font-bold font-pixel shrink-0 ml-2 shadow-lg">
                                            {selectionOrder + 1}
                                        </span>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>

                {!puzzleCompleted && (
                    <button 
                        onClick={checkPuzzleOrder}
                        disabled={puzzleSelection.length !== step.puzzleData.items.length}
                        className="px-10 py-4 bg-cyan-700 border-b-4 border-cyan-900 hover:bg-cyan-600 hover:border-cyan-800 text-white font-bold rounded font-pixel transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg active:translate-y-1 active:border-b-0 active:scale-95"
                    >
                        EJECUTAR SECUENCIA
                    </button>
                )}
            </div>
          )}

          {/* MEMORY MATCH (MEMORAMA) */}
          {step.type === 'memory' && step.memoryData && (
            <div className="animate-pop w-full flex flex-col items-center my-auto">
               <h3 className="text-3xl font-pixel text-pink-400 mb-2 drop-shadow-md">RUNAS DE LA MEMORIA</h3>
               <p className="text-slate-400 mb-6 font-mono text-sm uppercase">Encuentra los pares sagrados</p>

               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl w-full">
                  {memoryCards.map((card, idx) => {
                    const isFlipped = flippedIndices.includes(idx) || matchedIndices.includes(idx);
                    const isMatched = matchedIndices.includes(idx);
                    
                    return (
                    <div 
                      key={card.uniqueId} 
                      onClick={() => handleCardClick(idx)}
                      className="group relative w-full h-32 cursor-pointer perspective-1000"
                    >
                       <div className={`
                          w-full h-full relative transform-style-3d transition-transform duration-500 shadow-xl
                          ${isFlipped ? 'rotate-y-180' : ''}
                          ${isMatched ? 'scale-95 opacity-80' : 'hover:scale-105'}
                       `}>
                          {/* FRONT (Hidden side) */}
                          <div className="absolute inset-0 backface-hidden bg-slate-800 border-2 border-slate-600 rounded-xl flex items-center justify-center bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')]">
                             <span className="text-4xl opacity-30 select-none">?</span>
                          </div>

                          {/* BACK (Revealed side) */}
                          <div className={`
                              absolute inset-0 backface-hidden rotate-y-180 rounded-xl flex items-center justify-center p-2 text-center border-2
                              ${isMatched ? 'bg-green-900 border-green-400' : 'bg-pink-900/80 border-pink-400'}
                          `}>
                             <span className="text-white font-bold text-sm md:text-lg select-none break-words leading-tight drop-shadow-md">
                                {card.content}
                             </span>
                             {isMatched && (
                                <div className="absolute -top-2 -right-2 text-2xl animate-bounce">✨</div>
                             )}
                          </div>
                       </div>
                    </div>
                  )})}
               </div>
            </div>
          )}

          {/* ALCHEMY LAB (NEW MINIGAME) */}
          {step.type === 'alchemy' && step.alchemyData && (
             <div className="animate-pop w-full flex flex-col items-center my-auto">
                <h3 className="text-3xl font-pixel text-lime-400 mb-2 drop-shadow-lg">LABORATORIO ALQUÍMICO</h3>
                <p className="text-slate-400 mb-6 font-mono text-sm uppercase">Combina los elementos correctos</p>

                {/* GOAL DISPLAY */}
                <div className="bg-slate-800 border-2 border-lime-600 p-4 rounded-lg mb-8 text-center shadow-[0_0_15px_rgba(132,204,22,0.3)]">
                    <h4 className="text-white font-serif text-xl italic">"{renderInlineText(step.alchemyData.goalMessage)}"</h4>
                </div>

                {/* CAULDRON AREA */}
                <div className="relative w-48 h-48 mb-8 flex items-center justify-center">
                    {/* Bubbles animation */}
                    {isMixing && (
                         <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-full h-full">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="absolute bg-lime-400 rounded-full w-4 h-4 animate-float-text" style={{ 
                                    left: `${20 + Math.random() * 60}%`, 
                                    animationDelay: `${Math.random()}s`,
                                    opacity: 0.7 
                                }}></div>
                            ))}
                         </div>
                    )}
                    
                    {/* Cauldron SVG/Div */}
                    <div className={`
                        w-40 h-32 bg-slate-900 border-b-8 border-x-4 border-slate-700 rounded-b-[4rem] rounded-t-sm relative z-10 flex items-center justify-center flex-wrap gap-1 p-4 content-end overflow-hidden
                        ${isMixing ? 'animate-shake-hard shadow-[0_0_30px_rgba(132,204,22,0.6)]' : 'shadow-xl'}
                    `}>
                        {/* Liquid */}
                        <div className={`absolute bottom-0 w-full bg-lime-900/80 transition-all duration-1000 ${alchemyCauldron.length > 0 ? 'h-3/4' : 'h-2'}`}></div>
                        
                        {/* Floating Ingredients inside */}
                        {alchemyCauldron.map(ingId => {
                            const ing = step.alchemyData?.ingredients.find(i => i.id === ingId);
                            return (
                                <div key={ingId} className="relative z-20 text-xs bg-black/50 text-white px-2 py-1 rounded-full animate-pop">
                                    {ing?.label}
                                </div>
                            )
                        })}
                    </div>
                    {/* Cauldron Legs */}
                    <div className="absolute -bottom-2 left-4 w-4 h-8 bg-slate-800 -rotate-12"></div>
                    <div className="absolute -bottom-2 right-4 w-4 h-8 bg-slate-800 rotate-12"></div>
                </div>

                {/* INGREDIENTS SHELF */}
                <div className="flex flex-wrap justify-center gap-4 mb-8 max-w-2xl">
                    {shuffledAlchemyIngredients.map((ing) => {
                        const isSelected = alchemyCauldron.includes(ing.id);
                        return (
                            <button
                                key={ing.id}
                                onClick={() => handleAlchemyIngredientClick(ing.id)}
                                disabled={alchemyCompleted}
                                className={`
                                    w-16 h-16 rounded-full border-2 flex items-center justify-center text-lg font-bold shadow-lg transition-all
                                    ${isSelected 
                                        ? 'bg-slate-900 border-slate-700 opacity-50 scale-90 grayscale' 
                                        : 'bg-slate-800 border-lime-500 hover:scale-110 hover:bg-lime-900/30 text-lime-100'}
                                `}
                            >
                                {ing.label}
                            </button>
                        )
                    })}
                </div>

                {/* MIX BUTTON */}
                {!alchemyCompleted && (
                    <button
                        onClick={mixAlchemyPotion}
                        disabled={alchemyCauldron.length === 0 || isMixing}
                        className={`
                            px-8 py-3 bg-lime-700 hover:bg-lime-600 border-b-4 border-lime-900 text-white font-bold rounded font-pixel transition-all
                            disabled:opacity-50 disabled:cursor-not-allowed active:translate-y-1 active:border-b-0
                        `}
                    >
                        {isMixing ? 'MEZCLANDO...' : 'TRANSMUTAR'}
                    </button>
                )}
             </div>
          )}

          {/* CRYPTEX (NEW MINIGAME) */}
          {step.type === 'cryptex' && step.cryptexData && (
             <div className="animate-pop w-full flex flex-col items-center my-auto">
                 <h3 className="text-3xl font-pixel text-amber-500 mb-2 drop-shadow-lg">CRIPTEX ANCESTRAL</h3>
                 <p className="text-slate-400 mb-6 font-mono text-sm uppercase">Resuelve las ecuaciones para abrir el sello</p>

                 <div className="bg-slate-800/80 p-4 rounded border border-slate-600 mb-8 max-w-lg text-center">
                    <p className="text-white text-lg font-serif italic">"{step.cryptexData.instruction}"</p>
                 </div>

                 {/* WHEELS CONTAINER */}
                 <div className="flex justify-center gap-4 md:gap-8 mb-8 bg-black/30 p-8 rounded-2xl border-[6px] border-[#5c4a3d] shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] relative">
                    {/* Decorative Lock Bars */}
                    <div className="absolute top-1/2 left-0 w-full h-2 bg-red-900/50 -translate-y-1/2 pointer-events-none z-0"></div>

                    {step.cryptexData.wheels.map((wheel, idx) => (
                        <div key={idx} className="flex flex-col items-center relative z-10 gap-2">
                             <div className="text-amber-400 font-bold mb-1 text-sm">{wheel.label}</div>
                             
                             {/* The Wheel */}
                             <div className="bg-gradient-to-b from-slate-700 via-slate-200 to-slate-700 p-1 rounded-lg shadow-xl w-16 md:w-20">
                                 <button 
                                    onClick={() => handleCryptexChange(idx, 'up')}
                                    className="w-full h-8 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-t flex items-center justify-center text-xs active:bg-slate-900 transition-colors"
                                 >
                                    ▲
                                 </button>
                                 
                                 <div className="h-16 flex items-center justify-center bg-white text-slate-900 text-4xl font-mono font-bold border-y-2 border-slate-400 shadow-inner select-none">
                                     {cryptexValues[idx]}
                                 </div>

                                 <button 
                                    onClick={() => handleCryptexChange(idx, 'down')}
                                    className="w-full h-8 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-b flex items-center justify-center text-xs active:bg-slate-900 transition-colors"
                                 >
                                    ▼
                                 </button>
                             </div>

                             {/* The Clue */}
                             <div className="mt-2 bg-black/60 px-2 py-1 rounded text-xs text-amber-200 font-mono border border-amber-900/30 whitespace-nowrap">
                                 {renderInlineText(wheel.clue)}
                             </div>
                        </div>
                    ))}
                 </div>

                 {!cryptexCompleted && (
                     <button
                        onClick={checkCryptex}
                        className="px-10 py-4 bg-amber-700 hover:bg-amber-600 border-b-4 border-amber-900 text-white font-bold rounded font-pixel transition-all active:translate-y-1 active:border-b-0 shadow-[0_0_15px_rgba(245,158,11,0.4)]"
                     >
                         DESBLOQUEAR
                     </button>
                 )}
             </div>
          )}

          {/* MAZE (NEW MINIGAME) */}
          {step.type === 'maze' && step.mazeData && (
             <div className="animate-pop w-full flex flex-col items-center my-auto">
                 <h3 className="text-3xl font-pixel text-teal-400 mb-2 drop-shadow-lg">SENDA DE LA VERDAD</h3>
                 <p className="text-slate-400 mb-6 font-mono text-sm uppercase">Recorre el camino correcto</p>

                 <div className="bg-slate-800/80 p-4 rounded border border-slate-600 mb-8 max-w-lg text-center shadow-lg">
                    <p className="text-white text-lg font-serif italic">"{renderInlineText(step.mazeData.instruction)}"</p>
                 </div>

                 <div 
                    className="grid gap-2 mb-8 bg-slate-900 p-2 md:p-4 rounded-xl border-4 border-teal-900 shadow-2xl relative max-w-2xl mx-auto w-full"
                    style={{ gridTemplateColumns: `repeat(${step.mazeData.gridSize}, minmax(0, 1fr))` }}
                 >
                    {step.mazeData.cells.map((cell, idx) => {
                        const isPlayer = mazePlayerPos === idx;
                        const isStart = step.mazeData?.startIdx === idx;
                        const isEnd = step.mazeData?.endIdx === idx;
                        
                        return (
                            <button
                                key={idx}
                                onClick={() => handleMazeMove(idx)}
                                disabled={mazeCompleted}
                                className={`
                                    aspect-square rounded-lg flex flex-col items-center justify-center border-2 transition-all duration-300 relative overflow-hidden group
                                    ${isPlayer 
                                        ? 'bg-teal-700 border-teal-400 shadow-[0_0_20px_rgba(45,212,191,0.5)] z-20 scale-105' 
                                        : isEnd 
                                            ? 'bg-slate-800 border-yellow-500/50' 
                                            : 'bg-slate-800 border-slate-700 hover:bg-slate-700'}
                                `}
                            >
                                {/* Grid texture */}
                                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

                                {/* Content */}
                                <span className={`relative z-10 text-[10px] md:text-sm font-bold text-center p-1 break-words leading-tight ${isPlayer ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>
                                    {renderInlineText(cell.content)}
                                </span>
                                
                                {/* Start Marker */}
                                {isStart && !isPlayer && <span className="absolute bottom-0.5 text-[8px] md:text-[10px] text-teal-500 font-mono">INICIO</span>}
                                {/* End Marker */}
                                {isEnd && <span className="absolute bottom-0.5 text-[8px] md:text-[10px] text-yellow-500 font-mono animate-pulse">META</span>}

                                {/* Player Avatar */}
                                {isPlayer && (
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-bounce">
                                        <span className="text-2xl md:text-3xl filter drop-shadow-md">🧙‍♂️</span>
                                    </div>
                                )}
                            </button>
                        );
                    })}
                 </div>
             </div>
          )}

          {/* BOSS RPG COMBAT RENDERER - MEJORADO */}
          {step.type === 'boss' && step.bossData && (() => {
            const bossAsset = getCharacter(step.bossData.assetId);

            return (
              <div className="w-full h-full flex flex-col relative">
                
                {/* BATTLE SCENE */}
                <div className="flex-1 flex flex-col items-center justify-center relative bg-slate-950/90 rounded-lg overflow-hidden p-4">
                    {/* Boss Avatar & Animation */}
                    <div className={`text-9xl mb-4 transition-transform duration-100 ${isBossHit ? 'animate-shake-hard opacity-50' : 'animate-float'}`}>
                        {bossAsset?.avatar || '💀'}
                    </div>
                    
                    {/* Boss Name & HP */}
                    <div className="w-full max-w-md mb-8">
                        <div className={`flex justify-between font-bold font-pixel mb-1 ${bossAsset?.color || 'text-red-400'}`}>
                            <span>{step.bossData.name}</span>
                            <span>{bossHp}/{step.bossData.hp} HP</span>
                        </div>
                        <div className="w-full h-4 bg-red-900 rounded-full border border-red-700 overflow-hidden relative shadow-[0_0_10px_rgba(239,68,68,0.5)]">
                            <div 
                                className="h-full bg-red-500 transition-all duration-300"
                                style={{ width: `${(bossHp / step.bossData.hp) * 100}%` }}
                            />
                        </div>
                    </div>

                    {/* Player HP */}
                    <div className="w-full max-w-md mb-8">
                        <div className="flex justify-between text-green-400 font-bold font-pixel mb-1">
                            <span>HÉROE</span>
                            <span>{playerHp}/{step.bossData.playerMaxHp || 100} HP</span>
                        </div>
                        <div className="w-full h-4 bg-green-900 rounded-full border border-green-700 overflow-hidden relative shadow-[0_0_10px_rgba(34,197,94,0.5)]">
                            <div 
                                className="h-full bg-green-500 transition-all duration-300"
                                style={{ width: `${(playerHp / (step.bossData.playerMaxHp || 100)) * 100}%` }}
                            />
                        </div>
                    </div>

                    {/* Combat Log */}
                    <div className="h-12 flex items-center justify-center mb-4">
                        {combatLog.map((log, i) => (
                            <div key={i} className="text-yellow-300 font-mono text-sm bg-black/50 px-3 py-1 rounded border border-yellow-900 animate-fadeIn">
                                {log}
                            </div>
                        ))}
                    </div>
                </div>

                {/* ACTION PANEL (Bottom) */}
                <div className="h-[40%] bg-slate-900 border-t-4 border-slate-700 p-4 flex flex-col relative z-20">
                    {combatState === 'victory' ? (
                        <div className="flex-1 flex flex-col items-center justify-center animate-pop">
                            <h3 className="text-4xl text-yellow-400 font-pixel mb-4 text-center">¡VICTORIA!</h3>
                            <button onClick={handleNext} className="px-8 py-3 bg-yellow-600 hover:bg-yellow-500 text-black font-bold font-pixel rounded shadow-lg animate-bounce">
                                CONTINUAR VIAJE
                            </button>
                        </div>
                    ) : combatState === 'defeat' ? (
                        <div className="flex-1 flex flex-col items-center justify-center animate-pop">
                            <h3 className="text-4xl text-red-500 font-pixel mb-4 text-center">DERROTA...</h3>
                            <button onClick={retryBoss} className="px-8 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold font-pixel rounded shadow-lg">
                                REINTENTAR
                            </button>
                        </div>
                    ) : (
                        <>
                          <div className="bg-black/40 p-4 rounded border-2 border-slate-600 mb-4 flex-1 overflow-y-auto flex items-center justify-center">
                              <p className="text-lg md:text-xl text-white font-serif text-center">
                                  {renderFormattedText(step.bossData.questions[bossCurrentQ].q)}
                              </p>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3">
                              {shuffledBossOptions.map((opt, idx) => (
                                  <button
                                      key={idx}
                                      onClick={() => handleBossAnswer(opt.originalIndex)}
                                      disabled={combatState !== 'player_turn'}
                                      className="p-3 bg-slate-800 hover:bg-slate-700 border-2 border-slate-600 hover:border-yellow-500 text-left text-sm md:text-base rounded transition-all active:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                      <span className="text-yellow-500 font-bold mr-2">⚔️</span>
                                      {renderInlineText(opt.text)}
                                  </button>
                              ))}
                          </div>
                        </>
                    )}
                </div>
              </div>
            );
          })()}

        </div>
      </div>
    </div>
  );
};

export default CourseGame;