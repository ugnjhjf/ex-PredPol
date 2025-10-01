// 新的AI素养教育游戏类型定义

export type GamePhase = 'ai_training' | 'policy_selection' | 'report' | 'ending'

export type AIEndingType = 'failure' | 'bias' | 'compromise' | 'ideal' | 'hidden'

export interface AITrainingParameter {
  id: string
  name: string
  description: string
  impact: {
    accuracy: number
    fairness: number
    transparency: number
  }
  category: 'demographic' | 'socioeconomic' | 'community'
  ethicalConcern: string
}

export interface AITrainingOption {
  id: string
  name: string
  description: string
  impact: {
    accuracy: number
    fairness: number
    transparency: number
  }
  category: 'data' | 'algorithm' | 'validation' | 'bias' | 'community'
}

export interface PolicyOption {
  id: string
  name: string
  description: string
  impact: {
    trust: number
    crimeReduction: number
    accuracy: number
    fairness: number
  }
  riskLevel: 'low' | 'medium' | 'high'
}

export interface GameReport {
  trustLevel: number
  crimeRate: number
  accuracy: number
  fairness: number
  transparency: number
  overallScore: number
}

export interface GameEnding {
  type: AIEndingType
  title: string
  message: string
  score: number
  isHidden?: boolean
}

export interface AITrainingState {
  selectedOptions: string[]
  aiReliability: number
  canRetrain: boolean
  trainingHistory: Array<{
    round: number
    selectedOptions: string[]
    reliability: number
  }>
}

export interface PolicySelectionState {
  selectedPolicy: string | null
  availablePolicies: PolicyOption[]
}

export interface GameState {
  phase: GamePhase
  currentRound: number
  maxRounds: number
  aiTraining: AITrainingState
  policySelection: PolicySelectionState
  report: GameReport | null
  ending: GameEnding | null
  gameCompleted: boolean
}

// AI训练参数配置
export const AI_TRAINING_PARAMETERS: AITrainingParameter[] = [
  {
    id: 'education',
    name: '学历',
    description: '将学历作为AI训练的特征参数',
    impact: { accuracy: 40, fairness: -40, transparency: 12 },
    category: 'demographic',
    ethicalConcern: '可能加剧教育不平等，对低学历群体产生偏见'
  },
  {
    id: 'gender',
    name: '性别',
    description: '将性别作为AI训练的特征参数',
    impact: { accuracy: 25, fairness: -55, transparency: 8 },
    category: 'demographic',
    ethicalConcern: '可能强化性别刻板印象，导致性别歧视'
  },
  {
    id: 'income',
    name: '收入水平',
    description: '将收入水平作为AI训练的特征参数',
    impact: { accuracy: 25, fairness: -70, transparency: 6 },
    category: 'socioeconomic',
    ethicalConcern: '可能加剧经济不平等，对低收入群体产生系统性偏见'
  },
  {
    id: 'community_care',
    name: '社区关爱',
    description: '将社区关爱程度作为AI训练的特征参数',
    impact: { accuracy: 10, fairness: 35, transparency: 20 },
    category: 'community',
    ethicalConcern: '相对较少的伦理风险，但需要确保数据收集的公平性'
  },
  {
    id: 'skin_color',
    name: '肤色',
    description: '将肤色作为AI训练的特征参数',
    impact: { accuracy: 12, fairness: -50, transparency: 10 },
    category: 'demographic',
    ethicalConcern: '高风险参数，可能导致严重的种族偏见和歧视'
  }
]

