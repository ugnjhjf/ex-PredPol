"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, TrendingUp, TrendingDown } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"

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

// Reusable district metric component
const DistrictMetric = ({ 
    title, 
    value, 
    change = 0, 
    tooltipText, 
    unit = "", 
    isPositiveGood = true,
    children
  }) => {
    return (
      <div className="bg-muted/30 p-1.5 rounded-md">
        <div className="flex items-center justify-between mb-0.5">
          <div className="flex items-center gap-0.5">
            <span className="font-medium text-xs">{title}</span>
          </div>
        </div>
        <div className="flex items-center">
          <span className="font-semibold text-sm flex items-center">
            {value}{unit}
            {change !== 0 && (
              <span 
                className={`flex items-center text-[10px] ml-2 ${
                  (change > 0 && isPositiveGood) || (change < 0 && !isPositiveGood)
                    ? "text-green-600 dark:text-green-400" 
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {(change > 0 && isPositiveGood) || (change < 0 && !isPositiveGood)
                  ? <TrendingUp className="h-2.5 w-2.5 mr-0.5" />
                  : <TrendingDown className="h-2.5 w-2.5 mr-0.5" />
                }
                {change > 0 ? "+" : ""}
                {change}{unit === "%" ? "%" : ""}
              </span>
            )}
          </span>
        </div>
        {children}
      </div>
    );
  };

export function RoundSummary({ currentRound, gameMetrics, policeAllocation, roundSummary, getDistrictName, gameLog }) {
  // Style constants to match action screen
  const districtEmojis = {
    district1: "🏙️",
    district2: "🏘️",
    district3: "🏚️",
    district4: "🏫",
  }

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

  const getTrustColor = (trust) => {
    if (trust >= 70) return "text-green-600 dark:text-green-400"
    if (trust >= 40) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }

  const getCrimeColor = (crime) => {
    if (crime <= 0) return "text-green-600 dark:text-green-400"
    return "text-red-600 dark:text-red-400"
  }

  return (
    <div className="p-3 space-y-4 h-full overflow-auto">
      {/* Round title - make consistent with menu item font size */}
      <div>
        <h2 className="text-base font-bold">Round {currentRound} Summary</h2>
        <p className="text-xs text-muted-foreground">Review the results of your decisions</p>
      </div>

      {/* Budget section */}
      {roundSummary.budget && (
        <Card className="border border-primary/20">
          <CardHeader className="bg-primary/5 py-1.5 px-3">
            <CardTitle className="text-xs">Budget Summary</CardTitle>
          </CardHeader>
          <CardContent className="py-2 px-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-xs">Previous Budget:</span>
                  <span className="font-medium text-xs">${roundSummary.budget.previous}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs">Income:</span>
                  <span className="font-medium text-green-600 dark:text-green-400 text-xs">+${roundSummary.budget.income}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs">Expenses:</span>
                  <span className="font-medium text-red-600 dark:text-red-400 text-xs">-${roundSummary.budget.expenses}</span>
                </div>
                <div className="border-t pt-1.5 mt-1.5 flex justify-between items-center">
                  <span className="font-bold text-xs">Current Budget:</span>
                  <span className="font-bold text-xs">${roundSummary.budget.current}</span>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-xs mb-1.5">Budget Details</h4>
                <ScrollArea className="h-[90px] border rounded-md p-1.5">
                  <ul className="space-y-1 text-xs">
                    {roundSummary.budget.details.map((detail, index) => (
                      <li key={index}>{detail}</li>
                    ))}
                  </ul>
                </ScrollArea>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Police allocation section */}
      <div>
        <h3 className="text-xs font-semibold mb-2">Police Allocation</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {Object.keys(policeAllocation).filter(key => key !== "unallocated").map((district) => (
            <Card key={district} className={`border ${districtColors[district]}`}>
              <CardHeader className={`py-1 px-2 ${districtHeaderColors[district]}`}>
                <div className="flex items-center gap-1.5">
                  <div className="text-base">{districtEmojis[district]}</div>
                  <CardTitle className="text-xs">{getDistrictName(district)}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="py-2 px-3">
                <div className="flex justify-between text-xs">
                  <span>Day Shift:</span>
                  <span className="font-medium">{policeAllocation[district].day} 👮</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Night Shift:</span>
                  <span className="font-medium">{policeAllocation[district].night} 👮</span>
                </div>
                <div className="flex justify-between pt-1 mt-1 border-t text-xs">
                  <span>Total:</span>
                  <span className="font-bold">{policeAllocation[district].day + policeAllocation[district].night} 👮</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* District Metric Changes */}
      <div>
        <h3 className="text-xs font-semibold mb-2">Metric Changes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
          {Object.keys(roundSummary.metricChanges).map((district) => (
            <Card key={district} className={`border ${districtColors[district]}`}>
              <CardHeader className={`py-1 px-2 ${districtHeaderColors[district]}`}>
                <div className="flex items-center gap-1.5">
                  <div className="text-base">{districtEmojis[district]}</div>
                  <CardTitle className="text-xs">{getDistrictName(district)}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="py-2 px-3 space-y-1.5">
                {/* Trust Changes */}
                <div className="flex justify-between items-center">
                  <span className="text-xs">Community Trust:</span>
                  <div className="flex items-center gap-1">
                    {roundSummary.metricChanges[district].trust !== 0 && (
                      roundSummary.metricChanges[district].trust > 0 ? (
                        <TrendingUp className="h-3 w-3 text-green-600 dark:text-green-400" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-600 dark:text-red-400" />
                      )
                    )}
                    <span className={`font-medium text-xs ${
                      roundSummary.metricChanges[district].trust > 0 ? "text-green-600 dark:text-green-400" : 
                      roundSummary.metricChanges[district].trust < 0 ? "text-red-600 dark:text-red-400" : ""
                    }`}>
                      {roundSummary.metricChanges[district].trust > 0 ? "+" : ""}
                      {roundSummary.metricChanges[district].trust}%
                    </span>
                  </div>
                </div>

                {/* Crime Changes */}
                <div className="flex justify-between items-center">
                  <span className="text-xs">Crimes Reported:</span>
                  <div className="flex items-center gap-1">
                    {roundSummary.metricChanges[district].crimes !== 0 && (
                      roundSummary.metricChanges[district].crimes < 0 ? (
                        <TrendingDown className="h-3 w-3 text-green-600 dark:text-green-400" />
                      ) : (
                        <TrendingUp className="h-3 w-3 text-red-600 dark:text-red-400" />
                      )
                    )}
                    <span className={`font-medium text-xs ${
                      roundSummary.metricChanges[district].crimes < 0 ? "text-green-600 dark:text-green-400" : 
                      roundSummary.metricChanges[district].crimes > 0 ? "text-red-600 dark:text-red-400" : ""
                    }`}>
                      {roundSummary.metricChanges[district].crimes > 0 ? "+" : ""}
                      {roundSummary.metricChanges[district].crimes}
                    </span>
                  </div>
                </div>

                {/* False Arrest Changes */}
                <div className="flex justify-between items-center">
                  <span className="text-xs">False Arrest Rate:</span>
                  <div className="flex items-center gap-1">
                    {roundSummary.metricChanges[district].falseArrest !== 0 && (
                      roundSummary.metricChanges[district].falseArrest < 0 ? (
                        <TrendingDown className="h-3 w-3 text-green-600 dark:text-green-400" />
                      ) : (
                        <TrendingUp className="h-3 w-3 text-red-600 dark:text-red-400" />
                      )
                    )}
                    <span className={`font-medium text-xs ${
                      roundSummary.metricChanges[district].falseArrest < 0 ? "text-green-600 dark:text-green-400" : 
                      roundSummary.metricChanges[district].falseArrest > 0 ? "text-red-600 dark:text-red-400" : ""
                    }`}>
                      {roundSummary.metricChanges[district].falseArrest > 0 ? "+" : ""}
                      {roundSummary.metricChanges[district].falseArrest}%
                    </span>
                  </div>
                </div>

                {/* Population Changes */}
                {typeof roundSummary.metricChanges[district].population !== 'undefined' && 
                roundSummary.metricChanges[district].population !== 0 && (
                  <div className="flex justify-between items-center border-t pt-1.5">
                    <span className="text-xs">Population:</span>
                    <div className="flex items-center gap-1">
                      {roundSummary.metricChanges[district].population > 0 ? (
                        <TrendingUp className="h-3 w-3 text-green-600 dark:text-green-400" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-600 dark:text-red-400" />
                      )}
                      <span className={`font-medium text-xs ${
                        roundSummary.metricChanges[district].population > 0 ? 
                        "text-green-600 dark:text-green-400" : 
                        "text-red-600 dark:text-red-400"
                      }`}>
                        {roundSummary.metricChanges[district].population > 0 ? "+" : ""}
                        {roundSummary.metricChanges[district].population.toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Action Effects - convert to bullet list */}
      <div>
        <h3 className="text-xs font-semibold mb-2">Round Events</h3>
        <Card className="border">
          <CardContent className="p-3">
            {roundSummary.changes && roundSummary.changes.length > 0 ? (
              <ScrollArea className="h-[160px]">
                <ul className="space-y-1.5 pr-2">
                  {roundSummary.changes.map((change, index) => (
                    <li key={index} className="text-xs flex items-start gap-1.5">
                      <span className="text-primary flex-shrink-0 mt-0.5">•</span>
                      <span>{change}</span>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            ) : (
              <p className="text-muted-foreground text-center text-xs">No significant changes occurred this round.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Analyst Feedback - convert to bullet list */}
      {roundSummary.feedback && (
        <div>
          <h3 className="text-xs font-semibold mb-2">Analyst Feedback</h3>
          <Card className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
            <CardContent className="p-3">
              <ul className="space-y-1.5">
                {roundSummary.feedback.split(". ")
                  .filter(item => item.trim()) // Filter out empty strings
                  .map((point, index) => (
                    <li key={index} className="text-xs flex items-start gap-1.5">
                      <span className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5">•</span>
                      <span className="text-blue-800 dark:text-blue-300">
                        {point.endsWith(".") ? point : `${point}.`}
                      </span>
                    </li>
                  ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Continue Button */}
      <div className="flex justify-center pt-2">
        <Button size="sm" onClick={() => {}}>
          Continue to Next Round
        </Button>
      </div>
    </div>
  )
}