import { MAP_WIDTH, MAP_HEIGHT, factoryMap, MATH_WALL_CELLS, MATH_WALL_GATES, MATH_WALL_QUIZZES } from '../data/gameData'

export const isInsideMap = (x, y) => x >= 0 && x < MAP_WIDTH && y >= 0 && y < MAP_HEIGHT

export const isMathWall = (x, y, solvedMathWalls) => {
  return MATH_WALL_CELLS.has(`${x},${y}`) && !solvedMathWalls.has(`${x},${y}`)
}

export const getClosestGate = (x, y) => {
  const exactGate = MATH_WALL_GATES.find(gate => gate.x === x && gate.y === y)
  if (exactGate) return exactGate
  
  if (x === 15) {
    const verticalGates = MATH_WALL_GATES.filter(g => g.dir === 'vertical')
    return verticalGates.reduce((nearest, gate) => {
      const currentDist = Math.abs(gate.y - y)
      const nearestDist = Math.abs(nearest.y - y)
      return currentDist < nearestDist ? gate : nearest
    })
  } else if (y === 18) {
    const horizontalGates = MATH_WALL_GATES.filter(g => g.dir === 'horizontal')
    return horizontalGates.reduce((nearest, gate) => {
      const currentDist = Math.abs(gate.x - x)
      const nearestDist = Math.abs(nearest.x - x)
      return currentDist < nearestDist ? gate : nearest
    })
  }
  return null
}

export const getTileAt = (x, y) => {
  if (!isInsideMap(x, y)) return null
  return factoryMap[y][x]
}

export const isWalkable = (x, y, solvedMathWalls) => {
  if (!isInsideMap(x, y)) return false
  const tile = factoryMap[y][x]
  return tile !== 'W' && !isMathWall(x, y, solvedMathWalls)
}

export const getMathWallQuiz = (gateId) => {
  return MATH_WALL_QUIZZES[gateId] || MATH_WALL_QUIZZES.default
}
