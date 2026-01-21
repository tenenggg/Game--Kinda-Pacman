// Game configuration constants
export const MAP_WIDTH = 30
export const MAP_HEIGHT = 37

// Initialize Math Wall cells
export const MATH_WALL_CELLS = new Set()

// Horizontal barrier at row 18
for (let x = 0; x < MAP_WIDTH; x++) {
  MATH_WALL_CELLS.add(`${x},18`)
}

// Vertical barrier at column 15
for (let y = 0; y < MAP_HEIGHT; y++) {
  MATH_WALL_CELLS.add(`15,${y}`)
}

// Math Wall gates (16 total)
export const MATH_WALL_GATES = [
  { x: 3, y: 18, id: 'gate-h1', dir: 'horizontal' },
  { x: 7, y: 18, id: 'gate-h2', dir: 'horizontal' },
  { x: 10, y: 18, id: 'gate-h3', dir: 'horizontal' },
  { x: 13, y: 18, id: 'gate-h4', dir: 'horizontal' },
  { x: 17, y: 18, id: 'gate-h5', dir: 'horizontal' },
  { x: 20, y: 18, id: 'gate-h6', dir: 'horizontal' },
  { x: 22, y: 18, id: 'gate-h7', dir: 'horizontal' },
  { x: 26, y: 18, id: 'gate-h8', dir: 'horizontal' },
  { x: 15, y: 3, id: 'gate-v1', dir: 'vertical' },
  { x: 15, y: 6, id: 'gate-v2', dir: 'vertical' },
  { x: 15, y: 9, id: 'gate-v3', dir: 'vertical' },
  { x: 15, y: 12, id: 'gate-v4', dir: 'vertical' },
  { x: 15, y: 18, id: 'gate-v5', dir: 'vertical' },
  { x: 15, y: 20, id: 'gate-v6', dir: 'vertical' },
  { x: 15, y: 23, id: 'gate-v7', dir: 'vertical' },
  { x: 15, y: 26, id: 'gate-v8', dir: 'vertical' },
]

