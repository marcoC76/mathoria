import { World, MindMapNode, InfographicPoint, Mission, CourseStep } from '../types';

// --- MIND MAP DATA ---
export const algebraMindMap: MindMapNode = {
  id: "root",
  name: "El Grimorio del Álgebra",
  icon: "📘",
  color: "yellow",
  description: "La estructura fundamental de las matemáticas modernas.",
  details: "El Álgebra no es solo matemáticas; es el lenguaje de la creación en Mathoria. A diferencia de la aritmética simple que solo maneja números fijos, el Álgebra nos permite razonar sobre lo desconocido. \n\n**¿Por qué es importante?** \nNos permite crear fórmulas que funcionan para CUALQUIER número. Es la herramienta que usan los arquitectos para construir torres, los alquimistas para mezclar pociones y los guerreros para calcular la trayectoria de sus flechas. En este grimorio, descubrirás los pilares que sostienen esta realidad.",
  children: [
    { 
      id: "c1", name: "Lenguaje Algebraico", icon: "🗣️", color: "emerald",
      description: "La gramática de los dioses matemáticos.",
      details: "Dominar el lenguaje algebraico es como aprender a leer runas. Nos permite traducir problemas del mundo real (lenguaje común) a una forma que la lógica pura pueda resolver. \n\n**Conceptos Fundamentales:** \n1. **Traducción:** Pasar de 'el doble de una edad' a '2x'. \n2. **Abstracción:** Dejar de pensar en manzanas y peras para pensar en cantidades abstractas 'a' y 'b'. \n3. **Modelado:** Crear representaciones de situaciones complejas para predecir resultados.",
      children: [
        { 
          id: "c1-1", name: "Variables", icon: "x", color: "emerald",
          details: "Las variables son 'contenedores' mágicos. En su interior pueden albergar cualquier número. \n\n**Reglas de la Variable:** \n- Se representan comúnmente con letras (x, y, z, a, b, c). \n- Una variable puede representar un valor que cambia (como la velocidad de un dragón) o un valor que desconocemos y queremos encontrar (una incógnita). \n- **Tip del Mago:** Siempre que veas una letra en un hechizo algebraico, pregúntate: '¿Qué número podría estar escondido aquí?'"
        },
        { 
          id: "c1-2", name: "Constantes", icon: "5", color: "emerald",
          details: "A diferencia de las variables, las constantes son los cimientos inmutables de la realidad. \n\n**Naturaleza:** \n- Son números puros (5, -3, 0.5, π). \n- Su valor es absoluto y nunca cambia, sin importar el contexto del hechizo. \n- En una expresión como '3x + 4', el 4 es la constante que ancla el resultado al mundo físico."
        }
      ] 
    },
    { 
      id: "c2", name: "Aritmética de Poder", icon: "⚡", color: "blue",
      description: "Las leyes que gobiernan el flujo de energía numérica.",
      details: "Para manejar el poder del álgebra sin que te explote en las manos, debes dominar las leyes fundamentales de los signos y las potencias. Aquí es donde muchos aprendices fallan.",
      children: [
        { 
          id: "c2-1", name: "Leyes de Signos", icon: "±", color: "blue",
          details: "Los signos Positivo (+) y Negativo (-) son como la luz y la sombra en Mathoria. Deben estar en equilibrio. \n\n**Para Suma y Resta:** \n- Signos iguales: ¡Se unen! Suma los valores y mantén el signo. \n- Signos diferentes: ¡Combaten! Resta el menor del mayor y quédate con el signo del más poderoso (el de mayor valor absoluto). \n\n**Para Multiplicación y División:** \n- Amigos (+) x (+) = (+) \n- Enemigos (-) x (-) = (+) (¡Menos por menos es más!) \n- Conflicto (+) x (-) = (-) o (-) x (+) = (-)"
        },
        { 
          id: "c2-2", name: "Exponentes", icon: "x²", color: "blue",
          details: "El exponente es el multiplicador de intensidad. Indica cuántas veces una base se multiplica por sí misma. \n\n**Leyes de los Exponentes:** \n1. **Producto:** xᵃ * xᵇ = xᵃ⁺ᵇ (Si las bases son iguales, los poderes se suman). \n2. **Cociente:** xᵃ / xᵇ = xᵃ⁻ᵇ (En la división, los poderes se restan). \n3. **Potencia de Potencia:** (xᵃ)ᵇ = xᵃ*ᵇ (Los poderes se multiplican). \n4. **La Ley del Cero:** Todo guerrero sabe que x⁰ = 1 (excepto si x es 0)."
        }
      ] 
    },
    { 
      id: "c3", name: "Polinomios", icon: "⚔️", color: "orange",
      description: "La organización de los ejércitos de términos.",
      details: "Un polinomio es una cadena de términos algebraicos unidos por sumas y restas. Son como formaciones de combate: cada término tiene su lugar y su rango (grado).",
      children: [
        { 
          id: "c3-1", name: "Suma y Resta", icon: "➕", color: "orange",
          details: "Solo puedes sumar o restar términos que sean 'hermanos de sangre', es decir, **Términos Semejantes**. \n\n**¿Qué los hace semejantes?** \nDeben tener exactamente las mismas letras y los mismos exponentes. \n- 3x² y 5x² son semejantes. \n- 3x y 3x² NO lo son. \n\n**Técnica:** Agrupa los coeficientes de los términos semejantes y deja la parte literal (las letras) intacta."
        },
        { 
          id: "c3-2", name: "Multiplicación", icon: "✖️", color: "orange",
          details: "Al multiplicar polinomios, cada término del primer grupo debe 'atacar' a cada término del segundo grupo. \n\n**Propiedad Distributiva:** \na(b + c) = ab + ac. \nEs fundamental recordar que al multiplicar variables iguales, sus exponentes se suman (Aritmética de Poder). ¡No dejes a ningún término sin su pareja!"
        }
      ] 
    },
    { 
      id: "c4", name: "Ecuaciones", icon: "⚖️", color: "purple",
      description: "El arte de restaurar el equilibrio universal.",
      details: "Una ecuación es una declaración de igualdad perfecta. Es el rompecabezas definitivo donde debemos hallar el valor de la incógnita 'x' para que la balanza no se rompa.",
      children: [
        { 
          id: "c4-1", name: "Lineales de 1er Grado", icon: "➖", color: "purple",
          details: "Son las ecuaciones más puras. La 'x' no tiene poderes extra (exponentes mayores a 1). \n\n**Pasos del Despeje:** \n1. **Limpieza:** Mueve los términos con 'x' a un lado y los números al otro. \n2. **Inversión:** Si un número suma, pasa restando. Si multiplica, pasa dividiendo. \n3. **Resultado:** Al final, 'x' quedará sola y revelará su verdadera identidad numérica."
        },
        { 
          id: "c4-2", name: "Sistemas de Ecuaciones", icon: "🔄", color: "purple",
          details: "Cuando dos o más verdades (ecuaciones) deben cumplirse al mismo tiempo. Es como triangular la posición de un tesoro usando dos mapas distintos. \n\n**Métodos de Resolución:** \n- **Sustitución:** Despeja una variable en una ecuación y métela en la otra. \n- **Reducción:** Suma o resta las ecuaciones para eliminar una variable de un solo golpe. \n- **Igualación:** Despeja la misma variable en ambas y compáralas cara a cara."
        }
      ] 
    }
  ]
};

