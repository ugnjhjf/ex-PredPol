"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, AlertCircle, Info, AlertTriangle } from "lucide-react"
import { AI_TRAINING_PARAMETERS } from "@/types/game"

interface AITrainingPhaseProps {
  selectedParameters: string[]
  aiReliability: number
  canRetrain: boolean
  onSelectionChange: (parameters: string[]) => void
  onConfirm: () => void
}

export default function AITrainingPhase({
  selectedParameters,
  aiReliability,
  canRetrain,
  onSelectionChange,
  onConfirm
}: AITrainingPhaseProps) {
  const [hoveredOption, setHoveredOption] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)

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

  const handleNoParametersClick = () => {
    // 选择"不选择任何参数"
    onSelectionChange([])
  }

  const getReliabilityColor = (reliability: number) => {
    if (reliability >= 70 && reliability <= 85) return "text-green-600"
    if (reliability < 70) return "text-red-600"
    return "text-orange-600"
  }

  const getReliabilityStatus = (reliability: number) => {
    if (reliability >= 70 && reliability <= 85) return "合适"
    if (reliability < 70) return "不够准确"
    return "过度拟合"
  }

  const getReliabilityIcon = (reliability: number) => {
    if (reliability >= 70 && reliability <= 85) return <CheckCircle2 className="h-5 w-5 text-green-600" />
    if (reliability < 70) return <AlertCircle className="h-5 w-5 text-red-600" />
    return <AlertCircle className="h-5 w-5 text-orange-600" />
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
            <div className="text-right">
              <div className="text-sm text-slate-500 dark:text-slate-400">当前状态</div>
              <div className={`text-2xl font-bold ${getReliabilityColor(aiReliability)}`}>
                {aiReliability.toFixed(1)}%
              </div>
              <div className={`text-sm ${getReliabilityColor(aiReliability)}`}>
                {getReliabilityStatus(aiReliability)}
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* AI可信度仪表板 */}
          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  {getReliabilityIcon(aiReliability)}
                  AI可信度
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className={`text-4xl font-bold ${getReliabilityColor(aiReliability)} mb-2`}>
                    {aiReliability.toFixed(1)}%
                  </div>
                  <Progress value={aiReliability} className="h-3 mb-2" />
                  <div className={`text-sm font-medium ${getReliabilityColor(aiReliability)}`}>
                    {getReliabilityStatus(aiReliability)}
                  </div>
                  {canRetrain && (
                    <div className="text-xs text-orange-600 mt-1">
                      建议重新训练
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 参数选择区域 */}
          <div className="lg:col-span-3">
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
                    const isHighRisk = parameter.impact.fairness < -15
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
                          <div className="grid grid-cols-3 gap-2 mb-3">
                            <div className="text-center">
                              <div className="text-xs text-slate-500">准确性</div>
                              <div className={`text-sm font-bold ${parameter.impact.accuracy > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {parameter.impact.accuracy > 0 ? '+' : ''}{parameter.impact.accuracy}%
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-xs text-slate-500">公平性</div>
                              <div className={`text-sm font-bold ${parameter.impact.fairness > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {parameter.impact.fairness > 0 ? '+' : ''}{parameter.impact.fairness}%
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-xs text-slate-500">透明度</div>
                              <div className={`text-sm font-bold ${parameter.impact.transparency > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {parameter.impact.transparency > 0 ? '+' : ''}{parameter.impact.transparency}%
                              </div>
                            </div>
                          </div>

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
                
                {/* 特殊选项 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {/* 不选择任何参数选项 */}
                  <Card
                    className={`cursor-pointer transition-all duration-200 ${
                      selectedParameters.length === 0
                        ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950"
                        : "hover:shadow-md hover:scale-105"
                    }`}
                    onClick={handleNoParametersClick}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg text-blue-700 dark:text-blue-300">
                          不选择任何参数
                        </CardTitle>
                        {selectedParameters.length === 0 && (
                          <CheckCircle2 className="h-5 w-5 text-blue-600" />
                        )}
                      </div>
                      <CardDescription className="text-sm">
                        避免使用敏感参数，减少偏见风险，但可能影响准确性
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="grid grid-cols-3 gap-2 mb-3">
                        <div className="text-center">
                          <div className="text-xs text-slate-500">准确性</div>
                          <div className="text-sm font-bold">基础</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-slate-500">公平性</div>
                          <div className="text-sm font-bold text-green-600">高</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-slate-500">透明度</div>
                          <div className="text-sm font-bold">基础</div>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs bg-blue-100 text-blue-700 w-full">
                        伦理安全
                      </Badge>
                    </CardContent>
                  </Card>

                  {/* 不使用AI技术选项 */}
                  <Card
                    className={`cursor-pointer transition-all duration-200 ${
                      selectedParameters.includes('no_ai')
                        ? "ring-2 ring-green-500 bg-green-50 dark:bg-green-950"
                        : "hover:shadow-md hover:scale-105 bg-gray-100 dark:bg-gray-800"
                    }`}
                    onClick={() => handleParameterClick('no_ai')}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg text-green-700 dark:text-green-300">
                          不使用AI技术
                        </CardTitle>
                        {selectedParameters.includes('no_ai') && (
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        )}
                      </div>
                      <CardDescription className="text-sm">
                        完全避免使用AI技术，依赖传统警务方法，避免所有AI偏见风险
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="grid grid-cols-3 gap-2 mb-3">
                        <div className="text-center">
                          <div className="text-xs text-slate-500">准确性</div>
                          <div className="text-sm font-bold text-red-600">低</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-slate-500">公平性</div>
                          <div className="text-sm font-bold text-green-600">极高</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-slate-500">透明度</div>
                          <div className="text-sm font-bold text-green-600">极高</div>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs bg-green-100 text-green-700 w-full">
                        完全伦理安全
                      </Badge>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
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
                        : selectedParameters.length === 0
                        ? "不选择任何参数"
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
              disabled={selectedParameters.length !== 2 && !selectedParameters.includes('no_ai') && selectedParameters.length !== 0}
              size="lg"
              className="px-12 py-3 text-lg"
            >
              确认参数选择
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
