"use client"

import AITrainingPhase from "@/components/ai-training-phase"
import PolicySelectionPhase from "@/components/policy-selection-phase"
import GameEndingPhase from "@/components/game-ending-phase"
import { useState } from "react"
import { calculateAIReliability, isAIReliabilitySuitable, generateGameReport, completeGame } from "@/lib/ai-game-state"
import { AI_TRAINING_PARAMETERS, POLICY_OPTIONS, GAME_ENDINGS } from "@/types/game"

type GamePhase = 'ai_training' | 'policy_selection' | 'ending'

export default function Home() {
  const [gamePhase, setGamePhase] = useState<GamePhase>('ai_training')
  const [selectedParameters, setSelectedParameters] = useState<string[]>([])
  const [aiReliability, setAiReliability] = useState(50)
  const [canRetrain, setCanRetrain] = useState(false)
  const [selectedPolicy, setSelectedPolicy] = useState<string>('')
  const [gameReport, setGameReport] = useState<any>(null)
  const [gameEnding, setGameEnding] = useState<any>(null)
  const [gameSettings, setGameSettings] = useState({
    showDetailedValues: false,
    educationMode: false
  })

  const handleSelectionChange = (parameters: string[]) => {
    setSelectedParameters(parameters)
    const reliability = calculateAIReliability(parameters)
    setAiReliability(reliability)
    setCanRetrain(!isAIReliabilitySuitable(reliability))
  }

  const handleAITrainingConfirm = () => {
    console.log("选择的参数:", selectedParameters)
    console.log("AI可信度:", aiReliability)
    console.log("需要重新训练:", canRetrain)
    setGamePhase('policy_selection')
  }

  const handlePolicySelection = (policyId: string) => {
    setSelectedPolicy(policyId)
  }

  const handlePolicyConfirm = () => {
    console.log("选择的政策:", selectedPolicy)
    
    // 生成游戏报告
    const report = generateGameReport(selectedParameters, selectedPolicy, aiReliability)
    setGameReport(report)
    
    // 确定结局
    const ending = completeGame(report)
    setGameEnding(ending)
    
    setGamePhase('ending')
  }

  const handleRestart = () => {
    setGamePhase('ai_training')
    setSelectedParameters([])
    setAiReliability(50)
    setCanRetrain(false)
    setSelectedPolicy('')
    setGameReport(null)
    setGameEnding(null)
  }

  const renderCurrentPhase = () => {
    switch (gamePhase) {
          case 'ai_training':
            return (
              <AITrainingPhase
                selectedParameters={selectedParameters}
                aiReliability={aiReliability}
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
            selectedPolicy={selectedPolicy}
            availablePolicies={POLICY_OPTIONS}
            onSelectionChange={handlePolicySelection}
            onConfirm={handlePolicyConfirm}
            settings={gameSettings}
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
      {renderCurrentPhase()}
    </main>
  )
}

