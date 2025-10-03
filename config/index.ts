// 配置文件统一导出
// 这个文件统一导出所有配置，方便其他模块使用

// 数据集配置
export * from './ai-datasets'

// 政策配置
export * from './policies'

// 游戏平衡配置（排除重复的BASE_AI_METRICS）
export { 
  SCALE_CONFIG, 
  GAME_RULES, 
  ENDING_CONDITIONS, 
  SCORE_CONFIG, 
  determineEnding 
} from './game-balance'

// 重新导出常用配置的别名
export { AI_DATASETS as AI_TRAINING_PARAMETERS } from './ai-datasets'
export { ALL_POLICIES as POLICY_OPTIONS } from './policies'
export { HARD_POLICIES, SOFT_POLICIES, NO_POLICY_OPTION } from './policies'
export { NO_AI_OPTION } from './ai-datasets'
