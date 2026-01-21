import { useEffect, useRef } from 'react'
import Phaser from 'phaser'

// Lightweight Phaser view layer that mirrors the existing React game state
// without rewriting game logic. React still owns state and rules; Phaser only
// renders and animates for better visuals/performance.
const TILE_SIZE = 22
const WALL_COLOR = 0x2d2d2d
const FLOOR_COLOR = 0xf5f5f5
const PLAYER_COLOR = 0x42a5f5
const OBJECTIVE_COLOR = 0xffc400
const COMPLETED_COLOR = 0x9ccc65
const MATH_WALL_COLOR = 0xef5350
const ENEMY_COLOR = 0xff4444

// Function to create a stick man graphics object
function createStickMan(scene, x, y, color, scale = 1) {
  const graphics = scene.make.graphics({ x, y, add: false })
  graphics.setDepth(2)
  
  const headRadius = 3 * scale
  const bodyLength = 5 * scale
  const armLength = 4 * scale
  const legLength = 4 * scale
  
  graphics.lineStyle(3 * scale, color, 1)
  
  // Head
  graphics.strokeCircleShape(new Phaser.Geom.Circle(0, -bodyLength - headRadius, headRadius))
  
  // Body
  graphics.lineBetween(0, -bodyLength, 0, bodyLength)
  
  // Arms
  graphics.lineBetween(-armLength, -2 * scale, armLength, -2 * scale)
  
  // Legs
  graphics.lineBetween(0, bodyLength, -legLength * 0.7, bodyLength + legLength)
  graphics.lineBetween(0, bodyLength, legLength * 0.7, bodyLength + legLength)
  
  scene.add.existing(graphics)
  return graphics
}

// Maps a tile string to a fill color
const getTileColor = (tile, isSolvedMathWall) => {
  if (tile === 'W') return WALL_COLOR
  if (isSolvedMathWall) return FLOOR_COLOR
  if (tile === 'F') return FLOOR_COLOR
  if (tile && (tile.startsWith('G') || tile.startsWith('R') || tile.startsWith('Y'))) return OBJECTIVE_COLOR
  return FLOOR_COLOR
}

// A* Pathfinding Algorithm
// Returns array of {x, y} tile positions from start to goal
function findPath(map, solvedMathWalls, startX, startY, goalX, goalY, ignoreWalls = false) {
  const openSet = []
  const closedSet = new Set()
  const cameFrom = new Map()
  const gScore = new Map()
  const fScore = new Map()

  const startKey = `${startX},${startY}`
  const goalKey = `${goalX},${goalY}`

  // Manhattan distance heuristic
  const heuristic = (x, y) => Math.abs(x - goalX) + Math.abs(y - goalY)

  // Check if a tile is walkable
  const isWalkable = (x, y) => {
    if (x < 0 || y < 0 || y >= map.length || x >= map[0].length) return false
    const tile = map[y][x]
    
    // If ignoreWalls is true (for enemy), only block on actual walls
    if (ignoreWalls) {
      return tile !== 'W'
    }
    
    const key = `${x},${y}`
    
    // Wall is not walkable
    if (tile === 'W') return false
    
    // Math walls at row 18 / col 15 are walkable only if solved
    if ((x === 15 || y === 18) && !solvedMathWalls.has(key)) return false
    
    // Everything else (F, G, R, Y checkpoints) is walkable
    return true
  }

  gScore.set(startKey, 0)
  fScore.set(startKey, heuristic(startX, startY))
  openSet.push({ x: startX, y: startY, f: fScore.get(startKey) })

  while (openSet.length > 0) {
    // Get node with lowest fScore
    openSet.sort((a, b) => a.f - b.f)
    const current = openSet.shift()
    const currentKey = `${current.x},${current.y}`

    // Reached goal
    if (currentKey === goalKey) {
      const path = []
      let key = goalKey
      while (cameFrom.has(key)) {
        const coords = key.split(',').map(Number)
        path.unshift({ x: coords[0], y: coords[1] })
        key = cameFrom.get(key)
      }
      return path
    }

    closedSet.add(currentKey)

    // Check all 4 neighbors (up, down, left, right)
    const neighbors = [
      { x: current.x + 1, y: current.y },
      { x: current.x - 1, y: current.y },
      { x: current.x, y: current.y + 1 },
      { x: current.x, y: current.y - 1 },
    ]

    for (const neighbor of neighbors) {
      const neighborKey = `${neighbor.x},${neighbor.y}`

      if (!isWalkable(neighbor.x, neighbor.y)) continue
      if (closedSet.has(neighborKey)) continue

      const tentativeG = gScore.get(currentKey) + 1

      if (!gScore.has(neighborKey) || tentativeG < gScore.get(neighborKey)) {
        cameFrom.set(neighborKey, currentKey)
        gScore.set(neighborKey, tentativeG)
        const f = tentativeG + heuristic(neighbor.x, neighbor.y)
        fScore.set(neighborKey, f)

        if (!openSet.find((n) => n.x === neighbor.x && n.y === neighbor.y)) {
          openSet.push({ x: neighbor.x, y: neighbor.y, f })
        }
      }
    }
  }

  return [] // No path found
}