// Quiz questions for Math Wall gates
export const MATH_WALL_QUIZZES = {
  'gate-h1': {
    objective: 'Choose the best use of company funds.',
    question: 'A company has RM1,000. What is the best way to use it?',
    options: ['Buy safety equipment', 'Buy toys', 'Buy snacks only', 'Keep it unused'],
    correctIndex: 0,
  },
  'gate-h2': {
    objective: 'Identify accident-related costs.',
    question: 'If a worker gets injured, what money does the company need to pay?',
    options: ['Movie tickets', 'Medical bills', 'Holiday gifts', 'Phone bills'],
    correctIndex: 1,
  },
  'gate-h3': {
    objective: 'Recognize long-term cost savings.',
    question: 'Which choice helps save money in the long term?',
    options: ['Ignoring safety rules', 'Fixing safety problems early', 'Waiting for accidents', 'Paying fines'],
    correctIndex: 1,
  },
  'gate-h4': {
    objective: 'Understand accident costs.',
    question: 'An accident happens at work. Which cost is MOST likely?',
    options: ['Extra profit', 'Lower expenses', 'Free bonus', 'Repair and medical costs'],
    correctIndex: 3,
  },
  'gate-h5': {
    objective: 'Evaluate safety equipment value.',
    question: 'Why is buying safety equipment a good financial decision?',
    options: ['It increases accidents', 'It saves money by preventing injuries', 'It slows down work', 'It wastes company money'],
    correctIndex: 1,
  },
  'gate-h6': {
    objective: 'Recognize fine consequences.',
    question: 'What happens if a company must pay a fine for unsafe work?',
    options: ['Money is lost', 'More money saved', 'Workers earn more', 'Prices go down'],
    correctIndex: 0,
  },
  'gate-h7': {
    objective: 'Compare cost options.',
    question: 'Which option costs LESS overall?',
    options: ['Paying hospital bills', 'Paying compensation', 'Spending money on safety early', 'Repairing damaged machines'],
    correctIndex: 2,
  },
  'gate-h8': {
    objective: 'Understand safe workplace economics.',
    question: 'A safe workplace usually means ______.',
    options: ['Higher spending', 'More accidents', 'Less productivity', 'Lower long-term costs'],
    correctIndex: 3,
  },
  'gate-v1': {
    objective: 'Understand OSH investment purpose.',
    question: 'Why do companies spend money on Occupational Safety and Health (OSH)?',
    options: ['To waste company money', 'To keep workers safe and avoid accidents', 'To make work slower', 'To punish workers'],
    correctIndex: 1,
  },
  'gate-v2': {
    objective: 'Identify financial accident impacts.',
    question: 'What can happen financially if a workplace accident occurs?',
    options: ['The company earns more profit', 'No effect at all', 'Medical bills and compensation costs increase', 'Workers get free holidays'],
    correctIndex: 2,
  },
  'gate-v3': {
    objective: 'Understand safety equipment benefits.',
    question: 'Buying safety equipment helps a company to ______.',
    options: ['Reduce accident costs', 'Lose money', 'Increase danger', 'Close the company'],
    correctIndex: 0,
  },
  'gate-v4': {
    objective: 'Identify OSH costs.',
    question: 'Which cost is an example of an OSH-related cost?',
    options: ['Office decoration', 'Safety helmet and gloves', 'Staff birthday cake', 'Free Wi-Fi'],
    correctIndex: 1,
  },
  'gate-v5': {
    objective: 'Evaluate safety training value.',
    question: 'Why is training workers on safety good for company finances?',
    options: ['It makes workers sleepy', 'It increases accidents', 'It reduces mistakes and injury costs', 'It wastes working time'],
    correctIndex: 2,
  },
  'gate-v6': {
    objective: 'Understand OSH rule consequences.',
    question: 'What happens if a company ignores OSH rules?',
    options: ['The company saves money', 'The company may pay fines or compensation', 'Workers become richer', 'Nothing happens'],
    correctIndex: 1,
  },
  'gate-v7': {
    objective: 'Identify equity without fixed interest.',
    question: 'Which investment gives the holder ownership in a company but does NOT guarantee fixed yearly interest?',
    options: ['Bond', 'Preferred stock', 'Promissory note', 'Common stock'],
    correctIndex: 3,
  },
  'gate-v8': {
    objective: 'Match investment to investor goals.',
    question: 'An investor wants regular income with priority over common shareholders but does NOT want ownership rights in company decisions. Which investment BEST matches this goal?',
    options: ['Bond', 'Preferred stock', 'Common stock', 'Promissory note'],
    correctIndex: 1,
  },
  default: {
    objective: 'Review the core facts about all three securities.',
    question: 'Which statement requires the MOST accurate understanding of all three securities?',
    options: ['Bonds and preferred stocks both represent ownership', 'Preferred stocks guarantee company ownership', 'Bonds promise fixed interest until maturity', 'Common stocks pay fixed interest yearly'],
    correctIndex: 2,
  },
}

