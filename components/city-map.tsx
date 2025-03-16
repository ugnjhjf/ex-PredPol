"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Minus, InfoIcon, User as UserIcon, AlertTriangle } from "lucide-react" // Add User and AlertTriangle imports
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

  // Add info tooltips about district-specific shift effectiveness
  const getShiftEffectivenessInfo = (district) => {
    switch(district) {
      case "district1":
        return "Downtown has more daytime crime (white collar). Day shift is 100% effective, night shift is 70% effective.";
      case "district2":
        return "Westside has slightly more night crime. Day shift is 90% effective, night shift is 110% effective.";
      case "district3":
        return "South Side has significantly more night crime. Day shift is 70% effective, night shift is 130% effective.";
      case "district4":
        return "Eastside has more evening and night crime. Day shift is 80% effective, night shift is 120% effective.";
      default:
        return "Shift effectiveness varies by district.";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3">
      {["district1", "district2", "district3", "district4"].map((district) => {
        return (
          <Card key={district} className={`overflow-hidden border-2 ${districtColors[district]}`}>
            <CardHeader className={`py-1 px-2 ${districtHeaderColors[district]}`}>
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm">
                  {districtEmojis[district]} {getDistrictName(district)}
                </CardTitle>
                <div className="flex items-center gap-1.5 flex-wrap justify-end">
                  {/* Trust metric */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Badge 
                        variant="outline" 
                        className={`px-1.5 py-0.5 text-xs ${getTrustColor(gameMetrics.communityTrust[district])} cursor-help`}
                      >
                        Trust: {gameMetrics.communityTrust[district]}%
                      </Badge>
                    </PopoverTrigger>
                    <PopoverContent side="top" className="w-64 p-2 text-xs">
                      <p>How much citizens trust law enforcement. Higher trust leads to better crime reporting and community cooperation.</p>
                    </PopoverContent>
                  </Popover>
                  
                  {/* Crime metric */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Badge 
                        variant="outline" 
                        className={`px-1.5 py-0.5 text-xs ${getCrimeColor(gameMetrics.crimesReported[district])} cursor-help`}
                      >
                        Crimes: {gameMetrics.crimesReported[district]}
                      </Badge>
                    </PopoverTrigger>
                    <PopoverContent side="top" className="w-64 p-2 text-xs">
                      <p>Number of crimes reported in the district. Lower values indicate safer neighborhoods.</p>
                    </PopoverContent>
                  </Popover>
                  
                  {/* False Arrests metric */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Badge 
                        variant="outline" 
                        className={`px-1.5 py-0.5 text-xs ${getFalseArrestColor(gameMetrics.falseArrestRate[district])} cursor-help`}
                      >
                        False Arrests: {gameMetrics.falseArrestRate[district]}%
                      </Badge>
                    </PopoverTrigger>
                    <PopoverContent side="top" className="w-64 p-2 text-xs">
                      <p>Percentage of arrests that involve innocent individuals. Lower values indicate more accurate policing.</p>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <CardDescription className="text-xs font-medium">
                {district === "district1" && "High income, primarily white population"}
                {district === "district2" && "Mixed income, diverse population"}
                {district === "district3" && "Low income, primarily minority population"}
                {district === "district4" && "Mixed demographic with historical tensions"}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-2">
              {/* Add population with change indicator */}
              <div className="mb-2">
                <div className="flex items-center justify-between">
                  <div className="text-xs flex items-center gap-1">
                    <UserIcon size={12} />
                    <span className="font-medium">Population:</span> 
                    <span>{gameMetrics.population[district].toLocaleString()}</span>
                  </div>
                  
                  <Popover>
                    <PopoverTrigger>
                      <InfoIcon className="h-3.5 w-3.5 ml-0.5 text-muted-foreground cursor-pointer" />
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-2">
                      <p className="text-xs">
                        Low trust and high crime cause population decline, reducing tax revenue.
                        Safe districts with high trust attract new residents.
                      </p>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <div className="flex items-center">
                    {/* Increase font size for day shift emoji and text */}
                    <label className="text-xs font-medium">Day Shift <span className="text-base">👮</span></label>
                    <Popover>
                      <PopoverTrigger>
                        <InfoIcon className="h-3 w-3 ml-1 text-muted-foreground cursor-pointer" />
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <p className="text-xs">
                          Number of police officers assigned to day shift. More officers can reduce crime but may affect
                          trust differently in each district.
                        </p>
                        <p className="text-xs mt-2 font-medium">District-specific effectiveness:</p>
                        <p className="text-xs mt-1">{getShiftEffectivenessInfo(district)}</p>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="flex items-center">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => decrementPolice(district, "day")}
                      disabled={policeAllocation[district].day <= 1}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <div className="w-10 text-center font-medium text-xs">{policeAllocation[district].day}</div>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => incrementPolice(district, "day")}
                      disabled={policeAllocation.unallocated <= 0}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center">
                    <label className="text-xs font-medium">Night Shift <span className="text-base">👮</span></label>
                    <Popover>
                      <PopoverTrigger>
                        <InfoIcon className="h-3 w-3 ml-1 text-muted-foreground cursor-pointer" />
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <p className="text-xs">
                          Number of police officers assigned to night shift. More officers can reduce crime but may affect
                          trust differently in each district.
                        </p>
                        <p className="text-xs mt-2 font-medium">District-specific effectiveness:</p>
                        <p className="text-xs mt-1">{getShiftEffectivenessInfo(district)}</p>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="flex items-center">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => decrementPolice(district, "night")}
                      disabled={policeAllocation[district].night <= 1}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <div className="w-10 text-center font-medium text-xs">{policeAllocation[district].night}</div>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => incrementPolice(district, "night")}
                      disabled={policeAllocation.unallocated <= 0}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <div className="flex items-center">
                  <h4 className="text-xs font-medium mb-1">Common Crimes:</h4>
                  <Popover>
                    <PopoverTrigger>
                      <InfoIcon className="h-3 w-3 ml-1 text-muted-foreground cursor-pointer" />
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <p className="text-xs">
                        Most frequent types of crime in this district. Different actions may be more effective for
                        different crime types.
                      </p>
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex flex-wrap gap-1">
                  {gameMetrics.commonCrimes[district].map((crime, index) => (
                    <span key={index} className="text-[10px] bg-muted px-1.5 py-0.5 rounded">
                      {crime}
                    </span>
                  ))}
                </div>
              </div>
              {/* Show district-specific allocation hint */}
              <div className="mt-3 text-[10px] bg-muted p-1.5 rounded">
                {district === "district1" && "💡 Hint: Downtown has more white-collar crime during day hours. Consider a balanced approach."}
                {district === "district2" && "💡 Hint: Westside needs fairly even coverage with slight emphasis on night shifts."}
                {district === "district3" && "💡 Hint: South Side experiences significantly more crime at night. Consider allocating more night officers."}
                {district === "district4" && "💡 Hint: Eastside has higher crime rates in evening and night hours."}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
