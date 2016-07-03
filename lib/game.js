
function rollDice(){ return Math.floor(Math.random()*6) + 1 }

const RED = true;
const BLACK = false;

class TeamInfo {
  constructor(team){
    this.team = team;
    this.name = (team === RED ? 'RED' : 'BLACK');
    this.otherTeam = !team;
    this.homePoint = (team === RED ? 25 : 0);
  }

  pointOffsetForTeam(startPoint, offset){
    switch(this.team){
      case RED:
        return Math.min(25, startPoint + offset);
      case BLACK:
        return Math.max(0, startPoint - offset);
    }
  }
}

const teamInfo = {};
teamInfo[RED] = new TeamInfo(RED);
teamInfo[BLACK] = new TeamInfo(BLACK);

class Game {

  /**
   * The game board is an array of 26 (24 plus one off-board for each side) arrays of checkers
   * (either Game.BLACK or Game.RED). Index 0 is black's off-board, and then 1-24 follow the board's points along
   *  red's path around the board clockwise to black's start, where finally index 25 is red's off-board.
   */

  constructor(startingTeam){
    this._board = [];
    this._bar = [];
    this._reset();
    this._whoseTurn = startingTeam;
    this._rolls = [];
  }

  _reset(){
    for(let i = 0; i <= 25; i++){
      this._board[i] = [];
    }
    this._board[1] = [RED, RED];
    this._board[24] = [BLACK, BLACK];
    this._board[6] = [BLACK, BLACK, BLACK, BLACK, BLACK];
    this._board[19] = [RED, RED, RED, RED, RED];
    this._board[12] = [RED, RED, RED, RED, RED];
    this._board[13] = [BLACK, BLACK, BLACK, BLACK, BLACK];
    this._board[17] = [RED, RED, RED];
    this._board[8] = [BLACK, BLACK, BLACK];
  }

  getPoint(point){
    if(point < 0 || point > 25){
      throw `Point out of bounds: ${point}`;
    }
    return [].concat(this._board[point]);
  }

  whoseTurn(){
    return this._whoseTurn;
  }

  /**
   * Change teams, roll dice, record moves left, and return roll values
   */
  roll(){
    if(this._rolls.length > 0 && this.legalMoves().length > 0){
      throw 'Must move if possible to do so!';
    }
    this._whoseTurn = teamInfo[this._whoseTurn].otherTeam;

    let a = rollDice();
    let b = rollDice();

    if(a === b){
      // rolling doubles gives you 4 moves
      this._rolls = [a, a, a, a];
    }else{
      this._rolls = [a, b];
    }

    return [a, b];
  }

  getRolls(){
    return [].concat(this._rolls);
  }

  /**
   * Return an array of legal moves. A move object looks like
   *  {
   *    team       //RED or BLACK
   *    startPoint // index of point to move checker from
   *    amount     // value to move the piece in the team's proper direction
   *  }
   */
  legalMoves(){
    // get all points for the current team
    // add each unique move to the stack
    // remove any illegal moves
    if(this._rolls.length < 1){
      return []; // no moves left for this turn
    }

    let moves = [];
    this._rolls.filter((e,i,a) => {return a.indexOf(e) === i}).forEach((e) => {
      for(let i = 0; i <= 25; i++){
        let move = {team: this._whoseTurn, startPoint: i, amount: e};
        if(!this._isMoveIllegal(move)){
          moves.push(move);
        }
      }
    });
    return moves;
  }

  _canTeamBearOff(team){
    for(let i = 1; i <= 24; i++){
      if(!(
        (team === RED && i >= 19) ||
        (team === BLACK && i <= 6) ||
        (this.getPoint(i).length < 1) ||
        (this.getPoint(i)[0] !== team)
      )){
        return false;
      }
    }
    return true;
  }

  _furthestBackPointWithCheckers(team){
    let home = teamInfo[team].homePoint;
    let enemyHome = teamInfo[teamInfo[team].otherTeam].homePoint;
    let inc = (enemyHome < home ? 1 : -1);
    for(let i = enemyHome; i < home; i = i + inc){
      let p = this.getPoint(i);
      if(p.length > 0 && p[0] === team){
        return i;
      }
    }
    return home;
  }

  /**
   * Returns the reasoning if a move is illegal, or false
   * if the move is legal.
   *
   * "On any roll, a player must move according to the numbers on both
   * dice if it is at all possible to do so. If one or both numbers do
   * not allow a legal move, the player forfeits that portion of the
   * roll and his/her turn ends. If moves can be made according to
   * either one die or the other, but not both, the higher number must
   * be used. If one die is unable to be moved, but such a move is made
   * possible by the moving of the other die, that move is compulsory.
   */
  _isMoveIllegal(move){
    if(move.team != this._whoseTurn){
      return `It is ${teamInfo[this._whoseTurn].name}'s turn`;
    }
    if(this._rolls.length == 0){
      return 'No more moves! Please roll';
    }
    let info = teamInfo[move.team];
    let startPoint = this.getPoint(move.startPoint);
    let otherTeamHome = teamInfo[info.otherTeam].homePoint;
    if((startPoint.length < 1 || startPoint[0] !== move.team) && !(move.startPoint === otherTeamHome && this._bar.length > 0 && this._bar[0] === move.team)){
      return 'Illegal move: You don\'t have checkers there';
    }
    if(this._rolls.indexOf(move.amount) < 0){
      return `Illegal move: Didn\'t roll ${move.amount}`
    }
    let destPoint = info.pointOffsetForTeam(move.startPoint, move.amount);
    if(this.getPoint(destPoint).length > 1 && this.getPoint(destPoint)[0] === info.otherTeam){
      return 'Illegal move: Can\'t move to stack occupied by more than one enemy checker';
    }
    if(this._bar.length > 0 && this._bar[0] === move.team && move.startPoint !== otherTeamHome){
      return 'Illegal move: Hit checkers must re-enter the board first';
    }
    if(destPoint === info.homePoint && !this._canTeamBearOff(move.team)){
      return 'Illegal move: Can\t bear off until all pieces are in the last quadrant';
    }
    if(destPoint === info.homePoint && Math.abs(info.homePoint - move.startPoint) < move.amount && this._furthestBackPointWithCheckers(move.team) != move.startPoint){
      return 'Illegal move: Can only use overrolls to bear off if there are no checkers on higher points';
    }

    return false;
  }

  move(move){
    let illegal = this._isMoveIllegal(move);
    if(illegal){
      throw illegal;
    }
    let info = teamInfo[move.team];
    let destPointIndex = info.pointOffsetForTeam(move.startPoint, move.amount);
    let destPoint = this.getPoint(destPointIndex);
    let otherTeamHome = teamInfo[info.otherTeam].homePoint;

    if(move.startPoint === otherTeamHome){
      this._board[move.startPoint].push(this._bar.pop());
    }
    if(destPoint.length > 0 && destPoint[0] === info.otherTeam){
      this._bar.push(this._board[destPointIndex].pop());
    }
    this._board[destPointIndex].push(this._board[move.startPoint].pop());

    this._rolls.splice(this._rolls.indexOf(move.amount), 1);
  }

  isWon(){
    if(this.getPoint(teamInfo[RED].homePoint).length === 15){
      return RED;
    }
      if(this.getPoint(teamInfo[BLACK].homePoint).length === 15){
        return BLACK;
      }
    return null;
  }
}

Game.RED = RED;
Game.BLACK = BLACK;
Game.rollDice = rollDice;
Game.teamInfo = teamInfo;

// export default Game;