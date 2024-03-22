const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  snakePosition: [{ x: Number, y: Number }],
  score: { type: Number, required: true, default: 0 },
  status: { type: String, required: true, enum: ['running', 'game over'], default: 'running' },
}, { timestamps: true });

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;