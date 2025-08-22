import { GameState, Player, Champion } from '../types/game';
import { v4 as uuidv4 } from 'uuid';

// League of Legends champions data
const CHAMPIONS: Champion[] = [
  { name: 'Ahri', title: 'the Nine-Tailed Fox', role: 'Mage', difficulty: 'Moderate', region: 'Ionia' },
  { name: 'Yasuo', title: 'the Unforgiven', role: 'Fighter', difficulty: 'High', region: 'Ionia' },
  { name: 'Lux', title: 'the Lady of Luminosity', role: 'Mage', difficulty: 'Low', region: 'Demacia' },
  { name: 'Thresh', title: 'the Chain Warden', role: 'Support', difficulty: 'High', region: 'Shadow Isles' },
  { name: 'Jinx', title: 'the Loose Cannon', role: 'Marksman', difficulty: 'Moderate', region: 'Zaun' },
  { name: 'Zed', title: 'the Master of Shadows', role: 'Assassin', difficulty: 'High', region: 'Ionia' },
  { name: 'Leona', title: 'the Radiant Dawn', role: 'Tank', difficulty: 'Low', region: 'Mount Targon' },
  { name: 'Darius', title: 'the Hand of Noxus', role: 'Fighter', difficulty: 'Moderate', region: 'Noxus' },
  { name: 'Morgana', title: 'the Fallen', role: 'Mage', difficulty: 'Moderate', region: 'Demacia' },
  { name: 'Garen', title: 'the Might of Demacia', role: 'Fighter', difficulty: 'Low', region: 'Demacia' },
  { name: 'Katarina', title: 'the Sinister Blade', role: 'Assassin', difficulty: 'High', region: 'Noxus' },
  { name: 'Ashe', title: 'the Frost Archer', role: 'Marksman', difficulty: 'Low', region: 'Freljord' },
  { name: 'Teemo', title: 'the Swift Scout', role: 'Marksman', difficulty: 'Low', region: 'Bandle City' },
  { name: 'Riven', title: 'the Exile', role: 'Fighter', difficulty: 'High', region: 'Noxus' },
  { name: 'Sona', title: 'Maven of the Strings', role: 'Support', difficulty: 'Low', region: 'Demacia' },
  { name: 'Vayne', title: 'the Night Hunter', role: 'Marksman', difficulty: 'High', region: 'Demacia' },
  { name: 'Blitzcrank', title: 'the Great Steam Golem', role: 'Support', difficulty: 'Moderate', region: 'Zaun' },
  { name: 'Fizz', title: 'the Tidal Trickster', role: 'Assassin', difficulty: 'High', region: 'Bilgewater' },
  { name: 'Annie', title: 'the Dark Child', role: 'Mage', difficulty: 'Low', region: 'Noxus' },
  { name: 'Tryndamere', title: 'the Barbarian King', role: 'Fighter', difficulty: 'Moderate', region: 'Freljord' }
];

class GameService {
  private gameState: GameState | null = null;
  private discussionTimer: NodeJS.Timeout | null = null;
  private votingTimer: NodeJS.Timeout | null = null;

  createGame(hostPlayer: Player): GameState {
    const gameId = uuidv4();
    const secretChampion = this.getRandomChampion();
    
    this.gameState = {
      id: gameId,
      status: 'lobby',
      players: [hostPlayer],
      currentRound: 1,
      secretChampion: secretChampion.name,
      roundTimer: 0,
      discussionTime: 120, // 2 minutes
      votingTime: 30, // 30 seconds
    };

    return this.gameState;
  }

  joinGame(player: Player): boolean {
    if (!this.gameState || this.gameState.status !== 'lobby') {
      return false;
    }

    // Check if player already exists
    if (this.gameState.players.find(p => p.id === player.id)) {
      return false;
    }

    this.gameState.players.push(player);
    return true;
  }

  leaveGame(playerId: string): boolean {
    if (!this.gameState) return false;

    const playerIndex = this.gameState.players.findIndex(p => p.id === playerId);
    if (playerIndex === -1) return false;

    const player = this.gameState.players[playerIndex];
    this.gameState.players.splice(playerIndex, 1);

    // If host leaves, assign new host
    if (player.isHost && this.gameState.players.length > 0) {
      this.gameState.players[0].isHost = true;
    }

    // If not enough players, return to lobby
    if (this.gameState.players.length < 3 && this.gameState.status !== 'lobby') {
      this.gameState.status = 'lobby';
      this.stopTimers();
    }

    return true;
  }

