require 'coffee-script/register'
chai = require 'chai'
expect = chai.expect

Game = require '../lib/game'

describe 'Game', ->

  it 'should set up correctly', ->

    game = new Game Game.RED

    expect(game.getWhoseTurn().name).to.equal Game.RED.name

    expect(game.rolls).to.be.emptygetWhoseTurn

    expect(game.winner()).to.not.exist

    game.roll()

    expect(game.rolls).to.have.length.at.least 2

    expect(game.getWhoseTurn().name).to.equal Game.RED.name

    expect(game.legalMoves()).to.be.have.length.at.least 1

  it 'should allow the taking of pieces', ->
    game = new Game Game.RED, {3: [Game.RED.name, 1], 4: [Game.BLACK.name, 1]}
    game.roll()
    game.rolls = [1]

    expect(game.allPossibleMoves().length).to.equal 26
    expect(game.legalMoves().length).to.equal 1

    game.move(game.legalMoves()[0])

    expect(game.getPoint(4).length()).to.equal 1
    expect(game.getPoint(4).teamName()).to.equal Game.RED.name
    expect(game.getPoint(3).length()).to.equal 0
    expect(game.bars[Game.BLACK.name].length()).to.equal 1
    expect(game.isBarred(Game.BLACK)).to.be.true

    game.roll()
    game.rolls = [1]

    expect(game.legalMoves().length).to.equal 1
    expect(game.legalMoves()[0].startPoint).to.equal 25
    expect(game.legalMoves()[0].destPoint).to.equal 24

  it 'should only allow legal moves', ->
    game = new Game Game.RED

    game.roll()

    game.rolls = [6]

    expect(game.legalMoves().length).to.equal 3

    for move in game.legalMoves()
      expect(move.team.name).to.equal Game.RED.name
      expect(move.amount).to.equal 6
      expect(move.startPoint).to.be.oneOf [1, 12, 17]
      switch move.startPoint
        when 1 then expect(move.destPoint).to.equal 7
        when 12 then expect(move.destPoint).to.equal 18
        when 17 then expect(move.destPoint).to.equal 23
