import StatCard from './StatCard'

const Dashboard = ({ budget, safetyScore, accidentRisk, timeLeft, gameStatus, handlePauseToggle, handleRestart, gameStarted, isPaused }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, overflow: 'visible' }}>
      <div style={{ display: 'flex', gap: 12, marginTop: 0, justifyContent: 'center', alignItems: 'center' }}>
        <button
          onClick={handlePauseToggle}
          className="game-button"
          disabled={!gameStarted || gameStatus !== 'playing'}
          style={{
            padding: '18px 40px',
            minWidth: 200,
            borderRadius: 16,
            border: '3px solid #f57c00',
            background: isPaused
              ? 'linear-gradient(135deg, #66bb6a 0%, #43a047 100%)'
              : 'linear-gradient(135deg, #ffa726 0%, #f57c00 100%)',
            color: 'white',
            cursor: (!gameStarted || gameStatus !== 'playing') ? 'not-allowed' : 'pointer',
            fontSize: 20,
            fontWeight: 800,
            boxShadow: '0 8px 16px rgba(245, 124, 0, 0.4)',
            textTransform: 'uppercase',
            letterSpacing: 1,
            opacity: (!gameStarted || gameStatus !== 'playing') ? 0.5 : 1,
          }}
        >
          {isPaused ? '▶️ Resume' : '⏸️ Pause'}
        </button>
        <button
          onClick={handleRestart}
          className="game-button"
          style={{
            padding: '18px 40px',
            minWidth: 200,
            borderRadius: 16,
            border: '3px solid #d32f2f',
            background: 'linear-gradient(135deg, #e57373 0%, #d32f2f 100%)',
            color: 'white',
            cursor: 'pointer',
            fontSize: 20,
            fontWeight: 800,
            boxShadow: '0 8px 16px rgba(211, 47, 47, 0.4)',
            textTransform: 'uppercase',
            letterSpacing: 1,
          }}
        >
          🔄 Restart
        </button>
      </div>

      <h2
        style={{
          margin: 0,
          fontSize: 22,
          fontWeight: 800,
          color: '#1a237e',
          textTransform: 'uppercase',
          letterSpacing: 0.5,
          textShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}
      >
        🏭 Factory Dashboard
      </h2>

      <div
        className="stat-card glass-card"
        style={{
          padding: 20,
          borderRadius: 14,
          background: 'linear-gradient(135deg, rgba(227, 242, 253, 0.95) 0%, rgba(187, 222, 251, 0.95) 100%)',
          backdropFilter: 'blur(10px)',
          border: '2px solid rgba(25, 118, 210, 0.3)',
          minHeight: 120,
          fontSize: 14,
          color: '#0d47a1',
          boxShadow: '0 8px 24px rgba(25, 118, 210, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
        }}
      >
        {/* First Row: Budget, Safety, Risk - Centered */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 16 }}>
          <StatCard icon="💰" label="Budget" value={`RM${budget}`} />
          <StatCard icon="🛡️" label="Safety" value={safetyScore} />
          <StatCard icon="⚠️" label="Risk" value={accidentRisk} />
        </div>

        {/* Second Row: Time - Centered */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div
            className={timeLeft <= 10 ? 'stat-card time-warning' : 'stat-card'}
            style={{
              textAlign: 'center',
              padding: 12,
              borderRadius: 10,
              background: timeLeft <= 10
                ? 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)'
                : 'linear-gradient(135deg, #e1f5fe 0%, #b3e5fc 100%)',
              border: timeLeft <= 10 ? '2px solid #e53935' : '2px solid #03a9f4',
              boxShadow: timeLeft <= 10 ? '0 0 20px rgba(229,57,53,0.4)' : '0 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            <div
              style={{
                fontSize: 14,
                color: '#616161',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: 0.5,
                marginBottom: 4,
              }}
            >
              ⏱️ Time
            </div>
            <div
              className={timeLeft <= 10 ? 'neon-text' : ''}
              style={{
                fontSize: 40,
                fontWeight: 900,
                color: timeLeft <= 10 ? '#c62828' : timeLeft <= 30 ? '#f57c00' : '#0277bd',
                textShadow: '0 2px 4px rgba(0,0,0,0.2)',
              }}
            >
              {timeLeft}s
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
