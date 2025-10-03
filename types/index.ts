// 统一导出所有类型定义

// 从各个模块重新导出
export * from './ai-training'
export * from './policy-selection'
export * from './game-report'
export * from './game-state'

// 为了向后兼容，保留原有的导出方式
export type { GamePhase, AIEndingType } from './game-state'
export type { AITrainingParameter, AITrainingState } from './ai-training'
export type { PolicyOption, PolicySelectionState } from './policy-selection'
export type { GameReport, GameEnding } from './game-report'
export type { GameSettings, GameState } from './game-state'

// 导出配置常量
export { AI_TRAINING_PARAMETERS } from './ai-training'
export { POLICY_OPTIONS } from './policy-selection'
export { ENDING_SCORE_RANGES, GAME_ENDINGS } from './game-report'
