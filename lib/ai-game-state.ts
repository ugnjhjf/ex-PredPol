import { 
  GameState, 
  GamePhase, 
  AITrainingState, 
  PolicySelectionState, 
  GameReport, 
  GameEnding,
  AIEndingType,
  AI_TRAINING_PARAMETERS,
  POLICY_OPTIONS,
  GAME_ENDINGS,
  determineEnding,
  ScaleValue
} from '@/types'

// 初始游戏状态
export const createInitialGameState = (): GameState => ({
  phase: 'ai_training',
  currentRound: 1,
  maxRounds: 3,
  aiTraining: {
    selectedOptions: [],
    accuracy: 2,
    trust: 3,
    crimeRate: 3.5,
    canRetrain: false,
    trainingHistory: []
  },
  policySelection: {
    selectedPolicies: [],
    availablePolicies: POLICY_OPTIONS
  },
  report: null,
  ending: null,
  gameCompleted: false
})

// 计算AI三个核心指标（基于选择的数据集）
export const calculateAIMetrics = (selectedParameters: string[]) => {
  // 如果选择不使用AI技术，返回固定值（基于初始值的变化）
  if (selectedParameters.includes('no_ai')) {
    // 初始值：准确度2，信任度3，犯罪率3.5
    // 变化：准确度+0，信任度+2，犯罪率+1.5
    return { accuracy: 2 as ScaleValue, trust: 5 as ScaleValue, crimeRate: 5 as ScaleValue }
  }
  
  // 如果没有选择任何参数，返回初始值
  if (selectedParameters.length === 0) {
    return { accuracy: 2 as ScaleValue, trust: 3 as ScaleValue, crimeRate: 3.5 as ScaleValue }
  }

  const parameters = AI_TRAINING_PARAMETERS.filter(param => selectedParameters.includes(param.id))
  const totalAccuracy = parameters.reduce((sum, param) => sum + param.impact.accuracy, 0)
  const totalTrust = parameters.reduce((sum, param) => sum + param.impact.trust, 0)
  const totalCrimeRate = parameters.reduce((sum, param) => sum + param.impact.crimeRate, 0)

  // 基础值 + 总变化
  const baseAccuracy = 2
  const baseTrust = 3
  const baseCrimeRate = 3.5

  const finalAccuracy = baseAccuracy + totalAccuracy
  const finalTrust = baseTrust + totalTrust
  const finalCrimeRate = baseCrimeRate + totalCrimeRate

  // 限制下线为0，上线不封顶
  const clampValue = (value: number): number => {
    return Math.max(0, value)
  }

  return {
    accuracy: clampValue(finalAccuracy) as ScaleValue,
    trust: clampValue(finalTrust) as ScaleValue,
    crimeRate: clampValue(finalCrimeRate) as ScaleValue
  }
}

// 检查AI指标是否合适（基于准确度和信任度）
export const isAIMetricsSuitable = (accuracy: number, trust: number): boolean => {
  return accuracy >= 3 && trust >= 3
}

// 生成游戏报告
export const generateGameReport = (
  selectedParameters: string[],
  selectedPolicyIds: string[],
  accuracy: ScaleValue,
  trust: ScaleValue,
  crimeRate: ScaleValue
): GameReport => {
  // 计算所有选择政策的总影响
  const selectedPolicies = POLICY_OPTIONS.filter(p => selectedPolicyIds.includes(p.id))
  
  let totalAccuracyImpact = 0
  let totalTrustImpact = 0
  let totalCrimeRateImpact = 0
  
  selectedPolicies.forEach(policy => {
    totalAccuracyImpact += policy.impact.accuracy
    totalTrustImpact += policy.impact.trust
    totalCrimeRateImpact += policy.impact.crimeRate
  })

  // 计算政策影响后的最终指标
  const finalAccuracy = Math.max(1, Math.min(5, accuracy + totalAccuracyImpact)) as ScaleValue
  const finalTrust = Math.max(1, Math.min(5, trust + totalTrustImpact)) as ScaleValue
  const finalCrimeRate = Math.max(1, Math.min(5, crimeRate + totalCrimeRateImpact)) as ScaleValue

  // 计算总分（基于三个指标的加权平均，使用0-5分标度尺）
  const overallScore = (finalAccuracy + finalTrust + (6 - finalCrimeRate)) / 3

  // 调试信息
  console.log('AI训练指标:', { accuracy, trust, crimeRate })
  console.log('选择政策:', selectedPolicyIds)
  console.log('政策影响:', { totalAccuracyImpact, totalTrustImpact, totalCrimeRateImpact })
  console.log('最终指标:', { finalAccuracy, finalTrust, finalCrimeRate })
  console.log('总分:', overallScore)

  return {
    accuracy: finalAccuracy,
    trust: finalTrust,
    crimeRate: finalCrimeRate,
    overallScore
  }
}

// 完成游戏并确定结局
export const completeGame = (report: GameReport): GameEnding => {
  const { accuracy, trust, crimeRate } = report

  // 调试信息
  console.log('游戏报告指标:', { accuracy, trust, crimeRate })

  // 检查是否选择了不使用AI技术
  const isNoAI = accuracy === 2 && trust === 5 && crimeRate === 4

  // 使用新的结局判断逻辑
  const endingType = determineEnding(accuracy, trust, crimeRate, isNoAI)
  
  console.log(`匹配到结局: ${endingType}`)
  return GAME_ENDINGS[endingType]
}

// 游戏状态更新函数
export const updateGameState = (
  currentState: GameState,
  updates: Partial<GameState>
): GameState => {
  return { ...currentState, ...updates }
}

// 进入下一阶段
export const advanceToNextPhase = (currentState: GameState): GameState => {
  const phases: GamePhase[] = ['ai_training', 'policy_selection', 'report', 'ending']
  const currentIndex = phases.indexOf(currentState.phase)
  
  if (currentIndex < phases.length - 1) {
    return {
      ...currentState,
      phase: phases[currentIndex + 1]
    }
  }
  
  return currentState
}

// 重新训练AI
export const retrainAI = (currentState: GameState): GameState => {
  return {
    ...currentState,
    phase: 'ai_training',
    aiTraining: {
      ...currentState.aiTraining,
      selectedOptions: [],
      accuracy: 2,
      trust: 3,
      crimeRate: 3.5,
      canRetrain: false,
      trainingHistory: [
        ...currentState.aiTraining.trainingHistory,
        {
          round: currentState.currentRound,
          selectedOptions: currentState.aiTraining.selectedOptions,
          accuracy: currentState.aiTraining.accuracy,
          trust: currentState.aiTraining.trust,
          crimeRate: currentState.aiTraining.crimeRate
        }
      ]
    }
  }
}

