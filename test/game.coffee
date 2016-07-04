require 'coffee-script/register'
chai = require 'chai'
expect = chai.expect

Game = require '../lib/game'

describe 'Game', ->

  it 'should set up correctly', ->

    game = new Game Game.RED

    expect(game.turn.name).to.equal Game.RED.name

    expect(game.rolls).to.be.empty

    expect(game.winner()).to.be.undefined

    game.roll()

    expect(game.rolls).to.have.length.at.least 2

    expect(game.turn.name).to.equal Game.RED.name

    expect(game.legalMoves()).to.be.have.length.at.least 1

  it 'should allow the taking of pieces', ->
    game = new Game Game.RED, {3: [Game.RED.name, 1], 4: [Game.BLACK.name, 1]}
    console.log(game)
    game.print()
    game.roll()
    game.rolls = [1]

    expect(game.allPossibleMoves().length).to.equal 26
    expect(game.legalMoves().length).to.equal 1

    game.move(game.legalMoves()[0])

    expect(game.getPoint(4).length()).to.equal 1
    expect(game.getPoint(4).team()).to.equal Game.RED.name
    expect(game.getPoint(3).length()).to.equal 0
    expect(game.bars[Game.BLACK.name].length()).to.equal 1
    expect(game.isBarred(Game.BLACK)).to.be.true
