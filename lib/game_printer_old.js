/*
 ||--------------------||--------------------||
 ||  1  1  1  1  1  1  ||  1  2  2  2  2  2  ||
0||  3  4  5  6  7  8  ||  9  0  1  2  3  4  ||X
0||--------------------||--------------------||X
0||  X           O     ||  O              X  ||X
0||  X           O     ||  O              X  ||X
0||  X           O     ||  O                 ||X
0||  X                 ||  O                 ||X
0||  X                 ||  O                 ||X
0||                    ||                    ||X
0||  O                 ||  X                 ||X
0||  O                 ||  X                 ||X
0||  O           X     ||  X                 ||X
0||  O           X     ||  X              O  ||X
0||  O           X     ||  X              O  ||X
0||--------------------||--------------------||X
0||  1  1  1  0  0  0  ||  0  0  0  0  0  0  ||X
 ||  2  1  0  9  8  7  ||  6  5  4  3  2  1  ||
 ||--------------------||--------------------||
*/

/**
 * Helper utility for printing a game board to the console
 */
function print(game){
  let array = [
//   0    5  8 11 14 17 20 23  27 30 33 36 39 42   47
    ' ||--------------------||--------------------|| '.split(''), // 0
    ' ||  1  1  1  1  1  1  ||  1  2  2  2  2  2  || '.split(''), // 1
    ' ||  3  4  5  6  7  8  ||  9  0  1  2  3  4  || '.split(''), // 2
    ' ||--------------------||--------------------|| '.split(''), // 3
    ' ||                    ||                    || '.split(''), // 4
    ' ||                    ||                    || '.split(''), // 5
    ' ||                    ||                    || '.split(''), // 6
    ' ||                    ||                    || '.split(''), // 7
    ' ||                    ||                    || '.split(''), // 8
    ' ||                    ||                    || '.split(''), // 9
    ' ||                    ||                    || '.split(''), // 10
    ' ||                    ||                    || '.split(''), // 11
    ' ||                    ||                    || '.split(''), // 12
    ' ||                    ||                    || '.split(''), // 13
    ' ||                    ||                    || '.split(''), // 14
    ' ||--------------------||--------------------|| '.split(''), // 15
    ' ||  1  1  1  0  0  0  ||  0  0  0  0  0  0  || '.split(''), // 16
    ' ||  2  1  0  9  8  7  ||  6  5  4  3  2  1  || '.split(''), // 17
    ' ||--------------------||--------------------|| '.split('')  // 18
  ];

  // pieces
  for(let i = 1; i <= 24; i++){
    let p = game.getPoint(i);
    let baseY, incrementY, baseX, incrementX;

    if(p.length == 0){
      continue;
    }else if(i >= 1 && i <= 6){
      baseY = 14;
      incrementY = -1;
      baseX = 42;
      incrementX = -3;
    }else if(i >= 7 && i <= 12){
      baseY = 14;
      incrementY = -1;
      baseX = 20;
      incrementX = -3;
    }else if(i >= 13 && i <= 18){
      baseY = 4;
      incrementY = 1;
      baseX = 5;
      incrementX = 3;
    }else if(i >= 19 && i <= 24){
      baseY = 4;
      incrementY = 1;
      baseX = 27;
      incrementX = 3;
    }
    var x = ((i - 1) % 6)*incrementX + baseX;
    for(let y = baseY; y !== baseY + incrementY*Math.min(5, p.length); y = y + incrementY){
      array[y][x] = (p[0] ? 'O' : 'X');
    }
    if(p.length > 5){
      array[baseY][x] = '+';
    }
  }
  // off-board
  let rr = game.getPoint(0).length;
  for(let r = 2; r < rr; r++){
    array[r][0] = 'O';
  }
  let bb = game.getPoint(25).length;
  for(let b = 2; b < bb; b++){
    array[b][0] = 'X';
  }
  // bar
  for(let b = 0; b < game._bar.length; b++){
    array[b+4][23] = (game._bar[b] ? 'O' : 'X');
  }

  console.log(array.map( (x) => { return x.join('') }).join('\n'));
}

// export default print;