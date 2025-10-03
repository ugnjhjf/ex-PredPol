"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, AlertCircle, Info, AlertTriangle, Settings, Database, Shield, Users, Building2, CreditCard, Camera, FileText, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { AI_TRAINING_PARAMETERS, getScaleLabel, ScaleValue } from "@/types"
import { calculateAIMetrics, isAIMetricsSuitable } from "@/lib/ai-game-state"
import GameSettings from "./game-settings"
import { cn } from "@/lib/utils"

interface AITrainingPhaseProps {
  selectedParameters: string[]
  accuracy: ScaleValue
  trust: ScaleValue
  crimeRate: ScaleValue
  canRetrain: boolean
  onSelectionChange: (parameters: string[]) => void
  onConfirm: () => void
  settings?: {
    developerMode: boolean
  }
  onSettingsChange?: (settings: { developerMode: boolean }) => void
}

export default function AITrainingPhase({
  selectedParameters,
  accuracy: propAccuracy,
  trust: propTrust,
  crimeRate: propCrimeRate,
  canRetrain,
  onSelectionChange,
  onConfirm,
  settings = { developerMode: false },
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

  // 获取数据集图标
  const getDatasetIcon = (parameterId: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'recidivism_risk': <FileText className="h-6 w-6" />,
      'facial_surveillance': <Camera className="h-6 w-6" />,
      'stop_frisk_records': <Users className="h-6 w-6" />,
      'employment_records': <Building2 className="h-6 w-6" />,
      'credit_scoring': <CreditCard className="h-6 w-6" />,
      'no_ai': <Shield className="h-6 w-6" />
    }
    return iconMap[parameterId] || <Database className="h-6 w-6" />
  }

  // 获取分类颜色
  const getCategoryColor = (category: string) => {
    const colorMap: Record<string, string> = {
      'demographic': 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900 dark:text-red-300 dark:border-red-700',
      'socioeconomic': 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900 dark:text-orange-300 dark:border-orange-700',
      'community': 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-700'
    }
    return colorMap[category] || 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700'
  }

  // 获取分类标签
  const getCategoryLabel = (category: string) => {
    const labelMap: Record<string, string> = {
      'demographic': '人口统计',
      'socioeconomic': '社会经济',
      'community': '社区数据'
    }
    return labelMap[category] || '其他'
  }

  // 获取影响指标图标
  const getImpactIcon = (value: number) => {
    if (value > 0) return <TrendingUp className="h-3 w-3 text-green-600" />
    if (value < 0) return <TrendingDown className="h-3 w-3 text-red-600" />
    return <Minus className="h-3 w-3 text-gray-600" />
  }

  // 计算选择数据集组合后的指标值
  const calculateDatasetCombinationImpact = () => {
    const baseAccuracy = 2
    const baseTrust = 3
    const baseCrimeRate = 3.5
    
    const totalAccuracy = selectedParameters.reduce((sum, paramId) => {
      const param = AI_TRAINING_PARAMETERS.find(p => p.id === paramId)
      return sum + (param ? param.impact.accuracy : 0)
    }, 0)
    
    const totalTrust = selectedParameters.reduce((sum, paramId) => {
      const param = AI_TRAINING_PARAMETERS.find(p => p.id === paramId)
      return sum + (param ? param.impact.trust : 0)
    }, 0)
    
    const totalCrimeRate = selectedParameters.reduce((sum, paramId) => {
      const param = AI_TRAINING_PARAMETERS.find(p => p.id === paramId)
      return sum + (param ? param.impact.crimeRate : 0)
    }, 0)
    
    const finalAccuracy = Math.max(0, baseAccuracy + totalAccuracy) // 下线封底0
    const finalTrust = Math.max(0, baseTrust + totalTrust) // 下线封底0
    const finalCrimeRate = Math.max(0, baseCrimeRate + totalCrimeRate) // 下线封底0
    
    return {
      accuracy: finalAccuracy,
      trust: finalTrust,
      crimeRate: finalCrimeRate
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
                模型训练
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
          <Card className="bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950 border-slate-200 dark:border-slate-700">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-white" />
                </div>
                AI系统核心指标
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {/* 准确度 */}
                <div className="text-center group">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                      <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">准确度</span>
                  </div>
                  <div className={`text-4xl font-bold ${getMetricColor(accuracy, 'accuracy')} mb-2 transition-all duration-300 group-hover:scale-110`}>
                    {accuracy}
                  </div>
                  <div className={`text-sm font-medium ${getMetricColor(accuracy, 'accuracy')} mb-4`}>
                    {getScaleLabel(accuracy)}
                  </div>
                  <div className="relative">
                    <Progress 
                      value={(accuracy - 1) / 4 * 100} 
                      className="h-3 bg-slate-200 dark:bg-slate-700" 
                    />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 opacity-20" />
                  </div>
                </div>

                {/* 信任度 */}
                <div className="text-center group">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">信任度</span>
                  </div>
                  <div className={`text-4xl font-bold ${getMetricColor(trust, 'trust')} mb-2 transition-all duration-300 group-hover:scale-110`}>
                    {trust}
                  </div>
                  <div className={`text-sm font-medium ${getMetricColor(trust, 'trust')} mb-4`}>
                    {getScaleLabel(trust)}
                  </div>
                  <div className="relative">
                    <Progress 
                      value={(trust - 1) / 4 * 100} 
                      className="h-3 bg-slate-200 dark:bg-slate-700" 
                    />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 opacity-20" />
                  </div>
                </div>

                {/* 犯罪率 */}
                <div className="text-center group">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                      <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                    </div>
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">犯罪率</span>
                  </div>
                  <div className={`text-4xl font-bold ${getMetricColor(crimeRate, 'crimeRate')} mb-2 transition-all duration-300 group-hover:scale-110`}>
                    {crimeRate}
                  </div>
                  <div className={`text-sm font-medium ${getMetricColor(crimeRate, 'crimeRate')} mb-4`}>
                    {getScaleLabel(crimeRate)}
                  </div>
                  <div className="relative">
                    <Progress 
                      value={(crimeRate - 1) / 4 * 100} 
                      className="h-3 bg-slate-200 dark:bg-slate-700" 
                    />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 opacity-20" />
                  </div>
                </div>
              </div>
              {shouldRetrain && (
                <div className="mt-6 p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                  <div className="flex items-center justify-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                    <span className="text-sm font-medium text-orange-800 dark:text-orange-200">
                      建议重新训练 - 当前指标组合可能不够理想
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 参数选择区域 */}
        <div className="w-full">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-blue-600" />
                  训练参数选择
                </CardTitle>
                <CardDescription>
                  选择用于训练AI模型的参数。不同的参数选择会影响AI的准确性、公平性和透明度。
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* 分类统计 */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">数据集分类</h3>
                    <div className="text-xs text-slate-500">
                      共 {AI_TRAINING_PARAMETERS.length} 个数据集
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {['demographic', 'socioeconomic', 'community'].map((category) => {
                      const count = AI_TRAINING_PARAMETERS.filter(p => p.category === category).length
                      const selectedCount = AI_TRAINING_PARAMETERS.filter(p => p.category === category && selectedParameters.includes(p.id)).length
                      return (
                        <div key={category} className={`p-3 rounded-lg border ${getCategoryColor(category)}`}>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{getCategoryLabel(category)}</span>
                            <span className="text-xs">
                              {selectedCount}/{count} 已选
                            </span>
                          </div>
                          <div className="mt-1">
                            <div className="w-full bg-white/50 dark:bg-black/20 rounded-full h-1.5">
                              <div 
                                className="bg-current h-1.5 rounded-full transition-all duration-300"
                                style={{ width: `${count > 0 ? (selectedCount / count) * 100 : 0}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* 训练参数选项 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
                  {AI_TRAINING_PARAMETERS.map((parameter) => {
                    const isSelected = selectedParameters.includes(parameter.id)
                    const isHighRisk = parameter.impact.trust <= 2
                    const isDisabled = !isSelected && selectedParameters.length >= 2
                    
                    return (
                      <Card
                        key={parameter.id}
                        className={`group cursor-pointer transition-all duration-300 transform relative overflow-hidden ${
                          isSelected
                            ? "ring-2 ring-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 shadow-lg scale-105"
                            : isDisabled
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:shadow-xl hover:scale-105 hover:bg-gradient-to-br hover:from-slate-50 hover:to-slate-100 dark:hover:from-slate-800 dark:hover:to-slate-700"
                        } ${isHighRisk ? "border-red-200 dark:border-red-800" : "border-slate-200 dark:border-slate-700"}`}
                        onClick={() => !isDisabled && handleParameterClick(parameter.id)}
                        onMouseEnter={() => setHoveredOption(parameter.id)}
                        onMouseLeave={() => setHoveredOption(null)}
                      >
                        
                        {/* 悬停效果覆盖层 */}
                        {hoveredOption === parameter.id && !isSelected && !isDisabled && (
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 pointer-events-none" />
                        )}
                        <CardHeader className="pb-4">
                          <div className="flex flex-col sm:flex-row items-start gap-4">
                            {/* 图标区域 */}
                            <div className={cn(
                              "w-12 h-12 sm:w-16 sm:h-16 rounded-xl border-2 flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110 mx-auto sm:mx-0",
                              {
                                "border-blue-500 bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700 shadow-lg": isSelected,
                                "border-slate-300 bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600 group-hover:border-blue-300 group-hover:bg-gradient-to-br group-hover:from-blue-50 group-hover:to-blue-100 group-hover:text-blue-700": !isSelected && !isDisabled,
                                "border-slate-200 bg-slate-100 text-slate-400": isDisabled
                              }
                            )}>
                              <div className="transition-transform duration-300 group-hover:rotate-12">
                                {getDatasetIcon(parameter.id)}
                              </div>
                            </div>
                            
                            <div className="flex-1 min-w-0 w-full sm:w-auto">
                              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 gap-2">
                                <div className="flex-1 min-w-0">
                                  <CardTitle className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1 text-center sm:text-left">
                                    {parameter.name}
                                  </CardTitle>
                                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
                                    <Badge 
                                      variant="outline" 
                                      className={`text-xs ${getCategoryColor(parameter.category)}`}
                                    >
                                      {getCategoryLabel(parameter.category)}
                                    </Badge>
                                    {isHighRisk && (
                                      <Badge variant="destructive" className="text-xs">
                                        <AlertTriangle className="h-3 w-3 mr-1" />
                                        高风险
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  {isSelected && (
                                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center animate-bounce">
                                      <CheckCircle2 className="h-4 w-4 text-white" />
                                    </div>
                                  )}
                                </div>
                              </div>
                              <CardDescription className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed text-center sm:text-left">
                                {parameter.description}
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        
                        <CardContent className="pt-0">
                          {/* 影响指标 - 开发者模式 */}
                          {settings.developerMode && (
                            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 mb-4">
                              <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">指标影响</h4>
                              <div className="grid grid-cols-3 gap-4">
                                <div className="text-center">
                                  <div className="flex items-center justify-center gap-1 mb-1">
                                    {getImpactIcon(parameter.impact.accuracy)}
                                    <span className="text-xs text-slate-500">准确度</span>
                                  </div>
                                  <div className={`text-lg font-bold ${parameter.impact.accuracy > 0 ? 'text-green-600' : parameter.impact.accuracy < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                                    {parameter.impact.accuracy > 0 ? '+' : ''}{parameter.impact.accuracy}
                                  </div>
                                </div>
                                <div className="text-center">
                                  <div className="flex items-center justify-center gap-1 mb-1">
                                    {getImpactIcon(parameter.impact.trust)}
                                    <span className="text-xs text-slate-500">信任度</span>
                                  </div>
                                  <div className={`text-lg font-bold ${parameter.impact.trust > 0 ? 'text-green-600' : parameter.impact.trust < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                                    {parameter.impact.trust > 0 ? '+' : ''}{parameter.impact.trust}
                                  </div>
                                </div>
                                <div className="text-center">
                                  <div className="flex items-center justify-center gap-1 mb-1">
                                    {getImpactIcon(-parameter.impact.crimeRate)}
                                    <span className="text-xs text-slate-500">犯罪率</span>
                                  </div>
                                  <div className={`text-lg font-bold ${parameter.impact.crimeRate < 0 ? 'text-green-600' : parameter.impact.crimeRate > 0 ? 'text-red-600' : 'text-gray-600'}`}>
                                    {parameter.impact.crimeRate > 0 ? '+' : ''}{parameter.impact.crimeRate}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* 伦理风险提示 */}
                          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                            <div className="flex items-start gap-2">
                              <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="text-xs font-medium text-amber-800 dark:text-amber-200 mb-1">
                                  伦理考量
                                </p>
                                <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
                                  {parameter.ethicalConcern}
                                </p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
                
              </CardContent>
            </Card>
        </div>

        {/* 开发者模式 - 实时计算展示 */}
        {settings.developerMode && (
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
                                <span>准确度: {param.impact.accuracy > 0 ? '+' : ''}{param.impact.accuracy}</span>
                                <span className="text-green-600">信任度: {param.impact.trust > 0 ? '+' : ''}{param.impact.trust}</span>
                                <span className="text-orange-600">犯罪率: {param.impact.crimeRate > 0 ? '+' : ''}{param.impact.crimeRate}</span>
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
                            当前结果: 准确度 {accuracy} ({getScaleLabel(accuracy)}) | 
                            信任度 {trust} ({getScaleLabel(trust)}) | 
                            犯罪率 {crimeRate} ({getScaleLabel(crimeRate)})
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
                            {accuracy} ({getScaleLabel(accuracy)})
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-slate-500">信任度</div>
                          <div className={`font-bold ${getMetricColor(trust, 'trust')}`}>
                            {trust} ({getScaleLabel(trust)})
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-slate-500">犯罪率</div>
                          <div className={`font-bold ${getMetricColor(crimeRate, 'crimeRate')}`}>
                            {crimeRate} ({getScaleLabel(crimeRate)})
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
                选择完全避免AI技术，依赖传统警务方法”
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
                {settings.developerMode && (
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
            <Card className="md:col-span-2">
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
              disabled={selectedParameters.length !== 2 && selectedParameters.length !== 0 && !selectedParameters.includes('no_ai')}
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
