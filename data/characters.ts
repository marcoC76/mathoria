import { CharacterAsset } from '../types';

export const CHARACTER_LIBRARY: CharacterAsset[] = [
    // --- HEROES ---
    { id: 'wizard', name: 'Mago Arcano', avatar: '🧙‍♂️', type: 'hero', color: 'text-purple-400' },
    { id: 'warrior', name: 'Caballero', avatar: '⚔️', type: 'hero', color: 'text-yellow-400' },
    { id: 'rogue', name: 'Pícaro', avatar: '🥷', type: 'hero', color: 'text-emerald-400' },
    { id: 'scholar', name: 'Erudito', avatar: '🎓', type: 'hero', color: 'text-blue-400' },
    { id: 'archer', name: 'Cazador', avatar: '🏹', type: 'hero', color: 'text-green-400' },
    { id: 'robot', name: 'Androide', avatar: '🤖', type: 'hero', color: 'text-cyan-400' },
    { id: 'elf', name: 'Elfa', avatar: '🧝‍♀️', type: 'hero', color: 'text-lime-400' },
    { id: 'dwarf', name: 'Herrero', avatar: '⚒️', type: 'hero', color: 'text-orange-400' },

    // --- BOSSES ---
    { id: 'skull_lord', name: 'Señor Huesos', avatar: '💀', type: 'boss', color: 'text-slate-400' },
    { id: 'dragon_red', name: 'Dragón Infernal', avatar: '🐲', type: 'boss', color: 'text-red-500' },
    { id: 'demon', name: 'Diablo Numérico', avatar: '👹', type: 'boss', color: 'text-red-600' },
    { id: 'alien', name: 'Mente Colmena', avatar: '👽', type: 'boss', color: 'text-green-500' },
    { id: 'golem', name: 'Golem de Roca', avatar: '🗿', type: 'boss', color: 'text-stone-400' },
    { id: 'octopus', name: 'Kraken', avatar: '🐙', type: 'boss', color: 'text-violet-500' },
    { id: 'ghost', name: 'Espectro', avatar: '👻', type: 'boss', color: 'text-indigo-300' },
    { id: 'trex', name: 'Rex', avatar: '🦖', type: 'boss', color: 'text-emerald-600' },
    { id: 'vampire', name: 'Conde Variable', avatar: '🧛', type: 'boss', color: 'text-rose-500' },
    { id: 'genie', name: 'Genio de la Lámpara', avatar: '🧞', type: 'boss', color: 'text-cyan-500' },
];

export const getCharacter = (id: string): CharacterAsset => {
    return CHARACTER_LIBRARY.find(c => c.id === id) || CHARACTER_LIBRARY[0];
};

export const getHeroes = () => CHARACTER_LIBRARY.filter(c => c.type === 'hero');
export const getBosses = () => CHARACTER_LIBRARY.filter(c => c.type === 'boss');