  startGame(): boolean {
    if (!this.gameState || this.gameState.players.length < 3) {
      return false;
    }

    // Assign roles
    this.assignRoles();
    
    this.gameState.status = 'playing';
    this.startDiscussionPhase();
    
    return true;
  }

  private assignRoles() {
    if (!this.gameState) return;

    const players = [...this.gameState.players];
    const impostorIndex = Math.floor(Math.random() * players.length);
    
    players.forEach((player, index) => {
      if (index === impostorIndex) {
        player.role = 'impostor';
        this.gameState!.impostorId = player.id;
      } else {
        player.role = 'champion';
        player.secretChampion = this.gameState!.secretChampion;
      }
      player.isAlive = true;
    });
  }

  private startDiscussionPhase() {
    if (!this.gameState) return;

    this.gameState.status = 'playing';
    this.gameState.roundTimer = this.gameState.discussionTime;

    this.discussionTimer = setInterval(() => {
      if (this.gameState && this.gameState.roundTimer > 0) {
        this.gameState.roundTimer--;
      } else {
        this.startVotingPhase();
      }
    }, 1000);
  }

  private startVotingPhase() {
    if (!this.gameState) return;

    this.stopTimers();
    this.gameState.status = 'voting';
    this.gameState.roundTimer = this.gameState.votingTime;

    this.votingTimer = setInterval(() => {
      if (this.gameState && this.gameState.roundTimer > 0) {
        this.gameState.roundTimer--;
      } else {
        this.processVotes();
      }
    }, 1000);
  }

  submitVote(playerId: string, targetId: string): boolean {
    if (!this.gameState || this.gameState.status !== 'voting') {
      return false;
    }

    const player = this.gameState.players.find(p => p.id === playerId);
    if (!player || !player.isAlive || player.id === targetId) {
      return false;
    }

    player.voteTarget = targetId;
    return true;
  }

  private processVotes() {
    if (!this.gameState) return;

    this.stopTimers();

    // Count votes
    const voteCounts = new Map<string, number>();
    this.gameState.players.forEach(player => {
      if (player.isAlive && player.voteTarget) {
        const currentCount = voteCounts.get(player.voteTarget) || 0;
        voteCounts.set(player.voteTarget, currentCount + 1);
      }
    });

    // Find player with most votes
    let maxVotes = 0;
    let eliminatedPlayerId = '';

    voteCounts.forEach((count, playerId) => {
      if (count > maxVotes) {
        maxVotes = count;
        eliminatedPlayerId = playerId;
      }
    });

    if (eliminatedPlayerId) {
      this.eliminatePlayer(eliminatedPlayerId);
    } else {
      // No elimination, continue to next round
      this.nextRound();
    }
  }

  private eliminatePlayer(playerId: string) {
    if (!this.gameState) return;

    const player = this.gameState.players.find(p => p.id === playerId);
    if (!player) return;

    player.isAlive = false;
    this.gameState.eliminatedPlayer = player;

    // Check win conditions
    if (this.checkWinCondition()) {
      this.endGame();
    } else {
      this.nextRound();
    }
  }

  private checkWinCondition(): boolean {
    if (!this.gameState) return false;

    const alivePlayers = this.gameState.players.filter(p => p.isAlive);

    const aliveImpostor = alivePlayers.find(p => p.role === 'impostor');

    // Champions win if impostor is eliminated
    if (!aliveImpostor) {
      this.gameState.winner = 'champions';
      return true;
    }

    // Impostor wins if only 2 players remain (including themselves)
    if (alivePlayers.length <= 2) {
      this.gameState.winner = 'impostor';
      return true;
    }

    return false;
  }

  private nextRound() {
    if (!this.gameState) return;

    this.gameState.currentRound++;
    this.gameState.eliminatedPlayer = undefined;
    
    // Reset votes
    this.gameState.players.forEach(player => {
      player.voteTarget = undefined;
    });

    // Start next discussion phase
    this.startDiscussionPhase();
  }

  private endGame() {
    if (!this.gameState) return;

    this.gameState.status = 'gameOver';
    this.stopTimers();
  }

  private stopTimers() {
    if (this.discussionTimer) {
      clearInterval(this.discussionTimer);
      this.discussionTimer = null;
    }
    if (this.votingTimer) {
      clearInterval(this.votingTimer);
      this.votingTimer = null;
    }
  }

  private getRandomChampion(): Champion {
    return CHAMPIONS[Math.floor(Math.random() * CHAMPIONS.length)];
  }

  getGameState(): GameState | null {
    return this.gameState;
  }

  resetGame() {
    this.gameState = null;
    this.stopTimers();
  }
}

export const gameService = new GameService();
export default gameService;
