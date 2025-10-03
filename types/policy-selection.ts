// 政策选择相关类型定义

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

export interface PolicySelectionState {
  selectedPolicy: string | null
  availablePolicies: PolicyOption[]
}

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
    impact: { trust: -5, crimeReduction: 15, accuracy: 15, fairness: 10 },
    riskLevel: 'low'
  },
  {
    id: 'ai_facial_recognition',
    name: 'AI人脸识别',
    description: '人工智能人脸识别技术，高效但存在偏见风险',
    impact: { trust: -15, crimeReduction: 25, accuracy: 25, fairness: -20 },
    riskLevel: 'high'
  },
  {
    id: 'drone_surveillance',
    name: '无人机巡逻',
    description: '无人机空中监控，平衡效率和隐私',
    impact: { trust: -8, crimeReduction: 20, accuracy: 20, fairness: 5 },
    riskLevel: 'medium'
  }
]
