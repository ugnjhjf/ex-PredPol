"use client"

import AITrainingPhase from "@/components/ai-training-phase"
import PolicySelectionPhase from "@/components/policy-selection-phase"
import GameEndingPhase from "@/components/game-ending-phase"
import GameProgress from "@/components/game-progress"
import { useState } from "react"
import { calculateAIMetrics, isAIMetricsSuitable, generateGameReport, completeGame } from "@/lib/ai-game-state"
import { AI_TRAINING_PARAMETERS, POLICY_OPTIONS, GAME_ENDINGS, ScaleValue } from "@/types"

type GamePhase = 'ai_training' | 'policy_selection' | 'ending'

export default function Home() {
  const [gamePhase, setGamePhase] = useState<GamePhase>('ai_training')
  const [selectedParameters, setSelectedParameters] = useState<string[]>([])
  const [accuracy, setAccuracy] = useState<ScaleValue>(2)
  const [trust, setTrust] = useState<ScaleValue>(3)
  const [crimeRate, setCrimeRate] = useState<ScaleValue>(3.5)
  const [canRetrain, setCanRetrain] = useState(false)
  const [selectedPolicies, setSelectedPolicies] = useState<string[]>([])
  const [gameReport, setGameReport] = useState<any>(null)
  const [gameEnding, setGameEnding] = useState<any>(null)
  const [completedPhases, setCompletedPhases] = useState<GamePhase[]>([])
  const [gameSettings, setGameSettings] = useState({
    developerMode: false
  })

  const handleSelectionChange = (parameters: string[]) => {
    setSelectedParameters(parameters)
    const metrics = calculateAIMetrics(parameters)
    setAccuracy(metrics.accuracy)
    setTrust(metrics.trust)
    setCrimeRate(metrics.crimeRate)
    setCanRetrain(!isAIMetricsSuitable(metrics.accuracy, metrics.trust))
  }

  const handleAITrainingConfirm = () => {
    console.log("选择的参数:", selectedParameters)
    console.log("AI指标:", { accuracy, trust, crimeRate })
    console.log("需要重新训练:", canRetrain)
    setCompletedPhases(prev => [...prev, 'ai_training'])
    setGamePhase('policy_selection')
  }

  const handlePolicySelection = (policyIds: string[]) => {
    setSelectedPolicies(policyIds)
  }

  const handlePolicyConfirm = () => {
    console.log("选择的政策:", selectedPolicies)
    
    // 生成游戏报告
    const report = generateGameReport(selectedParameters, selectedPolicies, accuracy, trust, crimeRate)
    setGameReport(report)
    
    // 确定结局
    const ending = completeGame(report)
    setGameEnding(ending)
    
    setCompletedPhases(prev => [...prev, 'policy_selection'])
    setGamePhase('ending')
  }

  const handlePhaseClick = (phase: GamePhase) => {
    // 只允许导航到已完成的阶段或当前阶段
    if (phase === 'ai_training' || 
        (phase === 'policy_selection' && completedPhases.includes('ai_training')) ||
        (phase === 'ending' && completedPhases.includes('policy_selection'))) {
      setGamePhase(phase)
    }
  }

  const handleRestart = () => {
    setGamePhase('ai_training')
    setSelectedParameters([])
    setAccuracy(2)
    setTrust(3)
    setCrimeRate(3.5)
    setCanRetrain(false)
    setSelectedPolicies([])
    setGameReport(null)
    setGameEnding(null)
    setCompletedPhases([])
  }

  const renderCurrentPhase = () => {
    switch (gamePhase) {
          case 'ai_training':
            return (
              <AITrainingPhase
                selectedParameters={selectedParameters}
                accuracy={accuracy}
                trust={trust}
                crimeRate={crimeRate}
                canRetrain={canRetrain}
                onSelectionChange={handleSelectionChange}
                onConfirm={handleAITrainingConfirm}
                settings={gameSettings}
                onSettingsChange={setGameSettings}
              />
            )
      case 'policy_selection':
        return (
          <PolicySelectionPhase
            selectedPolicies={selectedPolicies}
            availablePolicies={POLICY_OPTIONS}
            onSelectionChange={handlePolicySelection}
            onConfirm={handlePolicyConfirm}
            settings={gameSettings}
            accuracy={accuracy}
            trust={trust}
            crimeRate={crimeRate}
          />
        )
      case 'ending':
        return (
          <GameEndingPhase
            ending={gameEnding}
            onRestart={handleRestart}
            settings={gameSettings}
            gameReport={gameReport}
          />
        )
      default:
        return null
    }
  }

  return (
    <main className="container mx-auto p-4 max-h-screen">
      {/* 进度条 */}
      <GameProgress
        currentPhase={gamePhase}
        onPhaseClick={handlePhaseClick}
        completedPhases={completedPhases}
        className="mb-6"
      />
      
      {/* 当前阶段内容 */}
      {renderCurrentPhase()}
    </main>
  )
}

