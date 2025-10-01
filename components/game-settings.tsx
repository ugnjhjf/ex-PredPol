"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Settings, BookOpen, Eye, EyeOff } from "lucide-react"

interface GameSettingsProps {
  settings: {
    showDetailedValues: boolean
    educationMode: boolean
  }
  onSettingsChange: (settings: { showDetailedValues: boolean; educationMode: boolean }) => void
  onClose: () => void
}

export default function GameSettings({ settings, onSettingsChange, onClose }: GameSettingsProps) {
  const [localSettings, setLocalSettings] = useState(settings)

  const handleSave = () => {
    onSettingsChange(localSettings)
    onClose()
  }

  const handleReset = () => {
    setLocalSettings({
      showDetailedValues: false,
      educationMode: false
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            游戏设置
          </CardTitle>
          <CardDescription>
            调整游戏显示模式和教育内容
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 教育模式 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="education-mode" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  教育模式
                </Label>
                <p className="text-sm text-muted-foreground">
                  显示详细的数值影响和计算公式
                </p>
              </div>
              <Switch
                id="education-mode"
                checked={localSettings.educationMode}
                onCheckedChange={(checked) => 
                  setLocalSettings(prev => ({ ...prev, educationMode: checked }))
                }
              />
            </div>
          </div>

          {/* 详细数值显示 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="detailed-values" className="flex items-center gap-2">
                  {localSettings.showDetailedValues ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                  显示详细数值
                </Label>
                <p className="text-sm text-muted-foreground">
                  显示参数对准确性、公平性、透明度的具体影响值
                </p>
              </div>
              <Switch
                id="detailed-values"
                checked={localSettings.showDetailedValues}
                onCheckedChange={(checked) => 
                  setLocalSettings(prev => ({ ...prev, showDetailedValues: checked }))
                }
              />
            </div>
          </div>

          {/* 模式说明 */}
          <div className="space-y-2 p-4 bg-muted rounded-lg">
            <h4 className="font-medium text-sm">模式说明</h4>
            <div className="text-xs text-muted-foreground space-y-1">
              <p><strong>普通模式：</strong>只显示风险等级，保持游戏探索性</p>
              <p><strong>教育模式：</strong>显示详细数值，适合学习AI伦理</p>
              <p><strong>详细数值：</strong>显示具体的+/-百分比影响</p>
            </div>
          </div>

          {/* 按钮 */}
          <div className="flex gap-2 pt-4">
            <Button onClick={handleReset} variant="outline" className="flex-1">
              重置
            </Button>
            <Button onClick={onClose} variant="outline" className="flex-1">
              取消
            </Button>
            <Button onClick={handleSave} className="flex-1">
              保存
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
