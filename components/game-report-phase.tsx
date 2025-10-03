"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart3, TrendingUp, TrendingDown, Minus, RefreshCw, ArrowRight } from "lucide-react"
import { GameReport } from "@/types"

interface GameReportPhaseProps {
  report: GameReport
  onProceed: () => void
  onRetrain: () => void
}

export default function GameReportPhase({
  report,
  onProceed,
  onRetrain
}: GameReportPhaseProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">AI系统评估报告</h1>
          <p className="text-lg text-muted-foreground">加载中...</p>
        </div>
      </div>
    )
  }
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    if (score >= 40) return "text-orange-600"
    return "text-red-600"
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "优秀"
    if (score >= 60) return "良好"
    if (score >= 40) return "一般"
    return "需要改进"
  }

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <TrendingUp className="h-4 w-4 text-green-600" />
    if (score >= 60) return <Minus className="h-4 w-4 text-yellow-600" />
    return <TrendingDown className="h-4 w-4 text-red-600" />
  }

  const getMetricColor = (value: number, isReverse = false) => {
    const threshold = isReverse ? 30 : 70
    if (isReverse) {
      return value <= threshold ? "text-green-600" : value <= 50 ? "text-yellow-600" : "text-red-600"
    }
    return value >= threshold ? "text-green-600" : value >= 50 ? "text-yellow-600" : "text-red-600"
  }

  const getMetricIcon = (value: number, isReverse = false) => {
    const threshold = isReverse ? 30 : 70
    if (isReverse) {
      return value <= threshold ? <TrendingDown className="h-4 w-4 text-green-600" /> : <TrendingUp className="h-4 w-4 text-red-600" />
    }
    return value >= threshold ? <TrendingUp className="h-4 w-4 text-green-600" /> : <TrendingDown className="h-4 w-4 text-red-600" />
  }

  const metrics = [
    {
      name: "公众信任度",
      value: report.trustLevel,
      description: "公众对AI系统的信任程度",
      isReverse: false
    },
    {
      name: "犯罪率",
      value: report.crimeRate,
      description: "犯罪率（越低越好）",
      isReverse: true
    },
    {
      name: "准确性",
      value: report.accuracy,
      description: "AI系统的准确性",
      isReverse: false
    },
    {
      name: "公平性",
      value: report.fairness,
      description: "AI系统的公平性",
      isReverse: false
    },
    {
      name: "透明度",
      value: report.transparency,
      description: "AI系统的透明度",
      isReverse: false
    }
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* 标题 */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">AI系统评估报告</h1>
        <p className="text-lg text-muted-foreground">
          基于您的AI训练和政策选择，以下是系统的综合表现评估
        </p>
      </div>

      {/* 总体评分 */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-blue-200 dark:border-blue-800">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <BarChart3 className="h-6 w-6 text-blue-600" />
              <span className="text-xl font-semibold">总体评分</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-3">
                {getScoreIcon(report.overallScore)}
                <span className={`text-4xl font-bold ${getScoreColor(report.overallScore)}`}>
                  {report.overallScore.toFixed(1)}
                </span>
                <Badge className={`text-lg px-3 py-1 ${getScoreColor(report.overallScore)}`}>
                  {getScoreLabel(report.overallScore)}
                </Badge>
              </div>
              <Progress value={report.overallScore} className="h-3" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 详细指标 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.name} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{metric.name}</CardTitle>
                {getMetricIcon(metric.value, metric.isReverse)}
              </div>
              <CardDescription className="text-sm">
                {metric.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">
                    {metric.value.toFixed(1)}%
                  </span>
                  <span className={`text-sm font-medium ${getMetricColor(metric.value, metric.isReverse)}`}>
                    {metric.isReverse 
                      ? (metric.value <= 30 ? "优秀" : metric.value <= 50 ? "良好" : "需改进")
                      : (metric.value >= 70 ? "优秀" : metric.value >= 50 ? "良好" : "需改进")
                    }
                  </span>
                </div>
                <Progress value={metric.value} className="h-2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 分析总结 */}
      <Card className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            分析总结
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            {report.trustLevel < 50 && (
              <p className="text-red-600">
                ⚠️ 公众信任度较低，可能影响AI系统的接受度和有效性。
              </p>
            )}
            {report.crimeRate > 70 && (
              <p className="text-orange-600">
                ⚠️ 犯罪率仍然较高，AI系统可能需要进一步优化。
              </p>
            )}
            {report.accuracy < 70 && (
              <p className="text-yellow-600">
                ⚠️ 准确性不足，建议重新训练AI模型。
              </p>
            )}
            {report.fairness < 50 && (
              <p className="text-red-600">
                ⚠️ 公平性存在问题，可能存在算法偏见。
              </p>
            )}
            {report.overallScore >= 80 && (
              <p className="text-green-600">
                ✅ 系统表现优秀，在多个维度都达到了良好水平。
              </p>
            )}
            {report.overallScore >= 60 && report.overallScore < 80 && (
              <p className="text-yellow-600">
                ⚖️ 系统表现中等，有改进空间但基本可用。
              </p>
            )}
            {report.overallScore < 60 && (
              <p className="text-red-600">
                ❌ 系统表现不佳，建议重新设计或训练。
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 操作按钮 */}
      <div className="flex justify-center gap-4">
        <Button
          onClick={onRetrain}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          重新训练AI
        </Button>
        <Button
          onClick={onProceed}
          className="flex items-center gap-2"
        >
          查看最终结果
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      {/* 教育提示 */}
      <Card className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
        <CardContent className="pt-6">
          <div className="space-y-2">
            <h3 className="font-semibold text-green-900 dark:text-green-100">
              AI系统评估的重要性
            </h3>
            <p className="text-sm text-green-800 dark:text-green-200">
              在现实世界中，AI系统需要定期评估其性能。不仅要关注准确性，
              还要考虑公平性、透明度和公众信任。一个成功的AI系统应该在
              所有维度都达到平衡，而不是仅仅追求单一指标的最优化。
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
