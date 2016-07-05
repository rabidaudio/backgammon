require('coffee-script/register');
Game = require('./game'); //require('./protected_game');

randomAi = require('./random_ai');

var redWins = 0;
var blackWins = 0;
var matchCount = 1; //10000;

var ais = {
  red: randomAi,
  black: randomAi
};

for(var i = 0; i < matchCount; i++){

  var redRoll, blackRoll;
  do {
    redRoll = Game.rollDice();
    blackRoll = Game.rollDice();
  }while(redRoll === blackRoll);

  game = new Game(redRoll > blackRoll ? Game.RED : Game.BLACK);

  while(!game.winner()){
    var rolls = game.roll();
    console.log("\n\n");
    game.print();
    console.log("Turn: "+game.getWhoseTurn().name+" ("+game.getWhoseTurn().symbol+")");
    console.log("Rolls:", rolls);

    // var p = game.getBoard().map((x)=>{if(x.team() === game.getWhoseTurn().name){return x.length();}else{return 0;}}).reduce((a,b)=>{return a+b;}, 0) + game.getBars()[game.getWhoseTurn().name].length();
    // if(p !== 15){
    //   throw "Weird number of pieces! "+ p;
    // }

    var moves = game.legalMoves();
    if(moves.length === 0){ console.log("No moves!"); }
    while(moves.length > 0){
      var move = ais[game.getWhoseTurn().name](game);
      console.log(move.startPoint + " -> " + move.destPoint + " ("+move.amount+")");
      game.move(move);
      moves = game.legalMoves();
    }
  }
  game.print();
  var winner = game.winner();
  console.log(winner.name + " wins!");
  if(winner.name == Game.RED.name){
    redWins++;
  }else{
    blackWins++;
  }
}

// console.log("Red: ", redWins, Math.round(redWins / matchCount * 100)+"%");
// console.log("Black: ", blackWins, Math.round(blackWins / matchCount * 100)+"%");