// AI训练选项配置（保留原有选项作为技术层面选择）
export const AI_TRAINING_OPTIONS: AITrainingOption[] = [
  {
    id: 'diverse_data',
    name: '多样化数据收集',
    description: '从不同社区和人群收集训练数据，提高模型公平性',
    impact: { accuracy: 5, fairness: 15, transparency: 5 },
    category: 'data'
  },
  {
    id: 'algorithm_transparency',
    name: '算法透明度',
    description: '使用可解释的AI算法，让决策过程更透明',
    impact: { accuracy: 0, fairness: 10, transparency: 20 },
    category: 'algorithm'
  },
  {
    id: 'bias_detection',
    name: '偏见检测机制',
    description: '建立系统检测和纠正算法偏见',
    impact: { accuracy: 5, fairness: 20, transparency: 10 },
    category: 'bias'
  },
  {
    id: 'community_validation',
    name: '社区验证',
    description: '让社区参与模型验证和反馈',
    impact: { accuracy: 10, fairness: 15, transparency: 15 },
    category: 'community'
  },
  {
    id: 'cross_validation',
    name: '交叉验证',
    description: '使用严格的验证方法确保模型准确性',
    impact: { accuracy: 20, fairness: 5, transparency: 5 },
    category: 'validation'
  }
]

// 政策选项配置
export const POLICY_OPTIONS: PolicyOption[] = [
  {
    id: 'none',
    name: '不使用任何政策',
    description: '不实施任何新的执法政策，维持现状',
    impact: { trust: 0, crimeReduction: 0, accuracy: 0, fairness: 0 },
    riskLevel: 'low'
  },
  {
    id: 'cctv',
    name: 'CCTV监控系统',
    description: '传统闭路电视监控，相对安全但效果有限',
    impact: { trust: -5, crimeReduction: 15, accuracy: 10, fairness: 5 },
    riskLevel: 'low'
  },
  {
    id: 'ai_facial_recognition',
    name: 'AI人脸识别',
    description: '人工智能人脸识别技术，高效但存在偏见风险',
    impact: { trust: -15, crimeReduction: 25, accuracy: 20, fairness: -10 },
    riskLevel: 'high'
  },
  {
    id: 'drone_surveillance',
    name: '无人机巡逻',
    description: '无人机空中监控，平衡效率和隐私',
    impact: { trust: -8, crimeReduction: 20, accuracy: 15, fairness: 0 },
    riskLevel: 'medium'
  }
]

// 结局分数范围配置
export const ENDING_SCORE_RANGES = {
  hidden: {
    accuracy: { min: 0, max: 40 },
    fairness: { min: 80, max: 100 },
    transparency: { min: 80, max: 100 }
  },
  failure: {
    accuracy: { min: 0, max: 60 },
    fairness: { min: 0, max: 40 },
    transparency: { min: 0, max: 50 }
  },
  bias: {
    accuracy: { min: 70, max: 100 },
    fairness: { min: 0, max: 50 },
    transparency: { min: 0, max: 70 }
  },
  compromise: {
    accuracy: { min: 50, max: 90 },
    fairness: { min: 40, max: 70 },
    transparency: { min: 40, max: 75 }
  },
  ideal: {
    accuracy: { min: 80, max: 100 },
    fairness: { min: 40, max: 100 },
    transparency: { min: 60, max: 100 }
  }
}

// 结局配置
export const GAME_ENDINGS: Record<AIEndingType, GameEnding> = {
  failure: {
    type: 'failure',
    title: '❌ 失敗結局：AI 濫用／社會崩潰',
    message: '你的 AI 系統效率極高，但社會分裂加劇，最終失去了民眾信任。',
    score: 0
  },
  bias: {
    type: 'bias',
    title: '⚠️ 偏差結局：效率導向',
    message: '系統表現優異，但部分群體長期被邊緣化。你是否忽視了 AI 的偏差？',
    score: 30
  },
  compromise: {
    type: 'compromise',
    title: '⚖️ 妥協結局：中庸治理',
    message: '你的 AI 沒有達到理想效果，但社會總體保持穩定，未來仍有改進空間。',
    score: 60
  },
  ideal: {
    type: 'ideal',
    title: '✅ 理想結局：公平與效率平衡',
    message: '你不僅管理好 AI，還確保了公平與信任，社會因此受益。',
    score: 90
  },
  hidden: {
    type: 'hidden',
    title: '🌐 隱藏結局：棄用 AI（彩蛋）',
    message: '你選擇不依賴 AI。雖然效率不佳，但社會避免了因 AI 偏差帶來的風險。',
    score: 70,
    isHidden: true
  }
}
