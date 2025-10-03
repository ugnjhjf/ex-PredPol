"use client"

import { CheckCircle2, Circle } from "lucide-react"
import { cn } from "@/lib/utils"

interface GameProgressProps {
  currentPhase: 'ai_training' | 'policy_selection' | 'ending'
  onPhaseClick: (phase: 'ai_training' | 'policy_selection' | 'ending') => void
  completedPhases: ('ai_training' | 'policy_selection' | 'ending')[]
  className?: string
}

const phases = [
  { id: 'ai_training', label: 'AI 训练', number: 1 },
  { id: 'policy_selection', label: '政策选择', number: 2 },
  { id: 'ending', label: '结果', number: 3 }
] as const

export default function GameProgress({ 
  currentPhase, 
  onPhaseClick, 
  completedPhases,
  className 
}: GameProgressProps) {
  return (
    <div className={cn("flex items-center justify-center py-4", className)}>
      {phases.map((phase, index) => {
        const isCurrent = currentPhase === phase.id
        const isCompleted = completedPhases.includes(phase.id)
        const isClickable = isCurrent || isCompleted || 
          (phase.id === 'policy_selection' && completedPhases.includes('ai_training')) ||
          (phase.id === 'ending' && completedPhases.includes('policy_selection'))

        return (
          <div key={phase.id} className="flex flex-col items-center relative z-10" style={{ marginLeft: index === 0 ? 0 : '8rem' }}>
            {/* 圆圈 */}
            <button
              onClick={() => isClickable && onPhaseClick(phase.id)}
              disabled={!isClickable}
              className={cn(
                "flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-200",
                "hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2",
                {
                  // 当前阶段
                  "bg-blue-500 border-blue-500 text-white shadow-lg": isCurrent,
                  // 已完成阶段
                  "bg-green-500 border-green-500 text-white": isCompleted && !isCurrent,
                  // 可点击但未完成
                  "bg-white border-gray-300 text-gray-600 hover:border-blue-400 hover:text-blue-600": 
                    isClickable && !isCurrent && !isCompleted,
                  // 不可点击
                  "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed": !isClickable
                }
              )}
            >
              {isCompleted ? (
                <CheckCircle2 className="w-6 h-6" />
              ) : (
                <span className="text-lg font-semibold">{phase.number}</span>
              )}
            </button>

            {/* 标签 */}
            <span className={cn(
              "mt-2 text-sm font-medium transition-colors",
              {
                "text-blue-600": isCurrent,
                "text-green-600": isCompleted && !isCurrent,
                "text-gray-600": isClickable && !isCurrent && !isCompleted,
                "text-gray-400": !isClickable
              }
            )}>
              {phase.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
