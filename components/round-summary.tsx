"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CircleDollarSign, AlertTriangle, TrendingUp, TrendingDown, Info, Check, X } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Define district color constants for consistency
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

const districtEmojis = {
  district1: "🏙️",
  district2: "🏘️",
  district3: "🏚️",
  district4: "🏫",
}

export function RoundSummary({ currentRound, gameMetrics, policeAllocation, roundSummary, getDistrictName }) {
  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row justify-between items-start mb-4">
        <div>
          <h1 className="text-2xl font-bold">Round {currentRound} Summary</h1>
          <p className="text-muted-foreground">Review the outcomes of your decisions from the last round</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        
        {/* Special Events Alert */}
        {roundSummary.specialEvents && roundSummary.specialEvents.length > 0 && (
          <div className="col-span-full">
            <Card className="bg-muted/30">
              <CardHeader className="py-3">
                <CardTitle className="text-sm flex items-center">
                  <AlertTriangle className="mr-2 h-4 w-4 text-amber-600" />
                  Special Events
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3">
                {roundSummary.specialEvents.map((event, index) => (
                  <Alert 
                    key={index} 
                    variant="default" 
                    className={event.type === "positive" ? "border-green-500 bg-green-50 dark:bg-green-950" : "border-red-500 bg-red-50 dark:bg-red-950"}
                  >
                    <AlertTriangle className={`h-4 w-4 ${event.type === "positive" ? "text-green-500" : "text-red-500"}`} />
                    <AlertTitle>{event.title}</AlertTitle>
                    <AlertDescription>
                      {event.message}
                    </AlertDescription>
                  </Alert>
                ))}
              </CardContent>
            </Card>
          </div>
        )}
        
        {/* Budget panel - spanning full width */}
        <div className="col-span-full">
          <Card>
            <CardHeader className="py-3 bg-emerald-50 dark:bg-emerald-950 border-b border-emerald-100 dark:border-emerald-900">
              <CardTitle className="text-sm flex items-center">
                <CircleDollarSign className="mr-2 h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                Budget Report
              </CardTitle>
              <CardDescription className="text-xs">Round {currentRound - 1} financial summary</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
                {/* Budget numbers */}
                <div className="col-span-1 md:col-span-2 space-y-3">
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Previous Budget:</span>
                      <span className="font-medium">${roundSummary.budget?.previous}</span>
                    </div>
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                      <span>Income:</span>
                      <span>+${roundSummary.budget?.income}</span>
                    </div>
                    <div className="flex justify-between text-red-600 dark:text-red-400">
                      <span>Expenses:</span>
                      <span>-${roundSummary.budget?.expenses}</span>
                    </div>
                    <div className="flex justify-between pt-1 mt-1 border-t font-medium">
                      <span>Current Budget:</span>
                      <span>${roundSummary.budget?.current}</span>
                    </div>
                  </div>
                  
                  <div className={`${
                    roundSummary.budget?.income - roundSummary.budget?.expenses >= 0 
                    ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950 dark:border-emerald-800' 
                    : 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800'
                  } border p-2 rounded-md`}>
                    <div className="flex items-center gap-2">
                      {roundSummary.budget?.income - roundSummary.budget?.expenses >= 0 ? (
                        <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />  
                      )}
                      <span className="text-sm font-medium">
                        {roundSummary.budget?.income - roundSummary.budget?.expenses >= 0 ? 'Budget Surplus' : 'Budget Deficit'}:
                        <span className={`ml-1 ${
                          roundSummary.budget?.income - roundSummary.budget?.expenses >= 0 
                          ? 'text-emerald-600 dark:text-emerald-400' 
                          : 'text-red-600 dark:text-red-400'
                        }`}>
                          {roundSummary.budget?.income - roundSummary.budget?.expenses >= 0 ? '+' : ''}
                          ${Math.abs(roundSummary.budget?.income - roundSummary.budget?.expenses)}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Budget details */}
                <div className="col-span-1 md:col-span-3">
                  <h4 className="text-sm font-medium mb-2">Budget Breakdown</h4>
                  <div className="bg-muted p-2 rounded-md max-h-32 overflow-y-auto text-xs">
                    <ul className="space-y-1">
                      {roundSummary.budget?.details?.map((item, idx) => (
                        <li key={idx} className="flex items-center">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary mr-1.5 flex-shrink-0"></span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Combined district metrics and police allocation - 3 columns wide */}
        <div className="col-span-3">
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm">District Performance & Allocation</CardTitle>
              <CardDescription className="text-xs">
                Changes in metrics and police assignments for each district
              </CardDescription>
            </CardHeader>
            <CardContent className="py-2">
              <div className="grid grid-cols-2 gap-3">
                {["district1", "district2", "district3", "district4"].map((district) => (
                  <div key={district} className={`p-3 rounded-lg border ${districtColors[district]}`}>
                    <div className={`-mx-3 -mt-3 mb-2 px-3 py-1.5 rounded-t-lg ${districtHeaderColors[district]}`}>
                      <h3 className="font-medium text-xs flex items-center">
                        <span className="text-base mr-1">{districtEmojis[district]}</span>
                        {getDistrictName(district)}
                      </h3>
                    </div>
                    
                    {/* Combined metrics and allocation in a grid */}
                    <div className="grid grid-cols-3 gap-x-3">
                      {/* Metrics Column */}
                      <div className="col-span-2 space-y-2 pr-2 border-r">
                        {/* Population (NEW) */}
                        <div className="space-y-0.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs">Population</span>
                            <div className="flex items-center gap-1">
                              <span className="text-xs font-medium">
                                {gameMetrics.population[district].toLocaleString()}
                              </span>
                              {roundSummary.metricChanges?.[district]?.population !== undefined && 
                               roundSummary.metricChanges?.[district]?.population !== 0 && (
                                <Badge 
                                  variant={roundSummary.metricChanges[district].population > 0 ? "success" : "destructive"}
                                  className="px-1 h-4 text-[10px]"
                                >
                                  {roundSummary.metricChanges[district].population > 0 ? '+' : ''}
                                  {roundSummary.metricChanges[district].population.toLocaleString()}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {/* Crimes */}
                        <div className="space-y-0.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs">Crimes Reported</span>
                            <div className="flex items-center gap-1">
                              <span className={`text-xs font-medium ${gameMetrics.crimesReported[district] > 80 ? 'text-red-600' : 
                                            gameMetrics.crimesReported[district] > 40 ? 'text-yellow-600' : 
                                            'text-green-600'}`}>
                                {gameMetrics.crimesReported[district]}
                              </span>
                              {roundSummary.metricChanges?.[district]?.crimes !== undefined && 
                               roundSummary.metricChanges?.[district]?.crimes !== 0 && (
                                <Badge 
                                  variant={roundSummary.metricChanges[district].crimes < 0 ? "success" : "destructive"}
                                  className="px-1 h-4 text-[10px]"
                                >
                                  {roundSummary.metricChanges[district].crimes > 0 ? '+' : ''}
                                  {roundSummary.metricChanges[district].crimes}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {/* Suspect Arrests (NEW) */}
                        <div className="space-y-0.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs">Suspects Arrested</span>
                            <div className="flex items-center gap-1">
                              <span className={`text-xs font-medium`}>
                                {gameMetrics.arrests?.[district] || 0}
                                {gameMetrics.crimesReported?.[district] ? 
                                  ` (${Math.round((gameMetrics.arrests[district] / gameMetrics.crimesReported[district]) * 100)}%)` : ''}
                              </span>
                              {roundSummary.metricChanges?.[district]?.arrests !== undefined &&
                               roundSummary.metricChanges?.[district]?.arrests !== 0 && (
                                <Badge 
                                  variant={roundSummary.metricChanges[district].arrests > 0 ? "success" : "destructive"}
                                  className="px-1 h-4 text-[10px]"
                                >
                                  {roundSummary.metricChanges[district].arrests > 0 ? '+' : ''}
                                  {roundSummary.metricChanges[district].arrests}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {/* False Arrests */}
                        <div className="space-y-0.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs">False Arrests</span>
                            <div className="flex items-center gap-1">
                              <span className={`text-xs font-medium ${gameMetrics.falseArrestRate[district] > 20 ? 'text-red-600' : 
                                            gameMetrics.falseArrestRate[district] > 10 ? 'text-yellow-600' : 
                                            'text-green-600'}`}>
                                {gameMetrics.falseArrestRate[district]}%
                              </span>
                              {roundSummary.metricChanges?.[district]?.falseArrest !== undefined &&
                               roundSummary.metricChanges?.[district]?.falseArrest !== 0 && (
                                <Badge 
                                  variant={roundSummary.metricChanges[district].falseArrest < 0 ? "success" : "destructive"}
                                  className="px-1 h-4 text-[10px]"
                                >
                                  {roundSummary.metricChanges[district].falseArrest > 0 ? '+' : ''}
                                  {roundSummary.metricChanges[district].falseArrest}%
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        
                      </div>
                      
                      {/* Police Allocation Column */}
                      <div className="col-span-1">
                        <p className="text-xs font-medium mb-1.5">Police</p>
                        <div className="space-y-2">
                          {/* Day Shift */}
                          <div>
                            <div className="flex justify-between items-center">
                              <span className="text-[10px]">☀️ Day</span>
                              <span className="text-xs font-medium">
                                {policeAllocation[district].day}
                              </span>
                            </div>
                            <div className="mt-1 w-full bg-muted h-1.5 rounded-full">
                              <div 
                                style={{width: `${policeAllocation[district].day * 10}%`}}
                                className={`${district === "district1" ? "bg-blue-400" : 
                                            district === "district2" ? "bg-green-400" : 
                                            district === "district3" ? "bg-amber-400" : 
                                            "bg-purple-400"} h-1.5 rounded-full`}
                              ></div>
                            </div>
                          </div>
                          
                          {/* Night Shift */}
                          <div>
                            <div className="flex justify-between items-center">
                              <span className="text-[10px]">🌙 Night</span>
                              <span className="text-xs font-medium">
                                {policeAllocation[district].night}
                              </span>
                            </div>
                            <div className="mt-1 w-full bg-muted h-1.5 rounded-full">
                              <div 
                                style={{width: `${policeAllocation[district].night * 10}%`}}
                                className={`${district === "district1" ? "bg-blue-500" : 
                                            district === "district2" ? "bg-green-500" : 
                                            district === "district3" ? "bg-amber-500" : 
                                            "bg-purple-500"} h-1.5 rounded-full`}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right sidebar with changes and feedback - 1 column wide */}
        <div className="col-span-1">
          <div className="space-y-4">
            {/* Round Changes */}
            <Card>
              <CardHeader className="py-2 px-3">
                <CardTitle className="text-sm">Round Changes</CardTitle>
              </CardHeader>
              <CardContent className="px-3 py-2 max-h-[200px] overflow-y-auto">
                <ul className="space-y-1.5">
                  {roundSummary.changes?.map((change, idx) => (
                    <li key={idx} className="text-xs flex items-start gap-1">
                      <span className="text-primary mt-0.5">•</span>
                      <span>{change}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            {/* Analyst Feedback */}
            <Card className="bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800">
              <CardHeader className="py-2 px-3">
                <CardTitle className="text-sm text-blue-800 dark:text-blue-300 flex items-center">
                  <Info className="mr-2 h-4 w-4 text-blue-600 dark:text-blue-400" />
                  Analyst Feedback
                </CardTitle>
              </CardHeader>
              <CardContent className="px-3 py-2 max-h-[230px] overflow-y-auto">
                <div className="space-y-1.5">
                  {roundSummary.feedback?.split('. ')
                    .filter(item => item.trim().length > 0)
                    .map((point, idx) => (
                    <p key={idx} className="text-xs flex items-start gap-1 text-blue-800 dark:text-blue-300">
                      <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                      <span>
                        {point.trim()}{!point.endsWith('.') ? '.' : ''}
                      </span>
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      
    </div>
  )
}