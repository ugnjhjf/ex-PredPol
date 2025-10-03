"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RotateCcw, Trophy, AlertTriangle, Scale, Target, Globe } from "lucide-react"
import { GameEnding } from "@/types"

interface GameEndingPhaseProps {
  ending: GameEnding
  onRestart: () => void
  settings?: {
    showDetailedValues: boolean
    educationMode: boolean
  }
  gameReport?: any
}

export default function GameEndingPhase({
  ending,
  onRestart,
  settings = { showDetailedValues: false, educationMode: false },
  gameReport
}: GameEndingPhaseProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">游戏结局</h1>
          <p className="text-lg text-muted-foreground">加载中...</p>
        </div>
      </div>
    )
  }
  const getEndingIcon = (type: string) => {
    switch (type) {
      case 'failure': return <AlertTriangle className="h-8 w-8 text-red-600" />
      case 'bias': return <AlertTriangle className="h-8 w-8 text-orange-600" />
      case 'compromise': return <Scale className="h-8 w-8 text-yellow-600" />
      case 'ideal': return <Trophy className="h-8 w-8 text-green-600" />
      case 'hidden': return <Globe className="h-8 w-8 text-blue-600" />
      default: return <Target className="h-8 w-8 text-gray-600" />
    }
  }

  const getEndingColor = (type: string) => {
    switch (type) {
      case 'failure': return "text-red-600 bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800"
      case 'bias': return "text-orange-600 bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800"
      case 'compromise': return "text-yellow-600 bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800"
      case 'ideal': return "text-green-600 bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800"
      case 'hidden': return "text-blue-600 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800"
      default: return "text-gray-600 bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800"
    }
  }

  const getEndingDescription = (type: string) => {
    switch (type) {
      case 'failure': return "AI系统虽然效率很高，但导致了严重的社会问题，最终失去了公众信任。"
      case 'bias': return "AI系统表现优异，但存在明显的偏见问题，部分群体被边缘化。"
      case 'compromise': return "AI系统表现中等，社会保持稳定，但仍有改进空间。"
      case 'ideal': return "AI系统在效率、公平性和公众信任之间达到了完美平衡。"
      case 'hidden': return "选择不使用AI技术，避免了AI偏见风险，但效率较低。"
      default: return "游戏结束。"
    }
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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* 结局标题 */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          {getEndingIcon(ending.type)}
          <h1 className="text-3xl font-bold">{ending.title}</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          {getEndingDescription(ending.type)}
        </p>
      </div>

      {/* 结局卡片 */}
      <Card className={`${getEndingColor(ending.type)}`}>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{ending.title}</CardTitle>
          <CardDescription className="text-lg">
            {ending.message}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          {/* 评分 */}
          <div className="flex items-center justify-center gap-3">
            <span className="text-sm text-muted-foreground">最终评分：</span>
            <span className={`text-3xl font-bold ${getScoreColor(ending.score)}`}>
              {ending.score}
            </span>
            <Badge className={`text-lg px-3 py-1 ${getScoreColor(ending.score)}`}>
              {getScoreLabel(ending.score)}
            </Badge>
          </div>

          {/* 隐藏结局特殊提示 */}
          {ending.isHidden && (
            <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                🎉 恭喜！您发现了隐藏结局！这个结局展示了不使用AI的另一种选择。
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 学习总结 */}
      <Card className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle>学习总结</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3 text-sm">
            <h4 className="font-semibold">关键学习点：</h4>
            <ul className="space-y-2 list-disc list-inside">
              <li>
                <strong>AI系统需要平衡多个目标：</strong> 不仅要追求准确性，
                还要考虑公平性、透明度和公众信任。
              </li>
              <li>
                <strong>算法偏见是真实存在的问题：</strong> AI系统可能无意中
                放大或延续社会中的不平等现象。
              </li>
              <li>
                <strong>社区参与很重要：</strong> 在开发和部署AI系统时，
                应该让受影响的社区参与决策过程。
              </li>
              <li>
                <strong>透明度有助于建立信任：</strong> 可解释的AI系统
                更容易获得公众的信任和接受。
              </li>
              <li>
                <strong>有时不使用AI可能是更好的选择：</strong> 
                不是所有问题都需要AI解决方案。
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* 现实世界案例 */}
      <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="text-blue-900 dark:text-blue-100">
            现实世界案例
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-blue-800 dark:text-blue-200">
          <p>
            <strong>PredPol案例：</strong> 这个预测性警务系统因为算法偏见
            而受到批评，它倾向于将更多警力部署到少数族裔社区，
            加剧了现有的不平等。
          </p>
          <p>
            <strong>人脸识别争议：</strong> 许多城市因为担心偏见和隐私问题
            而禁止或限制人脸识别技术的使用。
          </p>
          <p>
            <strong>社区参与的重要性：</strong> 一些城市在部署新的
            执法技术前会举行公开听证会，让社区参与决策。
          </p>
        </CardContent>
      </Card>

      {/* 教育模式 - 最终得分展示 */}
      {settings.educationMode && gameReport && (
        <div className="mt-8">
          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border-purple-200 dark:border-purple-800">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 dark:text-purple-400 text-xs">📊</span>
                </div>
                最终得分分析
              </CardTitle>
              <CardDescription>
                您的选择对各项指标的具体影响和最终得分
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* 最终得分展示 */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">最终得分</h4>
                  <div className="bg-white dark:bg-slate-800 p-3 rounded-lg text-sm font-mono">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-blue-600">准确性: {gameReport.accuracy?.toFixed(1)}%</div>
                        <div className="text-green-600">公平性: {gameReport.fairness?.toFixed(1)}%</div>
                        <div className="text-purple-600">透明度: {gameReport.transparency?.toFixed(1)}%</div>
                      </div>
                      <div>
                        <div className="text-orange-600">信任度: {gameReport.trustLevel?.toFixed(1)}%</div>
                        <div className="text-red-600">犯罪率: {gameReport.crimeRate?.toFixed(1)}%</div>
                        <div className="text-gray-600">总分: {gameReport.overallScore?.toFixed(1)}%</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 结局判定说明 */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">结局判定过程</h4>
                  <div className="bg-white dark:bg-slate-800 p-3 rounded-lg text-sm font-mono">
                    <div className="space-y-1">
                      <div>根据准确性、公平性、透明度的得分范围：</div>
                      <div className="text-xs text-muted-foreground">
                        • 准确性: {gameReport.accuracy?.toFixed(1)}% 
                        • 公平性: {gameReport.fairness?.toFixed(1)}% 
                        • 透明度: {gameReport.transparency?.toFixed(1)}%
                      </div>
                      <div className="font-bold text-blue-600">
                        匹配到结局: {ending.title}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 教育总结 */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">学习要点</h4>
                  <div className="bg-white dark:bg-slate-800 p-3 rounded-lg text-sm">
                    <div className="space-y-2">
                      <p>• AI训练参数的选择直接影响系统的公平性和准确性</p>
                      <p>• 政策选择会影响公众信任和社会接受度</p>
                      <p>• 理想的AI系统需要在效率、公平性和透明度之间找到平衡</p>
                      <p>• 不同的组合会产生不同的社会影响和伦理后果</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 操作按钮 */}
      <div className="flex justify-center gap-4">
        <Button
          onClick={onRestart}
          variant="outline"
          size="lg"
          className="flex items-center gap-2"
        >
          <RotateCcw className="h-5 w-5" />
          重新开始游戏
        </Button>
      </div>
    </div>
  )
}
