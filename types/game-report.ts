// 游戏报告和结局相关类型定义

export type AIEndingType = 'failure' | 'bias' | 'compromise' | 'ideal' | 'hidden'

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

// 结局分数范围配置
export const ENDING_SCORE_RANGES = {
  hidden: {
    accuracy: { min: 0, max: 50 },
    fairness: { min: 75, max: 100 },
    transparency: { min: 75, max: 100 }
  },
  failure: {
    accuracy: { min: 0, max: 70 },
    fairness: { min: 0, max: 35 },
    transparency: { min: 0, max: 55 }
  },
  bias: {
    accuracy: { min: 75, max: 100 },
    fairness: { min: 0, max: 50 },
    transparency: { min: 0, max: 75 }
  },
  compromise: {
    accuracy: { min: 45, max: 90 },
    fairness: { min: 35, max: 70 },
    transparency: { min: 35, max: 80 }
  },
  ideal: {
    accuracy: { min: 70, max: 100 },
    fairness: { min: 50, max: 100 },
    transparency: { min: 50, max: 100 }
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