// Enemy class that chases the player using A* pathfinding
class Enemy {
  constructor(scene, tileX, tileY, map, solvedMathWalls) {
    this.scene = scene
    this.map = map
    this.solvedMathWalls = solvedMathWalls
    this.tileX = tileX
    this.tileY = tileY
    this.path = []
    this.pathIndex = 0
    this.isMoving = false
    this.speed = 40 // Pixels per second (slower chase speed)
    this.recalcTimer = 0
    this.recalcInterval = 500 // Recalculate path every 500ms
    this.active = true

    // Create enemy sprite - red stick man
    const pixelX = tileX * TILE_SIZE + TILE_SIZE / 2
    const pixelY = tileY * TILE_SIZE + TILE_SIZE / 2
    this.sprite = createStickMan(scene, pixelX, pixelY, ENEMY_COLOR, 1.2)

    console.log(`[Enemy] Created at pixel (${pixelX}, ${pixelY}), tile (${tileX}, ${tileY})`)

    // Pulsing animation for menacing effect
    scene.tweens.add({
      targets: this.sprite,
      scale: 1.15,
      duration: 600,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    })
  }

  // Update called every frame from scene's update()
  update(time, delta, playerTileX, playerTileY) {
    if (!this.active) return

    this.recalcTimer += delta

    // Recalculate path periodically or when not moving
    if (this.recalcTimer >= this.recalcInterval || !this.isMoving) {
      this.recalcTimer = 0
      console.log(`[Enemy] Recalculating path. Current: (${this.tileX},${this.tileY}), Target: (${playerTileX},${playerTileY})`)
      this.calculatePath(playerTileX, playerTileY)
    }

    // Move along the path
    if (this.path.length > 0 && !this.isMoving) {
      console.log('[Enemy] Starting movement to next tile')
      this.moveToNextTile()
    }
  }

  calculatePath(targetX, targetY) {
    const newPath = findPath(
      this.map,
      this.solvedMathWalls,
      this.tileX,
      this.tileY,
      targetX,
      targetY,
      true // Enemy can pass through math walls
    )
    console.log('[Enemy] Path calculated:', newPath.length > 0 ? `${newPath.length} steps` : 'No path found')
    if (newPath.length > 0) {
      this.path = newPath
      this.pathIndex = 0
    }
  }

  moveToNextTile() {
    if (this.pathIndex >= this.path.length) {
      this.path = []
      this.pathIndex = 0
      return
    }

    const nextTile = this.path[this.pathIndex]
    this.isMoving = true

    const targetX = nextTile.x * TILE_SIZE + TILE_SIZE / 2
    const targetY = nextTile.y * TILE_SIZE + TILE_SIZE / 2

    // Calculate move duration based on distance and speed
    const distance = Phaser.Math.Distance.Between(
      this.sprite.x,
      this.sprite.y,
      targetX,
      targetY
    )
    const duration = (distance / this.speed) * 1000

    this.scene.tweens.add({
      targets: this.sprite,
      x: targetX,
      y: targetY,
      duration: duration,
      ease: 'Linear',
      onComplete: () => {
        this.tileX = nextTile.x
        this.tileY = nextTile.y
        this.isMoving = false
        this.pathIndex++
      },
    })
  }

  stop() {
    this.active = false
    this.scene.tweens.killTweensOf(this.sprite)
  }

  destroy() {
    this.sprite.destroy()
  }
}

