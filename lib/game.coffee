teams = require './teams'
printer = require './game_printer'

# require './privatizer'

rollDice = -> Math.floor(Math.random()*6) + 1

# as much as I don't like mixing JS functional with coffee list stuff, this is the most concise way
flatten = (arr) -> arr.reduce ((memo, b) -> memo.concat b), []
unique = (arr) -> arr.filter (e,i,a) -> a.indexOf(e) is i

class Point

  constructor: (teamName, count=0) -> @array = (teamName for [0...count])

  length: -> @array.length

  teamName: -> @array[0] if @hasCheckers()

  hasCheckers: -> @length() > 0

  isBlot: -> @length() is 1

  pop: -> @array.pop()

  push: (teamName) -> @array.push teamName

  toArray: -> [].concat @array

  toString: -> @array.toString()

class Move

  constructor: (opts) ->
    {@team, @startPoint, @amount} = opts
    @destPoint = @startPoint + @amount*@team.direction
    @destPoint = @team.homePoint if @team.direction*(@destPoint - @team.homePoint) > 0

  checkIllegal: (game) ->
    return "It is #{game.turn.name}'s turn" if @team.name isnt game.turn.name
    return "No more moves! Please roll" if game.rolls.length is 0
    return "Illegal move: Didn't roll #{@amount}" if game.rolls.indexOf(@amount) < 0

    src = game.getPoint @startPoint
    dest = game.getPoint @destPoint
    isBarred = game.isBarred @team
    otherTeamHome = @team.otherTeam.homePoint
    goingHome = @destPoint is @team.homePoint
    isShort = Math.abs(@team.homePoint - @startPoint) < @amount

    if isBarred and @startPoint isnt otherTeamHome
      return 'Illegal move: Hit checkers must re-enter the board first'
    if not isBarred and src.teamName() isnt @team.name
      return "Illegal move: You don't have checkers there"
    if dest.teamName() is @team.otherTeam.name and not dest.isBlot()
      return "Illegal move: Can't move to stack occupied by more than one enemy checker"
    if goingHome and not game.canBearOff(@team)
      return "Illegal move: Can't bear off until all pieces are in the last quadrant"
    if goingHome and isShort and game.furthestBackPointWithCheckers(@team) isnt @startPoint
      return "Illegal move: Can only use overrolls to bear off if there are no checkers on higher points"

  toHash: -> {team: @team, startPoint: @startPoint, destPoint: @destPoint, amount: @amount}

  toString: -> "#{@team.name} from #{@startPoint} to #{@destPoint} (#{@amount})"


class Game

  public: ['roll', 'move', 'legalMoves', 'isBarred', 'canBearOff', 'winner', 'print', 'getBoard', 'getBars', 'getWhoseTurn']

  constructor: (startingTeam, setup=null) ->
    @turn = startingTeam
    @firstTurn = true

    r = teams.red.name
    b = teams.black.name
    setup ?=
      1:  [r, 2]
      12: [r, 5]
      17: [r, 3]
      19: [r, 5]
      24: [b, 2]
      13: [b, 5]
      8:  [b, 3]
      6:  [b, 5]
    @board = (new Point((setup[i] ? [])...) for i in [0..25])
    @bars = {}
    @bars[name] = new Point for name, team of teams
    @rolls = []
    # return @.protect()

  getPoint: (n) -> @board[n]

  roll: ->
    throw 'Must move if possible to do so' if @rolls.length > 0 and @legalMoves().length > 0
    throw 'Game is already over' if @winner()?

    if @firstTurn then @firstTurn = false else @turn = @turn.otherTeam
    a = rollDice()
    b = rollDice()
    if a is b
      @rolls = [a, a, b, b]
    else
      @rolls = [a, b]


  move: (moveInfo) ->
    move = new Move moveInfo
    throw illegal if (illegal = move.checkIllegal(@))?

    src = @getPoint move.startPoint
    dest = @getPoint move.destPoint
    teamBar = @bars[move.team.name]
    otherTeamBar = @bars[move.team.otherTeam.name]
    otherTeamHome = @getPoint move.team.otherTeam.homePoint

    @moveChecker teamBar, otherTeamHome if @isBarred move.team
    @moveChecker dest, otherTeamBar if dest.teamName() is move.team.otherTeam.name
    @moveChecker src, dest
    @rolls.splice @rolls.indexOf(move.amount), 1

  allPossibleMoves: -> flatten (new Move({team: @turn, startPoint: i, amount: roll}) for i in [0..25] for roll in unique @rolls)

  legalMoves: -> move.toHash() for move in @allPossibleMoves() when not move.checkIllegal(@)?

  moveChecker: (fromPoint, toPoint) -> toPoint.push fromPoint.pop()

  isBarred: (team) -> @bars[team.name].hasCheckers()

  # otherTeamHome: (team) -> teams[team.otherTeam].homePoint

  quadrant: (point) -> (point - 1) // 6

  canBearOff: (team) -> @quadrant(@furthestBackPointWithCheckers(team)) is team.homeQuadrant

  furthestBackPointWithCheckers: (team) -> (i for i in [team.otherTeam.homePoint..team.homePoint] when @getPoint(i).teamName() is team.name)[0]

  winner: -> (team for name, team of teams when @furthestBackPointWithCheckers(team) is team.homePoint and !@isBarred(team))[0]

  getBoard: -> @getPoint(i).toArray() for i in [0..25]

  getBars: -> { red: @bars.red.toArray(), black: @bars.red.toArray() }

  getWhoseTurn: -> @turn

  print: -> console.log printer @


Game.RED = teams.red
Game.BLACK = teams.black
Game.rollDice = rollDice

module.exports = Game