// --- INFOGRAPHIC DATA ---
export const infographicPoints: InfographicPoint[] = [
  { id: 1, x: 10, y: 85, title: "Valle de las Variables", icon: "🌱", color: "emerald", description: "El inicio del viaje.", details: "Donde los números se vuelven letras. Aquí aprenderás que 'x' puede ser cualquier cosa que imagines." },
  { id: 2, x: 25, y: 70, title: "Fortaleza de Signos", icon: "🏰", color: "red", description: "Controla el positivo y negativo.", details: "La base del equilibrio matemático. Sin dominar los signos, tus cálculos se derrumbarán como un castillo de naipes." },
  { id: 3, x: 15, y: 50, title: "Laboratorio Exponencial", icon: "🧪", color: "indigo", description: "El crecimiento rápido.", details: "Potencias y sus leyes. Aprende cómo pequeños números en la esquina pueden crear fuerzas masivas." },
  { id: 4, x: 40, y: 40, title: "Arena de Polinomios", icon: "⚔️", color: "orange", description: "Batallas de términos.", details: "Suma, resta y clasificación. Organiza tus expresiones algebraicas para el combate final." },
  { id: 5, x: 60, y: 55, title: "Templo de Productos", icon: "🏛️", color: "amber", description: "Arquitectura matemática.", details: "Productos notables y expansión. Descubre los atajos que los antiguos arquitectos usaban para calcular áreas y volúmenes al instante." },
  { id: 6, x: 80, y: 75, title: "Cueva de Factorización", icon: "💎", color: "purple", description: "Descomposición.", details: "Encontrar las raíces de una expresión. Aprende a romper una armadura compleja en sus piezas fundamentales." },
  { id: 7, x: 85, y: 25, title: "Ciudad Ecuación", icon: "⚖️", color: "blue", description: "El equilibrio.", details: "Despeje de incógnitas. Aquí es donde todas las piezas encajan y la verdad es revelada." },
  { id: 8, x: 50, y: 10, title: "Nexo Infinito", icon: "🌌", color: "fuchsia", description: "Sistemas complejos.", details: "Resolución de múltiples variables. El desafío final para aquellos que desean gobernar la lógica de Mathoria." }
];

