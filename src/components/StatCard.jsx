const StatCard = ({ icon, label, value, condition }) => {
  const getBackground = () => {
    if (label === 'Budget') {
      return value < 2000
        ? 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)'
        : 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)'
    }
    if (label === 'Safety') {
      return value >= 80
        ? 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)'
        : value < 30
        ? 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)'
        : 'linear-gradient(135deg, #fffde7 0%, #fff9c4 100%)'
    }
    if (label === 'Risk') {
      return value > 80
        ? 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)'
        : value > 60
        ? 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)'
        : 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)'
    }
    return 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)'
  }

  const getBorder = () => {
    if (label === 'Budget' && value < 2000) return '2px solid #ff9800'
    if (label === 'Safety') {
      return value >= 80 ? '2px solid #66bb6a' : value < 30 ? '2px solid #e53935' : '2px solid #ffeb3b'
    }
    if (label === 'Risk') {
      return value > 80 ? '2px solid #e53935' : value > 60 ? '2px solid #ff9800' : '2px solid #66bb6a'
    }
    return '1px solid #e0e0e0'
  }

  const getColor = () => {
    if (label === 'Budget') return value < 2000 ? '#e65100' : '#0d47a1'
    if (label === 'Safety') return value >= 80 ? '#2e7d32' : value < 30 ? '#c62828' : '#f57c00'
    if (label === 'Risk') return value > 80 ? '#c62828' : value > 60 ? '#e65100' : '#2e7d32'
    return '#0d47a1'
  }

  return (
    <div
      className="stat-card"
      style={{
        padding: 12,
        borderRadius: 10,
        background: getBackground(),
        border: getBorder(),
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
        {icon} {label}
      </div>
      <div
        style={{
          fontSize: 36,
          fontWeight: 900,
          color: getColor(),
          textShadow: '0 2px 4px rgba(0,0,0,0.15)',
        }}
      >
        {value}
      </div>
    </div>
  )
}

export default StatCard
