# 游戏配置文件说明

这个目录包含了游戏的所有数值配置，方便手动调整游戏平衡。

## 文件结构

### 📊 `ai-datasets.ts` - AI训练数据集配置
包含所有AI训练数据集的数值定义：

- **数据集影响值**：每个数据集对准确度、信任度、犯罪率的影响
- **基础AI指标**：初始的准确度、信任度、犯罪率值
- **不使用AI选项**：完全避免AI技术的选项

**调整方法**：
```typescript
// 修改数据集影响值
impact: { accuracy: 2, trust: -1, crimeRate: 0 }

// 修改基础指标
export const BASE_AI_METRICS = {
  accuracy: 2,    // 初始准确度
  trust: 3,       // 初始信任度
  crimeRate: 3.5  // 初始犯罪率
}
```

### 🏛️ `policies.ts` - 政策配置
包含所有硬政策和软政策的数值定义：

- **硬政策**：无人机巡逻、全面数据接入、AI人脸识别
- **软政策**：教育、透明算法、社区警务
- **不使用政策选项**：维持现状的选项

**调整方法**：
```typescript
// 修改政策影响值
impact: { accuracy: 1, trust: -1, crimeRate: -2 }

// 修改风险等级
riskLevel: 'low' | 'medium' | 'high'
```

### ⚖️ `game-balance.ts` - 游戏平衡配置
包含游戏的核心平衡参数：

- **标度尺配置**：数值范围和标签定义
- **游戏规则**：AI训练和政策选择的规则
- **结局判定**：各种结局的触发条件
- **分数计算**：最终分数的计算方式

**调整方法**：
```typescript
// 修改结局判定条件
export const ENDING_CONDITIONS = {
  ideal: {
    conditions: {
      accuracy: { min: 4 },
      trust: { min: 4 },
      crimeRate: { max: 2 }
    }
  }
}

// 修改游戏规则
export const GAME_RULES = {
  aiTraining: {
    maxDatasets: 2,  // 最多选择数据集数量
    retrainThreshold: {
      minAccuracy: 3,  // 重新训练的最低准确度
      minTrust: 3      // 重新训练的最低信任度
    }
  }
}
```

## 如何调整数值

### 1. 调整数据集影响
编辑 `ai-datasets.ts` 文件中的 `impact` 值：
- `accuracy`: 对准确度的影响（正数提升，负数降低）
- `trust`: 对信任度的影响（正数提升，负数降低）
- `crimeRate`: 对犯罪率的影响（正数提升，负数降低）

### 2. 调整政策影响
编辑 `policies.ts` 文件中的 `impact` 值：
- 硬政策通常提升准确度但降低信任度
- 软政策通常提升信任度但可能降低准确度

### 3. 调整游戏平衡
编辑 `game-balance.ts` 文件：
- 修改 `BASE_AI_METRICS` 调整初始值
- 修改 `ENDING_CONDITIONS` 调整结局判定条件
- 修改 `GAME_RULES` 调整游戏规则

### 4. 调整标度尺
编辑 `game-balance.ts` 文件中的 `SCALE_CONFIG`：
- 修改 `minValue` 和 `maxValue` 调整数值范围
- 修改 `labels` 调整标度标签

## 注意事项

1. **数值一致性**：确保所有相关文件中的数值保持一致
2. **游戏平衡**：调整数值时考虑游戏的整体平衡性
3. **测试验证**：修改后记得测试游戏流程确保正常工作
4. **备份配置**：重要修改前建议备份原始配置

## 快速调整指南

### 让游戏更容易达到理想结局
- 降低理想结局的条件要求
- 增加软政策的正面影响
- 减少硬政策的负面影响

### 让游戏更具挑战性
- 提高理想结局的条件要求
- 增加数据集的负面影响
- 调整政策的风险等级

### 调整游戏难度
- 修改重新训练的阈值
- 调整数据集选择数量限制
- 修改政策选择规则
