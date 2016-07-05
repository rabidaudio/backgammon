var Game = require('./game');
require('./privatizer');

/**
 * A simple wrapper around game instances that expose a limited set of methods to protect from cheating.
 */
function ProtectedGame(startingTeam){
  var game = new Game(startingTeam);
  return game.protect();
};

ProtectedGame.RED = Game.RED;
ProtectedGame.BLACK = Game.BLACK;
ProtectedGame.rollDice = Game.rollDice;

module.exports = ProtectedGame;