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
    <div className="max-w-4xl mx-auto space-y-6">
      {/* 标题和进度 */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">AI模型训练参数选择</h1>
        <p className="text-lg text-muted-foreground">
          选择用于训练AI模型的参数。不同的参数选择会影响AI的准确性、公平性和透明度。
        </p>
        
        {/* AI可信度显示 */}
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2">
                {getReliabilityIcon(aiReliability)}
                <span className="text-lg font-semibold">AI可信度</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">当前可信度</span>
                  <span className={`text-2xl font-bold ${getReliabilityColor(aiReliability)}`}>
                    {aiReliability.toFixed(1)}%
                  </span>
                </div>
                <Progress value={aiReliability} className="h-2" />
                <div className="flex items-center justify-center gap-1">
                  <span className={`text-sm font-medium ${getReliabilityColor(aiReliability)}`}>
                    {getReliabilityStatus(aiReliability)}
                  </span>
                  {canRetrain && (
                    <span className="text-xs text-muted-foreground">
                      (建议重新训练)
                    </span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 训练参数选项 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>准确性</span>
                    <span className={`font-medium ${parameter.impact.accuracy > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {parameter.impact.accuracy > 0 ? '+' : ''}{parameter.impact.accuracy}%
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>公平性</span>
                    <span className={`font-medium ${parameter.impact.fairness > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {parameter.impact.fairness > 0 ? '+' : ''}{parameter.impact.fairness}%
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>透明度</span>
                    <span className={`font-medium ${parameter.impact.transparency > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {parameter.impact.transparency > 0 ? '+' : ''}{parameter.impact.transparency}%
                    </span>
                  </div>
                </div>

                {/* 伦理风险提示 */}
                <div className="mt-3 space-y-2">
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
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
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>准确性</span>
                <span className="font-medium">基础水平</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>公平性</span>
                <span className="font-medium text-green-600">高</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>透明度</span>
                <span className="font-medium">基础水平</span>
              </div>
            </div>
            <div className="mt-3">
              <Badge variant="outline" className="text-xs bg-blue-100 text-blue-700">
                伦理安全
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 不使用AI技术选项 */}
      <div className="flex justify-center">
        <Card
          className={`cursor-pointer transition-all duration-200 w-80 ${
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
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>准确性</span>
                <span className="font-medium">低</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>公平性</span>
                <span className="font-medium text-green-600">极高</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>透明度</span>
                <span className="font-medium text-green-600">极高</span>
              </div>
            </div>
            <div className="mt-3">
              <Badge variant="outline" className="text-xs bg-green-100 text-green-700">
                完全伦理安全
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 选择提示 */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          {selectedParameters.includes('no_ai')
            ? "已选择：不使用AI技术" 
            : selectedParameters.length === 0 
            ? "已选择：不选择任何参数" 
            : `已选择 ${selectedParameters.length}/2 个参数`
          }
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          请选择2个参数，或者选择"不使用AI技术"来完全避免AI偏见风险
        </p>
      </div>

      {/* 确认按钮 */}
      <div className="flex justify-center">
        <Button
          onClick={onConfirm}
          disabled={selectedParameters.length !== 2 && !selectedParameters.includes('no_ai') && selectedParameters.length !== 0}
          size="lg"
          className="px-8"
        >
          确认参数选择
        </Button>
      </div>

      {/* 教育提示 */}
      <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="space-y-2">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                AI素养提示
              </h3>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                在现实世界中，AI系统的训练参数选择涉及重要的伦理考量。使用敏感的人口统计学特征
                （如肤色、性别）可能提高准确性，但也会引入偏见和歧视风险。选择"不使用AI技术"
                虽然会失去AI的效率优势，但能完全避免AI偏见问题。选择"不选择任何参数"
                虽然可能降低准确性，但能最大程度避免偏见问题。理想的AI系统应该在70-85%的可信度范围内，
                既保证准确性又避免过度拟合。
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
