"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, TrendingUp, TrendingDown, Users, ShieldCheck, AlertCircle, Building2, HeartPulse } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

// Keep existing district styling variables
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

// Define action emojis object
const actionEmojis = {
  cctv: "📹",
  app: "📱",
  education: "🎓",
  drone: "🚁",
  facial: "👤"
};

// Action effect descriptions
const actionEffectDescriptions = {
  cctv: "CCTV cameras improved crime detection but had varying effects on community trust based on local demographics.",
  app: "The crime reporting app facilitated anonymous tips, improving crime clearance rates where digital access was available.",
  education: "Community education programs improved trust and cooperation, particularly in areas with historical police tensions.",
  drone: "Drone surveillance increased crime detection capabilities but raised privacy concerns in some communities.",
  facial: "Facial recognition technology improved suspect identification but raised significant bias concerns in diverse communities."
};

export function RoundSummary({ currentRound, gameMetrics, roundSummary, getDistrictName, onContinue }) {
  // Skip rendering if no summary is provided
  if (!roundSummary) return null
  
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

  // Get bar color for metrics
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

  // Format change with arrow and color
  const formatChange = (value, isPositive) => {
    const displayValue = Math.abs(value)
    if (value === 0) return null
    
    const Icon = isPositive ? TrendingUp : TrendingDown
    const colorClass = isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
    
    return (
      <span className={`ml-1 text-[10px] flex items-center ${colorClass}`}>
        {value > 0 ? '+' : ''}
        {value}
        <Icon className="h-2.5 w-2.5 ml-0.5" />
      </span>
    )
  }

  // Handle special events visualization
  const getEventStyle = (event) => {
    switch(event.type) {
      case "positive":
        return "bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800";
      case "civil-rights":
      case "riot":
      case "negative":
        return "bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800";
      case "health-crisis":
      case "property-crash":
      case "population-exodus":
        return "bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800";
      default:
        return "bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800";
    }
  };
  
  // Extract implemented actions from the latest round
  const getImplementedActions = () => {
    const actions = [];
    
    // Check if we have actions in the roundSummary
    if (roundSummary.actions && Object.keys(roundSummary.actions).length > 0) {
      Object.entries(roundSummary.actions).forEach(([district, action]) => {
        if (action && action !== "") {
          actions.push({
            district,
            action,
            districtName: getDistrictName(district),
            emoji: actionEmojis[action] || "🔧",
            description: actionEffectDescriptions[action] || "This action was implemented in the district."
          });
        }
      });
    }
    
    return actions;
  };
  
  const implementedActions = getImplementedActions();

  return (
    <div className="p-3">
      <div className="mb-3 flex justify-between items-center">
        <h2 className="text-lg font-bold">Round {currentRound} Summary</h2>
      </div>

      {/* Layout with adjusted columns width */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Left column: Districts information - wider (8/12) */}
        <div className="md:col-span-8">
          {/* Implemented actions from last round */}
          {implementedActions.length > 0 && (
            <Card className="mb-3 border-primary/30 bg-primary/5">
              <CardHeader className="py-1.5 px-3">
                <CardTitle className="text-sm">Actions Implemented This Round</CardTitle>
              </CardHeader>
              <CardContent className="py-2 px-3">
                <div className="space-y-2">
                  {implementedActions.map((item, index) => (
                    <div key={index} className="flex items-start gap-1.5">
                      <div className="text-xl">{item.emoji}</div>
                      <div>
                        <h4 className="text-xs font-medium">{item.action.charAt(0).toUpperCase() + item.action.slice(1)} in {item.districtName}</h4>
                        <p className="text-[10px] text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* District cards with enhanced metrics display */}
            {["district1", "district2", "district3", "district4"].map((district) => (
              <Card 
                key={district} 
                className={`border ${districtColors[district]}`}
              >
                <CardHeader className={`py-1.5 px-3 ${districtHeaderColors[district]}`}>
                  <div className="flex items-center gap-1.5">
                    <div className="text-base">{districtEmojis[district]}</div>
                    <CardTitle className="text-sm">{getDistrictName(district)}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="py-2 px-3 space-y-2">
                  {/* Population metric with emoji */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <Popover>
                        <PopoverTrigger className="text-[10px] cursor-help">Population:</PopoverTrigger>
                        <PopoverContent className="w-60 p-2 text-xs">
                          Number of people living in this district. Changes based on safety perception and economic factors.
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="flex items-center">
                      <span className="text-xs font-medium">
                        {gameMetrics.population[district].toLocaleString()}
                      </span>
                      {roundSummary.metricChanges?.[district]?.population && roundSummary.metricChanges[district].population !== 0 && (
                        <span className={`ml-1 text-[10px] ${
                          roundSummary.metricChanges[district].population > 0 
                          ? "text-green-600 dark:text-green-400" 
                          : "text-red-600 dark:text-red-400"
                        }`}>
                          {roundSummary.metricChanges[district].population > 0 ? '+' : ''}
                          {roundSummary.metricChanges[district].population.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Trust metric with emoji */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1">
                        <HeartPulse className="h-3 w-3" />
                        <Popover>
                          <PopoverTrigger className="text-[10px] cursor-help">Community Trust:</PopoverTrigger>
                          <PopoverContent className="w-60 p-2 text-xs">
                            How much the community trusts police in this district. Higher trust leads to better crime reporting and cooperation.
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div className="flex items-center">
                        <span className={`text-xs font-medium ${getTrustColor(gameMetrics.communityTrust[district])}`}>
                          {gameMetrics.communityTrust[district]}%
                        </span>
                        {roundSummary.metricChanges?.[district]?.trust && 
                          formatChange(
                            roundSummary.metricChanges[district].trust, 
                            roundSummary.metricChanges[district].trust > 0
                          )
                        }
                      </div>
                    </div>
                    <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={getBarColor('trust', gameMetrics.communityTrust[district])} 
                        style={{ width: `${gameMetrics.communityTrust[district]}%`, height: '100%' }}
                      ></div>
                    </div>
                  </div>
                  
                  {/* Crimes metric with emoji */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        <Popover>
                          <PopoverTrigger className="text-[10px] cursor-help">Crimes Reported:</PopoverTrigger>
                          <PopoverContent className="w-60 p-2 text-xs">
                            Number of crimes reported in this district. Lower values reflect safer neighborhoods.
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div className="flex items-center">
                        <span className={`text-xs font-medium ${getCrimeColor(Math.min(100, gameMetrics.crimesReported[district]/5))}`}>
                          {gameMetrics.crimesReported[district]}
                        </span>
                        {roundSummary.metricChanges?.[district]?.crimes && 
                          formatChange(
                            roundSummary.metricChanges[district].crimes,
                            roundSummary.metricChanges[district].crimes < 0
                          )
                        }
                      </div>
                    </div>
                    <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={getBarColor('crime', Math.min(100, gameMetrics.crimesReported[district]/5))} 
                        style={{ width: `${Math.min(100, gameMetrics.crimesReported[district]/3)}%`, height: '100%' }}
                      ></div>
                    </div>
                  </div>

                  {/* Arrests Metric with emoji */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      <ShieldCheck className="h-3 w-3" />
                      <Popover>
                        <PopoverTrigger className="text-[10px] cursor-help">Arrests Made:</PopoverTrigger>
                        <PopoverContent className="w-60 p-2 text-xs">
                          Number of suspects arrested in this district during the round.
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="flex items-center">
                      <span className="text-xs font-medium">
                        {gameMetrics.arrests?.[district] || 0}
                      </span>
                      {roundSummary.metricChanges?.[district]?.arrests && 
                        formatChange(
                          roundSummary.metricChanges[district].arrests,
                          roundSummary.metricChanges[district].arrests > 0
                        )
                      }
                    </div>
                  </div>
                  
                  {/* False Arrest metric with emoji */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1">
                        <Building2 className="h-3 w-3" />
                        <Popover>
                          <PopoverTrigger className="text-[10px] cursor-help">False Arrests:</PopoverTrigger>
                          <PopoverContent className="w-60 p-2 text-xs">
                            Percentage of arrests involving innocent individuals. Lower rates indicate more precise and fair policing.
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div className="flex items-center">
                        <span className={`text-xs font-medium ${getFalseArrestColor(gameMetrics.falseArrestRate[district])}`}>
                          {gameMetrics.falseArrestRate[district]}%
                        </span>
                        {roundSummary.metricChanges?.[district]?.falseArrest && 
                          formatChange(
                            roundSummary.metricChanges[district].falseArrest,
                            roundSummary.metricChanges[district].falseArrest < 0
                          )
                        }
                      </div>
                    </div>
                    <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={getBarColor('falseArrest', gameMetrics.falseArrestRate[district])} 
                        style={{ width: `${gameMetrics.falseArrestRate[district]*2}%`, height: '100%' }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Budget info */}
          {roundSummary.budget && (
            <Card className="mt-3">
              <CardHeader className="py-1.5 px-3">
                <CardTitle className="text-sm flex items-center gap-1.5">
                  <span className="text-base">💰</span> Budget Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="py-2 px-3 space-y-1.5">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <div className="flex justify-between items-center">
                      <span>Previous Budget:</span>
                      <span className="font-medium">${roundSummary.budget.previous}</span>
                    </div>
                    <div className="flex justify-between items-center text-green-600 dark:text-green-400">
                      <span>Income:</span>
                      <span className="font-medium">+${roundSummary.budget.income}</span>
                    </div>
                    <div className="flex justify-between items-center text-red-600 dark:text-red-400">
                      <span>Expenses:</span>
                      <span className="font-medium">-${roundSummary.budget.expenses}</span>
                    </div>
                  </div>
                  <div className="border-l pl-3">
                    <div className="text-xs text-muted-foreground mb-1">Budget Breakdown:</div>
                    <ScrollArea className="h-20 pr-3">
                      <div className="space-y-0.5 text-[10px]">
                        {roundSummary.budget.details.map((detail, index) => (
                          <div key={index} className="flex justify-between">
                            <span>{detail.split(':')[0]}:</span>
                            <span className={detail.includes('+') ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
                              {detail.split(':')[1]}
                            </span>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </div>
                <div className="flex justify-between pt-1.5 mt-1 border-t font-medium text-xs">
                  <span>Current Budget:</span>
                  <span>${roundSummary.budget.current}</span>
                </div>
                
                {/* Special Events section moved below budget */}
                {roundSummary.specialEvents && roundSummary.specialEvents.length > 0 && (
                  <div className="pt-2 mt-1.5 border-t">
                    <h3 className="font-medium text-xs mb-1.5">Special Events</h3>
                    <div className="space-y-1.5">
                      {roundSummary.specialEvents.map((event, idx) => (
                        <div 
                          key={idx} 
                          className={`p-2 rounded-md border ${getEventStyle(event)}`}
                        >
                          <div className="font-medium text-xs mb-0.5">{event.title}</div>
                          <div className="text-[10px]">{event.message}</div>
                          
                          {/* Display impact details if available */}
                          {(event.budgetEffect || event.trustEffect || event.crimeEffect || event.populationEffect) && (
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {event.budgetEffect && (
                                <Badge variant="outline" 
                                  className={`text-[9px] ${event.budgetEffect > 0 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'}`}
                                >
                                  Budget: {event.budgetEffect > 0 ? '+' : ''}{event.budgetEffect}$
                                </Badge>
                              )}
                              {event.trustEffect && (
                                <Badge variant="outline" 
                                  className={`text-[9px] ${event.trustEffect > 0 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'}`}
                                >
                                  Trust: {event.trustEffect > 0 ? '+' : ''}{event.trustEffect}%
                                </Badge>
                              )}
                              {event.crimeEffect && (
                                <Badge variant="outline" 
                                  className={`text-[9px] ${event.crimeEffect < 0 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'}`}
                                >
                                  Crime: {event.crimeEffect > 0 ? '+' : ''}{event.crimeEffect}
                                </Badge>
                              )}
                              {event.populationEffect && (
                                <Badge variant="outline" 
                                  className={`text-[9px] ${event.populationEffect > 0 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'}`}
                                >
                                  Population: {event.populationEffect > 0 ? '+' : ''}
                                  {Math.abs(event.populationEffect) > 999 
                                    ? Math.abs(event.populationEffect/1000).toFixed(1) + 'K' 
                                    : event.populationEffect}
                                </Badge>
                              )}
                              {event.district && (
                                <Badge variant="secondary" className="text-[9px]">
                                  {getDistrictName(event.district)}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right column: Feedback and Events - narrower (4/12) */}
        <div className="md:col-span-4 space-y-3">
          {/* Round Feedback */}
          {roundSummary.feedback && (
            <Card className="border-blue-200 dark:border-blue-800">
              <CardHeader className="bg-blue-50 dark:bg-blue-900/30 py-1.5 px-3">
                <CardTitle className="text-sm">Round Feedback</CardTitle>
              </CardHeader>
              <CardContent className="py-2 px-3">
                <div className="text-blue-800 dark:text-blue-300 space-y-1.5">
                  {roundSummary.feedback.split('. ').filter(item => item.trim()).map((point, idx) => (
                    <div key={idx} className="flex items-start gap-1.5">
                      <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                      <span className="flex-1 text-xs">
                        {point.trim()}{!point.endsWith('.') ? '.' : ''}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Round Events */}
          {roundSummary.changes && roundSummary.changes.length > 0 && (
            <Card>
              <CardHeader className="bg-primary/5 py-1.5 px-3">
                <CardTitle className="text-sm">Round Events</CardTitle>
              </CardHeader>
              <CardContent className="py-2 px-3">
                <ScrollArea className="pr-3 max-h-64">
                  <div className="space-y-1">
                    {roundSummary.changes.map((change, idx) => (
                      <div key={idx} className="flex items-start gap-1.5">
                        <span className="text-primary mt-0.5">•</span>
                        <span className="text-xs">{change}</span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}

          {/* Continue button - Right aligned */}
          <div className="flex justify-end mt-3">
            <Button onClick={onContinue} size="sm" className="flex items-center gap-1.5">
              Continue
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}