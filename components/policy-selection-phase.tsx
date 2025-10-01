"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, AlertTriangle, Shield, Info } from "lucide-react"
import { PolicyOption } from "@/types/game"

interface PolicySelectionPhaseProps {
  selectedPolicy: string | null
  availablePolicies: PolicyOption[]
  onSelectionChange: (policyId: string) => void
  onConfirm: () => void
  settings?: {
    showDetailedValues: boolean
    educationMode: boolean
  }
}

export default function PolicySelectionPhase({
  selectedPolicy,
  availablePolicies,
  onSelectionChange,
  onConfirm,
  settings = { showDetailedValues: false, educationMode: false }
}: PolicySelectionPhaseProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">政策选择</h1>
          <p className="text-lg text-muted-foreground">加载中...</p>
        </div>
      </div>
    )
  }
  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return "text-green-600 bg-green-100 dark:bg-green-900"
      case 'medium': return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900"
      case 'high': return "text-red-600 bg-red-100 dark:bg-red-900"
      default: return "text-gray-600 bg-gray-100 dark:bg-gray-900"
    }
  }

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return <Shield className="h-4 w-4" />
      case 'medium': return <AlertTriangle className="h-4 w-4" />
      case 'high': return <AlertTriangle className="h-4 w-4" />
      default: return null
    }
  }

  const getRiskLabel = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return "低风险"
      case 'medium': return "中等风险"
      case 'high': return "高风险"
      default: return "未知风险"
    }
  }

  const getImpactColor = (value: number) => {
    if (value > 0) return "text-green-600"
    if (value < 0) return "text-red-600"
    return "text-gray-600"
  }

  const getImpactIcon = (value: number) => {
    if (value > 0) return "↗"
    if (value < 0) return "↘"
    return "→"
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* 标题 */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">政策选择</h1>
        <p className="text-lg text-muted-foreground">
          基于您的AI训练结果，选择一个执法政策。您也可以选择不使用任何政策。
        </p>
      </div>

      {/* 政策选项 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {availablePolicies.map((policy) => {
          const isSelected = selectedPolicy === policy.id
          const isNoAI = policy.id === 'none'
          
          return (
            <Card
              key={policy.id}
              className={`cursor-pointer transition-all duration-200 ${
                isSelected
                  ? isNoAI 
                    ? "ring-2 ring-green-500 bg-green-50 dark:bg-green-950"
                    : "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950"
                  : "hover:shadow-md hover:scale-105"
              }`}
              onClick={() => onSelectionChange(policy.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className={`text-lg ${isNoAI ? 'text-green-700 dark:text-green-300' : ''}`}>
                    {policy.name}
                  </CardTitle>
                  {isSelected && (
                    <CheckCircle2 className={`h-5 w-5 ${isNoAI ? 'text-green-600' : 'text-blue-600'}`} />
                  )}
                </div>
                <CardDescription className="text-sm">
                  {policy.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 space-y-4">
                {/* 风险等级 */}
                <div className="flex items-center gap-2">
                  <Badge className={`${getRiskColor(policy.riskLevel)} text-xs`}>
                    <div className="flex items-center gap-1">
                      {getRiskIcon(policy.riskLevel)}
                      {getRiskLabel(policy.riskLevel)}
                    </div>
                  </Badge>
                </div>

                {/* 影响指标 */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold">预期影响</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span>公众信任</span>
                      <span className={`flex items-center gap-1 ${getImpactColor(policy.impact.trust)}`}>
                        {getImpactIcon(policy.impact.trust)}
                        {policy.impact.trust > 0 ? '+' : ''}{policy.impact.trust}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span>犯罪减少</span>
                      <span className={`flex items-center gap-1 ${getImpactColor(policy.impact.crimeReduction)}`}>
                        {getImpactIcon(policy.impact.crimeReduction)}
                        +{policy.impact.crimeReduction}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span>准确性</span>
                      <span className={`flex items-center gap-1 ${getImpactColor(policy.impact.accuracy)}`}>
                        {getImpactIcon(policy.impact.accuracy)}
                        {policy.impact.accuracy > 0 ? '+' : ''}{policy.impact.accuracy}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span>公平性</span>
                      <span className={`flex items-center gap-1 ${getImpactColor(policy.impact.fairness)}`}>
                        {getImpactIcon(policy.impact.fairness)}
                        {policy.impact.fairness > 0 ? '+' : ''}{policy.impact.fairness}%
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* 选择提示 */}
      <div className="text-center">
        {selectedPolicy ? (
          <p className="text-sm text-green-600">
            已选择政策：{availablePolicies.find(p => p.id === selectedPolicy)?.name}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            请选择一个执法政策
          </p>
        )}
      </div>

      {/* 确认按钮 */}
      <div className="flex justify-center">
        <Button
          onClick={onConfirm}
          disabled={!selectedPolicy}
          size="lg"
          className="px-8"
        >
          确认政策选择
        </Button>
      </div>

      {/* 教育模式 - 实时计算展示 */}
      {settings.educationMode && (
        <div className="mt-8">
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-green-200 dark:border-green-800">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="w-6 h-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  <span className="text-green-600 dark:text-green-400 text-xs">📊</span>
                </div>
                政策影响计算
              </CardTitle>
              <CardDescription>
                当前选择的政策对各项指标的影响计算过程
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* 政策影响计算 */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">政策影响分析</h4>
                  <div className="bg-white dark:bg-slate-800 p-3 rounded-lg text-sm font-mono">
                    {selectedPolicy ? (
                      (() => {
                        const policy = availablePolicies.find(p => p.id === selectedPolicy)
                        if (!policy) return <div className="text-muted-foreground">未选择政策</div>
                        return (
                          <div className="space-y-1">
                            <div className="text-blue-600 font-medium">{policy.name}</div>
                            <div className="space-y-1">
                              <div>信任度影响: {policy.impact.trust > 0 ? '+' : ''}{policy.impact.trust}%</div>
                              <div>犯罪减少: {policy.impact.crimeReduction > 0 ? '+' : ''}{policy.impact.crimeReduction}%</div>
                              <div>准确性影响: {policy.impact.accuracy > 0 ? '+' : ''}{policy.impact.accuracy}%</div>
                              <div>公平性影响: {policy.impact.fairness > 0 ? '+' : ''}{policy.impact.fairness}%</div>
                            </div>
                            <div className="border-t pt-2 mt-2">
                              <div className="text-xs text-muted-foreground">
                                风险等级: {policy.riskLevel === 'high' ? '高风险' : policy.riskLevel === 'medium' ? '中等风险' : '低风险'}
                              </div>
                            </div>
                          </div>
                        )
                      })()
                    ) : (
                      <div className="text-muted-foreground">请选择一个政策</div>
                    )}
                  </div>
                </div>

                {/* 计算公式说明 */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">最终得分计算公式</h4>
                  <div className="bg-white dark:bg-slate-800 p-3 rounded-lg text-sm font-mono">
                    <div className="space-y-1">
                      <div>最终得分 = (基础分数 + AI影响) × 0.7 + (基础分数 + 政策影响) × 0.3</div>
                      <div className="text-xs text-muted-foreground mt-2">
                        其中：基础分数 = 50%，AI影响来自训练参数，政策影响来自选择的政策
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 教育提示 */}
      <Card className="bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-amber-600 mt-0.5" />
            <div className="space-y-2">
              <h3 className="font-semibold text-amber-900 dark:text-amber-100">
                政策选择的重要性
              </h3>
              <p className="text-sm text-amber-800 dark:text-amber-200">
                不同的执法政策会对社会产生不同的影响。选择"不使用任何政策"虽然不会带来变化，
                但也不会解决现有问题。高风险的政策可能带来更高的效率，
                但也可能损害公众信任和公平性。在现实世界中，政策制定者需要在效率、
                公平性和公众接受度之间找到平衡。
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
