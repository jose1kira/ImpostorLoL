export interface Player {
  id: string;
  name: string;
  isHost: boolean;
  isAlive: boolean;
  role: 'champion' | 'impostor';
  secretChampion?: string;
  voteTarget?: string;
}

export interface GameState {
  id: string;
  status: 'lobby' | 'playing' | 'voting' | 'gameOver';
  players: Player[];
  currentRound: number;
  secretChampion: string;
  impostorId?: string;
  roundTimer: number;
  discussionTime: number;
  votingTime: number;
  winner?: 'champions' | 'impostor';
  eliminatedPlayer?: Player;
}

export interface GameMessage {
  type: 'join' | 'leave' | 'start' | 'vote' | 'eliminate' | 'gameOver';
  playerId?: string;
  playerName?: string;
  data?: any;
  timestamp: number;
}

export interface ChatMessage {
  id: string;
  playerId: string;
  playerName: string;
  message: string;
  timestamp: number;
  isSystem?: boolean;
}

export interface VoteResult {
  playerId: string;
  voteCount: number;
}

export type GamePhase = 'lobby' | 'discussion' | 'voting' | 'elimination' | 'gameOver';

export interface Champion {
  name: string;
  title: string;
  role: string;
  difficulty: string;
  region: string;
}
