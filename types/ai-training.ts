// AI训练相关类型定义

// 新的数值标度尺定义 - 允许超过5的值
export type ScaleValue = number // 允许任何数字，但实际使用中限制为 >= 0

export type ScaleLabel = '极低' | '低' | '低-中' | '中' | '中-高' | '高' | '极高' | '超高' | '极高+' | '极高++'

// 获取标度标签的函数
export const getScaleLabel = (value: number): ScaleLabel => {
  if (value <= 1) return '极低'
  if (value <= 2) return '低'
  if (value <= 2.5) return '低-中'
  if (value <= 3) return '中'
  if (value <= 3.5) return '中-高'
  if (value <= 4) return '高'
  if (value <= 5) return '极高'
  if (value <= 6) return '超高'
  if (value <= 7) return '极高+'
  return '极高++'
}

// 保留原有的SCALE_MAPPING用于向后兼容
export const SCALE_MAPPING: Record<number, ScaleLabel> = {
  1: '极低',
  2: '低', 
  2.5: '低-中',
  3: '中',
  3.5: '中-高',
  4: '高',
  5: '极高',
  6: '超高',
  7: '极高+',
  8: '极高++'
}

export interface AITrainingParameter {
  id: string
  name: string
  description: string
  impact: {
    accuracy: number
    trust: number
    crimeRate: number
  }
  category: 'demographic' | 'socioeconomic' | 'community'
  ethicalConcern: string
}

export interface AITrainingState {
  selectedOptions: string[]
  accuracy: ScaleValue
  trust: ScaleValue
  crimeRate: ScaleValue
  canRetrain: boolean
  trainingHistory: Array<{
    round: number
    selectedOptions: string[]
    accuracy: ScaleValue
    trust: ScaleValue
    crimeRate: ScaleValue
  }>
}

// 从配置文件导入数据集配置
export { AI_TRAINING_PARAMETERS, NO_AI_OPTION, BASE_AI_METRICS } from '../config'
