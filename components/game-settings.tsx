"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Settings, BookOpen, Eye, EyeOff } from "lucide-react"

interface GameSettingsProps {
  settings: {
    developerMode: boolean
  }
  onSettingsChange: (settings: { developerMode: boolean }) => void
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
      developerMode: false
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
          {/* 开发者模式 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="education-mode" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  开发者模式
                </Label>
                <p className="text-sm text-muted-foreground">
                  显示详细的数值影响、计算公式和实时计算结果
                </p>
              </div>
              <Switch
                id="education-mode"
                checked={localSettings.developerMode}
                onCheckedChange={(checked) =>
                  setLocalSettings(prev => ({ ...prev, developerMode: checked }))
                }
              />
            </div>
          </div>


          {/* 模式说明 */}
          <div className="space-y-2 p-4 bg-muted rounded-lg">
            <h4 className="font-medium text-sm">模式说明</h4>
            <div className="text-xs text-muted-foreground space-y-1">
              <p><strong>普通模式：</strong>只显示风险等级，保持游戏探索性</p>
              <p><strong>开发者模式：</strong>显示详细数值和计算公式，适合学习AI伦理</p>
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
