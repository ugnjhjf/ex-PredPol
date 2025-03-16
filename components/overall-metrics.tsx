"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { 
  TrendingUp, 
  TrendingDown, 
  Heart, 
  ShieldAlert, 
  Users, 
  Building2, 
  Shield, 
  AlertTriangle, 
  DollarSign 
} from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export default function OverallMetrics({ gameMetrics, currentRound }) {
  // Keep track of previous metrics for comparison
  const [previousMetrics, setPreviousMetrics] = useState(null)
  
  // Update previous metrics when current metrics change
  useEffect(() => {
    if (currentRound > 1) {
      setPreviousMetrics(prev => prev || { ...gameMetrics })
    }
  }, [currentRound])

  // Calculate city-wide averages
  const avgTrust = 
    (gameMetrics.communityTrust.district1 +
     gameMetrics.communityTrust.district2 +
     gameMetrics.communityTrust.district3 +
     gameMetrics.communityTrust.district4) / 4
  
  const avgCrime = 
    (Math.min(100, gameMetrics.crimesReported.district1 / 5) +
     Math.min(100, gameMetrics.crimesReported.district2 / 5) +
     Math.min(100, gameMetrics.crimesReported.district3 / 5) +
     Math.min(100, gameMetrics.crimesReported.district4 / 5)) / 4
  
  const avgFalseArrest = 
    (gameMetrics.falseArrestRate.district1 +
     gameMetrics.falseArrestRate.district2 +
     gameMetrics.falseArrestRate.district3 +
     gameMetrics.falseArrestRate.district4) / 4
  
  // Calculate total population
  const totalPopulation = 
    gameMetrics.population.district1 +
    gameMetrics.population.district2 +
    gameMetrics.population.district3 +
    gameMetrics.population.district4
  
  // Calculate metric changes compared to previous state
  const getTrustChange = () => {
    if (!previousMetrics) return 0
    const prevAvg = 
      (previousMetrics.communityTrust.district1 +
       previousMetrics.communityTrust.district2 +
       previousMetrics.communityTrust.district3 +
       previousMetrics.communityTrust.district4) / 4
    return avgTrust - prevAvg
  }
  
  const getCrimeChange = () => {
    if (!previousMetrics) return 0
    const prevAvg = 
      (Math.min(100, previousMetrics.crimesReported.district1 / 5) +
       Math.min(100, previousMetrics.crimesReported.district2 / 5) +
       Math.min(100, previousMetrics.crimesReported.district3 / 5) +
       Math.min(100, previousMetrics.crimesReported.district4 / 5)) / 4
    return avgCrime - prevAvg
  }
  
  const getFalseArrestChange = () => {
    if (!previousMetrics) return 0
    const prevAvg = 
      (previousMetrics.falseArrestRate.district1 +
       previousMetrics.falseArrestRate.district2 +
       previousMetrics.falseArrestRate.district3 +
       previousMetrics.falseArrestRate.district4) / 4
    return avgFalseArrest - prevAvg
  }
  
  const getPopulationChange = () => {
    if (!previousMetrics) return 0
    const prevTotal = 
      previousMetrics.population.district1 +
      previousMetrics.population.district2 +
      previousMetrics.population.district3 +
      previousMetrics.population.district4
    return totalPopulation - prevTotal
  }
  
  // Changes
  const trustChange = getTrustChange()
  const crimeChange = getCrimeChange()
  const falseArrestChange = getFalseArrestChange()
  const populationChange = getPopulationChange()
  
  // Get color classes based on value (good/bad)
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
  
  // Get badge for metric change indicators
  const getChangeIndicator = (change, isInverted = false) => {
    if (change === 0) return null
    
    const isPositive = isInverted ? change < 0 : change > 0
    const Icon = isPositive ? TrendingUp : TrendingDown
    const color = isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
    
    return (
      <div className={`flex items-center gap-0.5 ${color} text-xs ml-1`}>
        <Icon className="h-3 w-3" />
        <span>{Math.abs(change).toFixed(1)}{isInverted ? "" : "%"}</span>
      </div>
    )
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="grid grid-cols-5 gap-6">
          {/* Community Trust Metric */}
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-2">
              <Heart className="h-6 w-6 text-blue-600 dark:text-blue-300" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <Popover>
                  <PopoverTrigger asChild>
                    <h3 className="text-sm font-medium flex items-center gap-1 cursor-help">
                      Community Trust
                    </h3>
                  </PopoverTrigger>
                  <PopoverContent side="top" className="text-sm w-80">
                    <p>How much citizens trust law enforcement. Higher trust leads to better crime reporting and community cooperation.</p>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex items-center">
                <span className={`text-base font-bold ${getTrustColor(avgTrust)}`}>
                  {avgTrust.toFixed(1)}%
                </span>
                {getChangeIndicator(trustChange)}
              </div>
            </div>
          </div>

          {/* Crime Rate Metric */}
          <div className="flex items-center gap-3">
            <div className="bg-red-100 dark:bg-red-900 rounded-full p-2">
              <ShieldAlert className="h-6 w-6 text-red-600 dark:text-red-300" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <Popover>
                  <PopoverTrigger asChild>
                    <h3 className="text-sm font-medium flex items-center gap-1 cursor-help">
                      Crime Rate
                    </h3>
                  </PopoverTrigger>
                  <PopoverContent side="top" className="text-sm w-80">
                    <p>Average crime rate across all districts. Lower values indicate safer neighborhoods.</p>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex items-center">
                <span className={`text-base font-bold ${getCrimeColor(avgCrime)}`}>
                  {avgCrime.toFixed(1)}%
                </span>
                {getChangeIndicator(crimeChange, true)}
              </div>
            </div>
          </div>

          {/* False Arrests Metric */}
          <div className="flex items-center gap-3">
            <div className="bg-amber-100 dark:bg-amber-900 rounded-full p-2">
              <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <Popover>
                  <PopoverTrigger asChild>
                    <h3 className="text-sm font-medium flex items-center gap-1 cursor-help">
                      False Arrests
                    </h3>
                  </PopoverTrigger>
                  <PopoverContent side="top" className="text-sm w-80">
                    <p>Percentage of arrests involving innocent individuals. Lower values indicate more accurate policing.</p>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex items-center">
                <span className={`text-base font-bold ${getFalseArrestColor(avgFalseArrest)}`}>
                  {avgFalseArrest.toFixed(1)}%
                </span>
                {getChangeIndicator(falseArrestChange, true)}
              </div>
            </div>
          </div>

          {/* Population Metric */}
          <div className="flex items-center gap-3">
            <div className="bg-green-100 dark:bg-green-900 rounded-full p-2">
              <Users className="h-6 w-6 text-green-600 dark:text-green-300" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <Popover>
                  <PopoverTrigger asChild>
                    <h3 className="text-sm font-medium flex items-center gap-1 cursor-help">
                      Population
                    </h3>
                  </PopoverTrigger>
                  <PopoverContent side="top" className="text-sm w-80">
                    <p>Total city population. Growth indicates effective policing and high trust.</p>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex items-center">
                <span className="text-base font-bold">
                  {totalPopulation.toLocaleString()}
                </span>
                {populationChange !== 0 && (
                  <div className={`flex items-center gap-0.5 text-xs ml-1 ${populationChange > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {populationChange > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    <span>{Math.abs(populationChange).toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Budget Metric */}
          <div className="flex items-center gap-3">
            <div className="bg-emerald-100 dark:bg-emerald-900 rounded-full p-2">
              <DollarSign className="h-6 w-6 text-emerald-600 dark:text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <Popover>
                  <PopoverTrigger asChild>
                    <h3 className="text-sm font-medium flex items-center gap-1 cursor-help">
                      Budget
                    </h3>
                  </PopoverTrigger>
                  <PopoverContent side="top" className="text-sm w-80">
                    <p>Available funds for actions and police salaries. Tax revenue depends on district population and safety.</p>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex items-center">
                <span className={`text-base font-bold ${gameMetrics.budget < 250 ? 'text-red-600 dark:text-red-400' : ''}`}>
                  ${gameMetrics.budget}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Add Progress Bars for Key Metrics */}
        <div className="grid grid-cols-3 mt-4 gap-6">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs">Community Trust</span>
              <span className={`text-xs ${getTrustColor(avgTrust)}`}>
                {avgTrust.toFixed(1)}%
              </span>
            </div>
            <Progress value={avgTrust} className="h-1.5" 
              indicatorClassName={`
                ${avgTrust >= 70 ? 'bg-green-500' : 
                  avgTrust >= 40 ? 'bg-yellow-500' : 'bg-red-500'}
              `}
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs">Crime Rate</span>
              <span className={`text-xs ${getCrimeColor(avgCrime)}`}>
                {avgCrime.toFixed(1)}%
              </span>
            </div>
            <Progress value={100 - avgCrime} className="h-1.5"
              indicatorClassName={`
                ${avgCrime <= 30 ? 'bg-green-500' : 
                  avgCrime <= 60 ? 'bg-yellow-500' : 'bg-red-500'}
              `}
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs">False Arrest Rate</span>
              <span className={`text-xs ${getFalseArrestColor(avgFalseArrest)}`}>
                {avgFalseArrest.toFixed(1)}%
              </span>
            </div>
            <Progress value={100 - (avgFalseArrest * 2)} className="h-1.5"
              indicatorClassName={`
                ${avgFalseArrest <= 10 ? 'bg-green-500' : 
                  avgFalseArrest <= 20 ? 'bg-yellow-500' : 'bg-red-500'}
              `}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
