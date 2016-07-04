teams = require './teams'

module.exports = (game) ->
  array = [
    ' ||--------------------||--------------------|| '.split(''),
    ' ||  1  1  1  1  1  1  ||  1  2  2  2  2  2  || '.split(''),
    ' ||  3  4  5  6  7  8  ||  9  0  1  2  3  4  || '.split(''),
    ' ||--------------------||--------------------|| '.split(''),
    ' ||                    ||                    || '.split(''),
    ' ||                    ||                    || '.split(''),
    ' ||                    ||                    || '.split(''),
    ' ||                    ||                    || '.split(''),
    ' ||                    ||                    || '.split(''),
    ' ||                    ||                    || '.split(''),
    ' ||                    ||                    || '.split(''),
    ' ||                    ||                    || '.split(''),
    ' ||                    ||                    || '.split(''),
    ' ||                    ||                    || '.split(''),
    ' ||                    ||                    || '.split(''),
    ' ||--------------------||--------------------|| '.split(''),
    ' ||  1  1  1  0  0  0  ||  0  0  0  0  0  0  || '.split(''),
    ' ||  2  1  0  9  8  7  ||  6  5  4  3  2  1  || '.split(''),
    ' ||--------------------||--------------------|| '.split('')
  ]

  for i in [0..23]
    p = game.getPoint(i+1)
    if p.hasCheckers()
      quadrant = i // 6
      position = i % 6
      half = i // 12
      checkersToDraw = Math.min(5, p.length())
      ystart = [14,4][half]
      x = [42,20,5,27][quadrant] + [-3,3][half]*position
      for y in [ystart...(ystart + checkersToDraw*[-1,1][half])]
        array[y][x] = teams[p.team()].symbol
      array[ystart][x] = '+' if p.length() > 5

  for team, i in (team for name, team of teams)
    array[j+2][i*47] = team.symbol for j in [0...game.getPoint(team.homePoint).length()]
    array[j+4][23+i] = team.symbol for j in [0...game.bars[team.name].length()]

  (v.join('') for v in array).join '\n'