// Factory map layout
export const factoryMap = [
  ['W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W'],
  ['W', 'F', 'F', 'W', 'F', 'F', 'W', 'F', 'F', 'F', 'F', 'W', 'F', 'F', 'F', 'W', 'F', 'F', 'W', 'F', 'F', 'F', 'F', 'W', 'F', 'F', 'F', 'F', 'F', 'W'],
  ['W', 'F', 'W', 'W', 'F', 'W', 'W', 'F', 'W', 'W', 'F', 'W', 'F', 'W', 'F', 'W', 'F', 'W', 'W', 'F', 'W', 'W', 'F', 'W', 'F', 'W', 'W', 'F', 'F', 'W'],
  ['W', 'F', 'W', 'F', 'F', 'F', 'F', 'F', 'W', 'G1', 'F', 'W', 'F', 'W', 'F', 'W', 'F', 'F', 'F', 'F', 'W', 'F', 'F', 'W', 'F', 'W', 'F', 'W', 'F', 'W'],
  ['W', 'F', 'W', 'W', 'W', 'F', 'W', 'F', 'W', 'W', 'F', 'W', 'F', 'W', 'F', 'W', 'W', 'W', 'F', 'W', 'W', 'F', 'W', 'W', 'F', 'W', 'F', 'W', 'F', 'W'],
  ['W', 'F', 'F', 'F', 'F', 'F', 'W', 'F', 'F', 'F', 'F', 'W', 'F', 'W', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'W', 'F', 'F', 'F', 'W'],
  ['W', 'W', 'W', 'F', 'W', 'W', 'W', 'F', 'W', 'W', 'F', 'W', 'F', 'W', 'W', 'F', 'W', 'W', 'W', 'F', 'W', 'W', 'W', 'F', 'W', 'W', 'F', 'W', 'F', 'W'],
  ['W', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'W', 'R1', 'F', 'W', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'W', 'F', 'F', 'F', 'F', 'F', 'F', 'W', 'F', 'W'],
  ['W', 'F', 'W', 'W', 'W', 'W', 'F', 'W', 'W', 'W', 'F', 'W', 'F', 'W', 'W', 'W', 'F', 'W', 'W', 'F', 'W', 'F', 'W', 'W', 'F', 'W', 'F', 'W', 'F', 'W'],
  ['W', 'F', 'W', 'G2', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'W', 'F', 'F', 'F', 'F', 'F', 'W', 'Y1', 'F', 'W', 'F', 'W', 'F', 'F', 'F', 'F', 'W', 'F', 'W'],
  ['W', 'F', 'W', 'W', 'W', 'W', 'W', 'F', 'W', 'W', 'F', 'W', 'F', 'W', 'W', 'W', 'F', 'W', 'W', 'W', 'W', 'F', 'W', 'W', 'W', 'F', 'W', 'W', 'F', 'W'],
  ['W', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'W', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'W'],
  ['W', 'W', 'F', 'W', 'W', 'F', 'W', 'W', 'F', 'W', 'W', 'W', 'F', 'W', 'W', 'F', 'W', 'W', 'F', 'W', 'W', 'W', 'F', 'W', 'W', 'F', 'W', 'W', 'F', 'W'],
  ['W', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'W', 'Y2', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'W', 'F', 'F', 'W'],
  ['W', 'F', 'W', 'W', 'W', 'F', 'W', 'W', 'W', 'F', 'W', 'W', 'W', 'F', 'W', 'W', 'W', 'W', 'W', 'F', 'W', 'W', 'W', 'F', 'W', 'W', 'W', 'F', 'W', 'W'],
  ['W', 'F', 'W', 'R2', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'W'],
  ['W', 'F', 'W', 'W', 'W', 'W', 'F', 'W', 'W', 'F', 'W', 'W', 'W', 'F', 'W', 'W', 'F', 'W', 'W', 'W', 'F', 'W', 'W', 'W', 'F', 'W', 'W', 'F', 'W', 'W'],
  ['W', 'F', 'F', 'W', 'F', 'F', 'F', 'W', 'F', 'F', 'F', 'F', 'W', 'F', 'F', 'F', 'F', 'W', 'F', 'F', 'F', 'F', 'F', 'W', 'F', 'F', 'F', 'F', 'F', 'W'],
  ['W', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'W'],
  ['W', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'W', 'Y3', 'F', 'F', 'F', 'F', 'F', 'F', 'W', 'G4', 'F', 'F', 'F', 'W', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'W'],
  ['W', 'F', 'W', 'W', 'W', 'F', 'W', 'W', 'W', 'W', 'W', 'F', 'W', 'W', 'W', 'F', 'W', 'W', 'W', 'F', 'W', 'W', 'F', 'W', 'W', 'W', 'F', 'W', 'F', 'W'],
  ['W', 'F', 'W', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'W', 'F', 'F', 'F', 'W', 'F', 'W'],
  ['W', 'F', 'W', 'W', 'W', 'W', 'F', 'W', 'W', 'W', 'F', 'W', 'W', 'F', 'W', 'W', 'W', 'W', 'F', 'W', 'W', 'W', 'F', 'W', 'F', 'W', 'F', 'W', 'F', 'W'],
  ['W', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'W', 'F', 'W', 'F', 'W', 'Y5', 'W'],
  ['W', 'W', 'W', 'F', 'W', 'W', 'W', 'F', 'W', 'W', 'W', 'W', 'F', 'W', 'W', 'W', 'F', 'W', 'W', 'W', 'F', 'W', 'W', 'W', 'F', 'W', 'F', 'W', 'F', 'W'],
  ['W', 'R3', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'R5', 'W', 'F', 'W'],
  ['W', 'W', 'W', 'F', 'W', 'W', 'W', 'F', 'W', 'W', 'F', 'W', 'W', 'W', 'F', 'W', 'W', 'F', 'W', 'W', 'W', 'F', 'W', 'W', 'W', 'F', 'W', 'W', 'F', 'W'],
  ['W', 'G5', 'F', 'F', 'F', 'F', 'F', 'F', 'W', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'W', 'F', 'F', 'F', 'F', 'F', 'F', 'W', 'F', 'F', 'W'],
  ['W', 'W', 'W', 'W', 'F', 'W', 'W', 'W', 'W', 'W', 'W', 'F', 'W', 'W', 'W', 'F', 'W', 'W', 'W', 'W', 'W', 'W', 'F', 'W', 'W', 'W', 'W', 'W', 'F', 'W'],
  ['W', 'F', 'W', 'F', 'W', 'F', 'F', 'F', 'F', 'W', 'F', 'F', 'W', 'F', 'W', 'F', 'F', 'F', 'W', 'F', 'F', 'W', 'F', 'F', 'F', 'W', 'F', 'F', 'F', 'W'],
  ['W', 'F', 'W', 'F', 'F', 'F', 'F', 'W', 'F', 'F', 'F', 'F', 'F', 'W', 'F', 'F', 'F', 'W', 'F', 'F', 'F', 'F', 'F', 'W', 'F', 'F', 'F', 'W', 'F', 'W'],
  ['W', 'F', 'W', 'W', 'W', 'F', 'W', 'W', 'W', 'F', 'W', 'W', 'F', 'F', 'F', 'W', 'W', 'W', 'F', 'W', 'W', 'W', 'F', 'W', 'W', 'F', 'W', 'W', 'F', 'W'],
  ['W', 'F', 'W', 'F', 'G3', 'F', 'W', 'F', 'F', 'Y4', 'F', 'W', 'F', 'F', 'F', 'F', 'W', 'F', 'F', 'F', 'F', 'W', 'F', 'F', 'F', 'F', 'W', 'F', 'F', 'W'],
  ['W', 'F', 'W', 'F', 'W', 'W', 'W', 'F', 'W', 'W', 'F', 'W', 'F', 'W', 'W', 'F', 'W', 'W', 'F', 'W', 'W', 'W', 'R4', 'W', 'F', 'W', 'F', 'W', 'F', 'W'],
  ['W', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'W', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'W', 'G6', 'F', 'F', 'F', 'F', 'W'],
  ['W', 'W', 'W', 'F', 'W', 'W', 'W', 'F', 'W', 'W', 'F', 'W', 'W', 'W', 'F', 'W', 'W', 'F', 'W', 'W', 'F', 'W', 'W', 'W', 'F', 'W', 'W', 'F', 'W', 'W'],
  ['W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W'],
]

