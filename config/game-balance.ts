// 游戏平衡配置
// 这个文件包含了游戏的核心平衡参数，方便手动调整

// 基础AI指标值（初始值）
export const BASE_AI_METRICS = {
  accuracy: 2,
  trust: 3,
  crimeRate: 3.5
} as const

// 标度尺配置
export const SCALE_CONFIG = {
  minValue: 0,        // 最小值（下线封底）
  maxValue: Infinity, // 最大值（上线不封顶）
  labels: {
    0: '极低',
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
} as const

// 游戏规则配置
export const GAME_RULES = {
  // AI训练阶段规则
  aiTraining: {
    minDatasets: 0,     // 最少选择数据集数量
    maxDatasets: 2,     // 最多选择数据集数量
    allowNoAI: true,    // 是否允许不使用AI技术
    retrainThreshold: {
      minAccuracy: 3,   // 重新训练的最低准确度要求
      minTrust: 3       // 重新训练的最低信任度要求
    }
  },
  // 政策选择阶段规则
  policySelection: {
    minPolicies: 0,     // 最少选择政策数量
    maxPolicies: Infinity, // 最多选择政策数量（不限制）
    allowMixed: true,   // 是否允许混合选择硬政策和软政策
    allowOnlyHard: true, // 是否允许只选择硬政策
    allowOnlySoft: true  // 是否允许只选择软政策
  }
} as const

// 结局判定配置
export const ENDING_CONDITIONS = {
  abuse: {
    name: '❌ 滥用/崩溃',
    conditions: {
      accuracy: { min: 4 },
      trust: { max: 2 },
      crimeRate: { min: 3.5 }
    },
    description: '高效但失信，社会分裂爆发'
  },
  bias: {
    name: '⚠️ 偏差/效率导向',
    conditions: {
      accuracy: { min: 4 },
      trust: { min: 2.5, max: 3 },
      crimeRate: { max: 3 }
    },
    description: '准确率高，但信任不足，部分群体被边缘化'
  },
  compromise: {
    name: '⚖️ 妥协/中庸治理',
    conditions: {
      accuracy: { min: 2.5, max: 3.5 },
      trust: { min: 3, max: 3.5 },
      crimeRate: { min: 2.5, max: 3.5 }
    },
    description: '三项指标中等，社会保持稳定'
  },
  ideal: {
    name: '✅ 理想/平衡',
    conditions: {
      accuracy: { min: 4 },
      trust: { min: 4 },
      crimeRate: { max: 2 }
    },
    description: '高效又公平，社会稳定繁荣'
  },
  noAI: {
    name: '🎭 不使用AI技术（彩蛋）',
    conditions: {
      isNoAI: true
    },
    description: '完全依靠传统执法方式，避免AI偏见但效率较低'
  }
} as const

// 分数计算配置
export const SCORE_CONFIG = {
  // 最终分数计算权重
  weights: {
    accuracy: 1,
    trust: 1,
    crimeRate: 1
  },
  // 犯罪率在分数计算中的处理（犯罪率越低越好）
  crimeRateInvert: true,
  // 分数范围
  minScore: 0,
  maxScore: 5
} as const

// 结局判定函数
export const determineEnding = (accuracy: number, trust: number, crimeRate: number, isNoAI: boolean = false): string => {
  // 不使用AI的彩蛋结局
  if (isNoAI) {
    return 'hidden'
  }

  // 根据表格条件判断结局（按优先级排序）
  
  // ✅ 理想/平衡: 准确度≥4, 信任度≥4, 犯罪率≤2
  if (accuracy >= 4 && trust >= 4 && crimeRate <= 2) {
    return 'ideal'
  }

  // ❌ 滥用/崩溃: 准确度≥4, 信任度≤2, 犯罪率≥3.5
  if (accuracy >= 4 && trust <= 2 && crimeRate >= 3.5) {
    return 'failure'
  }

  // ⚠️ 偏差/效率导向: 准确度≥4, 信任度2.5-3, 犯罪率≤3
  if (accuracy >= 4 && trust >= 2.5 && trust <= 3 && crimeRate <= 3) {
    return 'bias'
  }

  // ⚖️ 妥协/中庸治理: 准确度2.5-3.5, 信任度3-3.5, 犯罪率≈3
  if (accuracy >= 2.5 && accuracy <= 3.5 && trust >= 3 && trust <= 3.5 && crimeRate >= 2.5 && crimeRate <= 3.5) {
    return 'compromise'
  }

  // 默认返回妥协结局
  return 'compromise'
}