// --- MISSION GENERATION HELPER ---

const getSpecificStep = (worldId: string, missionIndex: number): CourseStep => {
  const defaultStep: CourseStep = { 
    id: "default", type: "content", title: "En construcción", content: "Contenido próximamente." 
  };

  // --- MUNDO 1: VARIABLES ---
  if (worldId === "w1") {
    const steps: CourseStep[] = [
      { 
        id: "s1", type: "quiz", title: "El Despertar",
        content: "En el álgebra, usamos letras para representar números que no conocemos o que cambian. A estas letras las llamamos **Variables**.",
        theory: "Las variables suelen ser las últimas letras del abecedario (x, y, z) y sirven para generalizar operaciones.",
        quizData: { question: "¿Cuál de estos es una VARIABLE?", options: ["5", "10", "x", "Pi"], correctIndex: 2, explanation: "Las letras como x, y, z representan variables." }
      },
      { 
        id: "s2", type: "minigame", title: "Caza de Símbolos",
        theory: "Una constante es un valor fijo que no cambia durante el problema. Los números solos (5, -3, 100) son constantes.",
        minigameData: {
          instruction: "Identifica las **CONSTANTES** (valores que no cambian):",
          options: [
            { text: "x", isCorrect: false, feedback: "Es una variable." },
            { text: "7", isCorrect: true, feedback: "¡Correcto! 7 siempre vale 7." },
            { text: "y", isCorrect: false, feedback: "Es una variable." }
          ]
        }
      },
      { 
        id: "s3", type: "quiz", title: "El Coeficiente Oculto",
        content: "El número que está pegado a la izquierda de una variable la multiplica. Se llama **Coeficiente**. Si no ves ninguno, es un 1 invisible.",
        theory: "El coeficiente indica cuántas veces se suma la variable. 3x = x + x + x. Si ves 'x', el coeficiente es 1.",
        quizData: { question: "¿Cuál es el coeficiente en '5x'?", options: ["x", "5", "5x", "Ninguno"], correctIndex: 1, explanation: "El 5 multiplica a la x." }
      },
      { 
        id: "s4", type: "alchemy", title: "Forja de Términos", 
        theory: "Un término completo tiene 4 almas: Signo, Coeficiente, Variable y Exponente. ¡Constrúyelo!", 
        alchemyData: { 
            goalMessage: "Forja el término: **-5x²**", 
            correctCombination: ["sign", "coeff", "var", "exp"], 
            ingredients: [
                {id: "sign", label: "-"},
                {id: "coeff", label: "5"},
                {id: "var", label: "x"},
                {id: "exp", label: "²"},
                {id: "fake1", label: "+"},
                {id: "fake2", label: "³"},
            ],
            feedbackSuccess: "¡Término forjado correctamente!",
            feedbackError: "Esa combinación no crea -5x²."
        }
      },
      { 
        id: "s5", type: "memory", title: "Espejos Mágicos",
        theory: "Dos términos son SEMEJANTES si tienen exactamente las mismas letras con los mismos exponentes. El número (coeficiente) no importa.",
        memoryData: {
            pairs: [
                { id: 1, term: "3x", definition: "Término Semejante a -5x" },
                { id: 2, term: "Coeficiente", definition: "El número que multiplica" },
                { id: 3, term: "x²", definition: "Variable al cuadrado" },
                { id: 4, term: "Constante", definition: "Valor fijo (ej: 7)" }
            ]
        }
      },
      { 
        id: "s6", type: "maze", title: "Laberinto de Constantes",
        theory: "Para cruzar este valle, solo puedes pisar las **CONSTANTES** (números solos). Las variables son arenas movedizas.",
        mazeData: {
          instruction: "Cruza pisando solo NÚMEROS:",
          gridSize: 5,
          startIdx: 0,
          endIdx: 24,
          cells: [
            { content: "INICIO", isValid: true }, { content: "5", isValid: true }, { content: "-2", isValid: true }, { content: "x", isValid: false }, { content: "y", isValid: false },
            { content: "z", isValid: false }, { content: "3y", isValid: false }, { content: "10", isValid: true }, { content: "a", isValid: false }, { content: "b", isValid: false },
            { content: "x²", isValid: false }, { content: "2x", isValid: false }, { content: "8", isValid: true }, { content: "42", isValid: true }, { content: "0", isValid: true },
            { content: "3z", isValid: false }, { content: "c", isValid: false }, { content: "n", isValid: false }, { content: "a²", isValid: false }, { content: "1", isValid: true },
            { content: "5x", isValid: false }, { content: "2a", isValid: false }, { content: "7y", isValid: false }, { content: "b³", isValid: false }, { content: "META", isValid: true }
          ],
          feedbackSuccess: "¡Has cruzado el valle constante!",
          feedbackError: "¡Cuidado! Eso es una variable."
        }
      },
      { 
        id: "s7", type: "cryptex", title: "Criptex de Inicio", 
        theory: "Para abrir este sello, debes encontrar el valor numérico de cada letra. x = 2 significa que la x vale 2.",
        cryptexData: {
            instruction: "Descifra el código numérico:",
            wheels: [
                { label: "X", clue: "x = 5", correctValue: 5 },
                { label: "Y", clue: "y = 2 + 1", correctValue: 3 },
                { label: "Z", clue: "z = 10 - 2", correctValue: 8 }
            ],
            feedbackSuccess: "¡Código Aceptado! Entendiste el valor."
        }
      },
      { 
        id: "s8", type: "minigame", title: "Traductor Ancestral",
        theory: "Palabras clave: 'Aumentado' = Suma (+). 'Disminuido' = Resta (-). 'Producto' = Multiplicación (*). 'Cociente' = División (/).",
        minigameData: {
          instruction: "Traduce: **'Un número aumentado en 4'**",
          options: [
            { text: "4x", isCorrect: false, feedback: "Eso es 'cuatro veces un número'." },
            { text: "x - 4", isCorrect: false, feedback: "Eso es 'disminuido'." },
            { text: "x + 4", isCorrect: true, feedback: "¡Bien! Aumentar es sumar." }
          ]
        }
      },
      { 
        id: "s9", type: "quiz", title: "La Igualdad",
        content: "Una **Ecuación** es una igualdad con variables. Es como una balanza equilibrada.",
        theory: "Solo es ecuación si hay un signo '='. Si no tiene igual, es una 'Expresión'.",
        quizData: { question: "¿Cuál es una ecuación?", options: ["x + 2", "x + 2 = 5", "5 + 3 = 8", "x > 5"], correctIndex: 1, explanation: "Tiene variables y un signo igual." }
      },
      { 
        id: "s10", type: "boss", title: "El Guardián X",
        theory: "¡Usa todo lo aprendido! Coeficientes, sustitución y lenguaje algebraico. Recuerda: 'Doble' es multiplicar por 2.",
        bossData: {
          name: "Incógnita Suprema", hp: 100, playerMaxHp: 100, assetId: "skull_lord",
          questions: [
            { q: "Traduce: 'El doble de un número'", options: ["x+2", "x²", "2x", "x/2"], correct: 2, damageToBoss: 30, damageToPlayer: 20 },
            { q: "Si y=5, valora: 3y - 1", options: ["14", "4", "15", "12"], correct: 0, damageToBoss: 30, damageToPlayer: 25 },
            { q: "¿Coeficiente de -x?", options: ["1", "0", "-1", "x"], correct: 2, damageToBoss: 40, damageToPlayer: 30 }
          ]
        }
      }
    ];
    return steps[missionIndex] || defaultStep;
  }

  // Fallback for other worlds
  const genericTitles = ["Iniciación", "Práctica", "Teoría", "Lógica", "Simulación", "Estrategia", "Dominio", "Maestría", "Prueba", "Jefe"];
  const isBoss = missionIndex === 9;
  const isPuzzle = missionIndex === 3 || missionIndex === 5;
  const isMinigame = missionIndex === 1 || missionIndex === 4 || missionIndex === 7;
  const type = isBoss ? 'boss' : isPuzzle ? 'puzzle' : 'quiz';

  let step: CourseStep = {
     id: `gen-${worldId}-${missionIndex}`,
     type: type as any,
     title: genericTitles[missionIndex],
     theory: "Recuerda los principios básicos de este mundo. Lee atentamente el enunciado."
  };

  if (isBoss) {
      step.bossData = {
          name: "Guardián del Reino", hp: 100, playerMaxHp: 100, assetId: "dragon_red",
          questions: [
              { q: "¿Preparado para demostrar tu valor?", options: ["Sí", "Siempre", "Nunca", "Tal vez"], correct: 0, damageToBoss: 35, damageToPlayer: 10 },
              { q: "Resuelve el acertijo final: x = x", options: ["Verdadero", "Falso"], correct: 0, damageToBoss: 35, damageToPlayer: 10 },
              { q: "El golpe final...", options: ["¡Atacar!", "Defender"], correct: 0, damageToBoss: 30, damageToPlayer: 10 }
          ]
      }
  } else if (isPuzzle) {
      step.puzzleData = {
          instruction: "Ordena la secuencia lógica:",
          items: ["Paso 1", "Paso 2", "Paso 3"],
          correctOrder: [0, 1, 2],
          feedback: "Lógica impecable."
      }
  } else {
      step.content = "Concepto avanzado de este mundo.";
      step.quizData = {
          question: `Pregunta de nivel ${missionIndex + 1} sobre ${worldId}`,
          options: ["Opción A", "Opción B", "Opción C"],
          correctIndex: 0,
          explanation: "Respuesta basada en teoría."
      }
  }
  
  return step;
};

