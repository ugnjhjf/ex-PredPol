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
  ENDING_SCORE_RANGES,
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
    selectedPolicy: null,
    availablePolicies: POLICY_OPTIONS
  },
  report: null,
  ending: null,
  gameCompleted: false
})

// 计算AI三个核心指标（基于选择的数据集）
export const calculateAIMetrics = (selectedParameters: string[]) => {
  // 如果选择不使用AI技术，返回固定值
  if (selectedParameters.includes('no_ai')) {
    return { accuracy: 2 as ScaleValue, trust: 5 as ScaleValue, crimeRate: 4 as ScaleValue }
  }
  
  // 如果没有选择任何参数，返回初始值
  if (selectedParameters.length === 0) {
    return { accuracy: 2 as ScaleValue, trust: 3 as ScaleValue, crimeRate: 3.5 as ScaleValue }
  }

  const parameters = AI_TRAINING_PARAMETERS.filter(param => selectedParameters.includes(param.id))
  const avgAccuracy = parameters.reduce((sum, param) => sum + param.impact.accuracy, 0) / parameters.length
  const avgTrust = parameters.reduce((sum, param) => sum + param.impact.trust, 0) / parameters.length
  const avgCrimeRate = parameters.reduce((sum, param) => sum + param.impact.crimeRate, 0) / parameters.length

  // 将平均值四舍五入到最接近的标度值
  const roundToScale = (value: number): ScaleValue => {
    const scaleValues: ScaleValue[] = [1, 2, 2.5, 3, 3.5, 4, 5]
    return scaleValues.reduce((prev, curr) => 
      Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
    )
  }

  return {
    accuracy: roundToScale(avgAccuracy),
    trust: roundToScale(avgTrust),
    crimeRate: roundToScale(avgCrimeRate)
  }
}

// 检查AI指标是否合适（基于准确度和信任度）
export const isAIMetricsSuitable = (accuracy: number, trust: number): boolean => {
  return accuracy >= 3 && trust >= 3
}

// 生成游戏报告
export const generateGameReport = (
  selectedParameters: string[],
  selectedPolicyId: string,
  aiReliability: number
): GameReport => {
  const selectedPolicy = POLICY_OPTIONS.find(p => p.id === selectedPolicyId)
  if (!selectedPolicy) {
    throw new Error('No policy selected')
  }

  // 计算AI训练参数对各项指标的影响
  const parameters = AI_TRAINING_PARAMETERS.filter(param => selectedParameters.includes(param.id))
  const aiAccuracyImpact = parameters.reduce((sum, param) => sum + param.impact.accuracy, 0)
  const aiFairnessImpact = parameters.reduce((sum, param) => sum + param.impact.fairness, 0)
  const aiTransparencyImpact = parameters.reduce((sum, param) => sum + param.impact.transparency, 0)

  // 基础指标
  const baseAccuracy = 50
  const baseFairness = 50
  const baseTransparency = 50

  // 计算最终得分：AI准确率影响 x 0.7 + 政策影响 x 0.3
  const accuracy = Math.min(100, Math.max(0, 
    (baseAccuracy + aiAccuracyImpact) * 0.7 + 
    (baseAccuracy + selectedPolicy.impact.accuracy) * 0.3
  ))
  
  const fairness = Math.min(100, Math.max(0, 
    (baseFairness + aiFairnessImpact) * 0.7 + 
    (baseFairness + selectedPolicy.impact.fairness) * 0.3
  ))
  
  const transparency = Math.min(100, Math.max(0, 
    (baseTransparency + aiTransparencyImpact) * 0.7 + 
    (baseTransparency + selectedPolicy.impact.fairness) * 0.3
  ))

  // 调试信息
  console.log('AI参数影响:', { aiAccuracyImpact, aiFairnessImpact, aiTransparencyImpact })
  console.log('政策影响:', selectedPolicy.impact)
  console.log('基础分数:', { baseAccuracy, baseFairness, baseTransparency })
  console.log('最终得分:', { accuracy, fairness, transparency })

  // 其他指标保持原有逻辑
  const baseTrust = 50
  const baseCrimeRate = 100
  const trustLevel = Math.min(100, Math.max(0, baseTrust + selectedPolicy.impact.trust))
  const crimeRate = Math.min(100, Math.max(0, baseCrimeRate - selectedPolicy.impact.crimeReduction))

  // 计算总分
  const overallScore = (trustLevel + (100 - crimeRate) + accuracy + fairness + transparency) / 5

  return {
    trustLevel,
    crimeRate,
    accuracy,
    fairness,
    transparency,
    overallScore
  }
}

// 完成游戏并确定结局
export const completeGame = (report: GameReport): GameEnding => {
  const { accuracy, fairness, transparency } = report

  // 调试信息
  console.log('游戏报告得分:', { accuracy, fairness, transparency })

  // 检查每个结局的分数范围
  const endings = Object.entries(ENDING_SCORE_RANGES)
  
  for (const [endingType, ranges] of endings) {
    const isInRange = 
      accuracy >= ranges.accuracy.min && accuracy <= ranges.accuracy.max &&
      fairness >= ranges.fairness.min && fairness <= ranges.fairness.max &&
      transparency >= ranges.transparency.min && transparency <= ranges.transparency.max
    
    console.log(`检查 ${endingType}:`, {
      ranges,
      isInRange,
      accuracyCheck: `${accuracy} >= ${ranges.accuracy.min} && ${accuracy} <= ${ranges.accuracy.max}`,
      fairnessCheck: `${fairness} >= ${ranges.fairness.min} && ${fairness} <= ${ranges.fairness.max}`,
      transparencyCheck: `${transparency} >= ${ranges.transparency.min} && ${transparency} <= ${ranges.transparency.max}`
    })
    
    if (isInRange) {
      console.log(`匹配到结局: ${endingType}`)
      return GAME_ENDINGS[endingType as AIEndingType]
    }
  }

  // 如果没有匹配的范围，返回妥协结局作为默认
  console.log('没有匹配的范围，返回妥协结局')
  return GAME_ENDINGS.compromise
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

