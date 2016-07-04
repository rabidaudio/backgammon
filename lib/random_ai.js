
// Super simple "AI" which simply returns a random move
module.exports = function(game){
  var moves = game.legalMoves();
  return moves[Math.floor(Math.random()*moves.length)];
}