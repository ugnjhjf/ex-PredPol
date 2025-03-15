import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown, AlertCircle } from "lucide-react"

export default function GameLog({ gameLog, getDistrictName, currentRound }) {
  const getActionName = (actionType) => {
    const actions = {
      cctv: "CCTV Surveillance",
      app: "Crime Reporting App",
      education: "Public Education",
      drone: "Drone Surveillance",
    }
    return actions[actionType] || "Unknown Action"
  }

  const getTrustColor = (trust) => {
    if (trust >= 70) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
    if (trust >= 40) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
  }

  const getCrimeColor = (crime) => {
    if (crime <= 30) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
    if (crime <= 60) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
  }

  const getFalseArrestColor = (rate) => {
    if (rate <= 10) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
    if (rate <= 20) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
  }

  // Add helper function to determine if a change is good or bad
  const isPositiveChange = (metricType, value) => {
    switch(metricType) {
      case 'communityTrust':
        return value > 0;
      case 'crimesReported': // Changed from crimeRate
        return value < 0;
      case 'falseArrestRate':
        return value < 0;
      default:
        return false;
    }
  };

  // Add district styling variables
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

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>Round History</CardTitle> {/* Changed from "Game History" to "Round History" */}
        </CardHeader>
        <CardContent>
          {gameLog.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No history yet. Complete your first round to see your decisions and outcomes.
            </div>
          ) : (
            <ScrollArea className="h-[calc(80vh-220px)]">
              <div className="space-y-6 pr-4">
                {gameLog.map((entry, index) => (
                  <div key={index} className="border rounded-md p-4">
                    <div className="flex justify-between items-center mb-4">
                      <Badge variant="outline" className="px-2 py-1">
                        Round {entry.round}
                      </Badge>
                      {entry.action ? (
                        <Badge variant="secondary" className="px-2 py-1">
                          {getActionName(entry.action.type)} in {entry.action.districtName}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="px-2 py-1 bg-muted">
                          No Action Taken
                        </Badge>
                      )}
                    </div>

                    {/* Show the effects and triggers */}
                    {entry.changes && entry.changes.length > 0 && (
                      <div className="mb-4">
                        <h3 className="font-medium mb-2">Effects & Triggers</h3>
                        <div className="space-y-1 text-sm bg-muted/30 p-3 rounded-md">
                          {entry.changes.map((change, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <div className="mt-0.5">
                                {change.includes("Crime rate -") || change.includes("Community trust +") || change.includes("False arrests -") ? (
                                  <TrendingDown className="h-4 w-4 text-green-600" />
                                ) : change.includes("Crime rate +") || change.includes("Community trust -") || change.includes("False arrests +") ? (
                                  <TrendingUp className="h-4 w-4 text-red-600" />
                                ) : (
                                  <AlertCircle className="h-4 w-4 text-amber-600" />
                                )}
                              </div>
                              <span>{change}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Add budget section to each entry */}
                    {entry.budget && (
                      <div className="mb-4">
                        <h3 className="font-medium mb-2">Budget Summary</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-muted/30 p-3 rounded-md">
                            <div className="flex justify-between items-center mb-1.5 text-sm">
                              <span>Previous Budget:</span>
                              <span className="font-medium">${entry.budget.previous}</span>
                            </div>
                            <div className="flex justify-between items-center mb-1.5 text-sm text-green-600">
                              <span>Income:</span>
                              <span className="font-medium">+${entry.budget.income}</span>
                            </div>
                            <div className="flex justify-between items-center mb-1.5 text-sm text-red-600">
                              <span>Expenses:</span>
                              <span className="font-medium">-${entry.budget.expenses}</span>
                            </div>
                            <div className="border-t pt-1.5 mt-1.5 flex justify-between items-center text-sm font-semibold">
                              <span>Current Budget:</span>
                              <span>${entry.budget.current}</span>
                            </div>
                          </div>
                          <div className="bg-muted/30 p-3 rounded-md">
                            <h4 className="text-sm font-medium mb-1.5">Budget Details</h4>
                            <ul className="space-y-0.5 text-xs">
                              {entry.budget.details.map((detail, index) => (
                                <li key={index} className={detail.includes('+') ? 'text-green-600' : 'text-red-600'}>
                                  {detail}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}

                    <h3 className="font-medium mb-2">Police Allocation</h3>
                    <div className="grid grid-cols-4 gap-2 mb-4">
                      {["district1", "district2", "district3", "district4"].map((district) => (
                        <div key={district} className="bg-muted p-2 rounded text-sm">
                          <div className="font-medium">{getDistrictName(district)}</div>
                          <div className="text-xs">
                            Day: {entry.policeAllocation[district].day} | Night: {entry.policeAllocation[district].night}
                          </div>
                        </div>
                      ))}
                    </div>

                    <h3 className="font-medium mb-2">District Metrics</h3>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      {["district1", "district2", "district3", "district4"].map((district) => (
                        <div key={district} className={`rounded text-sm border-2 ${districtColors[district]} overflow-hidden`}>
                          <div className={`font-medium p-2 ${districtHeaderColors[district]} flex items-center gap-1.5`}>
                            <span>{districtEmojis[district]}</span>
                            <span>{getDistrictName(district)}</span>
                          </div>
                          <div className="p-3">
                            <div className="grid grid-cols-2 gap-4">
                              {/* Left column: Trust and Crime metrics */}
                              <div className="space-y-3">
                                {/* Trust metric with bar */}
                                <div>
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs font-medium">Trust</span>
                                    <div className="flex items-center">
                                      <span className="text-sm font-semibold">{entry.metrics.communityTrust[district]}%</span>
                                      {entry.metricChanges && entry.metricChanges.communityTrust && (
                                        <span 
                                          className={`ml-1 text-xs flex items-center ${
                                            isPositiveChange('communityTrust', entry.metricChanges.communityTrust[district]) 
                                              ? "text-green-600 dark:text-green-400" 
                                              : "text-red-600 dark:text-red-400"
                                          }`}
                                        >
                                          {isPositiveChange('communityTrust', entry.metricChanges.communityTrust[district]) ? (
                                            <TrendingUp className="h-3 w-3 ml-0.5" />
                                          ) : (
                                            <TrendingDown className="h-3 w-3 ml-0.5" />
                                          )}
                                          {entry.metricChanges.communityTrust[district] > 0 ? '+' : ''}
                                          {entry.metricChanges.communityTrust[district]}%
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                                    <div 
                                      className={cn("h-full", getTrustColor(entry.metrics.communityTrust[district]))} 
                                      style={{ width: `${entry.metrics.communityTrust[district]}%` }}
                                    ></div>
                                  </div>
                                </div>

                                {/* Crime metric with bar */}
                                <div>
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs font-medium">Crimes</span>
                                    <div className="flex items-center">
                                      <span className="text-sm font-semibold">{entry.metrics.crimesReported[district]}</span>
                                      {entry.metricChanges && entry.metricChanges.crimesReported && (
                                        <span 
                                          className={`ml-1 text-xs flex items-center ${
                                            isPositiveChange('crimesReported', entry.metricChanges.crimesReported[district]) 
                                              ? "text-green-600 dark:text-green-400" 
                                              : "text-red-600 dark:text-red-400"
                                          }`}
                                        >
                                          {isPositiveChange('crimesReported', entry.metricChanges.crimesReported[district]) ? (
                                            <TrendingDown className="h-3 w-3 ml-0.5" />
                                          ) : (
                                            <TrendingUp className="h-3 w-3 ml-0.5" />
                                          )}
                                          {entry.metricChanges.crimesReported[district] > 0 ? '+' : ''}
                                          {entry.metricChanges.crimesReported[district]}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                                    <div 
                                      className={cn("h-full", getCrimeColor(entry.metrics.crimesReported[district]))} 
                                      style={{ width: `${Math.min(100, entry.metrics.crimesReported[district]/5)}%` }}
                                    ></div>
                                  </div>
                                </div>
                              </div>

                              {/* Right column: False Arrest and Clearance Rate */}
                              <div className="space-y-3">
                                {/* False Arrest metric with bar */}
                                <div>
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs font-medium">False Arrests</span>
                                    <div className="flex items-center">
                                      <span className="text-sm font-semibold">{entry.metrics.falseArrestRate[district]}%</span>
                                      {entry.metricChanges && entry.metricChanges.falseArrestRate && (
                                        <span 
                                          className={`ml-1 text-xs flex items-center ${
                                            isPositiveChange('falseArrestRate', entry.metricChanges.falseArrestRate[district]) 
                                              ? "text-green-600 dark:text-green-400" 
                                              : "text-red-600 dark:text-red-400"
                                          }`}
                                        >
                                          {isPositiveChange('falseArrestRate', entry.metricChanges.falseArrestRate[district]) ? (
                                            <TrendingDown className="h-3 w-3 ml-0.5" />
                                          ) : (
                                            <TrendingUp className="h-3 w-3 ml-0.5" />
                                          )}
                                          {entry.metricChanges.falseArrestRate[district] > 0 ? '+' : ''}
                                          {entry.metricChanges.falseArrestRate[district]}%
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                                    <div 
                                      className={cn("h-full", getFalseArrestColor(entry.metrics.falseArrestRate[district]))} 
                                      style={{ width: `${entry.metrics.falseArrestRate[district] * 2}%` }}
                                    ></div>
                                  </div>
                                </div>

                                {/* Add clearance rate calculation */}
                                <div>
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs font-medium">Clearance Rate</span>
                                    <span className="text-sm font-semibold">
                                      {Math.round((entry.metrics.arrests && entry.metrics.crimesReported && 
                                      entry.metrics.arrests[district] && entry.metrics.crimesReported[district]) ? 
                                      (entry.metrics.arrests[district] / entry.metrics.crimesReported[district]) * 100 : 0)}%
                                    </span>
                                  </div>
                                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                                    <div 
                                      className={`h-full ${
                                        (entry.metrics.arrests && entry.metrics.crimesReported &&
                                         entry.metrics.arrests[district] && entry.metrics.crimesReported[district] &&
                                         (entry.metrics.arrests[district] / entry.metrics.crimesReported[district]) * 100 >= 70) ? 
                                          "bg-green-500" : 
                                          (entry.metrics.arrests && entry.metrics.crimesReported &&
                                           entry.metrics.arrests[district] && entry.metrics.crimesReported[district] &&
                                           (entry.metrics.arrests[district] / entry.metrics.crimesReported[district]) * 100 >= 40) ? 
                                            "bg-yellow-500" : 
                                            "bg-blue-500"
                                      }`} 
                                      style={{ width: `${Math.min(100, (entry.metrics.arrests && entry.metrics.crimesReported &&
                                        entry.metrics.arrests[district] && entry.metrics.crimesReported[district]) ? 
                                        (entry.metrics.arrests[district] / entry.metrics.crimesReported[district]) * 100 : 0)}%` }}
                                    ></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Add population section */}
                    <h3 className="font-medium mb-2">District Population</h3>
                    <div className="grid grid-cols-4 gap-2 mb-4">
                      {["district1", "district2", "district3", "district4"].map((district) => (
                        <div key={district} className={`rounded-md text-sm ${districtColors[district]}`}>
                          <div className={`font-medium p-2 ${districtHeaderColors[district]}`}>
                            {getDistrictName(district)}
                          </div>
                          <div className="p-2">
                            <div className="font-medium">
                              {entry.population && entry.population[district] ? entry.population[district].toLocaleString() : 'N/A'}
                            </div>
                            {entry.metricChanges && entry.metricChanges[district] && 
                             entry.metricChanges[district].population !== undefined && 
                             entry.metricChanges[district].population !== 0 && (
                              <div className={`text-xs ${
                                entry.metricChanges[district].population > 0 ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {entry.metricChanges[district].population > 0 ? '+' : ''}
                                {entry.metricChanges[district].population.toLocaleString()}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {entry.feedback && (
                      <div className="bg-muted p-3 rounded-md text-sm">
                        <h3 className="font-medium mb-1">Analyst Feedback</h3>
                        <div className="space-y-1">
                          {entry.feedback.split('. ').filter(item => item.trim()).map((point, index) => (
                            <div key={index} className="flex items-start gap-2">
                              <AlertCircle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                              <span>{point.trim()}{!point.endsWith('.') ? '.' : ''}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {gameLog.length < currentRound - 1 && (
                  <div className="text-center py-4 text-muted-foreground text-sm">
                    End of round history. Complete the current round to see more results.
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
