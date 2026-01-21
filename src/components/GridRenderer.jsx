import { getTileAt, isMathWall } from '../utils/gameUtils'
import { MATH_WALL_CELLS, MAP_WIDTH, MAP_HEIGHT } from '../data/gameData'

const GridRenderer = ({ playerPosition, completedObjectives, solvedMathWalls }) => {
  const renderCell = (x, y) => {
    const tile = getTileAt(x, y)
    const isPlayerHere = playerPosition.x === x && playerPosition.y === y
    const isCompleted = completedObjectives.includes(tile)
    const isMathWallCell = isMathWall(x, y, solvedMathWalls)
    const isSolvedMathWall = MATH_WALL_CELLS.has(`${x},${y}`) && solvedMathWalls.has(`${x},${y}`)

    let backgroundColor = '#e0e0e0'
    let label = ''

    if (tile === 'W') {
      backgroundColor = '#444'
    } else if (isMathWallCell) {
      backgroundColor = '#ef5350'
      label = '🧮'
    } else if (isSolvedMathWall) {
      backgroundColor = '#c8e6c9'
      label = '✓'
    } else if (tile && (tile.startsWith('G') || tile.startsWith('R') || tile.startsWith('Y'))) {
      backgroundColor = isCompleted ? '#fff59d' : '#ffd54f'
      label = tile
    }

    return (
      <div
        key={`${x}-${y}`}
        className={`game-tile ${(tile && (tile.startsWith('G') || tile.startsWith('R') || tile.startsWith('Y')) && !isCompleted) ? 'objective-tile' : ''}`}
        style={{
          width: 32,
          height: 32,
          border: tile === 'W' ? 'none' : '1px solid rgba(0,0,0,0.1)',
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor,
          fontSize: 14,
          position: 'relative',
          boxShadow: tile === 'W' ? 'inset 0 2px 4px rgba(0,0,0,0.3)' : isMathWallCell ? '0 0 8px rgba(239,83,80,0.6)' : 'none',
          transition: 'all 0.2s ease',
          opacity: isCompleted ? 0.5 : 1,
        }}
      >
        {!isPlayerHere && label && (
          <span style={{ fontSize: 9, color: '#000', fontWeight: 700, textShadow: '0 1px 2px rgba(255,255,255,0.5)' }}>{label}</span>
        )}
        {isPlayerHere && (
          <span className="player-character" style={{ fontSize: 22 }} role="img" aria-label="player">
            🧑‍💼
          </span>
        )}
      </div>
    )
  }

  const renderRow = (y) => {
    const cells = []
    for (let x = 0; x < MAP_WIDTH; x++) {
      cells.push(renderCell(x, y))
    }
    return (
      <div key={y} style={{ display: 'flex' }}>
        {cells}
      </div>
    )
  }

  const rows = []
  for (let y = 0; y < MAP_HEIGHT; y++) {
    rows.push(renderRow(y))
  }

  return <div>{rows}</div>
}

export default GridRenderer
