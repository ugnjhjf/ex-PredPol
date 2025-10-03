// 政策配置
// 这个文件包含了所有政策的数值定义，方便手动调整

export interface PolicyConfig {
  id: string
  name: string
  description: string
  category: 'hard' | 'soft'
  impact: {
    accuracy: number
    trust: number
    crimeRate: number
  }
  riskLevel: 'low' | 'medium' | 'high'
}

// 硬政策配置
export const HARD_POLICIES: PolicyConfig[] = [
  {
    id: 'drone_patrol',
    name: '无人机巡逻',
    description: '使用无人机进行空中监控和巡逻，提高执法效率',
    category: 'hard',
    impact: { accuracy: 1, trust: -1, crimeRate: -2 },
    riskLevel: 'medium'
  },
  {
    id: 'comprehensive_data_access',
    name: '全面数据接入',
    description: '获取全面的个人数据用于AI分析，提高预测准确性',
    category: 'hard',
    impact: { accuracy: 3, trust: -3, crimeRate: -3 },
    riskLevel: 'high'
  },
  {
    id: 'ai_facial_recognition',
    name: 'AI人脸识别',
    description: '使用人工智能人脸识别技术进行身份识别和监控',
    category: 'hard',
    impact: { accuracy: 2, trust: -2, crimeRate: -2 },
    riskLevel: 'high'
  }
]

// 软政策配置
export const SOFT_POLICIES: PolicyConfig[] = [
  {
    id: 'education',
    name: '教育',
    description: '通过教育项目提高社区意识和犯罪预防能力',
    category: 'soft',
    impact: { accuracy: -1, trust: 2, crimeRate: -1 },
    riskLevel: 'low'
  },
  {
    id: 'transparent_algorithms',
    name: '透明算法与独立审查',
    description: '确保AI算法的透明度和独立审查，建立公众信任',
    category: 'soft',
    impact: { accuracy: -1, trust: 3, crimeRate: 0 },
    riskLevel: 'low'
  },
  {
    id: 'community_policing',
    name: '社区警务 / 合作',
    description: '与社区建立合作关系，通过社区参与预防犯罪',
    category: 'soft',
    impact: { accuracy: -1, trust: 2, crimeRate: -1 },
    riskLevel: 'low'
  }
]

// 不使用政策选项
export const NO_POLICY_OPTION: PolicyConfig = {
  id: 'none',
  name: '不使用任何政策',
  description: '不实施任何新的执法政策，维持现状',
  category: 'hard',
  impact: { accuracy: 0, trust: 0, crimeRate: 0 },
  riskLevel: 'low'
}

// 所有政策选项
export const ALL_POLICIES: PolicyConfig[] = [
  NO_POLICY_OPTION,
  ...HARD_POLICIES,
  ...SOFT_POLICIES
]