// Easter eggs
export const EASTER_EGGS = [
  { x: 5, y: 25, id: 'egg-stop', type: 'stop-enemy', name: '🛑 Enemy Freeze', description: 'Freeze the enemy for 15 seconds' },
  { x: 28, y: 34, id: 'egg-win', type: 'instant-win', name: '🎊 Instant Win', description: 'Win the game immediately!' },
  { x: 8, y: 32, id: 'egg-freeze', type: 'freeze-player', name: '❄️ Player Freeze', description: 'You cannot move for 10 seconds' },
  { x: 22, y: 5, id: 'egg-rick', type: 'rick-roll', name: '🎬 Mystery Box', description: 'Opens a surprise!' },
]

export const easterEggMap = new Map(EASTER_EGGS.map(egg => [`${egg.x},${egg.y}`, egg]))

// Checkpoint objectives
export const objectives = {
  G1: { id: 'G1', type: 'advantage', name: '🛡️ PPE Station', description: 'Invest in personal protective equipment for workers.', cost: 2000, safetyChange: +6, accidentRiskChange: -1, budgetChange: 0, timeChange: 0 },
  G2: { id: 'G2', type: 'advantage', name: '📚 Training Room', description: 'Run comprehensive safety training for all employees.', cost: 2500, safetyChange: +7, accidentRiskChange: -3, budgetChange: 0, timeChange: 0 },
  G3: { id: 'G3', type: 'advantage', name: '🔍 Inspection Area', description: 'Regular safety inspections to catch hazards early.', cost: 1800, safetyChange: +4, accidentRiskChange: -4, budgetChange: 0, timeChange: 0 },
  G4: { id: 'G4', type: 'advantage', name: '⚙️ Machine Guarding', description: 'Install guards on dangerous machines.', cost: 1500, safetyChange: +5, accidentRiskChange: -2, budgetChange: 0, timeChange: 0 },
  G5: { id: 'G5', type: 'advantage', name: '🚨 Emergency System', description: 'Upgrade emergency alert and evacuation system.', cost: 3000, safetyChange: +9, accidentRiskChange: -5, budgetChange: 0, timeChange: 0 },
  G6: { id: 'G6', type: 'advantage', name: '💰 Safety Grant', description: 'Receive government safety improvement grant.', cost: 0, safetyChange: +3, accidentRiskChange: 0, budgetChange: +1000, timeChange: +3 },
  R1: { id: 'R1', type: 'disadvantage', name: '⏰ Overtime Push', description: 'Force workers to meet tight deadlines with longer hours.', cost: 1000, safetyChange: -8, accidentRiskChange: +18, budgetChange: 0, timeChange: 0 },
  R2: { id: 'R2', type: 'disadvantage', name: '✂️ Budget Cuts', description: 'Reduce maintenance spending to save money.', cost: 500, safetyChange: -10, accidentRiskChange: +20, budgetChange: 0, timeChange: 0 },
  R3: { id: 'R3', type: 'disadvantage', name: '❌ Skip Inspections', description: 'Cancel scheduled safety inspections.', cost: 300, safetyChange: -5, accidentRiskChange: +25, budgetChange: 0, timeChange: 0 },
  R4: { id: 'R4', type: 'disadvantage', name: '👥 Reduce Staffing', description: 'Cut the safety team to reduce overhead.', cost: 800, safetyChange: -12, accidentRiskChange: +22, budgetChange: 0, timeChange: 0 },
  R5: { id: 'R5', type: 'disadvantage', name: '🔇 Ignore Warnings', description: 'Ignore worker safety complaints to avoid delays.', cost: 200, safetyChange: -8, accidentRiskChange: +28, budgetChange: 0, timeChange: 0 },
  Y1: { id: 'Y1', type: 'neutral', name: '🔄 Process Update', description: 'Modernize procedures - risky but potentially beneficial.', cost: 2000, safetyChange: +3, accidentRiskChange: +8, budgetChange: 0, timeChange: 0 },
  Y2: { id: 'Y2', type: 'neutral', name: '⚡ Quick Fix', description: 'Fast temporary solution to safety issues.', cost: 1000, safetyChange: +2, accidentRiskChange: +6, budgetChange: 0, timeChange: +2 },
  Y3: { id: 'Y3', type: 'neutral', name: '🎯 Emergency Drill', description: 'Conduct emergency drills - takes time but improves safety.', cost: 1500, safetyChange: +6, accidentRiskChange: 0, budgetChange: 0, timeChange: -5 },
  Y4: { id: 'Y4', type: 'neutral', name: '📊 Safety Audit', description: 'External audit reveals issues and solutions.', cost: 2500, safetyChange: +4, accidentRiskChange: +4, budgetChange: 0, timeChange: 0 },
  Y5: { id: 'Y5', type: 'neutral', name: '🏥 First Aid Station', description: 'Set up comprehensive first aid facilities.', cost: 1200, safetyChange: +4, accidentRiskChange: -1, budgetChange: 0, timeChange: 0 },
}
