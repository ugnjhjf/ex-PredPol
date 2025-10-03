"use client"

import { useState, useEffect } from "react"
import { GameState, GamePhase } from "@/types"
import { 
  createInitialGameState, 
  updateGameState, 
  advanceToNextPhase,
  calculateAIMetrics,
  isAIMetricsSuitable,
  generateGameReport,
  retrainAI,
  completeGame
} from "@/lib/ai-game-state"
import AITrainingPhase from "./ai-training-phase"
import PolicySelectionPhase from "./policy-selection-phase"
import GameReportPhase from "./game-report-phase"
import GameEndingPhase from "./game-ending-phase"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"

export default function GameSimulation() {
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [showRetrainDialog, setShowRetrainDialog] = useState(false)
  const [isClient, setIsClient] = useState(false)

  // 确保只在客户端渲染
  useEffect(() => {
    setIsClient(true)
    setGameState(createInitialGameState())
  }, [])

  // 防止hydration错误
  if (!isClient || !gameState) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">加载中...</p>
        </div>
      </div>
    )
  }

  // AI训练参数处理
  const handleAITrainingSelection = (selectedParameters: string[]) => {
    if (!gameState) return
    
    const metrics = calculateAIMetrics(selectedParameters)
    const canRetrain = !isAIMetricsSuitable(metrics.accuracy, metrics.trust)
    
    setGameState(prevState => {
      if (!prevState) return prevState
      return updateGameState(prevState, {
        aiTraining: {
          ...prevState.aiTraining,
          selectedOptions: selectedParameters,
          accuracy: metrics.accuracy,
          trust: metrics.trust,
          crimeRate: metrics.crimeRate,
          canRetrain
        }
      })
    })
  }

  // 确认AI训练选择
  const confirmAITraining = () => {
    if (!gameState) return
    
    if (gameState.aiTraining.canRetrain) {
      setShowRetrainDialog(true)
    } else {
      setGameState(prevState => {
        if (!prevState) return prevState
        return advanceToNextPhase(prevState)
      })
    }
  }

  // 重新训练AI
  const handleRetrain = () => {
    setGameState(prevState => {
      if (!prevState) return prevState
      return retrainAI(prevState)
    })
    setShowRetrainDialog(false)
  }

  // 继续使用当前AI
  const handleContinueWithCurrent = () => {
    setGameState(prevState => {
      if (!prevState) return prevState
      return advanceToNextPhase(prevState)
    })
    setShowRetrainDialog(false)
  }

  // 政策选择处理
  const handlePolicySelection = (policyId: string) => {
    if (!gameState) return
    
    setGameState(prevState => {
      if (!prevState) return prevState
      return updateGameState(prevState, {
        policySelection: {
          ...prevState.policySelection,
          selectedPolicy: policyId
        }
      })
    })
  }

  // 确认政策选择
  const confirmPolicySelection = () => {
    if (!gameState || !gameState.policySelection.selectedPolicy) return
    
    const report = generateGameReport(
      gameState.aiTraining.selectedOptions,
      gameState.policySelection.selectedPolicy,
      gameState.aiTraining.accuracy
    )
    setGameState(prevState => {
      if (!prevState) return prevState
      return updateGameState(prevState, {
        report,
        phase: 'report'
      })
    })
  }

  // 查看报告后进入结局
  const proceedToEnding = () => {
    if (!gameState || !gameState.report) return
    
    setGameState(prevState => {
      if (!prevState || !prevState.report) return prevState
      const ending = completeGame(prevState.report)
      return {
        ...prevState,
        ending,
        phase: 'ending' as const
      }
    })
  }

  // 重新开始游戏
  const restartGame = () => {
    setGameState(createInitialGameState())
    setShowRetrainDialog(false)
  }

  // 渲染当前阶段的组件
  const renderCurrentPhase = () => {
    if (!gameState) return null
    
    switch (gameState.phase) {
      case 'ai_training':
        return (
          <AITrainingPhase
            selectedParameters={gameState.aiTraining.selectedOptions}
            accuracy={gameState.aiTraining.accuracy}
            trust={gameState.aiTraining.trust}
            crimeRate={gameState.aiTraining.crimeRate}
            canRetrain={gameState.aiTraining.canRetrain}
            onSelectionChange={handleAITrainingSelection}
            onConfirm={confirmAITraining}
          />
        )
      case 'policy_selection':
        return (
          <PolicySelectionPhase
            selectedPolicy={gameState.policySelection.selectedPolicy}
            availablePolicies={gameState.policySelection.availablePolicies}
            onSelectionChange={handlePolicySelection}
            onConfirm={confirmPolicySelection}
          />
        )
      case 'report':
        return (
          <GameReportPhase
            report={gameState.report!}
            onProceed={proceedToEnding}
            onRetrain={() => {
              setGameState(prevState => {
                if (!prevState) return prevState
                return retrainAI(prevState)
              })
            }}
          />
        )
      case 'ending':
        return (
          <GameEndingPhase
            ending={gameState.ending!}
            onRestart={restartGame}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto p-4">
        {renderCurrentPhase()}
      </main>

      {/* 重新训练确认对话框 */}
      <Dialog open={showRetrainDialog} onOpenChange={setShowRetrainDialog}>
        <DialogContent>
          <DialogTitle>AI可信度不理想</DialogTitle>
          <div className="space-y-4">
            <p>
              当前AI指标为 <strong>准确度: {gameState?.aiTraining.accuracy || 0}, 信任度: {gameState?.aiTraining.trust || 0}</strong>，
              建议准确度和信任度都达到3以上。
            </p>
            <p>您希望：</p>
            <div className="flex gap-2">
              <button
                onClick={handleRetrain}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                重新训练AI
              </button>
              <button
                onClick={handleContinueWithCurrent}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                继续使用当前AI
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}