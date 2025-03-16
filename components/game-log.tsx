import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown, AlertCircle, ChevronRight, ChevronDown, Clock, Check } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

// District styling variables for consistency with round-summary
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

export default function GameLog({ gameLog, getDistrictName, currentRound }) {
  // Add state to track which rounds are expanded
  const [expandedRounds, setExpandedRounds] = useState({})

  // Toggle expanded state for a round
  const toggleRoundExpansion = (round) => {
    setExpandedRounds(prev => ({
      ...prev,
      [round]: !prev[round]
    }))
  }

  // Enhanced getActionName function to properly translate action IDs to human-readable names
  const getActionName = (actionType) => {
    const actions = {
      cctv: "CCTV Surveillance",
      app: "Crime Reporting App",
      education: "Public Education",
      drone: "Drone Surveillance",
      facial: "Facial Recognition"
    }
    return actions[actionType] || actionType;
  }

  // Helper to determine if a change is good or bad
  const isPositiveChange = (metricType, value) => {
    switch(metricType) {
      case 'communityTrust':
        return value > 0;
      case 'crimesReported':
        return value < 0;
      case 'falseArrestRate':
        return value < 0;
      default:
        return false;
    }
  }

  // Format change values with sign and styling - using same style as round summary
  const formatChange = (value, isPositive) => {
    const displayValue = Math.abs(value)
    if (value === 0) return null
    
    const Icon = isPositive ? TrendingUp : TrendingDown
    const colorClass = isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
    
    return (
      <span className={`ml-1 text-xs flex items-center ${colorClass}`}>
        {value > 0 ? '+' : ''}
        {value}
        <Icon className="h-3 w-3 ml-0.5" />
      </span>
    )
  }

  // No data message if game just started
  if (gameLog.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center p-8">
          <h3 className="font-semibold text-xl mb-2">No History Yet</h3>
          <p className="text-muted-foreground">Complete at least one round to see your decisions and outcomes.</p>
        </div>
      </div>
    );
  }

  // Helpers for color styling - using same style as round summary
  const getTrustColor = (trust) => {
    if (trust >= 70) return "text-green-600 dark:text-green-400"
    if (trust >= 40) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }

  const getCrimeColor = (crime) => {
    if (crime <= 30) return "text-green-600 dark:text-green-400"
    if (crime <= 60) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }

  const getFalseArrestColor = (rate) => {
    if (rate <= 10) return "text-green-600 dark:text-green-400"
    if (rate <= 20) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }

  // Get bar color for metrics - matching round summary style
  const getBarColor = (metric, value) => {
    switch(metric) {
      case 'trust':
        return value >= 70 ? "bg-green-500" : value >= 40 ? "bg-yellow-500" : "bg-red-500";
      case 'crime':
        return value <= 30 ? "bg-green-500" : value <= 60 ? "bg-yellow-500" : "bg-red-500";
      case 'falseArrest':
        return value <= 10 ? "bg-green-500" : value <= 20 ? "bg-yellow-500" : "bg-red-500";
      default:
        return "bg-gray-500";
    }
  }

  return (
    <div className="p-4">
      <Card>
        <CardHeader className="py-3 border-b bg-primary/5">
          <CardTitle className="flex items-center text-sm">
            <Clock className="mr-2 h-4 w-4" /> 
            Round History
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-3">
          <ScrollArea className="h-[calc(80vh-220px)]">
            <div className="space-y-2">
              {gameLog.map((entry, index) => (
                <Card 
                  key={index} 
                  className={`overflow-hidden border ${currentRound === entry.round + 1 ? 'border-primary/50 shadow-sm' : 'border-border/50'}`}
                >
                  {/* Round header with toggle */}
                  <div 
                    className={`flex items-center justify-between p-2.5 cursor-pointer hover:bg-muted/50 ${expandedRounds[entry.round] ? 'bg-muted/30' : ''}`}
                    onClick={() => toggleRoundExpansion(entry.round)}
                  >
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline" className="px-2 py-0.5 text-xs">
                        Round {entry.round}
                      </Badge>
                      
                      {/* Show action taken - Fix the display of actions */}
                      {entry.action ? (
                        Array.isArray(entry.action) ? (
                          <Badge variant="secondary" className="px-2 py-0.5 text-xs">
                            {getActionName(entry.action[0].type)} in {entry.action[0].districtName}
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="px-2 py-0.5 text-xs">
                            {getActionName(entry.action.type)} in {entry.action.districtName}
                          </Badge>
                        )
                      ) : (
                        <Badge variant="outline" className="px-2 py-0.5 text-xs bg-muted">
                          No Action Taken
                        </Badge>
                      )}
                    </div>
                    
                    {/* Budget summary */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center text-xs">
                        <span className="text-muted-foreground">Budget:</span>
                        <span className="font-medium ml-1">${entry.budget?.current}</span>
                        <span className={`ml-1 ${entry.budget?.income - entry.budget?.expenses >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          ({entry.budget?.income - entry.budget?.expenses >= 0 ? '+' : ''}${entry.budget?.income - entry.budget?.expenses})
                        </span>
                      </div>
                      
                      {/* Toggle icon */}
                      {expandedRounds[entry.round] ? (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                  
                  {/* Expanded content */}
                  {expandedRounds[entry.round] && (
                    <div className="p-3 pt-0 border-t">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                        {/* Key metrics summary */}
                        <div className="col-span-1 space-y-3">
                          {/* Special events if any */}
                          {entry.specialEvents && entry.specialEvents.length > 0 && (
                            <div>
                              <h4 className="text-xs font-medium mb-1.5">Special Events</h4>
                              <div className="space-y-1.5">
                                {entry.specialEvents.map((event, idx) => (
                                  <div 
                                    key={idx}
                                    className={`text-xs p-2 rounded ${
                                      event.type === 'positive' ? 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800 border' :
                                      'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800 border'
                                    }`}
                                  >
                                    <div className="font-medium">{event.title}</div>
                                    <div>{event.message}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* Budget details - style matching round summary */}
                          <div>
                            <h4 className="text-xs font-medium mb-1.5">Budget Details</h4>
                            <div className="bg-muted/30 p-2 rounded-md text-xs">
                              <div className="flex justify-between mb-0.5">
                                <span>Previous Budget:</span>
                                <span className="font-medium">${entry.budget?.previous}</span>
                              </div>
                              <div className="flex justify-between mb-0.5 text-green-600 dark:text-green-400">
                                <span>Income:</span>
                                <span>+${entry.budget?.income}</span>
                              </div>
                              <div className="flex justify-between mb-0.5 text-red-600 dark:text-red-400">
                                <span>Expenses:</span>
                                <span>-${entry.budget?.expenses}</span>
                              </div>
                              <div className="flex justify-between pt-1.5 mt-1 border-t font-medium">
                                <span>Current Budget:</span>
                                <span>${entry.budget?.current}</span>
                              </div>
                            </div>
                          </div>

                          {/* Police allocation using district styling scheme */}
                          <div>
                            <h4 className="text-xs font-medium mb-1.5">Police Allocation</h4>
                            <div className="grid grid-cols-2 gap-1.5">
                              {["district1", "district2", "district3", "district4"].map((district) => (
                                <div key={district} className={`p-1.5 rounded text-xs ${districtColors[district]}`}>
                                  <div className="font-medium truncate flex items-center">
                                    <span className="mr-1">{districtEmojis[district]}</span>
                                    {getDistrictName(district)}
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Day: {entry.policeAllocation[district].day}</span>
                                    <span>Night: {entry.policeAllocation[district].night}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        {/* District metrics - two-column grid for all districts */}
                        <div className="col-span-2">
                          <h4 className="text-xs font-medium mb-1.5">District Metrics</h4>
                          <div className="grid grid-cols-2 gap-1.5">
                            {["district1", "district2", "district3", "district4"].map((district) => (
                              <div key={district} className={`p-2 rounded-md border ${districtColors[district]}`}>
                                <div className="font-medium text-xs mb-2 flex items-center">
                                  <span className="text-base mr-1">{districtEmojis[district]}</span>
                                  {getDistrictName(district)}
                                </div>
                                
                                {/* Metrics in a compact grid matching summary styling */}
                                <div className="grid grid-cols-2 gap-2 text-[10px]">
                                  {/* Trust */}
                                  <div className="space-y-1">
                                    <div className="flex justify-between items-center">
                                      <span>Trust:</span>
                                      <div className="flex items-center">
                                        <span className={`font-medium ${getTrustColor(entry.metrics.communityTrust[district])}`}>
                                          {entry.metrics.communityTrust[district]}%
                                        </span>
                                        {entry.metricChanges?.communityTrust && 
                                          formatChange(
                                            entry.metricChanges.communityTrust[district],
                                            isPositiveChange('communityTrust', entry.metricChanges.communityTrust[district])
                                          )
                                        }
                                      </div>
                                    </div>
                                    <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                                      <div 
                                        className={getBarColor('trust', entry.metrics.communityTrust[district])} 
                                        style={{ width: `${entry.metrics.communityTrust[district]}%`, height: '100%' }}
                                      ></div>
                                    </div>
                                  </div>
                                  
                                  {/* Crime */}
                                  <div className="space-y-1">
                                    <div className="flex justify-between items-center">
                                      <span>Crimes:</span>
                                      <div className="flex items-center">
                                        <span className={`font-medium ${getCrimeColor(Math.min(100, entry.metrics.crimesReported[district]/5))}`}>
                                          {entry.metrics.crimesReported[district]}
                                        </span>
                                        {entry.metricChanges?.crimesReported && 
                                          formatChange(
                                            entry.metricChanges.crimesReported[district],
                                            isPositiveChange('crimesReported', entry.metricChanges.crimesReported[district])
                                          )
                                        }
                                      </div>
                                    </div>
                                    <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                                      <div 
                                        className={getBarColor('crime', Math.min(100, entry.metrics.crimesReported[district]/5))} 
                                        style={{ width: `${Math.min(100, entry.metrics.crimesReported[district]/3)}%`, height: '100%' }}
                                      ></div>
                                    </div>
                                  </div>
                                  
                                  {/* False Arrests */}
                                  <div className="space-y-1">
                                    <div className="flex justify-between items-center">
                                      <span>False Arrests:</span>
                                      <div className="flex items-center">
                                        <span className={`font-medium ${getFalseArrestColor(entry.metrics.falseArrestRate[district])}`}>
                                          {entry.metrics.falseArrestRate[district]}%
                                        </span>
                                        {entry.metricChanges?.falseArrestRate && 
                                          formatChange(
                                            entry.metricChanges.falseArrestRate[district],
                                            isPositiveChange('falseArrestRate', entry.metricChanges.falseArrestRate[district])
                                          )
                                        }
                                      </div>
                                    </div>
                                    <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                                      <div 
                                        className={getBarColor('falseArrest', entry.metrics.falseArrestRate[district])} 
                                        style={{ width: `${entry.metrics.falseArrestRate[district] * 2}%`, height: '100%' }}
                                      ></div>
                                    </div>
                                  </div>
                                  
                                  {/* Population */}
                                  <div>
                                    <div className="flex justify-between items-center">
                                      <span>Population:</span>
                                      <div className="flex items-center">
                                        <span className="font-medium">{entry.population?.[district]?.toLocaleString()}</span>
                                        {entry.metricChanges?.[district]?.population && entry.metricChanges[district].population !== 0 && (
                                          <span className={`text-xs ml-1 ${entry.metricChanges[district].population > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                            {entry.metricChanges[district].population > 0 ? '+' : ''}
                                            {entry.metricChanges[district].population.toLocaleString()}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          {/* Round events/changes - styled like round summary with bullet points */}
                          {entry.changes && entry.changes.length > 0 && (
                            <div className="mt-3">
                              <h4 className="text-xs font-medium mb-1.5">Round Events</h4>
                              <div className="space-y-1 text-[10px] bg-muted/30 p-2 rounded-md max-h-28 overflow-auto">
                                {entry.changes.map((change, idx) => (
                                  <div key={idx} className="flex items-start gap-1.5">
                                    <span className="text-primary flex-shrink-0 mt-0.5">•</span>
                                    <span>{change}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Analyst feedback using blue styling from round summary */}
                      {entry.feedback && (
                        <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 p-3 rounded-md text-xs">
                          <h4 className="font-medium mb-2 text-blue-800 dark:text-blue-300">Analyst Feedback</h4>
                          <ul className="space-y-1.5">
                            {entry.feedback.split('. ').filter(item => item.trim()).map((point, idx) => (
                              <li key={idx} className="flex items-start gap-1.5">
                                <span className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5">•</span>
                                <span className="text-blue-800 dark:text-blue-300">
                                  {point.trim()}{!point.endsWith('.') ? '.' : ''}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              ))}

              {gameLog.length < currentRound - 1 && (
                <div className="text-center py-4 text-muted-foreground text-sm">
                  End of round history. Complete the current round to see more results.
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
