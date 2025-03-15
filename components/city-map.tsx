"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Minus, InfoIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"

export default function CityMap({ policeAllocation, handlePoliceAllocation, gameMetrics, getDistrictName }) {
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
    if (trust >= 70) return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
    if (trust >= 40) return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
    return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
  }

  const getCrimeColor = (crimes) => {
    if (crimes <= 100) return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
    if (crimes <= 200) return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
    return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
  }

  const getFalseArrestColor = (rate) => {
    if (rate <= 10) return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
    if (rate <= 20) return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
    return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
  }

  const incrementPolice = (district, shift) => {
    if (policeAllocation.unallocated > 0) {
      handlePoliceAllocation(district, shift, (policeAllocation[district][shift] + 1).toString())
    }
  }

  const decrementPolice = (district, shift) => {
    if (policeAllocation[district][shift] > 1) {
      handlePoliceAllocation(district, shift, (policeAllocation[district][shift] - 1).toString())
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
      {["district1", "district2", "district3", "district4"].map((district) => (
        <Card key={district} className={`overflow-hidden border-2 ${districtColors[district]}`}>
          <CardHeader className={`pb-2 ${districtHeaderColors[district]}`}>
            <div className="flex justify-between items-center">
              <CardTitle>
                {districtEmojis[district]} {getDistrictName(district)}
              </CardTitle>
              <div className="flex items-center gap-1.5 flex-wrap justify-end">
                {/* Trust metric */}
                <div className="flex items-center">
                  <Badge 
                    variant="outline" 
                    className={`px-1.5 py-0.5 text-xs ${getTrustColor(gameMetrics.communityTrust[district])}`}
                  >
                    Trust: {gameMetrics.communityTrust[district]}%
                  </Badge>
                  <Popover>
                    <PopoverTrigger>
                      <InfoIcon className="h-3.5 w-3.5 ml-0.5 text-muted-foreground cursor-pointer" />
                    </PopoverTrigger>
                    <PopoverContent className="w-64 p-2">
                      <p className="text-sm">
                        Community trust in police. Higher trust leads to better cooperation and crime reporting.
                      </p>
                    </PopoverContent>
                  </Popover>
                </div>
                
                {/* Crime metric */}
                <div className="flex items-center">
                  <Badge 
                    variant="outline" 
                    className={`px-1.5 py-0.5 text-xs ${getCrimeColor(gameMetrics.crimesReported[district])}`}
                  >
                    Crimes: {gameMetrics.crimesReported[district]}
                  </Badge>
                  <Popover>
                    <PopoverTrigger>
                      <InfoIcon className="h-3.5 w-3.5 ml-0.5 text-muted-foreground cursor-pointer" />
                    </PopoverTrigger>
                    <PopoverContent className="w-64 p-2">
                      <p className="text-sm">Number of crimes reported in the district. Lower values indicate safer neighborhoods.</p>
                    </PopoverContent>
                  </Popover>
                </div>
                
                {/* False Arrests metric */}
                <div className="flex items-center">
                  <Badge 
                    variant="outline" 
                    className={`px-1.5 py-0.5 text-xs ${getFalseArrestColor(gameMetrics.falseArrestRate[district])}`}
                  >
                    False Arrests: {gameMetrics.falseArrestRate[district]}%
                  </Badge>
                  <Popover>
                    <PopoverTrigger>
                      <InfoIcon className="h-3.5 w-3.5 ml-0.5 text-muted-foreground cursor-pointer" />
                    </PopoverTrigger>
                    <PopoverContent className="w-64 p-2">
                      <p className="text-sm">
                        Percentage of arrests that involve innocent individuals. Lower values indicate more accurate policing.
                      </p>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
            <CardDescription className="font-medium">
              {district === "district1" && "High income, primarily white population"}
              {district === "district2" && "Mixed income, diverse population"}
              {district === "district3" && "Low income, primarily minority population"}
              {district === "district4" && "Mixed demographic with historical tensions"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center">
                  {/* Increase font size for day shift emoji and text */}
                  <label className="text-sm font-medium">Day Shift <span className="text-xl">👮</span></label>
                  <Popover>
                    <PopoverTrigger>
                      <InfoIcon className="h-3 w-3 ml-1 text-muted-foreground cursor-pointer" />
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <p className="text-sm">
                        Number of police officers assigned to day shift. More officers can reduce crime but may affect
                        trust differently in each district.
                      </p>
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex items-center">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => decrementPolice(district, "day")}
                    disabled={policeAllocation[district].day <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <div className="w-12 text-center font-medium">{policeAllocation[district].day}</div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => incrementPolice(district, "day")}
                    disabled={policeAllocation.unallocated <= 0}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center">
                  {/* Increase font size for night shift emoji and text */}
                  <label className="text-sm font-medium">Night Shift <span className="text-xl">👮</span></label>
                  <Popover>
                    <PopoverTrigger>
                      <InfoIcon className="h-3 w-3 ml-1 text-muted-foreground cursor-pointer" />
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <p className="text-sm">
                        Number of police officers assigned to night shift. More officers can reduce crime but may affect
                        trust differently in each district.
                      </p>
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex items-center">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => decrementPolice(district, "night")}
                    disabled={policeAllocation[district].night <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <div className="w-12 text-center font-medium">{policeAllocation[district].night}</div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => incrementPolice(district, "night")}
                    disabled={policeAllocation.unallocated <= 0}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center">
                <h4 className="text-sm font-medium mb-1">Common Crimes:</h4>
                <Popover>
                  <PopoverTrigger>
                    <InfoIcon className="h-3 w-3 ml-1 text-muted-foreground cursor-pointer" />
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <p className="text-sm">
                      Most frequent types of crime in this district. Different actions may be more effective for
                      different crime types.
                    </p>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex flex-wrap gap-1">
                {gameMetrics.commonCrimes[district].map((crime, index) => (
                  <span key={index} className="text-xs bg-muted px-2 py-1 rounded">
                    {crime}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