function createScene({ map, solvedMathWalls, onGameOver, gameStarted, isPaused, easterEggVisible, easterEggs, enemyFrozen, playerFrozen }) {
  return class GridScene extends Phaser.Scene {
    constructor() {
      super({ key: 'GridScene' })
      this.map = map
      this.solvedMathWalls = solvedMathWalls
      this.onGameOver = onGameOver
      this.gameStarted = gameStarted
      this.isPaused = isPaused
      this.easterEggVisible = easterEggVisible
      this.easterEggs = easterEggs
      this.enemyFrozen = enemyFrozen
      this.playerFrozen = playerFrozen
      this.tiles = null
      this.player = null
      this.labels = []
      this.enemy = null
      this.gameOver = false
      this.playerTileX = 1
      this.playerTileY = 1
    }

    create() {
      // Debug: confirm scene booted
      console.info('[Phaser] Scene create')

      this.tiles = this.add.graphics()
      this.cameras.main.setBackgroundColor('#1f2937')
      this.drawMap()

      // Player indicator - stick man
      const startX = TILE_SIZE * 1 + TILE_SIZE / 2
      const startY = TILE_SIZE * 1 + TILE_SIZE / 2
      this.playerTileX = 1
      this.playerTileY = 1
      this.player = createStickMan(this, startX, startY, PLAYER_COLOR, 1.2)
      this.tweens.add({
        targets: this.player,
        scale: 1.15,
        duration: 800,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      })

      // Spawn enemy at G6 checkpoint location
      const enemyStartX = 24
      const enemyStartY = 34
      this.enemy = new Enemy(this, enemyStartX, enemyStartY, this.map, this.solvedMathWalls)

      console.info('[Phaser] Enemy spawned at tile', enemyStartX, enemyStartY)
      console.info('[Phaser] Player starts at tile', this.playerTileX, this.playerTileY)
    }

    // Update loop - handle enemy AI and collision detection
    update(time, delta) {
      if (this.gameOver || !this.gameStarted || this.isPaused) return

      // Update enemy AI (unless frozen)
      if (this.enemy && !this.enemyFrozen) {
        this.enemy.update(time, delta, this.playerTileX, this.playerTileY)

        // Check collision between player and enemy
        const distance = Phaser.Math.Distance.Between(
          this.player.x,
          this.player.y,
          this.enemy.sprite.x,
          this.enemy.sprite.y
        )

        // Collision threshold: if centers are within 1 tile distance
        if (distance < TILE_SIZE * 0.7) {
          this.triggerGameOver()
        }
      }
    }

    triggerGameOver() {
      if (this.gameOver) return
      this.gameOver = true

      console.warn('[Phaser] GAME OVER - Enemy caught the player!')

      // Stop all movement
      this.tweens.killAll()
      if (this.enemy) this.enemy.stop()

      // Flash the player red
      this.tweens.add({
        targets: this.player,
        alpha: 0.3,
        duration: 200,
        yoyo: true,
        repeat: 3,
      })

      // Display Game Over text
      const centerX = (this.map[0].length * TILE_SIZE) / 2
      const centerY = (this.map.length * TILE_SIZE) / 2

      const gameOverBg = this.add.rectangle(centerX, centerY, 300, 100, 0x000000, 0.85)
      gameOverBg.setDepth(100)

      const gameOverText = this.add.text(centerX, centerY, 'GAME OVER', {
        fontFamily: 'Arial',
        fontSize: '32px',
        color: '#ff4444',
        fontStyle: 'bold',
      })
      gameOverText.setOrigin(0.5)
      gameOverText.setDepth(101)

      // Optional: emit event to React layer
      this.events.emit('gameOver')
      if (typeof this.onGameOver === 'function') {
        this.onGameOver()
      }
    }

    drawMap() {
      console.info('[Phaser] drawMap')
      // If scene systems are not ready yet, skip until create runs
      if (!this.add) return

      // Ensure graphics exists before clearing (covers early calls before create)
      if (!this.tiles) {
        this.tiles = this.add.graphics()
      }

      this.tiles.clear()
      this.labels.forEach((t) => t.destroy())
      this.labels = []

      for (let y = 0; y < this.map.length; y++) {
        for (let x = 0; x < this.map[0].length; x++) {
          const key = `${x},${y}`
          const tile = this.map[y][x]
          const isSolved = this.solvedMathWalls.has(key)
          const color = getTileColor(tile, isSolved)

          this.tiles.fillStyle(color, 1)
          this.tiles.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE - 1, TILE_SIZE - 1)

          // Highlight unsolved math walls in red
          if (!isSolved && (key.includes(',18') || key.startsWith('15,'))) {
            this.tiles.fillStyle(MATH_WALL_COLOR, 0.6)
            this.tiles.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE - 1, TILE_SIZE - 1)
          }

          // Labels for checkpoints (G/R/Y)
          if (tile && (tile.startsWith('G') || tile.startsWith('R') || tile.startsWith('Y'))) {
            const text = this.add.text(
              x * TILE_SIZE + TILE_SIZE * 0.25,
              y * TILE_SIZE + TILE_SIZE * 0.2,
              tile,
              {
                fontFamily: 'Arial',
                fontSize: `${TILE_SIZE * 0.4}px`,
                color: '#1b1b1b',
                fontStyle: 'bold',
              }
            )
            text.setDepth(1)
            this.labels.push(text)
          }
        }
      }

      // Draw visible Easter eggs as blinking purple stars
      if (this.easterEggVisible && this.easterEggs) {
        for (const egg of this.easterEggs) {
          const eggKey = `${egg.x},${egg.y}`
          if (this.easterEggVisible.has(eggKey)) {
            // Draw a distinctive purple/magenta star
            const centerX = egg.x * TILE_SIZE + TILE_SIZE / 2
            const centerY = egg.y * TILE_SIZE + TILE_SIZE / 2
            const radius = TILE_SIZE * 0.4
            const spikes = 5
            const outerRadius = radius
            const innerRadius = radius * 0.4

            this.tiles.fillStyle(0xc700ff, 0.9) // Bright magenta/purple

            // Draw a star polygon
            const points = []
            for (let i = 0; i < spikes * 2; i++) {
              const isOuter = i % 2 === 0
              const currentRadius = isOuter ? outerRadius : innerRadius
              const angle = (i * Math.PI) / spikes - Math.PI / 2
              points.push({
                x: centerX + currentRadius * Math.cos(angle),
                y: centerY + currentRadius * Math.sin(angle),
              })
            }

            // Fill the star
            this.tiles.fillPoints(points, true)

            // Add glow effect with stroke
            this.tiles.lineStyle(2, 0xff00ff, 0.6)
            this.tiles.strokePoints(points, true)
          }
        }
      }
    }

    // Smoothly move the player to match React state
    setPlayerPosition({ x, y }) {
      if (!this.player) return
      
      // Track player tile position for enemy pathfinding
      this.playerTileX = x
      this.playerTileY = y

      this.tweens.add({
        targets: this.player,
        x: x * TILE_SIZE + TILE_SIZE / 2,
        y: y * TILE_SIZE + TILE_SIZE / 2,
        duration: 160,
        ease: 'Sine.easeOut',
      })
    }

    // Redraw map when math walls are solved
    updateSolvedWalls(nextSolved) {
      this.solvedMathWalls = nextSolved
      this.drawMap()
      
      // Update enemy's wall state so pathfinding uses new accessible areas
      if (this.enemy) {
        this.enemy.solvedMathWalls = nextSolved
      }
    }
  }
}

