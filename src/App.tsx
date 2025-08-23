import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameState, Player } from './types/game';
import { mqttService } from './services/mqttService';
import { gameService } from './services/gameService';
import Lobby from './components/Lobby';
import Game from './components/Game';
import './App.css';

function App() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Connect to global lobby
    const connectToLobby = async () => {
      try {
        await mqttService.connect();
        setIsConnected(true);
        console.log('Connected to global lobby');
      } catch (error) {
        console.error('Failed to connect to lobby:', error);
      }
    };

    connectToLobby();

    // Set up MQTT event handlers
    mqttService.on('gameState', (state: GameState) => {
      console.log('Received game state update:', state);
      setGameState(state);
    });

    mqttService.on('playerJoined', (player: Player) => {
      console.log('Player joined:', player);
      if (gameState && currentPlayer && currentPlayer.isHost) {
        // Add the new player to the game
        const updatedPlayers = [...gameState.players, player];
        const updatedState = { ...gameState, players: updatedPlayers };
        setGameState(updatedState);
        
        // Publish the updated state to all players
        mqttService.publishGameState(updatedState);
      }
    });

    mqttService.on('playerLeft', (data: { playerId: string }) => {
      console.log('Player left:', data.playerId);
      if (gameState) {
        const updatedPlayers = gameState.players.filter(p => p.id !== data.playerId);
        const updatedState = { ...gameState, players: updatedPlayers };
        setGameState(updatedState);
        
        // Publish the updated state to all players
        mqttService.publishGameState(updatedState);
      }
    });

    return () => {
      mqttService.disconnect();
    };
  }, [gameState, currentPlayer]);

  const handleCreateGame = async (playerName: string) => {
    const player: Player = {
      id: `player-${Date.now()}`,
      name: playerName,
      isHost: true,
      isAlive: true,
      role: 'champion'
    };

    setCurrentPlayer(player);
    const newGameState = gameService.createGame(player);
    setGameState(newGameState);

    // Publish initial game state to global lobby
    mqttService.publishGameState(newGameState);
    console.log('Game created and published to global lobby:', newGameState);
  };

  const handleJoinGame = async (playerName: string) => {
    const player: Player = {
      id: `player-${Date.now()}`,
      name: playerName,
      isHost: false,
      isAlive: true,
      role: 'champion'
    };

    setCurrentPlayer(player);

    // If there's already a game, join it
    if (gameState) {
      const updatedPlayers = [...gameState.players, player];
      const updatedState = { ...gameState, players: updatedPlayers };
      setGameState(updatedState);
      
      // Publish player joined and updated state
      mqttService.publishPlayerJoined(player);
      mqttService.publishGameState(updatedState);
    } else {
      // Create a new game if none exists
      const newGameState = gameService.createGame(player);
      setGameState(newGameState);
      mqttService.publishGameState(newGameState);
    }
  };

  const handleStartGame = () => {
    if (gameService.startGame()) {
      const updatedState = gameService.getGameState();
      if (updatedState) {
        setGameState(updatedState);
        mqttService.publishGameState(updatedState);
      }
    }
  };

  const handleVote = (targetId: string) => {
    if (currentPlayer && gameService.submitVote(currentPlayer.id, targetId)) {
      const updatedState = gameService.getGameState();
      if (updatedState) {
        setGameState(updatedState);
        mqttService.publishGameState(updatedState);
      }
    }
  };

  const handleLeaveGame = () => {
    if (currentPlayer && gameState) {
      // Notify other players that this player left
      mqttService.publishPlayerLeft(currentPlayer.id);
      
      // Remove player from local state
      const updatedPlayers = gameState.players.filter(p => p.id !== currentPlayer.id);
      if (updatedPlayers.length > 0) {
        const updatedState = { ...gameState, players: updatedPlayers };
        setGameState(updatedState);
        mqttService.publishGameState(updatedState);
      } else {
        // No players left, reset game
        setGameState(null);
      }
    }
    
    setCurrentPlayer(null);
  };

  const handleGameOver = () => {
    // Reset for new game
    if (currentPlayer && gameState) {
      gameService.resetGame();
      setGameState(null);
      setCurrentPlayer(null);
    }
  };

  return (
    <div className="app">
      <motion.div
        className="app-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="app-title">
          <span className="text-gradient">Impostor</span>
          <span className="app-subtitle">League of Legends Edition</span>
        </h1>
      </motion.div>

      <AnimatePresence mode="wait">
        {!gameState ? (
          <motion.div
            key="lobby"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <Lobby
              onCreateGame={handleCreateGame}
              onJoinGame={handleJoinGame}
            />
          </motion.div>
        ) : (
          <motion.div
            key="game"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <Game
              gameState={gameState}
              currentPlayer={currentPlayer!}
              isConnected={isConnected}
              onStartGame={handleStartGame}
              onVote={handleVote}
              onLeaveGame={handleLeaveGame}
              onGameOver={handleGameOver}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {isConnected && (
        <motion.div
          className="connection-status connected"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="status-dot"></div>
          Connected to Global Lobby
        </motion.div>
      )}
    </div>
  );
}

export default App;
