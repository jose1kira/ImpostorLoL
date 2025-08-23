import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './Lobby.css';

interface LobbyProps {
  onJoinGame: (playerName: string) => void;
}

const Lobby: React.FC<LobbyProps> = ({ onJoinGame }) => {
  const [playerName, setPlayerName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
            className="join-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="join-card">
              <h3 className="join-title">🎮 Join the Game</h3>
              <p className="join-description">
                Enter your name and join the global lobby. If no game exists, one will be created automatically!
              </p>
              
              <motion.form
                className="lobby-form"
                onSubmit={handleJoinGame}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="form-group">
                  <label htmlFor="player-name" className="form-label">
                    Your Champion Name
                  </label>
                  <input
                    id="player-name"
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
                <li><strong>One Global Lobby:</strong> Everyone joins the same game automatically</li>
                <li><strong>No Game IDs:</strong> Just enter your name and play!</li>
                <li><strong>Auto-Create:</strong> First player creates the game, others join</li>
                <li><strong>Real-Time:</strong> See players join/leave instantly</li>
                <li><strong>Simple:</strong> Perfect for family game nights!</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Lobby;
