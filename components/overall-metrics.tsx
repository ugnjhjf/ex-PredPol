import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { InfoIcon, TrendingUp, TrendingDown } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useEffect, useState } from "react"

export default function OverallMetrics({ gameMetrics, currentRound }) {
  // Keep track of previous metrics for comparison
  const [previousMetrics, setPreviousMetrics] = useState(null)
  
  // Update previous metrics whenever game metrics change and after round 1
  useEffect(() => {
    if (currentRound > 1) {
      // Store current metrics before they update
      return () => {
        setPreviousMetrics({ ...gameMetrics })
      }
    }
  }, [gameMetrics, currentRound])

  // Calculate overall metrics
  const avgTrust =
    (gameMetrics.communityTrust.district1 +
      gameMetrics.communityTrust.district2 +
      gameMetrics.communityTrust.district3 +
      gameMetrics.communityTrust.district4) /
    4

  const totalCrimes = 
    gameMetrics.crimesReported.district1 +
    gameMetrics.crimesReported.district2 +
    gameMetrics.crimesReported.district3 +
    gameMetrics.crimesReported.district4

  // Calculate total arrests (add this calculation)
  const totalArrests = 
    gameMetrics.arrests.district1 +
    gameMetrics.arrests.district2 +
    gameMetrics.arrests.district3 +
    gameMetrics.arrests.district4

  // Calculate average crime rate based on crimes reported
  // We can use a calculated value that normalizes crime numbers to a percentage
  const avgCrime =
    (Math.min(100, gameMetrics.crimesReported.district1 / 5) +
      Math.min(100, gameMetrics.crimesReported.district2 / 5) +
      Math.min(100, gameMetrics.crimesReported.district3 / 5) +
      Math.min(100, gameMetrics.crimesReported.district4 / 5)) /
    4

  const avgFalseArrest =
    (gameMetrics.falseArrestRate.district1 +
      gameMetrics.falseArrestRate.district2 +
      gameMetrics.falseArrestRate.district3 +
      gameMetrics.falseArrestRate.district4) /
    4

  // Calculate bias scores
  const racialBias =
    Math.abs(gameMetrics.arrestsByRace.black.district3 - gameMetrics.arrestsByRace.white.district1) +
    Math.abs(gameMetrics.arrestsByRace.hispanic.district3 - gameMetrics.arrestsByRace.white.district1)

  const incomeBias =
    Math.abs(gameMetrics.arrestsByIncome.low.district3 - gameMetrics.arrestsByIncome.high.district1) +
    Math.abs(gameMetrics.arrestsByIncome.low.district4 - gameMetrics.arrestsByIncome.high.district1)

  // Calculate trend direction for metrics when previous data exists
  const getTrend = (current, metricName) => {
    if (!previousMetrics || currentRound <= 1) return null;
    
    // Define previous values based on metric type
    let prev;
    switch(metricName) {
      case 'avgTrust':
        prev = (previousMetrics.communityTrust.district1 +
                previousMetrics.communityTrust.district2 + 
                previousMetrics.communityTrust.district3 + 
                previousMetrics.communityTrust.district4) / 4;
        break;
      case 'avgCrime':
        prev = (previousMetrics.crimeRate.district1 +
                previousMetrics.crimeRate.district2 + 
                previousMetrics.crimeRate.district3 + 
                previousMetrics.crimeRate.district4) / 4;
        break;
      case 'avgFalseArrest':
        prev = (previousMetrics.falseArrestRate.district1 +
                previousMetrics.falseArrestRate.district2 + 
                previousMetrics.falseArrestRate.district3 + 
                previousMetrics.falseArrestRate.district4) / 4;
        break;
      // Add logic for bias metrics if needed
      // ...
    }
    
    // Return trend based on comparison with threshold for minimal changes
    if (Math.abs(current - prev) < 0.5) return 'neutral';
    return current > prev ? 'up' : 'down';
  }

  // Determine if a trend is positive or negative based on the metric
  const isTrendPositive = (trend, metricName) => {
    if (trend === 'neutral') return null;
    
    switch(metricName) {
      case 'avgTrust':
        return trend === 'up';
      case 'avgCrime':
        return trend === 'down';
      case 'avgFalseArrest':
        return trend === 'down';
      case 'racialBias':
      case 'incomeBias':
        return trend === 'down';
      default:
        return null;
    }
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

  const getBiasColor = (bias) => {
    const normalizedBias = bias / 2 // Normalize to 0-100 scale
    if (normalizedBias <= 30) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
    if (normalizedBias <= 60) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
  }

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="grid grid-cols-5 gap-4">
          {/* 1. Crimes Reported */}
          <Card className="overflow-hidden">
            <CardContent className="p-3">
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1 mb-1">
                  <span className="text-xs font-medium">Crimes Reported</span>
                  <Popover>
                    <PopoverTrigger>
                      <InfoIcon className="h-3 w-3 text-muted-foreground cursor-pointer" />
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <p className="text-sm">
                        Total crimes reported across all districts. Lower is better.
                      </p>
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex items-center gap-1">
                  <Badge variant="outline" className={`px-2 py-1 text-lg ${getCrimeColor(totalCrimes)}`}>
                    {totalCrimes}
                  </Badge>
                  
                  {/* Show trend indicator if after round 1 */}
                  {currentRound > 1 && getTrend(totalCrimes, 'totalCrimes') !== 'neutral' && (
                    <span className={`ml-1 ${isTrendPositive(getTrend(totalCrimes, 'totalCrimes'), 'totalCrimes') ? 'text-green-600' : 'text-red-600'}`}>
                      {getTrend(totalCrimes, 'totalCrimes') === 'up' ? (
                        <TrendingUp className="h-5 w-5" />
                      ) : (
                        <TrendingDown className="h-5 w-5" />
                      )}
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 2. Number of Arrests */}
          <Card className="overflow-hidden">
            <CardContent className="p-3">
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1 mb-1">
                  <span className="text-xs font-medium">No. of Arrests</span>
                  <Popover>
                    <PopoverTrigger>
                      <InfoIcon className="h-3 w-3 text-muted-foreground cursor-pointer" />
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <p className="text-sm">
                        Total number of arrests made across all districts.
                      </p>
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex items-center gap-1">
                  <Badge variant="outline" className="px-2 py-1 text-lg">
                    {gameMetrics.arrests.district1 + 
                    gameMetrics.arrests.district2 + 
                    gameMetrics.arrests.district3 + 
                    gameMetrics.arrests.district4}
                  </Badge>
                  
                  {/* Add trend indicator for arrests */}
                  {currentRound > 1 && getTrend(totalArrests, 'totalArrests') !== 'neutral' && (
                    <span className={`ml-1 ${isTrendPositive(getTrend(totalArrests, 'totalArrests'), 'totalArrests') ? 'text-green-600' : 'text-red-600'}`}>
                      {getTrend(totalArrests, 'totalArrests') === 'up' ? (
                        <TrendingUp className="h-5 w-5" />
                      ) : (
                        <TrendingDown className="h-5 w-5" />
                      )}
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 3. False Arrest Rate */}
          <Card className="overflow-hidden">
            <CardContent className="p-3">
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1 mb-1">
                  <span className="text-xs font-medium">False Arrest Rate</span>
                  <Popover>
                    <PopoverTrigger>
                      <InfoIcon className="h-3 w-3 text-muted-foreground cursor-pointer" />
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <p className="text-sm">
                        Percentage of arrests that involve innocent individuals. Lower values indicate more accurate and
                        fair policing.
                      </p>
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex items-center gap-1">
                  <Badge variant="outline" className={`px-2 py-1 text-lg ${getFalseArrestColor(avgFalseArrest)}`}>
                    {avgFalseArrest.toFixed(1)}%
                  </Badge>
                  
                  {/* Show trend indicator if after round 1 */}
                  {currentRound > 1 && getTrend(avgFalseArrest, 'avgFalseArrest') !== 'neutral' && (
                    <span className={`ml-1 ${isTrendPositive(getTrend(avgFalseArrest, 'avgFalseArrest'), 'avgFalseArrest') ? 'text-green-600' : 'text-red-600'}`}>
                      {getTrend(avgFalseArrest, 'avgFalseArrest') === 'up' ? (
                        <TrendingUp className="h-5 w-5" />
                      ) : (
                        <TrendingDown className="h-5 w-5" />
                      )}
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 4. Community Trust */}
          <Card className="overflow-hidden">
            <CardContent className="p-3">
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1 mb-1">
                  <span className="text-xs font-medium">Community Trust</span>
                  <Popover>
                    <PopoverTrigger>
                      <InfoIcon className="h-3 w-3 text-muted-foreground cursor-pointer" />
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <p className="text-sm">
                        Average trust across all districts. Higher trust leads to better cooperation with police and more
                        crime reporting.
                      </p>
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex items-center gap-1">
                  <Badge variant="outline" className={`px-2 py-1 text-lg ${getTrustColor(avgTrust)}`}>
                    {avgTrust.toFixed(1)}%
                  </Badge>
                  
                  {/* Show trend indicator if after round 1 */}
                  {currentRound > 1 && getTrend(avgTrust, 'avgTrust') !== 'neutral' && (
                    <span className={`ml-1 ${isTrendPositive(getTrend(avgTrust, 'avgTrust'), 'avgTrust') ? 'text-green-600' : 'text-red-600'}`}>
                      {getTrend(avgTrust, 'avgTrust') === 'up' ? (
                        <TrendingUp className="h-5 w-5" />
                      ) : (
                        <TrendingDown className="h-5 w-5" />
                      )}
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 5. Racial Disparity */}
          <Card className="overflow-hidden">
            <CardContent className="p-3">
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1 mb-1">
                  <span className="text-xs font-medium">Racial Disparity</span>
                  <Popover>
                    <PopoverTrigger>
                      <InfoIcon className="h-3 w-3 text-muted-foreground cursor-pointer" />
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <p className="text-sm">
                        Measures the difference in arrest rates between racial groups. Higher values may indicate racial
                        bias in policing.
                      </p>
                    </PopoverContent>
                  </Popover>
                </div>
                <Badge variant="outline" className={`px-2 py-1 text-lg ${getBiasColor(racialBias)}`}>
                  {(racialBias / 2).toFixed(1)}%
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  )
}

