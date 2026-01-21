import { useEffect, useState } from 'react'
import PhaserLayer from './phaser/PhaserLayer.jsx'
import useSoundManager from './hooks/useSoundManager'
import { objectives, EASTER_EGGS, easterEggMap, factoryMap } from './data/gameData'
import { isWalkable, getTileAt, isMathWall, getClosestGate, getMathWallQuiz } from './utils/gameUtils'
import Dashboard from './components/Dashboard'
import GridRenderer from './components/GridRenderer'
import './App.css'

function App() {
  const sound = useSoundManager()
  
  const [gameStarted, setGameStarted] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [playerPosition, setPlayerPosition] = useState({ x: 1, y: 1 })
  const [isMoving, setIsMoving] = useState(false)
  const [budget, setBudget] = useState(10000)
  const [safetyScore, setSafetyScore] = useState(50)
  const [accidentRisk, setAccidentRisk] = useState(50)
  const [message, setMessage] = useState('Click START GAME to begin your mission!')
  const [completedObjectives, setCompletedObjectives] = useState([])
  const [gameStatus, setGameStatus] = useState('playing')
  const [timeLeft, setTimeLeft] = useState(120)
  const [activeObjectiveId, setActiveObjectiveId] = useState(null)
  const [checkpointFeedback, setCheckpointFeedback] = useState(null)
  const [solvedMathWalls, setSolvedMathWalls] = useState(new Set())
  const [easterEggVisible, setEasterEggVisible] = useState(new Set())
  const [enemyFrozen, setEnemyFrozen] = useState(false)
  const [playerFrozen, setPlayerFrozen] = useState(false)
  const [easterEggCooldown, setEasterEggCooldown] = useState(new Map())

  const handleEasterEggCollision = (x, y) => {
    const key = `${x},${y}`
    const egg = easterEggMap.get(key)
    if (!egg || easterEggCooldown.has(egg.id)) return false

    setEasterEggCooldown((prev) => new Map(prev).set(egg.id, true))
    setTimeout(() => setEasterEggCooldown((prev) => { const updated = new Map(prev); updated.delete(egg.id); return updated }), 2000)

    switch (egg.type) {
      case 'stop-enemy':
        sound.playGoodInvestSound()
        setEnemyFrozen(true)
        setMessage(' Enemy frozen for 15 seconds!')
        return true
      case 'instant-win':
        sound.stopBackgroundSound()
        sound.playWinSound()
        setGameStatus('won')
        setMessage(' You found the instant win! Game completed!')
        return true
      case 'freeze-player':
        sound.playBadInvestSound()
        setPlayerFrozen(true)
        setMessage(' You are frozen for 10 seconds!')
        return true
      case 'rick-roll':
        sound.playWinSound()
        setMessage(' Opening surprise...')
        setTimeout(() => window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank'), 500)
        return true
      default:
        return false
    }
  }

  const handleMathWall = (newX, newY) => {
    const gate = getClosestGate(newX, newY)
    if (!gate) return false

    const quiz = getMathWallQuiz(gate.id)
    const optionsText = quiz.options.map((opt, idx) => `${idx + 1}) ${opt}`).join('\n')
    const userAnswer = window.prompt(` Safety Gate Challenge\n\nObjective: ${quiz.objective}\n\n${quiz.question}\n\n${optionsText}\n\nChoose 1-${quiz.options.length}`)

    if (userAnswer === null) {
      setMessage('You cancelled the gate challenge.')
      return false
    }

    const userNum = parseInt(userAnswer, 10) - 1
    const isValidChoice = !isNaN(userNum) && userNum >= 0 && userNum < quiz.options.length

    if (!isValidChoice) {
      setMessage('Invalid choice. The gate stays locked.')
      return false
    }

    if (userNum === quiz.correctIndex) {
      sound.playGoodInvestSound()
      const newSolvedWalls = new Set(solvedMathWalls)
      newSolvedWalls.add(`${newX},${newY}`)
      setSolvedMathWalls(newSolvedWalls)
      setMessage(' Gate opened at this spot. Move through!')
      return true
    } else {
      sound.stopBackgroundSound()
      sound.playLoseSound()
      setGameStatus('lost')
      setMessage(` Wrong answer! Game Over. The safest choice was "${quiz.options[quiz.correctIndex]}".`)
      return false
    }
  }

  const handleEnemyCatch = () => {
    if (gameStatus !== 'playing') return
    sound.stopBackgroundSound()
    sound.playLoseSound()
    setGameStatus('lost')
    setMessage(' The saboteur caught you on the factory floor!')
  }

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (isPaused || playerFrozen || !gameStarted || gameStatus !== 'playing') return
      
      let dx = 0, dy = 0
      if (event.key === 'ArrowUp') dy = -1
      else if (event.key === 'ArrowDown') dy = 1
      else if (event.key === 'ArrowLeft') dx = -1
      else if (event.key === 'ArrowRight') dx = 1
      else return

      event.preventDefault()
      
      setPlayerPosition((prevPos) => {
        const newX = prevPos.x + dx
        const newY = prevPos.y + dy

        if (handleEasterEggCollision(newX, newY)) {
          sound.playMoveSound()
          setIsMoving(true)
          setTimeout(() => setIsMoving(false), 200)
          return { x: newX, y: newY }
        }

        if (isMathWall(newX, newY, solvedMathWalls)) {
          const solved = handleMathWall(newX, newY)
          if (!solved) return prevPos
        }

        if (isWalkable(newX, newY, solvedMathWalls)) {
          sound.playMoveSound()
          setIsMoving(true)
          setTimeout(() => setIsMoving(false), 200)
          
          const tile = getTileAt(newX, newY)
          if (tile && (tile.startsWith('G') || tile.startsWith('R') || tile.startsWith('Y'))) {
            setCompletedObjectives((completed) => {
              if (completed.includes(tile)) {
                setActiveObjectiveId(null)
                setMessage(` You already completed ${objectives[tile].name}.`)
              } else {
                setActiveObjectiveId(tile)
                setMessage(` You arrived at ${objectives[tile].name}. Decide how to proceed.`)
              }
              return completed
            })
          } else {
            setActiveObjectiveId(null)
          }
          
          return { x: newX, y: newY }
        } else {
          setMessage('You cannot walk through walls!')
          return prevPos
        }
      })
    }

    if (gameStarted && gameStatus === 'playing') {
      window.addEventListener('keydown', handleKeyDown)
    }
    
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [gameStarted, gameStatus, solvedMathWalls, isPaused, playerFrozen])

  useEffect(() => {
    if (!gameStarted || gameStatus !== 'playing' || isPaused) return

    const intervalId = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalId)
          sound.stopBackgroundSound()
          if (safetyScore >= 80) {
            sound.playWinSound()
            setGameStatus('won')
            setMessage('Time is up! Your final Safety Score is strong enough. You saved the factory!')
          } else {
            sound.playLoseSound()
            setGameStatus('lost')
            setMessage('Time is up and the Safety Score is too low. The factory is not safe enough.')
          }
          return 0
        }
        if (prev <= 10) sound.playWarningBeep()
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(intervalId)
  }, [gameStarted, gameStatus, safetyScore, isPaused])

  useEffect(() => { return () => { sound.stopBackgroundSound() } }, [])

  useEffect(() => {
    const eggBlinkInterval = setInterval(() => {
      setEasterEggVisible(new Set(EASTER_EGGS.map(egg => `${egg.x},${egg.y}`)))
      const hideTimer = setTimeout(() => setEasterEggVisible(new Set()), 3000)
      return () => clearTimeout(hideTimer)
    }, 10000)
    
    return () => clearInterval(eggBlinkInterval)
  }, [])

  useEffect(() => {
    if (!playerFrozen) return
    const freezeTimer = setTimeout(() => { setPlayerFrozen(false); setMessage(' You are unfrozen!') }, 10000)
    return () => clearTimeout(freezeTimer)
  }, [playerFrozen])

  useEffect(() => {
    if (!enemyFrozen) return
    const freezeTimer = setTimeout(() => { setEnemyFrozen(false); setMessage(' Enemy is unfrozen!') }, 15000)
    return () => clearTimeout(freezeTimer)
  }, [enemyFrozen])

  const handleInvest = () => {
    if (!activeObjectiveId) return
    const obj = objectives[activeObjectiveId]

    if (completedObjectives.includes(activeObjectiveId)) {
      setMessage(' This checkpoint has already been completed.')
      return
    }

    if (budget - obj.cost < 0) {
      setMessage(` Not enough budget for ${obj.name}. You only have RM${budget}.`)
      return
    }

    const newBudget = budget - obj.cost + (obj.budgetChange || 0)
    const newSafety = safetyScore + obj.safetyChange
    const newAccidentRisk = accidentRisk + obj.accidentRiskChange
    const newTimeLeft = Math.max(0, timeLeft + (obj.timeChange || 0))

    if (obj.type === 'advantage') sound.playGoodInvestSound()
    else if (obj.type === 'disadvantage') sound.playBadInvestSound()
    else if (obj.type === 'neutral') sound.playNeutralInvestSound()

    setBudget(newBudget)
    setSafetyScore(newSafety)
    setAccidentRisk(newAccidentRisk)
    if (obj.timeChange) setTimeLeft(newTimeLeft)
    setCompletedObjectives((prev) => [...prev, activeObjectiveId])
    setActiveObjectiveId(null)

    const feedback = { name: obj.name, changes: [] }
    if (obj.safetyChange !== 0) feedback.changes.push(`Safety ${obj.safetyChange > 0 ? '+' : ''}${obj.safetyChange}`)
    if (obj.accidentRiskChange !== 0) feedback.changes.push(`Risk ${obj.accidentRiskChange > 0 ? '+' : ''}${obj.accidentRiskChange}`)
    if (obj.budgetChange) feedback.changes.push(`Budget ${obj.budgetChange > 0 ? '+' : ''}${obj.budgetChange}`)
    if (obj.timeChange) feedback.changes.push(`Time ${obj.timeChange > 0 ? '+' : ''}${obj.timeChange}s`)
    
    setCheckpointFeedback(feedback)
    setTimeout(() => setCheckpointFeedback(null), 3000)

    setMessage(` ${obj.name} completed! ${feedback.changes.join(', ')}`)

    if (newSafety >= 80) {
      sound.stopBackgroundSound()
      sound.playWinSound()
      setGameStatus('won')
      setMessage('You saved the SafeCity Factory! Safety Score reached 80. Great job!')
      return
    }

    if (newBudget <= 0 || newSafety <= 0 || newAccidentRisk > 80) {
      sound.stopBackgroundSound()
      sound.playLoseSound()
      setGameStatus('lost')
      let lossReason = ''
      if (newBudget <= 0) lossReason = 'The factory ran out of budget.'
      else if (newSafety <= 0) lossReason = 'The factory became too unsafe.'
      else if (newAccidentRisk > 80) lossReason = 'Accident risk exceeded 80! The factory is too dangerous.'
      setMessage(`Oh no! Game over. ${lossReason}`)
    }
  }

  const handleSkip = () => {
    if (!activeObjectiveId) return
    sound.playSkipSound()
    setMessage(`You skipped the ${objectives[activeObjectiveId].name}.`)
    setActiveObjectiveId(null)
  }

  const handlePauseToggle = () => {
    if (!gameStarted || gameStatus !== 'playing') return
    setIsPaused(!isPaused)
    setMessage(isPaused ? ' Game resumed' : ' Game paused')
  }

  const handleRestart = () => window.location.reload()

  const currentObjective = activeObjectiveId ? objectives[activeObjectiveId] : null

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', padding: 20, background: 'radial-gradient(circle at top, #fefefe 0, #e0f7fa 40%, #e0e0e0 100%)', fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif', color: '#111', overflow: 'visible' }}>
      {/* Game Modals */}
      {!gameStarted && gameStatus === 'playing' && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, animation: 'fadeIn 0.3s ease-out' }}>
          <div style={{ backgroundColor: 'white', padding: 48, borderRadius: 20, textAlign: 'center', maxWidth: 900, width: '90%', border: '4px solid #1976d2', boxShadow: '0 20px 60px rgba(25, 118, 210, 0.4)', animation: 'slideInUp 0.5s ease-out' }}>
            <h2 style={{ margin: '0 0 16px 0', fontSize: 36, fontWeight: 900, color: '#1a237e', textTransform: 'uppercase', letterSpacing: 1.5 }}>🏭 READY TO SAVE THE FACTORY?</h2>
            <p style={{ fontSize: 16, color: '#424242', marginBottom: 32, lineHeight: 1.6, fontWeight: 600 }}>
              You have <strong style={{ color: '#f57c00', fontSize: 20 }}>120 seconds</strong> to reach a Safety Score of <strong style={{ color: '#2e7d32', fontSize: 18 }}>80+</strong>
            </p>
            <p style={{ fontSize: 14, color: '#616161', marginBottom: 24, lineHeight: 1.5 }}>
              Navigate the factory floor, visit checkpoints, and make strategic decisions to improve safety while managing your budget.
            </p>

            <div style={{ marginBottom: 32, padding: 24, borderRadius: 12, background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)', border: '2px solid #1976d2', boxShadow: '0 4px 12px rgba(25, 118, 210, 0.15)' }}>
              <h3 style={{ marginTop: 0, marginBottom: 20, fontSize: 20, fontWeight: 800, color: '#1a237e', textAlign: 'center', letterSpacing: 0.5, textTransform: 'uppercase' }}>
                🎯 MISSION OBJECTIVES
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, fontSize: 13, color: '#212121', fontWeight: 500, textAlign: 'left' }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <span style={{ flexShrink: 0, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)', color: '#fff', fontSize: 14, fontWeight: 800, boxShadow: '0 2px 6px rgba(25, 118, 210, 0.3)' }}>1</span>
                  <span style={{ fontWeight: 600, fontSize: 13 }}>Visit checkpoints: All appear as <strong style={{ color: '#f57c00' }}>🟡 Yellow</strong> tiles on the grid.</span>
                </div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <span style={{ flexShrink: 0, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)', color: '#fff', fontSize: 14, fontWeight: 800, boxShadow: '0 2px 6px rgba(25, 118, 210, 0.3)' }}>2</span>
                  <span style={{ fontWeight: 600, fontSize: 13 }}>Press <strong>Invest</strong> to activate checkpoint effects (costs budget).</span>
                </div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <span style={{ flexShrink: 0, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)', color: '#fff', fontSize: 14, fontWeight: 800, boxShadow: '0 2px 6px rgba(25, 118, 210, 0.3)' }}>3</span>
                  <span style={{ fontWeight: 600, fontSize: 13 }}>Reach <strong style={{ color: '#2e7d32' }}>Safety 80+</strong> before time expires.</span>
                </div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <span style={{ flexShrink: 0, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)', color: '#fff', fontSize: 14, fontWeight: 800, boxShadow: '0 2px 6px rgba(25, 118, 210, 0.3)' }}>4</span>
                  <span style={{ fontWeight: 600, fontSize: 13 }}>You have <strong style={{ color: '#f57c00' }}>120 seconds</strong> to complete the mission.</span>
                </div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <span style={{ flexShrink: 0, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)', color: '#fff', fontSize: 14, fontWeight: 800, boxShadow: '0 2px 6px rgba(25, 118, 210, 0.3)' }}>5</span>
                  <span style={{ fontWeight: 600, fontSize: 13 }}>A <strong style={{ color: '#d32f2f' }}>saboteur</strong> is chasing you - avoid getting caught!</span>
                </div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <span style={{ flexShrink: 0, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)', color: '#fff', fontSize: 14, fontWeight: 800, boxShadow: '0 2px 6px rgba(25, 118, 210, 0.3)' }}>6</span>
                  <span style={{ fontWeight: 600, fontSize: 13 }}>Cross <strong style={{ color: '#ef5350' }}>🔴 Red Walls</strong> by answering safety questions correctly. Game pauses when you hit them.</span>
                </div>
              </div>
            </div>

            <button onClick={() => { setGameStarted(true); sound.playStartSound(); sound.startBackgroundSound(); setMessage('🎮 Game started! Move to checkpoints and make your choices wisely.') }} className="game-button" style={{ padding: '16px 40px', fontSize: 20, fontWeight: 900, background: 'linear-gradient(135deg, #43a047 0%, #2e7d32 100%)', color: 'white', border: '3px solid #1b5e20', borderRadius: 12, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: 2, boxShadow: '0 6px 16px rgba(67,160,71,0.5)', animation: 'pulse 2s ease-in-out infinite' }}>▶️ START GAME</button>
          </div>
        </div>
      )}

      {checkpointFeedback && (
        <div style={{ position: 'fixed', top: 100, left: '50%', transform: 'translateX(-50%)', zIndex: 1500, animation: 'slideInUp 0.3s ease-out' }}>
          <div style={{ padding: '16px 32px', borderRadius: 12, background: 'linear-gradient(135deg, #ffd54f 0%, #ffb300 100%)', color: '#1a237e', fontWeight: 800, fontSize: 16, boxShadow: '0 8px 24px rgba(0,0,0,0.3)', border: '2px solid rgba(255,255,255,0.3)', textAlign: 'center' }}>
            <div style={{ marginBottom: 4 }}>{checkpointFeedback.name}</div>
            <div style={{ fontSize: 14, opacity: 0.95 }}>{checkpointFeedback.changes.join(' | ')}</div>
          </div>
        </div>
      )}

      {gameStatus !== 'playing' && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'white', padding: 40, borderRadius: 16, boxShadow: '0 20px 60px rgba(0,0,0,0.4)', textAlign: 'center', maxWidth: 450, width: '90%', border: `3px solid ${gameStatus === 'won' ? '#43a047' : '#e53935'}`, animation: 'slideInUp 0.4s ease-out' }}>
            <h2 style={{ margin: '0 0 20px 0', fontSize: 34, fontWeight: 900, color: gameStatus === 'won' ? '#1b5e20' : '#b71c1c', textTransform: 'uppercase', letterSpacing: 1 }}>
              {gameStatus === 'won' ? '🎉 Factory Saved!' : '💥 Game Over'}
            </h2>
            <p style={{ fontSize: 16, color: '#424242', marginBottom: 24, lineHeight: 1.6, fontWeight: 600 }}>
              {gameStatus === 'won' ? 'You reached a Safety Score of at least 80. Great job!' : message}
            </p>
            <button onClick={() => window.location.reload()} className="game-button" style={{ padding: '14px 32px', fontSize: 16, fontWeight: 800, background: gameStatus === 'won' ? 'linear-gradient(135deg, #43a047 0%, #2e7d32 100%)' : 'linear-gradient(135deg, #e53935 0%, #c62828 100%)', color: 'white', border: `2px solid ${gameStatus === 'won' ? '#2e7d32' : '#c62828'}`, borderRadius: 10, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: 1, boxShadow: `0 4px 12px ${gameStatus === 'won' ? 'rgba(67,160,71,0.4)' : 'rgba(229,57,53,0.4)'}` }}>🔄 Play Again</button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div style={{ backgroundColor: 'white', padding: 24, borderRadius: 12, boxShadow: '0 10px 40px rgba(0,0,0,0.12)', display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 1400, width: '100%', overflow: 'visible' }}>
        <div style={{ textAlign: 'center', paddingBottom: 16 }}>
          <h1 style={{ marginTop: 0, marginBottom: 8, fontSize: 32, fontWeight: 900, background: 'linear-gradient(135deg, #1a237e 0%, #283593 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textTransform: 'uppercase', letterSpacing: 1 }}>
            🏭 OSH Budget Quest: Save the SafeCity Factory!
          </h1>
          <p style={{ marginTop: 0, fontSize: 15, color: '#616161', fontWeight: 600, lineHeight: 1.6 }}>
            Manage the factory budget and safety measures. Reach <strong style={{ color: '#2e7d32' }}>Safety Score 80</strong> before time runs out.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start', width: '100%' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ fontSize: 13, color: '#555' }}>Use <strong>arrow keys</strong> to move around the factory.</div>
            <div className="game-grid-container" style={{ border: '3px solid rgba(25, 118, 210, 0.4)', borderRadius: 8, padding: 4, background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', display: 'inline-block', boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)' }}>
              <PhaserLayer map={factoryMap} playerPosition={playerPosition} solvedMathWalls={solvedMathWalls} onGameOver={handleEnemyCatch} gameStarted={gameStarted} isPaused={isPaused} easterEggVisible={easterEggVisible} easterEggs={EASTER_EGGS} enemyFrozen={enemyFrozen || activeObjectiveId !== null} playerFrozen={playerFrozen} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Dashboard budget={budget} safetyScore={safetyScore} accidentRisk={accidentRisk} timeLeft={timeLeft} gameStatus={gameStatus} handlePauseToggle={handlePauseToggle} handleRestart={handleRestart} gameStarted={gameStarted} isPaused={isPaused} />
            
            <div style={{ fontSize: 16, fontWeight: 700, padding: 16, background: 'rgba(255,255,255,0.95)', borderRadius: 10, border: '2px solid rgba(25, 118, 210, 0.4)', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
              <strong style={{ color: '#1a237e' }}>💬 Supervisor:</strong> <span style={{ color: '#1a237e', marginLeft: 8, fontSize: 18, fontWeight: 800 }}>{message}</span>
            </div>

            {currentObjective && gameStatus === 'playing' && (
              <div style={{ padding: 28, borderRadius: 14, background: 'linear-gradient(135deg, #fffde7 0%, #fff9c4 100%)', border: '4px solid #fdd835', fontSize: 14, boxShadow: '0 6px 16px rgba(253, 216, 53, 0.4)' }}>
                <h3 style={{ marginTop: 0, marginBottom: 16, fontSize: 28, textAlign: 'center', fontWeight: 900, color: '#f57c00', textTransform: 'uppercase' }}>{currentObjective.name}</h3>
                <p style={{ marginTop: 0, marginBottom: 20, textAlign: 'center', fontSize: 18, fontWeight: 600, color: '#424242', lineHeight: 1.6 }}>{currentObjective.description}</p>
                <div style={{ marginBottom: 20, textAlign: 'center', fontSize: 18, fontWeight: 700 }}>
                  <div style={{ marginBottom: 12 }}>
                    <strong style={{ color: '#1565c0' }}>Cost:</strong> <span style={{ color: '#0d47a1', fontSize: 22, fontWeight: 900 }}>RM{currentObjective.cost}</span>
                  </div>
                  {currentObjective.safetyChange !== 0 && (
                    <div style={{ color: currentObjective.safetyChange > 0 ? '#2e7d32' : '#c62828', fontSize: 20, fontWeight: 800 }}>
                      🛡️ Safety {currentObjective.safetyChange > 0 ? '+' : ''}{currentObjective.safetyChange}
                    </div>
                  )}
                  {currentObjective.accidentRiskChange !== 0 && (
                    <div style={{ color: currentObjective.accidentRiskChange > 0 ? '#c62828' : '#2e7d32', fontSize: 20, fontWeight: 800 }}>
                      ⚠️ Risk {currentObjective.accidentRiskChange > 0 ? '+' : ''}{currentObjective.accidentRiskChange}
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
                  <button onClick={handleInvest} className="game-button" style={{ padding: '14px 32px', borderRadius: 12, border: '3px solid #2e7d32', background: 'linear-gradient(135deg, #43a047 0%, #2e7d32 100%)', color: 'white', cursor: 'pointer', fontSize: 18, fontWeight: 800, boxShadow: '0 6px 12px rgba(67, 160, 71, 0.4)', textTransform: 'uppercase' }}>✅ Invest</button>
                  <button onClick={handleSkip} className="game-button" style={{ padding: '14px 32px', borderRadius: 12, border: '3px solid #757575', background: 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)', cursor: 'pointer', fontSize: 18, color: '#424242', fontWeight: 800, boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)', textTransform: 'uppercase' }}>❌ Skip</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
