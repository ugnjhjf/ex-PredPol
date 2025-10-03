// AI训练相关类型定义

// 新的数值标度尺定义
export type ScaleValue = 1 | 2 | 2.5 | 3 | 3.5 | 4 | 5
export type ScaleLabel = '极低' | '低' | '低-中' | '中' | '中-高' | '高' | '极高'

export const SCALE_MAPPING: Record<ScaleValue, ScaleLabel> = {
  1: '极低',
  2: '低', 
  2.5: '低-中',
  3: '中',
  3.5: '中-高',
  4: '高',
  5: '极高'
}

export interface AITrainingParameter {
  id: string
  name: string
  description: string
  impact: {
    accuracy: ScaleValue
    trust: ScaleValue
    crimeRate: ScaleValue
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

// AI训练数据集配置
export const AI_TRAINING_PARAMETERS: AITrainingParameter[] = [
  {
    id: 'recidivism_risk',
    name: '再犯风险历史判决集',
    description: '基于历史判决记录预测再犯风险的数据集',
    impact: { accuracy: 4, trust: 2, crimeRate: 3 },
    category: 'demographic',
    ethicalConcern: '可能对特定群体产生系统性偏见，影响司法公正'
  },
  {
    id: 'facial_surveillance',
    name: '城市监控人脸影像集',
    description: '城市监控系统中的人脸识别影像数据',
    impact: { accuracy: 5, trust: 1, crimeRate: 2 },
    category: 'demographic',
    ethicalConcern: '严重侵犯隐私权，可能加剧种族歧视和监控社会'
  },
  {
    id: 'stop_frisk_records',
    name: '警局拦检与逮捕记录集',
    description: '警察拦检和逮捕记录的历史数据',
    impact: { accuracy: 3.5, trust: 2, crimeRate: 3 },
    category: 'demographic',
    ethicalConcern: '反映执法偏见，可能强化对特定群体的过度执法'
  },
  {
    id: 'employment_records',
    name: '就业简历与录用结果集',
    description: '就业申请和录用结果的历史记录',
    impact: { accuracy: 2.5, trust: 3, crimeRate: 3 },
    category: 'socioeconomic',
    ethicalConcern: '可能加剧就业歧视，影响社会公平'
  },
  {
    id: 'credit_scoring',
    name: '贷款与信用评分记录集',
    description: '贷款申请和信用评分的历史数据',
    impact: { accuracy: 2, trust: 1, crimeRate: 4 },
    category: 'socioeconomic',
    ethicalConcern: '可能加剧经济不平等，对弱势群体造成系统性排斥'
  }
]
