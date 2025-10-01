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
  ENDING_SCORE_RANGES
} from '@/types/game'

// 初始游戏状态
export const createInitialGameState = (): GameState => ({
  phase: 'ai_training',
  currentRound: 1,
  maxRounds: 3,
  aiTraining: {
    selectedOptions: [],
    aiReliability: 0,
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

// 计算AI可信度（基于选择的参数）
export const calculateAIReliability = (selectedParameters: string[]): number => {
  // 如果选择不使用AI技术，返回0
  if (selectedParameters.includes('no_ai')) return 0
  
  // 如果没有选择任何参数，返回基础可信度
  if (selectedParameters.length === 0) return 50
  
  const parameters = AI_TRAINING_PARAMETERS.filter(param => selectedParameters.includes(param.id))
  const totalAccuracy = parameters.reduce((sum, param) => sum + param.impact.accuracy, 0)
  const totalFairness = parameters.reduce((sum, param) => sum + param.impact.fairness, 0)
  const totalTransparency = parameters.reduce((sum, param) => sum + param.impact.transparency, 0)
  
  // 基础可信度 + 参数影响
  const baseReliability = 50
  const reliability = baseReliability + (totalAccuracy + totalFairness + totalTransparency) / 3
  
  return Math.min(100, Math.max(0, reliability))
}

// 检查AI可信度是否合适
export const isAIReliabilitySuitable = (reliability: number): boolean => {
  return reliability >= 70 && reliability <= 85
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
      aiReliability: 0,
      canRetrain: false,
      trainingHistory: [
        ...currentState.aiTraining.trainingHistory,
        {
          round: currentState.currentRound,
          selectedOptions: currentState.aiTraining.selectedOptions,
          reliability: currentState.aiTraining.aiReliability
        }
      ]
    }
  }
}