// --- WORLD DATA GENERATOR ---
const generateMissions = (worldId: string, worldName: string): Mission[] => {
    return Array.from({ length: 10 }).map((_, i) => {
        const step = getSpecificStep(worldId, i);
        let displayType: any = 'Quiz';
        if (step.type === 'puzzle') displayType = 'Puzzle';
        if (step.type === 'minigame') displayType = 'Simulación';
        if (step.type === 'boss') displayType = 'Jefe Final';
        if (step.type === 'alchemy') displayType = 'Alquimia';
        if (step.type === 'cryptex') displayType = 'Criptex';
        if (step.type === 'maze') displayType = 'Laberinto';
        if (step.type === 'memory') displayType = 'Memoria';

        return {
            id: `${worldId}-m${i}`,
            title: step.title,
            description: step.type === 'boss' ? "Derrota al Guardián." : `Nivel ${i+1} de ${worldName}`,
            difficulty: i > 8 ? 'Legendario' : i > 5 ? 'Difícil' : 'Medio',
            type: displayType,
            locked: i > 0,
            completed: false,
            steps: [step]
        };
    });
};

export const worldsData: World[] = [
  {
    id: "w1", name: "El Valle de las Variables", emoji: "🌱",
    description: "Donde los números cobran vida y se transforman.",
    themeColor: "emerald", bgGradient: "from-emerald-900 to-slate-900",
    missions: generateMissions("w1", "Variables")
  },
  {
    id: "w2", name: "Fortaleza de Signos", emoji: "🏰",
    description: "Domina la dualidad del positivo y negativo.",
    themeColor: "red", bgGradient: "from-red-900 to-slate-900",
    missions: generateMissions("w2", "Signos")
  },
  {
    id: "w3", name: "Laboratorio Exponencial", emoji: "🧪",
    description: "Desata el poder del crecimiento explosivo.",
    themeColor: "indigo", bgGradient: "from-indigo-900 to-slate-900",
    missions: generateMissions("w3", "Exponentes")
  },
  {
    id: "w4", name: "Arena de Polinomios", emoji: "⚔️",
    description: "Comanda ejércitos de términos algebraicos.",
    themeColor: "orange", bgGradient: "from-orange-900 to-slate-900",
    missions: generateMissions("w4", "Polinomios")
  },
  {
    id: "w5", name: "Templo de Productos", emoji: "🏛️",
    description: "Descubre los patrones arquitectónicos antiguos.",
    themeColor: "amber", bgGradient: "from-amber-800 to-slate-900",
    missions: generateMissions("w5", "Productos")
  },
  {
    id: "w6", name: "Cueva de Factorización", emoji: "💎",
    description: "Rompe las estructuras en sus gemas primarias.",
    themeColor: "purple", bgGradient: "from-purple-900 to-slate-900",
    missions: generateMissions("w6", "Factorización")
  },
  {
    id: "w7", name: "Ciudad Ecuación", emoji: "⚖️",
    description: "Restaura el equilibrio de la gran balanza.",
    themeColor: "blue", bgGradient: "from-blue-900 to-slate-900",
    missions: generateMissions("w7", "Ecuaciones")
  },
  {
    id: "w8", name: "Nexo Infinito", emoji: "🌌",
    description: "Donde múltiples realidades convergen.",
    themeColor: "fuchsia", bgGradient: "from-fuchsia-900 to-slate-900",
    missions: generateMissions("w8", "Sistemas")
  }
];