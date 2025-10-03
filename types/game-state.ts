// 游戏状态和通用类型定义

import { AITrainingState } from './ai-training'
import { PolicySelectionState } from './policy-selection'
import { GameReport, GameEnding } from './game-report'

export type GamePhase = 'ai_training' | 'policy_selection' | 'report' | 'ending'

export interface GameSettings {
  showDetailedValues: boolean
  educationMode: boolean
}

export interface GameState {
  phase: GamePhase
  currentRound: number
  maxRounds: number
  aiTraining: AITrainingState
  policySelection: PolicySelectionState
  report: GameReport | null
  ending: GameEnding | null
  gameCompleted: boolean
  settings: GameSettings
}
