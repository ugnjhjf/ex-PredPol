"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, AlertCircle, Info, AlertTriangle, Settings } from "lucide-react"
import { AI_TRAINING_PARAMETERS, SCALE_MAPPING, ScaleValue } from "@/types"
import { calculateAIMetrics, isAIMetricsSuitable } from "@/lib/ai-game-state"
import GameSettings from "./game-settings"

interface AITrainingPhaseProps {
  selectedParameters: string[]
  accuracy: ScaleValue
  trust: ScaleValue
  crimeRate: ScaleValue
  canRetrain: boolean
  onSelectionChange: (parameters: string[]) => void
  onConfirm: () => void
  settings?: {
    showDetailedValues: boolean
    educationMode: boolean
  }
  onSettingsChange?: (settings: { showDetailedValues: boolean; educationMode: boolean }) => void
}

export default function AITrainingPhase({
  selectedParameters,
  accuracy: propAccuracy,
  trust: propTrust,
  crimeRate: propCrimeRate,
  canRetrain,
  onSelectionChange,
  onConfirm,
  settings = { showDetailedValues: false, educationMode: false },
  onSettingsChange
}: AITrainingPhaseProps) {
  const [hoveredOption, setHoveredOption] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  // 动态计算当前指标
  const currentMetrics = calculateAIMetrics(selectedParameters)
  const accuracy = currentMetrics.accuracy
  const trust = currentMetrics.trust
  const crimeRate = currentMetrics.crimeRate
  const shouldRetrain = !isAIMetricsSuitable(accuracy, trust)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">AI模型训练</h1>
          <p className="text-lg text-muted-foreground">加载中...</p>
        </div>
      </div>
    )
  }

  const handleParameterClick = (parameterId: string) => {
    if (selectedParameters.includes(parameterId)) {
      // 取消选择
      onSelectionChange(selectedParameters.filter(id => id !== parameterId))
    } else if (selectedParameters.length < 2) {
      // 添加选择（最多选择2个）
      onSelectionChange([...selectedParameters, parameterId])
    }
  }


  // 获取指标颜色
  const getMetricColor = (value: ScaleValue, type: 'accuracy' | 'trust' | 'crimeRate') => {
    if (type === 'crimeRate') {
      // 犯罪率：越低越好
      if (value <= 2) return "text-green-600"
      if (value <= 3) return "text-yellow-600"
      return "text-red-600"
    } else {
      // 准确度和信任度：越高越好
      if (value >= 4) return "text-green-600"
      if (value >= 3) return "text-yellow-600"
      return "text-red-600"
    }
  }



  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100">
                AI模型训练中心
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 mt-2">
                选择训练参数，构建您的AI系统
              </p>
            </div>
            <div className="flex items-center gap-4">
              {onSettingsChange && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSettings(true)}
                  className="flex items-center gap-2"
                >
                  <Settings className="h-4 w-4" />
                  设置
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* 三个核心指标 - 与下方对齐 */}
        <div className="mb-8">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-center gap-2">
                <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 dark:text-blue-400 text-xs">📊</span>
                </div>
                AI系统核心指标
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 准确度 */}
                <div className="text-center">
                  <div className="text-sm text-slate-500 mb-2">准确度</div>
                  <div className={`text-3xl font-bold ${getMetricColor(accuracy, 'accuracy')} mb-2`}>
                    {accuracy}
                  </div>
                  <div className={`text-sm font-medium ${getMetricColor(accuracy, 'accuracy')}`}>
                    {SCALE_MAPPING[accuracy]}
                  </div>
                  <Progress value={(accuracy - 1) / 4 * 100} className="h-2 mt-2" />
                </div>

                {/* 信任度 */}
                <div className="text-center">
                  <div className="text-sm text-slate-500 mb-2">信任度</div>
                  <div className={`text-3xl font-bold ${getMetricColor(trust, 'trust')} mb-2`}>
                    {trust}
                  </div>
                  <div className={`text-sm font-medium ${getMetricColor(trust, 'trust')}`}>
                    {SCALE_MAPPING[trust]}
                  </div>
                  <Progress value={(trust - 1) / 4 * 100} className="h-2 mt-2" />
                </div>

                {/* 犯罪率 */}
                <div className="text-center">
                  <div className="text-sm text-slate-500 mb-2">犯罪率</div>
                  <div className={`text-3xl font-bold ${getMetricColor(crimeRate, 'crimeRate')} mb-2`}>
                    {crimeRate}
                  </div>
                  <div className={`text-sm font-medium ${getMetricColor(crimeRate, 'crimeRate')}`}>
                    {SCALE_MAPPING[crimeRate]}
                  </div>
                  <Progress value={(crimeRate - 1) / 4 * 100} className="h-2 mt-2" />
                </div>
              </div>
              {shouldRetrain && (
                <div className="text-center text-xs text-orange-600 mt-4">
                  建议重新训练
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 参数选择区域 */}
        <div className="w-full">
            <Card>
              <CardHeader>
                <CardTitle>训练参数选择</CardTitle>
                <CardDescription>
                  选择用于训练AI模型的参数。不同的参数选择会影响AI的准确性、公平性和透明度。
                </CardDescription>
              </CardHeader>
              <CardContent>

                {/* 训练参数选项 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {AI_TRAINING_PARAMETERS.map((parameter) => {
                    const isSelected = selectedParameters.includes(parameter.id)
                    const isHighRisk = parameter.impact.trust <= 2
                    const isDisabled = !isSelected && selectedParameters.length >= 2
                    
                    return (
                      <Card
                        key={parameter.id}
                        className={`cursor-pointer transition-all duration-200 ${
                          isSelected
                            ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950"
                            : isDisabled
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:shadow-md hover:scale-105"
                        } ${isHighRisk ? "border-red-200 dark:border-red-800" : ""}`}
                        onClick={() => !isDisabled && handleParameterClick(parameter.id)}
                        onMouseEnter={() => setHoveredOption(parameter.id)}
                        onMouseLeave={() => setHoveredOption(null)}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{parameter.name}</CardTitle>
                            <div className="flex items-center gap-2">
                              {isHighRisk && (
                                <AlertTriangle className="h-4 w-4 text-red-500" />
                              )}
                              {isSelected && (
                                <CheckCircle2 className="h-5 w-5 text-blue-600" />
                              )}
                            </div>
                          </div>
                          <CardDescription className="text-sm">
                            {parameter.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                          {/* 影响指标 */}
                          {settings.showDetailedValues && (
                            <div className="grid grid-cols-3 gap-2 mb-3">
                              <div className="text-center">
                                <div className="text-xs text-slate-500">准确度</div>
                                <div className={`text-sm font-bold ${getMetricColor(parameter.impact.accuracy, 'accuracy')}`}>
                                  {parameter.impact.accuracy}
                                </div>
                                <div className="text-xs text-slate-400">
                                  {SCALE_MAPPING[parameter.impact.accuracy]}
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="text-xs text-slate-500">信任度</div>
                                <div className={`text-sm font-bold ${getMetricColor(parameter.impact.trust, 'trust')}`}>
                                  {parameter.impact.trust}
                                </div>
                                <div className="text-xs text-slate-400">
                                  {SCALE_MAPPING[parameter.impact.trust]}
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="text-xs text-slate-500">犯罪率</div>
                                <div className={`text-sm font-bold ${getMetricColor(parameter.impact.crimeRate, 'crimeRate')}`}>
                                  {parameter.impact.crimeRate}
                                </div>
                                <div className="text-xs text-slate-400">
                                  {SCALE_MAPPING[parameter.impact.crimeRate]}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* 伦理风险提示 */}
                          <div className="space-y-2">
                            <Badge 
                              variant="outline" 
                              className={`text-xs w-full ${
                                isHighRisk 
                                  ? 'bg-red-100 text-red-700 border-red-300' 
                                  : 'bg-yellow-100 text-yellow-700 border-yellow-300'
                              }`}
                            >
                              {isHighRisk ? '高风险' : '中等风险'}
                            </Badge>
                            <p className="text-xs text-muted-foreground">
                              {parameter.ethicalConcern}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
                
              </CardContent>
            </Card>
        </div>

        {/* 教育模式 - 实时计算展示 */}
        {settings.educationMode && (
          <div className="mt-8">
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-blue-200 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 dark:text-blue-400 text-xs">📊</span>
                  </div>
                  实时数值计算
                </CardTitle>
                <CardDescription>
                  当前选择的参数对AI系统各项指标的影响计算过程
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* AI参数影响计算 */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">AI训练数据集影响</h4>
                    <div className="bg-white dark:bg-slate-800 p-3 rounded-lg text-sm font-mono">
                      {selectedParameters.includes('no_ai') ? (
                        <div className="text-muted-foreground">
                          不使用AI技术 → 准确度: 2, 信任度: 5, 犯罪率: 4
                        </div>
                      ) : (
                        <div className="space-y-1">
                          {selectedParameters.map(paramId => {
                            const param = AI_TRAINING_PARAMETERS.find(p => p.id === paramId)
                            if (!param) return null
                            return (
                              <div key={paramId} className="flex items-center gap-2">
                                <span className="text-blue-600">{param.name}:</span>
                                <span>准确度: {param.impact.accuracy}</span>
                                <span className="text-green-600">信任度: {param.impact.trust}</span>
                                <span className="text-orange-600">犯罪率: {param.impact.crimeRate}</span>
                              </div>
                            )
                          })}
                          <div className="border-t pt-2 mt-2">
                            <div className="font-bold">
                              当前指标: 准确度 {accuracy} | 信任度 {trust} | 犯罪率 {crimeRate}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 指标计算 */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">指标计算过程</h4>
                    <div className="bg-white dark:bg-slate-800 p-3 rounded-lg text-sm font-mono">
                      {selectedParameters.includes('no_ai') ? (
                        <div>不使用AI技术 → 固定值: 准确度 2, 信任度 5, 犯罪率 4</div>
                      ) : selectedParameters.length === 0 ? (
                        <div>未选择数据集 → 默认值: 准确度 3, 信任度 3, 犯罪率 3</div>
                      ) : (
                        <div className="space-y-1">
                          <div>选择的数据集: {selectedParameters.length} 个</div>
                          <div>计算方式: 各指标取平均值，四舍五入到最接近的标度值</div>
                          <div className="font-bold">
                            当前结果: 准确度 {accuracy} ({SCALE_MAPPING[accuracy]}) | 
                            信任度 {trust} ({SCALE_MAPPING[trust]}) | 
                            犯罪率 {crimeRate} ({SCALE_MAPPING[crimeRate]})
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 状态评估 */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">当前状态评估</h4>
                    <div className="bg-white dark:bg-slate-800 p-3 rounded-lg text-sm">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-xs text-slate-500">准确度</div>
                          <div className={`font-bold ${getMetricColor(accuracy, 'accuracy')}`}>
                            {accuracy} ({SCALE_MAPPING[accuracy]})
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-slate-500">信任度</div>
                          <div className={`font-bold ${getMetricColor(trust, 'trust')}`}>
                            {trust} ({SCALE_MAPPING[trust]})
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-slate-500">犯罪率</div>
                          <div className={`font-bold ${getMetricColor(crimeRate, 'crimeRate')}`}>
                            {crimeRate} ({SCALE_MAPPING[crimeRate]})
                          </div>
                        </div>
                      </div>
                      {shouldRetrain && (
                        <div className="text-center mt-2">
                          <Badge variant="outline" className="text-orange-600">
                            建议重新训练
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* 不使用AI技术选项 - 独立白框 */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="w-6 h-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  <span className="text-green-600 dark:text-green-400 text-xs">🛡️</span>
                </div>
                其它选项
              </CardTitle>
              <CardDescription>
                选择完全避免AI技术，依赖传统警务方法
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={`cursor-pointer transition-all duration-200 p-4 rounded-lg border-2 ${
                  selectedParameters.includes('no_ai')
                    ? "ring-2 ring-green-500 bg-green-50 dark:bg-green-950 border-green-300"
                    : "hover:shadow-md hover:scale-105 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                }`}
                onClick={() => handleParameterClick('no_ai')}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-green-700 dark:text-green-300">
                    不使用AI技术
                  </h3>
                  {selectedParameters.includes('no_ai') && (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  完全避免使用AI技术，依赖传统警务方法，避免所有AI偏见风险
                </p>
                {settings.showDetailedValues && (
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="text-center">
                      <div className="text-xs text-slate-500">准确度</div>
                      <div className="text-sm font-bold text-red-600">2</div>
                      <div className="text-xs text-slate-400">低</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-slate-500">信任度</div>
                      <div className="text-sm font-bold text-green-600">5</div>
                      <div className="text-xs text-slate-400">极高</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-slate-500">犯罪率</div>
                      <div className="text-sm font-bold text-red-600">4</div>
                      <div className="text-xs text-slate-400">高</div>
                    </div>
                  </div>
                )}
                <Badge variant="outline" className="text-xs bg-green-100 text-green-700">
                  完全伦理安全
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dashboard Footer */}
        <div className="mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 选择状态 */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">当前选择</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">
                      {selectedParameters.includes('no_ai')
                        ? "不使用AI技术"
                        : `已选择 ${selectedParameters.length} 个参数`
                      }
                    </span>
                  </div>
                  {selectedParameters.length > 0 && !selectedParameters.includes('no_ai') && (
                    <div className="text-xs text-muted-foreground">
                      {selectedParameters
                        .map(id => AI_TRAINING_PARAMETERS.find(p => p.id === id)?.name)
                        .join('、')}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 教育提示 */}
            <Card className="lg:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 dark:text-blue-400 text-xs">💡</span>
                  </div>
                  AI伦理教育
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  在现实世界中，AI系统的训练参数选择涉及重要的伦理考量。使用敏感的人口统计学特征
                  （如肤色、性别）可能提高准确性，但也会引入偏见和歧视风险。选择"不使用AI技术"
                  虽然会失去AI的效率优势，但能完全避免AI偏见问题。
                </p>
              </CardContent>
            </Card>
          </div>

          {/* 确认按钮 */}
          <div className="flex justify-center mt-6">
            <Button
              onClick={onConfirm}
              disabled={selectedParameters.length !== 2 && !selectedParameters.includes('no_ai')}
              size="lg"
              className="px-12 py-3 text-lg"
            >
              确认参数选择
            </Button>
          </div>
        </div>
      </div>

      {/* 设置面板 */}
      {showSettings && onSettingsChange && (
        <GameSettings
          settings={settings}
          onSettingsChange={onSettingsChange}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  )
}
