var Game = require('./game');

/**
 * A simple wrapper around game instances that expose a limited set of methods to protect from cheating.
 */
function ProtectedGame(startingTeam){
  
  var game = new Game(startingTeam);

  this.roll = function(){ return game.roll(); };
  this.move = function(move){ return game.move(move); };
  this.legalMoves = function(){ return game.legalMoves(); };
  this.winner = function(){ return game.winner(); };
  this.print = function(){ return game.print(); };
  this.turn = function(){ return JSON.parse(JSON.stringify(game.turn)); };
  this.getBoard = function(){ return game.board.map(function(p){ return p.copy(); }); };
  this.getBars = function(){ return {red: game.bars.red.copy(), black: game.bars.black.copy()}; };

};

ProtectedGame.RED = Game.RED;
ProtectedGame.BLACK = Game.BLACK;
ProtectedGame.rollDice = Game.rollDice;

module.exports = ProtectedGame;