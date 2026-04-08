import { create } from 'zustand';
import type { SynonymEntry, SynonymFilters, VocabRound } from '../../shared/types';
import { VOCAB_BOOST_ROUNDS } from '../../shared/constants';
import { getApiInstance } from '../lib/api-instance';

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateDistractors(
  correct: SynonymEntry,
  allEntries: SynonymEntry[],
  count: number = 3,
): string[] {
  const correctWords = new Set([correct.word, correct.synonym]);

  // Prefer same POS for plausible distractors
  const samePOS = allEntries.filter(
    (e) => e.id !== correct.id && e.part_of_speech === correct.part_of_speech,
  );
  const otherPOS = allEntries.filter(
    (e) => e.id !== correct.id && e.part_of_speech !== correct.part_of_speech,
  );

  const candidates = [...shuffleArray(samePOS), ...shuffleArray(otherPOS)];
  const distractors: string[] = [];
  const used = new Set<string>();

  for (const c of candidates) {
    if (distractors.length >= count) break;
    // Pick either word or synonym from the candidate as a distractor
    const pick = Math.random() < 0.5 ? c.word : c.synonym;
    if (!correctWords.has(pick) && !used.has(pick)) {
      distractors.push(pick);
      used.add(pick);
    }
    // Try the other one if the first was a duplicate
    const alt = pick === c.word ? c.synonym : c.word;
    if (distractors.length < count && !correctWords.has(alt) && !used.has(alt)) {
      distractors.push(alt);
      used.add(alt);
    }
  }

  return distractors.slice(0, count);
}

function buildRounds(entries: SynonymEntry[], count: number): VocabRound[] {
  const picked = shuffleArray(entries).slice(0, count);
  return picked.map((entry) => {
    const distractors = generateDistractors(entry, entries);
    const correctAnswer = entry.synonym;
    const choices = shuffleArray([correctAnswer, ...distractors]);
    return {
      entry,
      prompt: entry.word,
      choices,
      correctIndex: choices.indexOf(correctAnswer),
    };
  });
}

interface VocabBoostState {
  // Config
  topic: string | null;

  // Session
  rounds: VocabRound[];
  currentRound: number;
  score: number;
  streak: number;
  bestStreak: number;
  answered: boolean;
  selectedIndex: number | null;
  sessionActive: boolean;
  sessionComplete: boolean;

  // Actions
  setTopic: (topic: string | null) => void;
  startSession: () => Promise<void>;
  selectAnswer: (choiceIndex: number) => void;
  nextRound: () => void;
  endSession: () => Promise<void>;
  reset: () => void;
}

export const useVocabBoostStore = create<VocabBoostState>((set, get) => ({
  topic: null,
  rounds: [],
  currentRound: 0,
  score: 0,
  streak: 0,
  bestStreak: 0,
  answered: false,
  selectedIndex: null,
  sessionActive: false,
  sessionComplete: false,

  setTopic: (topic) => set({ topic }),

  startSession: async () => {
    const { topic } = get();
    const filters: SynonymFilters = {};
    if (topic) filters.topic = topic;

    const synonyms: SynonymEntry[] = await getApiInstance().getSynonyms(filters);
    if (synonyms.length < 4) return; // Not enough for a quiz

    const rounds = buildRounds(synonyms, Math.min(VOCAB_BOOST_ROUNDS, synonyms.length));
    set({
      rounds,
      currentRound: 0,
      score: 0,
      streak: 0,
      bestStreak: 0,
      answered: false,
      selectedIndex: null,
      sessionActive: true,
      sessionComplete: false,
    });
  },

  selectAnswer: (choiceIndex) => {
    const { rounds, currentRound, score, streak, bestStreak, answered } = get();
    if (answered) return;

    const round = rounds[currentRound];
    const isCorrect = choiceIndex === round.correctIndex;
    const newStreak = isCorrect ? streak + 1 : 0;

    set({
      answered: true,
      selectedIndex: choiceIndex,
      score: isCorrect ? score + 1 : score,
      streak: newStreak,
      bestStreak: Math.max(bestStreak, newStreak),
    });
  },

  nextRound: () => {
    const { currentRound, rounds } = get();
    const next = currentRound + 1;
    if (next >= rounds.length) {
      set({ sessionComplete: true });
    } else {
      set({
        currentRound: next,
        answered: false,
        selectedIndex: null,
      });
    }
  },

  endSession: async () => {
    const { score, rounds } = get();
    try {
      await getApiInstance().saveSession({
        id: crypto.randomUUID(),
        started_at: new Date().toISOString(),
        ended_at: new Date().toISOString(),
        exercises_completed: rounds.length,
        correct_count: score,
        total_score: rounds.length > 0 ? Math.round((score / rounds.length) * 100) : 0,
      });
    } catch {
      // Non-critical — don't block navigation
    }
    get().reset();
  },

  reset: () =>
    set({
      rounds: [],
      currentRound: 0,
      score: 0,
      streak: 0,
      bestStreak: 0,
      answered: false,
      selectedIndex: null,
      sessionActive: false,
      sessionComplete: false,
    }),
}));
