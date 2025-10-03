"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, AlertTriangle, Shield, Info, Zap, Heart } from "lucide-react"
import { PolicyOption, HARD_POLICIES, SOFT_POLICIES, getScaleLabel, ScaleValue } from "@/types"

interface PolicySelectionPhaseProps {
  selectedPolicies: string[]
  availablePolicies: PolicyOption[]
  onSelectionChange: (policyIds: string[]) => void
  onConfirm: () => void
  settings?: {
    developerMode: boolean
  }
  // 从AI训练阶段继承的三个指标
  accuracy: ScaleValue
  trust: ScaleValue
  crimeRate: ScaleValue
}

export default function PolicySelectionPhase({
  selectedPolicies,
  availablePolicies,
  onSelectionChange,
  onConfirm,
  settings = { developerMode: false },
  accuracy,
  trust,
  crimeRate
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

  // 处理政策选择
  const handlePolicyClick = (policyId: string) => {
    const isSelected = selectedPolicies.includes(policyId)
    let newSelectedPolicies: string[]
    
    if (isSelected) {
      // 取消选择
      newSelectedPolicies = selectedPolicies.filter(id => id !== policyId)
    } else {
      // 添加选择
      newSelectedPolicies = [...selectedPolicies, policyId]
    }
    
    onSelectionChange(newSelectedPolicies)
  }

  // 计算所有选择政策的总影响
  const calculateTotalPolicyImpact = () => {
    const selectedPolicyObjects = availablePolicies.filter(p => selectedPolicies.includes(p.id))
    
    let totalAccuracyImpact = 0
    let totalTrustImpact = 0
    let totalCrimeRateImpact = 0
    
    selectedPolicyObjects.forEach(policy => {
      totalAccuracyImpact += policy.impact.accuracy
      totalTrustImpact += policy.impact.trust
      totalCrimeRateImpact += policy.impact.crimeRate
    })
    
    return { totalAccuracyImpact, totalTrustImpact, totalCrimeRateImpact }
  }

  // 计算政策影响后的指标
  const calculatePolicyImpact = (policy: PolicyOption) => {
    const newAccuracy = Math.max(1, Math.min(5, accuracy + policy.impact.accuracy)) as ScaleValue
    const newTrust = Math.max(1, Math.min(5, trust + policy.impact.trust)) as ScaleValue
    const newCrimeRate = Math.max(1, Math.min(5, crimeRate + policy.impact.crimeRate)) as ScaleValue
    
    return { accuracy: newAccuracy, trust: newTrust, crimeRate: newCrimeRate }
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            政策选择
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            选择适合的执法政策来调整AI系统的表现
        </p>
      </div>

        {/* 当前AI指标显示 */}
        <div className="mb-8">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-center gap-2">
                <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 dark:text-blue-400 text-xs">📊</span>
                </div>
                当前AI系统指标
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
                    {getScaleLabel(accuracy)}
                  </div>
                </div>

                {/* 信任度 */}
                <div className="text-center">
                  <div className="text-sm text-slate-500 mb-2">信任度</div>
                  <div className={`text-3xl font-bold ${getMetricColor(trust, 'trust')} mb-2`}>
                    {trust}
                  </div>
                  <div className={`text-sm font-medium ${getMetricColor(trust, 'trust')}`}>
                    {getScaleLabel(trust)}
                  </div>
                </div>

                {/* 犯罪率 */}
                <div className="text-center">
                  <div className="text-sm text-slate-500 mb-2">犯罪率</div>
                  <div className={`text-3xl font-bold ${getMetricColor(crimeRate, 'crimeRate')} mb-2`}>
                    {crimeRate}
                  </div>
                  <div className={`text-sm font-medium ${getMetricColor(crimeRate, 'crimeRate')}`}>
                    {getScaleLabel(crimeRate)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 政策+AI总分面板 */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950 dark:to-indigo-950 border-purple-200 dark:border-purple-800">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-center gap-2">
                <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 dark:text-purple-400 text-xs">🎯</span>
                </div>
                政策+AI综合评分
              </CardTitle>
              <CardDescription className="text-center">
                基于当前AI指标和政策选择的综合评分
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 当前总分 */}
                <div className="text-center">
                  <div className="text-sm text-slate-500 mb-2">当前总分</div>
                  <div className="text-4xl font-bold text-purple-600 mb-2">
                    {((accuracy + trust + (6 - crimeRate)) / 3).toFixed(1)}
                  </div>
                  <div className="text-sm text-slate-600">
                    基于AI训练结果
                  </div>
                </div>

                {/* 选择政策后的预期总分 */}
                <div className="text-center">
                  <div className="text-sm text-slate-500 mb-2">预期总分</div>
                  <div className="text-4xl font-bold text-indigo-600 mb-2">
                    {selectedPolicies.length > 0 ? (() => {
                      const { totalAccuracyImpact, totalTrustImpact, totalCrimeRateImpact } = calculateTotalPolicyImpact()
                      
                      const finalAccuracy = Math.max(1, Math.min(5, accuracy + totalAccuracyImpact)) as ScaleValue
                      const finalTrust = Math.max(1, Math.min(5, trust + totalTrustImpact)) as ScaleValue
                      const finalCrimeRate = Math.max(1, Math.min(5, crimeRate + totalCrimeRateImpact)) as ScaleValue
                      
                      return ((finalAccuracy + finalTrust + (6 - finalCrimeRate)) / 3).toFixed(1)
                    })() : '--'}
                  </div>
                  <div className="text-sm text-slate-600">
                    {selectedPolicies.length > 0 ? `已选择${selectedPolicies.length}个政策` : '请选择政策'}
                  </div>
                </div>
              </div>

              {/* 评分说明 */}
              <div className="mt-4 p-3 bg-white dark:bg-slate-800 rounded-lg">
                <div className="text-xs text-slate-600 dark:text-slate-400 text-center">
                  <strong>评分计算：</strong> (准确度 + 信任度 + (6 - 犯罪率)) ÷ 3
                  <br />
                  <span className="text-purple-600">范围：1.0-5.0分</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 硬政策 */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Zap className="h-6 w-6 text-red-600" />
                硬政策
              </CardTitle>
              <CardDescription>
                技术导向的执法政策，通常能提高效率但可能影响公众信任
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {HARD_POLICIES.map((policy) => {
                  const isSelected = selectedPolicies.includes(policy.id)
                  const impact = calculatePolicyImpact(policy)
          
          return (
            <Card
              key={policy.id}
              className={`cursor-pointer transition-all duration-200 ${
                isSelected
                          ? "ring-2 ring-red-500 bg-red-50 dark:bg-red-950"
                  : "hover:shadow-md hover:scale-105"
              }`}
                      onClick={() => handlePolicyClick(policy.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-4">
                  {/* 图片框 */}
                  <div className={`w-16 h-16 rounded-lg border-2 flex items-center justify-center flex-shrink-0 ${
                    isSelected
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300 bg-gray-50"
                  }`}>
                    <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
                      <span className="text-xs text-gray-500">图片</span>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{policy.name}</CardTitle>
                      {isSelected && (
                        <CheckCircle2 className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                    <CardDescription className="text-sm">
                      {policy.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
                      <CardContent className="pt-0">
                        {/* 影响指标 */}
                        {settings.developerMode && (
                          <div className="grid grid-cols-3 gap-2 mb-3">
                            <div className="text-center">
                              <div className="text-xs text-slate-500">准确度</div>
                              <div className={`text-sm font-bold ${policy.impact.accuracy > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {policy.impact.accuracy > 0 ? '+' : ''}{policy.impact.accuracy}
                              </div>
                              <div className="text-xs text-slate-400">
                                → {impact.accuracy} ({getScaleLabel(impact.accuracy)})
                              </div>
                    </div>
                            <div className="text-center">
                              <div className="text-xs text-slate-500">信任度</div>
                              <div className={`text-sm font-bold ${policy.impact.trust > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {policy.impact.trust > 0 ? '+' : ''}{policy.impact.trust}
                </div>
                              <div className="text-xs text-slate-400">
                                → {impact.trust} ({getScaleLabel(impact.trust)})
                    </div>
                    </div>
                            <div className="text-center">
                              <div className="text-xs text-slate-500">犯罪率</div>
                              <div className={`text-sm font-bold ${policy.impact.crimeRate < 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {policy.impact.crimeRate > 0 ? '+' : ''}{policy.impact.crimeRate}
                    </div>
                              <div className="text-xs text-slate-400">
                                → {impact.crimeRate} ({getScaleLabel(impact.crimeRate)})
                    </div>
                  </div>
                </div>
                        )}

                        <Badge 
                          variant="outline" 
                          className="text-xs bg-red-100 text-red-700 w-full"
                        >
                          硬政策
                        </Badge>
              </CardContent>
            </Card>
          )
        })}
      </div>
            </CardContent>
          </Card>
      </div>

        {/* 软政策 */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Heart className="h-6 w-6 text-green-600" />
                软政策
              </CardTitle>
              <CardDescription>
                社区导向的执法政策，注重建立信任和长期关系
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SOFT_POLICIES.map((policy) => {
                  const isSelected = selectedPolicies.includes(policy.id)
                  const impact = calculatePolicyImpact(policy)
                  
                  return (
                    <Card
                      key={policy.id}
                      className={`cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? "ring-2 ring-green-500 bg-green-50 dark:bg-green-950"
                          : "hover:shadow-md hover:scale-105"
                      }`}
                      onClick={() => handlePolicyClick(policy.id)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-4">
                          {/* 图片框 */}
                          <div className={`w-16 h-16 rounded-lg border-2 flex items-center justify-center flex-shrink-0 ${
                            isSelected
                              ? "border-green-500 bg-green-50"
                              : "border-gray-300 bg-gray-50"
                          }`}>
                            <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
                              <span className="text-xs text-gray-500">图片</span>
                            </div>
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-lg">{policy.name}</CardTitle>
                              {isSelected && (
                                <CheckCircle2 className="h-5 w-5 text-green-600" />
                              )}
                            </div>
                            <CardDescription className="text-sm">
                              {policy.description}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        {/* 影响指标 */}
                        {settings.developerMode && (
                          <div className="grid grid-cols-3 gap-2 mb-3">
                            <div className="text-center">
                              <div className="text-xs text-slate-500">准确度</div>
                              <div className={`text-sm font-bold ${policy.impact.accuracy > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {policy.impact.accuracy > 0 ? '+' : ''}{policy.impact.accuracy}
                              </div>
                              <div className="text-xs text-slate-400">
                                → {impact.accuracy} ({getScaleLabel(impact.accuracy)})
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-xs text-slate-500">信任度</div>
                              <div className={`text-sm font-bold ${policy.impact.trust > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {policy.impact.trust > 0 ? '+' : ''}{policy.impact.trust}
                              </div>
                              <div className="text-xs text-slate-400">
                                → {impact.trust} ({getScaleLabel(impact.trust)})
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-xs text-slate-500">犯罪率</div>
                              <div className={`text-sm font-bold ${policy.impact.crimeRate < 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {policy.impact.crimeRate > 0 ? '+' : ''}{policy.impact.crimeRate}
                              </div>
                              <div className="text-xs text-slate-400">
                                → {impact.crimeRate} ({getScaleLabel(impact.crimeRate)})
                              </div>
                            </div>
                          </div>
                        )}

                        <Badge 
                          variant="outline" 
                          className="text-xs bg-green-100 text-green-700 w-full"
                        >
                          软政策
                        </Badge>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 不使用政策选项 */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Shield className="h-6 w-6 text-gray-600" />
                其他选项
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Card
                className={`cursor-pointer transition-all duration-200 ${
                  selectedPolicies.includes('none')
                    ? "ring-2 ring-gray-500 bg-gray-50 dark:bg-gray-950"
                    : "hover:shadow-md hover:scale-105"
                }`}
                onClick={() => handlePolicyClick('none')}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-4">
                    {/* 图片框 */}
                    <div className={`w-16 h-16 rounded-lg border-2 flex items-center justify-center flex-shrink-0 ${
                      selectedPolicies.includes('none')
                        ? "border-gray-500 bg-gray-50"
                        : "border-gray-300 bg-gray-50"
                    }`}>
                      <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
                        <span className="text-xs text-gray-500">图片</span>
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">不使用任何政策</CardTitle>
                        {selectedPolicies.includes('none') && (
                          <CheckCircle2 className="h-5 w-5 text-gray-600" />
                        )}
                      </div>
                      <CardDescription className="text-sm">
                        不实施任何新的执法政策，维持现状
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <Badge 
                    variant="outline" 
                    className="text-xs bg-gray-100 text-gray-700 w-full"
                  >
                    维持现状
                  </Badge>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
                </div>

        {/* 当前选择显示 */}
        {selectedPolicies.length > 0 && (
          <div className="mb-8">
            <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-blue-600" />
                  已选择政策 ({selectedPolicies.length}个)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {selectedPolicies.map(policyId => {
                    const policy = availablePolicies.find(p => p.id === policyId)
                    return policy ? (
                      <div key={policyId} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg">
                        <div>
                          <h3 className="font-semibold text-lg">{policy.name}</h3>
                          <p className="text-sm text-muted-foreground">{policy.description}</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePolicyClick(policyId)}
                        >
                          取消选择
                        </Button>
                      </div>
                    ) : null
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* 确认按钮 */}
        <div className="flex justify-center">
          <Button
            onClick={onConfirm}
            disabled={selectedPolicies.length === 0}
            size="lg"
            className="px-12 py-3 text-lg"
          >
            确认政策选择
          </Button>
            </div>
          </div>
    </div>
  )
}