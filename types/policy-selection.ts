// 政策选择相关类型定义

export type PolicyCategory = 'hard' | 'soft'

export interface PolicyOption {
  id: string
  name: string
  description: string
  category: PolicyCategory
  impact: {
    accuracy: number
    trust: number
    crimeRate: number
  }
  riskLevel: 'low' | 'medium' | 'high'
}

export interface PolicySelectionState {
  selectedPolicies: string[]
  availablePolicies: PolicyOption[]
}

// 从配置文件导入政策配置
export { 
  HARD_POLICIES, 
  SOFT_POLICIES, 
  POLICY_OPTIONS, 
  NO_POLICY_OPTION 
} from '../config'
