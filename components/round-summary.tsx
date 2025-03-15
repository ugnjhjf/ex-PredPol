import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { InfoIcon, TrendingUp, TrendingDown, Minus, AlertCircle } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

// District styling variables
const districtColors = {
  district1: "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800",
  district2: "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800",
  district3: "bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800",
  district4: "bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800",
}

const districtHeaderColors = {
  district1: "bg-blue-100 dark:bg-blue-900",
  district2: "bg-green-100 dark:bg-green-900",
  district3: "bg-amber-100 dark:bg-amber-900",
  district4: "bg-purple-100 dark:bg-purple-900",
}

// District emojis
const districtEmojis = {
  district1: "🏙️",
  district2: "🏘️",
  district3: "🏚️",
  district4: "🏫",
}

export default function RoundSummary({
  currentRound,
  gameMetrics,
  policeAllocation,
  roundSummary,
  getDistrictName,
}) {
  return (
    <div className="p-4 space-y-4">
      {/* Introductory paragraph before district metrics */}
      <div className="bg-muted/50 p-4 rounded-md border">
        <p className="leading-relaxed">
          {currentRound >= 10 ? 
            "This is the final round. Your decisions in this round will complete your policing strategy. Make your final resource allocations and policy decisions carefully." : 
            `As Round ${currentRound > 1 ? currentRound - 1 : currentRound} concludes, your resource allocation and policy decisions have affected each district differently. Review how crime rates, community trust, and policing accuracy have changed in response to your strategy.`
          }
        </p>
      </div>
    </div>
    )
}



    