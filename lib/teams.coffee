red = 
  name: 'red',
  symbol: 'O',
  homePoint: 25,
  homeQuadrant: 3,
  direction: 1
black = 
  name: 'black',
  symbol: 'X',
  homePoint: 0,
  homeQuadrant: 0,
  direction: -1

[red.otherTeam, black.otherTeam] = [black, red]

module.exports = 
  red: red,
  black: black