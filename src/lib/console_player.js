const readline = require('readline');

import Game from './game';
import print from './game_printer';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let redGo, blackGo;

do{
  redGo = Game.rollDice();
  blackGo = Game.rollDice();
  console.log(`Roll to start: Red: ${redGo}, Black: ${blackGo}`);
}while(redGo === blackGo);

let game = new Game(redGo > blackGo ? Game.RED : Game.BLACK);

while(game.isWon() === null){
  game.roll();
  console.log('\n\n');

  print(game);
  console.log('Turn: ', game.whoseTurn() === Game.RED ? 'O' : 'X');
  console.log('Rolls left:', game.getRolls());
  let moves = game.legalMoves();
  if(moves.length < 1){
    console.log('No legal moves!');
  }else{
    while(moves.length > 0){
      moves.forEach((e, i) => { console.log(`${i+1}: move ${e.startPoint} by ${e.amount}`); });
      game.move(moves[0]);
      moves = game.legalMoves();
    }
    // rl.question('Which move do you choose?', (ans)=>{
    //   let m = parseInt(ans, 10);
    //   if(m > 0 && m <= moves.length){
    //     game.move(moves[m-1]);
    //   }
    // });
  }
}
// rl.close();