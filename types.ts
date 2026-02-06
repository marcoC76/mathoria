export interface CharacterAsset {
  id: string;
  name: string;
  avatar: string; // The emoji or image URL
  type: 'hero' | 'boss' | 'special';
  color: string; // Tailwind text color class for styling
}

export interface CourseStep {
  id: string;
  type: 'content' | 'quiz' | 'boss' | 'minigame' | 'puzzle' | 'memory' | 'alchemy' | 'cryptex' | 'maze';
  title: string;
  content?: string; // Markdown/Text
  image?: string;
  theory?: string; // New: Theory/Hint text to help answer the specific challenge
  quizData?: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  minigameData?: {
    instruction: string;
    options: Array<{ text: string; isCorrect: boolean; feedback: string }>;
  };
  puzzleData?: {
    instruction: string;
    items: string[]; // The items to sort/order
    correctOrder: number[]; // Indices of items in correct order (e.g. [2, 0, 1])
    feedback: string;
  };
  memoryData?: {
    pairs: Array<{ id: number, term: string, definition: string }>;
  };
  alchemyData?: {
    goalMessage: string; // e.g. "Crea x^5 multiplicando bases"
    correctCombination: string[]; // List of ingredient IDs required (order doesn't matter)
    ingredients: Array<{ id: string; label: string; color?: string }>; // Available items
    feedbackSuccess: string;
    feedbackError: string;
  };
  cryptexData?: {
    instruction: string;
    wheels: Array<{
      label: string; // The variable name e.g., "X"
      clue: string; // The equation e.g., "x + 2 = 5"
      correctValue: number; // The answer e.g., 3
    }>;
    feedbackSuccess: string;
  };
  mazeData?: {
    instruction: string;
    gridSize: number; // e.g., 3 for 3x3
    cells: Array<{ content: string; isValid: boolean }>; 
    startIdx: number;
    endIdx: number;
    feedbackSuccess: string;
    feedbackError: string;
  };
  bossData?: {
    name: string;
    assetId: string; // Links to CharacterAsset
    hp: number;
    playerMaxHp: number; // New: Player health
    questions:Array<{
      q: string;
      options: string[];
      correct: number;
      damageToBoss: number;
      damageToPlayer: number;
    }>;
  };
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  difficulty: 'Fácil' | 'Medio' | 'Difícil' | 'Legendario';
  type: 'Quiz' | 'Puzzle' | 'Simulación' | 'Jefe Final' | 'Tutorial' | 'Alquimia' | 'Criptex' | 'Laberinto';
  steps: CourseStep[];
  locked: boolean;
  completed: boolean;
  stars?: number; // 0, 1, 2, or 3
}

export interface World {
  id: string;
  name: string;
  emoji: string;
  description: string;
  themeColor: string;
  bgGradient: string;
  missions: Mission[];
  locked?: boolean; // New optional property for world locking
}

export interface MindMapNode {
  id: string;
  name: string;
  icon?: string;
  description?: string;
  details?: string; // Long explanation
  color?: string; // Tailwind color class (e.g., "emerald")
  children?: MindMapNode[];
}

export interface InfographicPoint {
  id: number;
  x: number; // Percentage 0-100
  y: number; // Percentage 0-100
  title: string;
  description: string;
  details?: string; // New field for modal content
  icon: string;
  color?: string;
}

export interface PlayerProfile {
  characterId: string;
  name: string;
}