import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './Lobby.css';

interface LobbyProps {
  onCreateGame: (playerName: string) => void;
  onJoinGame: (playerName: string) => void;
}

const Lobby: React.FC<LobbyProps> = ({ onCreateGame, onJoinGame }) => {
  const [playerName, setPlayerName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateGame = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim()) return;

    setIsLoading(true);
    try {
      await onCreateGame(playerName.trim());
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinGame = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim()) return;

    setIsLoading(true);
    try {
      await onJoinGame(playerName.trim());
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="lobby">
      <motion.div
        className="lobby-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="lobby-header">
          <h2 className="lobby-title">Welcome to the Rift</h2>
          <p className="lobby-subtitle">
            Join the global lobby and play with your cousins!
          </p>
        </div>

        <div className="lobby-content">
          <motion.div
            className="lobby-options"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="option-card">
              <h3 className="option-title">🎮 Create New Game</h3>
              <p className="option-description">
                Start a new game and become the host. Other players can join automatically.
              </p>
              <motion.form
                className="lobby-form"
                onSubmit={handleCreateGame}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="form-group">
                  <label htmlFor="create-player-name" className="form-label">
                    Your Champion Name
                  </label>
                  <input
                    id="create-player-name"
                    type="text"
                    className="form-input"
                    placeholder="Enter your summoner name..."
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    required
                    maxLength={20}
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary btn-large"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating...' : '🚀 Create Game'}
                </button>
              </motion.form>
            </div>

            <div className="option-card">
              <h3 className="option-title">🛡️ Join Existing Game</h3>
              <p className="option-description">
                Join a game that's already in progress. No game ID needed!
              </p>
              <motion.form
                className="lobby-form"
                onSubmit={handleJoinGame}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="form-group">
                  <label htmlFor="join-player-name" className="form-label">
                    Your Champion Name
                  </label>
                  <input
                    id="join-player-name"
                    type="text"
                    className="form-input"
                    placeholder="Enter your summoner name..."
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    required
                    maxLength={20}
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary btn-large"
                  disabled={isLoading}
                >
                  {isLoading ? 'Joining...' : '⚔️ Join Game'}
                </button>
              </motion.form>
            </div>
          </motion.div>

          <motion.div
            className="lobby-info"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <div className="info-card">
              <h4>🎯 How It Works</h4>
              <ul>
                <li><strong>Global Lobby:</strong> One lobby for everyone - no game IDs needed!</li>
                <li><strong>Auto-Join:</strong> Players automatically join the active game</li>
                <li><strong>Real-Time:</strong> See players join/leave instantly</li>
                <li><strong>Simple:</strong> Just enter your name and play!</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Lobby;
