"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertTriangle, RefreshCcw } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function GameResults({ metrics, onReset, gameLog, gameEndReason = "completed" }) {
  // Calculate key metrics
  const avgTrust = (metrics.communityTrust.district1 + 
                    metrics.communityTrust.district2 + 
                    metrics.communityTrust.district3 + 
                    metrics.communityTrust.district4) / 4

  const avgCrime = (Math.min(100, metrics.crimesReported.district1 / 5) +
                    Math.min(100, metrics.crimesReported.district2 / 5) +
                    Math.min(100, metrics.crimesReported.district3 / 5) +
                    Math.min(100, metrics.crimesReported.district4 / 5)) / 4

  const avgFalseArrest = (metrics.falseArrestRate.district1 +
                          metrics.falseArrestRate.district2 +
                          metrics.falseArrestRate.district3 +
                          metrics.falseArrestRate.district4) / 4

  // Simplify bias calculations
  const racialBias = Math.abs(metrics.arrestsByRace.black.district3 - metrics.arrestsByRace.white.district1) / 2
  const incomeBias = Math.abs(metrics.arrestsByIncome.low.district3 - metrics.arrestsByIncome.high.district1) / 2

  // Calculate total score (simplified scoring)
  const trustScore = Math.min(25, Math.round((avgTrust / 100) * 25))
  const crimeScore = Math.min(25, Math.round((1 - avgCrime / 100) * 25))
  const falseArrestScore = Math.min(25, Math.round((1 - avgFalseArrest / 50) * 25))
  const equityScore = Math.min(25, Math.round((2 - ((racialBias + incomeBias) / 100)) * 25))
  
  const totalScore = trustScore + crimeScore + falseArrestScore + equityScore

  // Simplified grade calculation
  const getGrade = (score) => {
    if (score >= 90) return { letter: "A", label: "Exceptional", description: "You've achieved a remarkable balance between crime reduction and community trust." }
    if (score >= 80) return { letter: "B+", label: "Excellent", description: "Your policing approach was highly effective with only minor shortcomings." }
    if (score >= 70) return { letter: "B", label: "Good", description: "You maintained a good balance between enforcement and community relations." }
    if (score >= 60) return { letter: "C+", label: "Fair", description: "Your strategy had mixed results with room for improvement." }
    if (score >= 50) return { letter: "C", label: "Average", description: "Your approach achieved baseline objectives but had significant gaps." }
    if (score >= 40) return { letter: "D", label: "Poor", description: "Your strategy struggled to maintain both order and community relations." }
    return { letter: "F", label: "Failed", description: "Your approach failed to address key community policing challenges." }
  }

  const scoreGrade = getGrade(totalScore)
  
  // Core metrics to focus on
  const coreMetrics = [
    {
      name: "Community Trust",
      value: avgTrust.toFixed(1) + "%",
      target: "> 60%",
      achieved: avgTrust > 60,
      color: avgTrust > 70 ? "bg-green-500" : avgTrust > 40 ? "bg-yellow-500" : "bg-red-500",
      percentage: Math.min(100, avgTrust)
    },
    {
      name: "Crime Rate",
      value: avgCrime.toFixed(1) + "%",
      target: "< 40%",
      achieved: avgCrime < 40,
      color: avgCrime < 30 ? "bg-green-500" : avgCrime < 60 ? "bg-yellow-500" : "bg-red-500",
      percentage: Math.min(100, avgCrime)
    },
    {
      name: "False Arrest Rate",
      value: avgFalseArrest.toFixed(1) + "%",
      target: "< 15%",
      achieved: avgFalseArrest < 15,
      color: avgFalseArrest < 10 ? "bg-green-500" : avgFalseArrest < 20 ? "bg-yellow-500" : "bg-red-500",
      percentage: Math.min(100, avgFalseArrest * 2)
    },
    {
      name: "Equity Index",
      value: ((100 - ((racialBias + incomeBias) / 2))).toFixed(1) + "%",
      target: "> 70%",
      achieved: (100 - ((racialBias + incomeBias) / 2)) > 70,
      color: (racialBias + incomeBias) / 2 < 30 ? "bg-green-500" : (racialBias + incomeBias) / 2 < 50 ? "bg-yellow-500" : "bg-red-500",
      percentage: 100 - Math.min(100, (racialBias + incomeBias) / 2)
    }
  ]

  // Main takeaways based on results
  const getTakeaways = () => {
    const takeaways = []
    
    if (avgTrust < 40) {
      takeaways.push("Low community trust undermined police effectiveness and cooperation.")
    } else if (avgTrust > 70) {
      takeaways.push("Strong community trust improved crime reporting and police-community relations.")
    }
    
    if (avgCrime < 30) {
      takeaways.push("You successfully reduced crime across the city.")
    } else if (avgCrime > 60) {
      takeaways.push("Crime rates remained high, indicating need for better resource allocation.")
    }
    
    if (avgFalseArrest > 20) {
      takeaways.push("High false arrest rates damaged community relations and police legitimacy.")
    } else if (avgFalseArrest < 10) {
      takeaways.push("Low false arrest rates reflected fair and accurate policing practices.")
    }
    
    if ((racialBias + incomeBias) / 2 > 50) {
      takeaways.push("Significant disparities in arrests across demographic groups indicated systemic bias.")
    } else if ((racialBias + incomeBias) / 2 < 30) {
      takeaways.push("Your approach minimized demographic disparities in policing outcomes.")
    }
    
    if (takeaways.length === 0) {
      takeaways.push("Your policing approach achieved mixed results across different metrics.")
    }
    
    return takeaways
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 max-w-5xl mx-auto">
      <Card className="w-full">
        {/* Header with prominent restart button and game status */}
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <Button 
              onClick={onReset}
              size="lg" 
              className="px-8 py-5 text-lg bg-primary hover:bg-primary/90 font-semibold flex items-center gap-2"
            >
              <RefreshCcw className="h-5 w-5" />
              {gameEndReason === "bankrupt" ? "Try Again" : "Play Again"}
            </Button>
          </div>
          
          <CardTitle className="text-2xl">
            {gameEndReason === "bankrupt" ? (
              <span className="text-red-600 dark:text-red-500">GAME OVER - City Bankruptcy</span>
            ) : (
              "Policing Simulation Results"
            )}
          </CardTitle>
          
          <CardDescription className="max-w-lg mx-auto">
            {gameEndReason === "bankrupt" ? 
              "Your city ran out of funds and could no longer maintain police operations. Consider a more balanced budget approach next time." :
              "Your 10-round term as Police Commissioner has ended. Here's how your policing strategy performed."}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Game Over Alert for Bankruptcy */}
          {gameEndReason === "bankrupt" && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 dark:bg-red-900/50 dark:text-red-100">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                <p className="font-bold">Financial Crisis</p>
              </div>
              <p className="mt-1">
                Without sufficient funds, the police department cannot maintain operations. 
                City services collapsed before completing the full 10-round term.
              </p>
            </div>
          )}
          
          {/* Score & Grade Display */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center py-2">
            <div className="flex items-center gap-4">
              <div className={`
                w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold
                ${totalScore >= 70 ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" : 
                  totalScore >= 50 ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100" : 
                  "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"}
              `}>
                {scoreGrade.letter}
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-bold">{totalScore}/100 Points</h3>
                <p className="text-lg font-medium">{scoreGrade.label} Performance</p>
              </div>
            </div>
            
            <div className="flex-1 max-w-md">
              <p className="text-center md:text-left">{scoreGrade.description}</p>
            </div>
          </div>
          
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="metrics">Key Metrics</TabsTrigger>
              <TabsTrigger value="lessons">Key Lessons</TabsTrigger>
            </TabsList>
            
            {/* Overview Tab */}
            <TabsContent value="overview" className="py-4">
              <div className="space-y-4">
                {/* Score breakdown */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="p-3 rounded-md bg-blue-50 dark:bg-blue-950 text-center">
                    <h4 className="text-sm font-medium">Trust</h4>
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{trustScore}/25</div>
                  </div>
                  
                  <div className="p-3 rounded-md bg-green-50 dark:bg-green-950 text-center">
                    <h4 className="text-sm font-medium">Crime</h4>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">{crimeScore}/25</div>
                  </div>
                  
                  <div className="p-3 rounded-md bg-amber-50 dark:bg-amber-950 text-center">
                    <h4 className="text-sm font-medium">Accuracy</h4>
                    <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{falseArrestScore}/25</div>
                  </div>
                  
                  <div className="p-3 rounded-md bg-purple-50 dark:bg-purple-950 text-center">
                    <h4 className="text-sm font-medium">Equity</h4>
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{equityScore}/25</div>
                  </div>
                </div>
                
                {/* Main takeaways */}
                <div className="bg-muted rounded-md p-4">
                  <h3 className="text-base font-medium mb-2">Key Takeaways</h3>
                  <ul className="space-y-1">
                    {getTakeaways().map((takeaway, index) => (
                      <li key={index} className="flex items-start text-sm gap-2">
                        <span className="text-primary mt-0.5">•</span>
                        <span>{takeaway}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </TabsContent>
            
            {/* Key Metrics Tab */}
            <TabsContent value="metrics" className="py-4">
              <div className="space-y-3">
                {coreMetrics.map((metric, index) => (
                  <div key={index} className="flex flex-col">
                    <div className="flex justify-between mb-1 items-center">
                      <div className="flex items-center gap-1">
                        <span className="font-medium text-sm">{metric.name}:</span>
                        <span className="text-sm">{metric.value}</span>
                      </div>
                      <Badge variant={metric.achieved ? "success" : "destructive"} className="text-xs">
                        Target: {metric.target}
                      </Badge>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-2 ${metric.color}`} 
                        style={{ width: `${metric.name === "Crime Rate" ? 100 - metric.percentage : metric.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}

                {/* District comparison */}
                <div className="mt-6 pt-2 border-t">
                  <h3 className="text-base font-medium mb-3">District Comparison</h3>
                  <div className="space-y-2">
                    <div className="grid grid-cols-5 gap-2 mb-1">
                      <div className="text-xs font-medium">District</div>
                      <div className="text-xs font-medium text-center">Trust</div>
                      <div className="text-xs font-medium text-center">Crimes</div>
                      <div className="text-xs font-medium text-center">False Arrests</div>
                      <div className="text-xs font-medium text-center">Population</div>
                    </div>
                    
                    {["district1", "district2", "district3", "district4"].map((district, idx) => (
                      <div key={idx} className="grid grid-cols-5 gap-2 p-2 bg-muted rounded-md">
                        <div className="text-xs font-medium">
                          {district === "district1" ? "Downtown" :
                           district === "district2" ? "Westside" :
                           district === "district3" ? "South Side" : "Eastside"}
                        </div>
                        <div className={`text-xs text-center ${metrics.communityTrust[district] >= 60 ? "text-green-600" : "text-red-600"}`}>
                          {metrics.communityTrust[district]}%
                        </div>
                        <div className={`text-xs text-center ${metrics.crimesReported[district] <= 40 ? "text-green-600" : "text-red-600"}`}>
                          {metrics.crimesReported[district]}
                        </div>
                        <div className={`text-xs text-center ${metrics.falseArrestRate[district] <= 15 ? "text-green-600" : "text-red-600"}`}>
                          {metrics.falseArrestRate[district]}%
                        </div>
                        <div className="text-xs text-center">
                          {metrics.population[district].toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Key Lessons Tab */}
            <TabsContent value="lessons" className="py-4">
              <div className="space-y-4">
                <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 p-4 rounded-md">
                  <h3 className="font-medium mb-2 text-blue-800 dark:text-blue-300">What This Simulation Teaches</h3>
                  <ul className="space-y-2">
                    <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                      <span>•</span>
                      <span>Balancing enforcement with community trust is essential for effective policing</span>
                    </li>
                    <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                      <span>•</span>
                      <span>Resource allocation across different communities affects both safety and equity outcomes</span>
                    </li>
                    <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                      <span>•</span>
                      <span>Technology and community engagement policies have varying effects in different neighborhoods</span>
                    </li>
                    <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                      <span>•</span>
                      <span>Budget constraints require careful prioritization of resources</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-muted p-4 rounded-md">
                  <h3 className="font-medium mb-2">Your Approach</h3>
                  <ScrollArea className="h-40">
                    <div className="space-y-2 pr-4">
                      {gameLog.slice(0, 5).map((entry, idx) => (
                        <div key={idx} className="text-xs">
                          <span className="font-medium">Round {entry.round}:</span> {
                            entry.action ? 
                              Array.isArray(entry.action) ? 
                                `Implemented ${entry.action[0]?.type || "action"} in ${entry.action[0]?.districtName || "district"}` : 
                                `Implemented ${entry.action?.type || "action"} in ${entry.action?.districtName || "district"}` : 
                              "No specific action taken"
                          }
                        </div>
                      ))}
                      {gameLog.length > 5 && <div className="text-xs italic">...and {gameLog.length - 5} more rounds</div>}
                    </div>
                  </ScrollArea>
                </div>
                
                <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 p-4 rounded-md">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                    <div>
                      <h3 className="font-medium mb-1">Learning Opportunity</h3>
                      <p className="text-sm">
                        This simulation simplifies complex social issues but illustrates important trade-offs in policing. 
                        Real-world policing involves many more variables and deeply embedded social factors.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter className="flex justify-center pt-0">
          <Button size="sm" onClick={onReset}>
            {gameEndReason === "bankrupt" ? "Try Again" : "Restart Simulation"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

