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
  AlertTriangle, 
  Users,
  Shield,
  UserCheck, // Replace Handcuffs with UserCheck
  FileBarChart
} from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export default function OverallMetrics({ gameMetrics, currentRound }) {
  // Keep track of previous metrics for comparison
  const [previousMetrics, setPreviousMetrics] = useState(null)
  
  // Update previous metrics when current metrics change
  useEffect(() => {
    // Only update previous metrics after the first render
    // This ensures we don't lose the initial comparison values
    if (previousMetrics !== null) {
      setPreviousMetrics(gameMetrics)
    } else {
      setPreviousMetrics(gameMetrics)
    }
  }, [gameMetrics])

  // Calculate city-wide averages
  const avgTrust = 
    (gameMetrics.communityTrust.district1 +
     gameMetrics.communityTrust.district2 +
     gameMetrics.communityTrust.district3 +
     gameMetrics.communityTrust.district4) / 4
  
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
  
  // Calculate total crimes
  const totalCrimes = 
    gameMetrics.crimesReported.district1 +
    gameMetrics.crimesReported.district2 +
    gameMetrics.crimesReported.district3 +
    gameMetrics.crimesReported.district4
    
  // Calculate total arrests
  const totalArrests = 
    gameMetrics.arrests.district1 +
    gameMetrics.arrests.district2 +
    gameMetrics.arrests.district3 +
    gameMetrics.arrests.district4
  
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
  
  const getCrimesChange = () => {
    if (!previousMetrics) return 0
    const prevTotal = 
      previousMetrics.crimesReported.district1 +
      previousMetrics.crimesReported.district2 +
      previousMetrics.crimesReported.district3 +
      previousMetrics.crimesReported.district4
    return totalCrimes - prevTotal
  }
  
  const getArrestsChange = () => {
    if (!previousMetrics || !previousMetrics.arrests) return 0
    const prevTotal = 
      previousMetrics.arrests.district1 +
      previousMetrics.arrests.district2 +
      previousMetrics.arrests.district3 +
      previousMetrics.arrests.district4
    return totalArrests - prevTotal
  }
  
  // Changes
  const trustChange = getTrustChange()
  const falseArrestChange = getFalseArrestChange()
  const populationChange = getPopulationChange()
  const crimesChange = getCrimesChange()
  const arrestsChange = getArrestsChange()
  
  // Get color classes based on value (good/bad)
  const getTrustColor = (trust) => {
    if (trust >= 70) return "text-green-600 dark:text-green-400"
    if (trust >= 40) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }
  
  // Updated crime rate thresholds
  const getCrimeColor = (totalCrimes) => {
    // Scale the total crime by district count for a more accurate assessment
    const avgCrimePerDistrict = totalCrimes / 4;
    if (avgCrimePerDistrict < 50) return "text-green-600 dark:text-green-400"
    if (avgCrimePerDistrict <= 100) return "text-yellow-600 dark:text-yellow-400" 
    return "text-red-600 dark:text-red-400"
  }
  
  const getFalseArrestColor = (rate) => {
    if (rate <= 10) return "text-green-600 dark:text-green-400"
    if (rate <= 20) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }
  
  // Get badge for metric change indicators
  const getChangeIndicator = (change, isInverted = false) => {
    if (change === 0 || currentRound <= 1) return null
    
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

         {/* Population Metric */}
         <div className="flex items-center gap-3">
            <div className="bg-violet-100 dark:bg-violet-900 rounded-full p-2">
              <Users className="h-6 w-6 text-violet-600 dark:text-violet-300" />
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
                    
          {/* Crimes Reported Metric - Updated with severity label */}
          <div className="flex items-center gap-3">
            <div className="bg-red-100 dark:bg-red-900 rounded-full p-2">
              <FileBarChart className="h-6 w-6 text-red-600 dark:text-red-300" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <Popover>
                  <PopoverTrigger asChild>
                    <h3 className="text-sm font-medium flex items-center gap-1 cursor-help">
                      Crimes Reported
                    </h3>
                  </PopoverTrigger>
                  <PopoverContent side="top" className="text-sm w-80">
                    <p>Total number of crimes reported across all districts. Under 50/district is low, 50-100 is moderate, over 100 is severe.</p>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex items-center">
                <span className={`text-base font-bold ${getCrimeColor(totalCrimes)}`}>
                  {totalCrimes}
                </span>
                <span className="text-xs ml-1 text-muted-foreground">
                  {(totalCrimes/4) < 50 ? "(Low)" : 
                   (totalCrimes/4) <= 100 ? "(Moderate)" : 
                   "(Severe)"}
                </span>
                {crimesChange !== 0 && (
                  <div className={`flex items-center gap-0.5 text-xs ml-1 ${crimesChange < 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {crimesChange < 0 ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
                    <span>{Math.abs(crimesChange)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Suspects Arrested Metric - Replace Handcuffs with UserCheck icon */}
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-2">
              <UserCheck className="h-6 w-6 text-blue-600 dark:text-blue-300" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <Popover>
                  <PopoverTrigger asChild>
                    <h3 className="text-sm font-medium flex items-center gap-1 cursor-help">
                      Suspects Arrested
                    </h3>
                  </PopoverTrigger>
                  <PopoverContent side="top" className="text-sm w-80">
                    <p>Total number of arrests made across all districts.</p>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex items-center">
                <span className="text-base font-bold">
                  {totalArrests}
                </span>
                {arrestsChange !== 0 && (
                  <div className={`flex items-center gap-0.5 text-xs ml-1 ${arrestsChange > 0 ? 'text-blue-600 dark:text-blue-400' : 'text-muted-foreground'}`}>
                    {arrestsChange > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    <span>{Math.abs(arrestsChange)}</span>
                  </div>
                )}
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

          {/* Community Trust Metric */}
          <div className="flex items-center gap-3">
            <div className="bg-green-100 dark:bg-green-900 rounded-full p-2">
              <Heart className="h-6 w-6 text-green-600 dark:text-green-300" />
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

 
        </div>
      </CardContent>
    </Card>
  )
}