export default function PhaserLayer({ map, playerPosition, solvedMathWalls, onGameOver, gameStarted, isPaused, easterEggVisible, easterEggs, enemyFrozen, playerFrozen }) {
  const containerRef = useRef(null)
  const gameRef = useRef(null)
  const sceneRef = useRef(null)
  const readyRef = useRef(false)
  const onGameOverRef = useRef(onGameOver)
  const gameStartedRef = useRef(gameStarted)
  const isPausedRef = useRef(isPaused)
  const easterEggVisibleRef = useRef(easterEggVisible)
  const easterEggsRef = useRef(easterEggs)
  const enemyFrozenRef = useRef(enemyFrozen)
  const playerFrozenRef = useRef(playerFrozen)

  useEffect(() => {
    onGameOverRef.current = onGameOver
  }, [onGameOver])

  useEffect(() => {
    gameStartedRef.current = gameStarted
    if (sceneRef.current) {
      sceneRef.current.gameStarted = gameStarted
    }
  }, [gameStarted])

  useEffect(() => {
    isPausedRef.current = isPaused
    if (sceneRef.current) {
      sceneRef.current.isPaused = isPaused
    }
  }, [isPaused])

  useEffect(() => {
    easterEggVisibleRef.current = easterEggVisible
    if (sceneRef.current) {
      sceneRef.current.easterEggVisible = easterEggVisible
      sceneRef.current.drawMap() // Redraw to show/hide eggs
    }
  }, [easterEggVisible])

  useEffect(() => {
    easterEggsRef.current = easterEggs
    if (sceneRef.current) {
      sceneRef.current.easterEggs = easterEggs
    }
  }, [easterEggs])

  useEffect(() => {
    enemyFrozenRef.current = enemyFrozen
    if (sceneRef.current) {
      sceneRef.current.enemyFrozen = enemyFrozen
    }
  }, [enemyFrozen])

  useEffect(() => {
    playerFrozenRef.current = playerFrozen
    if (sceneRef.current) {
      sceneRef.current.playerFrozen = playerFrozen
    }
  }, [playerFrozen])

  useEffect(() => {
    if (!containerRef.current) return
    if (gameRef.current) return // Avoid double-init (React strict mode)

    // Fresh scene instance that reads current map data
    const SceneClass = createScene({
      map,
      solvedMathWalls,
      gameStarted: gameStartedRef.current,
      isPaused: isPausedRef.current,
      easterEggVisible: easterEggVisibleRef.current,
      easterEggs: easterEggsRef.current,
      enemyFrozen: enemyFrozenRef.current,
      playerFrozen: playerFrozenRef.current,
      onGameOver: () => {
        if (onGameOverRef.current) {
          onGameOverRef.current()
        }
      },
    })

    const game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: containerRef.current,
      width: map[0].length * TILE_SIZE,
      height: map.length * TILE_SIZE,
      backgroundColor: '#1f2937',
      render: { pixelArt: true },
      physics: { default: 'arcade' },
      transparent: false,
    })

    gameRef.current = game

    // Explicitly add and start the scene to avoid auto-start issues
    const sceneInstance = new SceneClass()
    game.scene.add('GridScene', sceneInstance, false)
    game.scene.start('GridScene')
    sceneRef.current = sceneInstance

    const sceneEvents = sceneInstance?.events || sceneInstance?.sys?.events
    if (sceneEvents?.once) {
      sceneEvents.once(Phaser.Scenes.Events.CREATE, () => {
        readyRef.current = true
        // Debug overlay to confirm draw even if map data fails
        const dbg = sceneInstance.add.rectangle(10, 10, 40, 40, 0x00ff00).setOrigin(0)
        dbg.setDepth(10)

        sceneInstance.setPlayerPosition(playerPosition)
        sceneInstance.updateSolvedWalls(solvedMathWalls)
      })
    } else {
      // If events are missing, fall back immediately
      readyRef.current = true
      sceneInstance.setPlayerPosition(playerPosition)
      sceneInstance.updateSolvedWalls(solvedMathWalls)
    }

    // Fallback: if CREATE already fired before listener, set state soon after start
    setTimeout(() => {
      if (!readyRef.current && sceneInstance.sys?.isActive() && sceneInstance.add) {
        readyRef.current = true
        sceneInstance.setPlayerPosition(playerPosition)
        sceneInstance.updateSolvedWalls(solvedMathWalls)
      }
    }, 0)

    return () => {
      // Clean destroy to avoid leaking canvases when React unmounts
      game.destroy(true)
      gameRef.current = null
      sceneRef.current = null
      readyRef.current = false
    }
  }, [map])

  // Respond to React state changes (player moves or walls solved)
  useEffect(() => {
    if (sceneRef.current && readyRef.current) {
      sceneRef.current.setPlayerPosition(playerPosition)
    }
  }, [playerPosition])

  useEffect(() => {
    if (sceneRef.current && readyRef.current) {
      sceneRef.current.updateSolvedWalls(solvedMathWalls)
    }
  }, [solvedMathWalls])

  return (
    <div
      ref={containerRef}
      style={{
        width: map[0].length * TILE_SIZE,
        height: map.length * TILE_SIZE,
        borderRadius: 8,
        overflow: 'hidden',
      }}
    />
  )
}
