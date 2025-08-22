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
    // Set up MQTT event handlers
    mqttService.on('gameState', (state: GameState) => {
      setGameState(state);
    });

    mqttService.on('players', (players: Player[]) => {
      if (gameState) {
        setGameState({ ...gameState, players });
      }
    });

    return () => {
      mqttService.disconnect();
    };
  }, [gameState]);

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

    try {
      await mqttService.connect(newGameState.id, player.id);
      setIsConnected(true);
      mqttService.publishGameState(newGameState);
    } catch (error) {
      console.error('Failed to connect to MQTT:', error);
    }
  };

  const handleJoinGame = async (gameId: string, playerName: string) => {
    const player: Player = {
      id: `player-${Date.now()}`,
      name: playerName,
      isHost: false,
      isAlive: true,
      role: 'champion'
    };

    setCurrentPlayer(player);

    try {
      await mqttService.connect(gameId, player.id);
      setIsConnected(true);
      
      // Join the game
      if (gameService.joinGame(player)) {
        const updatedState = gameService.getGameState();
        if (updatedState) {
          setGameState(updatedState);
          mqttService.publishPlayerUpdate(updatedState.players);
        }
      }
    } catch (error) {
      console.error('Failed to connect to MQTT:', error);
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
      gameService.leaveGame(currentPlayer.id);
      mqttService.publishPlayerUpdate(gameState.players);
    }
    
    mqttService.disconnect();
    gameService.resetGame();
    setGameState(null);
    setCurrentPlayer(null);
    setIsConnected(false);
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
          Connected
        </motion.div>
      )}
    </div>
  );
}

export default App;
