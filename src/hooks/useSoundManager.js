import { useRef } from 'react'

const useSoundManager = () => {
  const audioContextRef = useRef(null)
  const backgroundOscillatorRef = useRef(null)
  const backgroundGainRef = useRef(null)
  const bgmIntervalRef = useRef(null)

  const initAudio = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
    }
  }

  const createSound = (frequency, duration, gainValue, type = 'sine') => {
    if (!audioContextRef.current) return
    const ctx = audioContextRef.current
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = type
    osc.connect(gain)
    gain.connect(ctx.destination)

    return { osc, gain, ctx }
  }

  const playStartSound = () => {
    initAudio()
    const { osc, gain, ctx } = createSound(400, 0.3, 0.15)
    osc.frequency.setValueAtTime(400, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.3)
    gain.gain.setValueAtTime(0.15, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.3)
  }

  const startBackgroundSound = () => {
    initAudio()
    const ctx = audioContextRef.current
    stopBackgroundSound()

    const playMelodyLoop = () => {
      const melody = [
        { freq: 262, duration: 0.3 }, { freq: 330, duration: 0.3 },
        { freq: 392, duration: 0.3 }, { freq: 330, duration: 0.3 },
        { freq: 294, duration: 0.3 }, { freq: 330, duration: 0.3 },
        { freq: 262, duration: 0.3 }, { freq: 247, duration: 0.3 },
      ]

      let time = ctx.currentTime
      melody.forEach((note) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'square'
        osc.frequency.setValueAtTime(note.freq, time)
        gain.gain.setValueAtTime(0, time)
        gain.gain.linearRampToValueAtTime(0.04, time + 0.01)
        gain.gain.linearRampToValueAtTime(0.02, time + note.duration * 0.7)
        gain.gain.linearRampToValueAtTime(0, time + note.duration)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(time)
        osc.stop(time + note.duration)
        time += note.duration
      })
    }

    playMelodyLoop()
    bgmIntervalRef.current = setInterval(playMelodyLoop, 2400)
  }

  const stopBackgroundSound = () => {
    if (bgmIntervalRef.current) {
      clearInterval(bgmIntervalRef.current)
      bgmIntervalRef.current = null
    }
    if (backgroundOscillatorRef.current) {
      try { backgroundOscillatorRef.current.stop() } catch (e) {}
      backgroundOscillatorRef.current = null
      backgroundGainRef.current = null
    }
  }

  const playMoveSound = () => {
    const sound = createSound(200, 0.05, 0.05, 'square')
    if (!sound) return
    const { osc, gain, ctx } = sound
    gain.gain.setValueAtTime(0.05, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.05)
  }

  const playWinSound = () => {
    if (!audioContextRef.current) return
    const ctx = audioContextRef.current
    const notes = [523, 659, 784, 1047]
    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.frequency.setValueAtTime(freq, ctx.currentTime)
      gain.gain.setValueAtTime(0.1, ctx.currentTime + index * 0.15)
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + index * 0.15 + 0.2)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(ctx.currentTime + index * 0.15)
      osc.stop(ctx.currentTime + index * 0.15 + 0.2)
    })
  }

  const playLoseSound = () => {
    const sound = createSound(400, 0.5, 0.15)
    if (!sound) return
    const { osc, gain, ctx } = sound
    osc.frequency.setValueAtTime(400, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.5)
    gain.gain.setValueAtTime(0.15, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.5)
  }

  const playWarningBeep = () => {
    const sound = createSound(880, 0.1, 0.08)
    if (!sound) return
    const { osc, gain, ctx } = sound
    gain.gain.setValueAtTime(0.08, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.1)
  }

  const playMultiNoteSound = (notes, type = 'sine') => {
    if (!audioContextRef.current) return
    const ctx = audioContextRef.current
    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = type
      osc.frequency.setValueAtTime(freq, ctx.currentTime)
      gain.gain.setValueAtTime(0.12, ctx.currentTime + index * 0.1)
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + index * 0.1 + 0.15)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(ctx.currentTime + index * 0.1)
      osc.stop(ctx.currentTime + index * 0.1 + 0.15)
    })
  }

  const playGoodInvestSound = () => playMultiNoteSound([523, 659])
  const playBadInvestSound = () => playMultiNoteSound([392, 294], 'triangle')
  
  const playNeutralInvestSound = () => {
    const sound = createSound(440, 0.2, 0.1)
    if (!sound) return
    const { osc, gain, ctx } = sound
    gain.gain.setValueAtTime(0.1, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.2)
  }

  const playSkipSound = () => {
    const sound = createSound(330, 0.08, 0.08, 'square')
    if (!sound) return
    const { osc, gain, ctx } = sound
    gain.gain.setValueAtTime(0.08, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.08)
  }

  return {
    playStartSound,
    startBackgroundSound,
    stopBackgroundSound,
    playMoveSound,
    playWinSound,
    playLoseSound,
    playWarningBeep,
    playGoodInvestSound,
    playBadInvestSound,
    playNeutralInvestSound,
    playSkipSound,
  }
}

export default useSoundManager
