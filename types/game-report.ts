// 游戏报告和结局相关类型定义

import { ScaleValue } from './ai-training'

export type AIEndingType = 'failure' | 'bias' | 'compromise' | 'ideal' | 'hidden'

export interface GameReport {
  accuracy: ScaleValue
  trust: ScaleValue
  crimeRate: ScaleValue
  overallScore: number // 0-5分标度尺
}

export interface GameEnding {
  type: AIEndingType
  title: string
  message: string
  score: number
  isHidden?: boolean
}

// 从配置文件导入结局判定逻辑
export { determineEnding } from '../config'

// 结局配置
export const GAME_ENDINGS: Record<AIEndingType, GameEnding> = {
  failure: {
    type: 'failure',
    title: '❌ 滥用/崩溃',
    message: '高效但失信，社会分裂爆发。AI系统虽然准确度很高，但失去了公众信任，犯罪率居高不下，社会陷入混乱。',
    score: 1.5
  },
  bias: {
    type: 'bias',
    title: '⚠️ 偏差/效率导向',
    message: '准确率高，但信任不足，部分群体被边缘化。AI系统表现优异，但存在明显的偏见问题，某些社区受到不公平对待。',
    score: 2.5
  },
  compromise: {
    type: 'compromise',
    title: '⚖️ 妥协/中庸治理',
    message: '三项指标中等，社会保持稳定。AI系统表现平平，虽然没有达到理想效果，但社会总体保持稳定，未来仍有改进空间。',
    score: 3.5
  },
  ideal: {
    type: 'ideal',
    title: '✅ 理想/平衡',
    message: '高效又公平，社会稳定繁荣。AI系统在准确度、信任度和犯罪率控制方面都达到了优秀水平，社会因此受益。',
    score: 4.5
  },
  hidden: {
    type: 'hidden',
    title: '🌐 不使用AI技术（彩蛋）',
    message: '你选择不使用AI技术。虽然效率较低，但社会避免了因AI偏见带来的风险，保持了传统执法的稳定性。',
    score: 3.0,
    isHidden: true
  }
}
