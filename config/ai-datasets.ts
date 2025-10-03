// AI训练数据集配置
// 这个文件包含了所有AI训练数据集的数值定义，方便手动调整

export interface DatasetConfig {
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

// AI训练数据集配置
export const AI_DATASETS: DatasetConfig[] = [
  {
    id: 'recidivism_risk',
    name: '再犯风险历史判决集',
    description: '基于历史判决记录预测再犯风险的数据集',
    impact: { accuracy: 2, trust: -1, crimeRate: 0 },
    category: 'demographic',
    ethicalConcern: '可能对特定群体产生系统性偏见，影响司法公正'
  },
  {
    id: 'facial_surveillance',
    name: '城市监控人脸影像集',
    description: '城市监控系统中的人脸识别影像数据',
    impact: { accuracy: 3, trust: -2, crimeRate: -1 },
    category: 'demographic',
    ethicalConcern: '严重侵犯隐私权，可能加剧种族歧视和监控社会'
  },
  {
    id: 'stop_frisk_records',
    name: '警局拦检与逮捕记录集',
    description: '警察拦检和逮捕记录的历史数据',
    impact: { accuracy: 1.5, trust: -1, crimeRate: 0 },
    category: 'demographic',
    ethicalConcern: '反映执法偏见，可能强化对特定群体的过度执法'
  },
  {
    id: 'employment_records',
    name: '就业简历与录用结果集',
    description: '就业申请和录用结果的历史记录',
    impact: { accuracy: 0.5, trust: -0.5, crimeRate: 0 },
    category: 'socioeconomic',
    ethicalConcern: '可能加剧就业歧视，影响社会公平'
  },
  {
    id: 'credit_scoring',
    name: '贷款与信用评分记录集',
    description: '贷款申请和信用评分的历史数据',
    impact: { accuracy: 0, trust: -2, crimeRate: 1.5 },
    category: 'socioeconomic',
    ethicalConcern: '可能加剧经济不平等，对弱势群体造成系统性排斥'
  }
]

// 不使用AI技术选项
export const NO_AI_OPTION: DatasetConfig = {
  id: 'no_ai',
  name: '不使用AI技术',
  description: '不采用任何AI技术进行犯罪预测，完全依靠传统执法方式',
  impact: { accuracy: 0, trust: 2, crimeRate: 1.5 },
  category: 'community',
  ethicalConcern: '避免AI偏见，但可能降低执法效率'
}

// 基础AI指标值（初始值）
export const BASE_AI_METRICS = {
  accuracy: 2,
  trust: 3,
  crimeRate: 3.5
} as const
