export type Category =
  | "norge"
  | "verden"
  | "vitenskap"
  | "kunst"
  | "krig"
  | "religion"
  | "oppfinnelse"
  | "idrett"
  | "politikk"
  | "kultur";

export type Difficulty = "lett" | "middels" | "vanskelig";

export interface QuizQuestion {
  id: number;
  year: number;
  event: string;
  category: Category;
  difficulty: Difficulty;
  hint?: string;
}

export type GameMode = "klassisk" | "lyn" | "hardcore" | "sudden";

export interface GameModeConfig {
  id: GameMode;
  name: string;
  description: string;
  questionCount: number | null; // null = endless
  perfectThreshold: number; // years off considered "right" in hardcore
  timePerQuestion: number | null; // seconds, null = unlimited
  livesEnabled: boolean;
}

export interface AttemptResult {
  questionId: number;
  guess: number;
  actual: number;
  diff: number;
  points: number;
  timestamp: number;
  mode: GameMode;
  category: Category;
}

export interface GameSession {
  mode: GameMode;
  attempts: AttemptResult[];
  totalPoints: number;
  startedAt: number;
  endedAt?: number;
  lives?: number;
}

export interface PlayerStats {
  totalQuestions: number;
  totalPoints: number;
  bestStreak: number;
  perfectGuesses: number;
  avgDiff: number;
  byCategory: Record<Category, { count: number; points: number; avgDiff: number }>;
  recentSessions: GameSession[];
  highScores: Record<GameMode, number>;
}

export type Theme = "lys" | "morke" | "pergament";
