"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogFooter, 
  AlertDialogHeader, AlertDialogTitle, AlertDialogDescription } from "@/components/ui/alert-dialog"
import { InfoIcon, HelpCircleIcon, XIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Toast, ToastAction, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"

// Make the Actions tab more compact with visual charts for ethnicity and income
export default function ActionSelection({
  districtActions,
  setDistrictActions,
  getDistrictName,
  currentRound,
  gameMetrics,
  implementedActions,
}) {
  const [selectedDistrict, setSelectedDistrict] = useState("district1")
  const [selectedAction, setSelectedAction] = useState(districtActions[selectedDistrict] || "")
  const [showActionSelectedDialog, setShowActionSelectedDialog] = useState(false)
  const { toast } = useToast()

  const handleConfirm = () => {
    // Clear any existing actions for other districts
    const newDistrictActions = {
      district1: "",
      district2: "",
      district3: "",
      district4: "",
    }

    // Set only the current district action
    newDistrictActions[selectedDistrict] = selectedAction

    setDistrictActions(newDistrictActions)
  }

  const districtColors = {
    district1: "from-blue-500 to-blue-600",
    district2: "from-green-500 to-green-600",
    district3: "from-amber-500 to-amber-600",
    district4: "from-purple-500 to-purple-600",
  }

  const districtBgColors = {
    district1: "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800",
    district2: "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800",
    district3: "bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800",
    district4: "bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800",
  }

  // Add the missing districtHeaderColors definition
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

  // Check if any district has an action selected
  const hasActionSelected = Object.values(districtActions).some((action) => action !== "")

  // Get the district that has an action if any
  const districtWithAction = Object.keys(districtActions).find((district) => districtActions[district] !== "")

  const actions = [
    {
      id: "cctv",
      title: "Implement CCTV Surveillance",
      description: "Install cameras in public areas to monitor and deter crime.",
      effects: "Reduces crime rate but may decrease community trust. Effects vary by district demographics.",
      detailedEffects: "CCTV cameras have proven effective in deterring property crimes and helping solve cases. However, they're received differently in different communities. In affluent areas, they're often seen as security enhancements, while in lower-income minority neighborhoods, they can be perceived as intrusive surveillance, potentially reducing trust. The effectiveness increases with strategic placement around high-crime locations."
    },
    {
      id: "app",
      title: "Develop Anonymous Crime Reporting App",
      description: "Create a mobile app that allows citizens to report crimes anonymously.",
      effects: "Generally increases community trust and reduces crime rate. More effective in high-crime areas.",
      detailedEffects: "This app addresses the fear of retaliation that often prevents people from reporting crimes. It's particularly effective in neighborhoods with low trust in police, where traditional reporting is suppressed. The increase in valuable tips helps solve crimes and can significantly improve clearance rates. However, the app requires digital literacy and smartphone access, which may limit its effectiveness in some demographics."
    },
    {
      id: "education",
      title: "Public Education and Consultation",
      description: "Hold community meetings and educational programs about policing.",
      effects: "Significantly improves trust, especially in low-trust districts. May help reduce crime in troubled areas.",
      detailedEffects: "Community engagement through education builds relationships and understanding between police and residents. This strengthens social cohesion and creates networks of informal social control, which research shows can significantly reduce crime over time. In areas with historical police tensions, these programs help heal relationships, improving information sharing and cooperation. This is a long-term investment that yields compounding benefits."
    },
    {
      id: "drone",
      title: "Drone Surveillance",
      description: "Deploy drones for aerial monitoring of high-crime areas.",
      effects: "Reduces crime rate but can severely decrease trust in minority communities, potentially increasing false arrests.",
      detailedEffects: "Drones cover more ground than traditional patrols and can respond quickly to incidents, reducing crime through deterrence and faster response times. However, they can increase false arrests due to limitations in visual identification from aerial footage, especially in dense areas or at night. In communities of color with histories of over-policing, drone surveillance often triggers concerns about privacy violations and racial profiling, significantly damaging trust."
    },
    {
      id: "facial",
      title: "Facial Recognition Technology",
      description: "Deploy AI-powered facial recognition to identify suspects from surveillance footage.",
      effects: "Reduces crime similarly across all districts, but has dramatically different effects on trust and false arrest rates based on district demographics.",
      detailedEffects: "Current facial recognition algorithms have documented accuracy disparities across demographic groups, with higher error rates for women and people with darker skin tones. While the technology can help identify suspects quickly in all districts, its implementation in diverse neighborhoods leads to higher false arrest rates for minorities. These algorithmic biases compound existing societal inequities, severely damaging trust in affected communities while being perceived as more accurate in whiter, wealthier areas."
    },
  ]

  const getDistrictDemographics = (district) => {
    const demographics = {
      district1: {
        ethnicity: { white: 80, black: 10, hispanic: 5, other: 5 },
        income: { high: 70, middle: 20, low: 10 },
      },
      district2: {
        ethnicity: { white: 50, black: 30, hispanic: 15, other: 5 },
        income: { high: 30, middle: 40, low: 30 },
      },
      district3: {
        ethnicity: { white: 20, black: 60, hispanic: 15, other: 5 },
        income: { high: 5, middle: 25, low: 70 },
      },
      district4: {
        ethnicity: { white: 40, black: 35, hispanic: 20, other: 5 },
        income: { high: 25, middle: 40, low: 35 },
      },
    }

    return demographics[district]
  }

  // Helper function to render a pie chart
  const PieChart = ({ data, colorMap, size = 70 }) => {
    const total = Object.values(data).reduce((sum, value) => sum + value, 0)
    let currentAngle = 0
    const center = size / 2
    const radius = size / 2
    const segments = []
    const labels = []
    
    // Colors for the pie segments
    const colors = {
      white: '#60a5fa', // blue-400
      black: '#4ade80', // green-400
      hispanic: '#facc15', // yellow-400
      other: '#c084fc', // purple-400
      high: '#34d399', // emerald-400
      middle: '#fbbf24', // amber-400
      low: '#f87171', // red-400
    }

    Object.entries(data).forEach(([key, value], index) => {
      const percentage = (value / total) * 100
      const angle = (percentage / 100) * 360
      const largeArcFlag = angle > 180 ? 1 : 0
      
      // Starting point
      const startX = center + radius * Math.cos((currentAngle * Math.PI) / 180)
      const startY = center + radius * Math.sin((currentAngle * Math.PI) / 180)
      
      // Calculate ending point
      const endAngle = currentAngle + angle
      const endX = center + radius * Math.cos((endAngle * Math.PI) / 180)
      const endY = center + radius * Math.sin((endAngle * Math.PI) / 180)
      
      // Calculate point for label
      const labelAngle = currentAngle + (angle / 2)
      // Position label slightly outside the pie
      const labelRadius = radius * 0.7
      const labelX = center + labelRadius * Math.cos((labelAngle * Math.PI) / 180)
      const labelY = center + labelRadius * Math.sin((labelAngle * Math.PI) / 180)
      
      // Create the SVG path for the segment
      const path = [
        `M ${center},${center}`,
        `L ${startX},${startY}`,
        `A ${radius},${radius} 0 ${largeArcFlag},1 ${endX},${endY}`,
        'Z'
      ].join(' ')
      
      segments.push(
        <path 
          key={key} 
          d={path} 
          fill={colors[key] || colorMap[index]} 
          stroke="#fff" 
          strokeWidth="1"
        />
      )
      
      if (percentage > 5) {
        // Only show label if segment is large enough
        labels.push(
          <text 
            key={key} 
            x={labelX} 
            y={labelY} 
            textAnchor="middle" 
            dominantBaseline="central"
            fill="currentColor" 
            fontSize="8px" 
            fontWeight="bold"
          >
            {percentage > 10 ? `${Math.round(percentage)}%` : ''}
          </text>
        )
      }
      
      currentAngle = endAngle
    })
    
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {segments}
        {labels}
      </svg>
    )
  }

  // Legend component for pie charts
  const ChartLegend = ({ data, colors }) => {
    return (
      <div className="flex flex-wrap gap-2 mt-1 justify-center text-xs">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="flex items-center">
            <div 
              className="w-2 h-2 rounded-full mr-1" 
              style={{ backgroundColor: colors[key] }}
            />
            <span>{key.charAt(0).toUpperCase() + key.slice(1)}: {value}%</span>
          </div>
        ))}
      </div>
    )
  }

  const getActionName = (actionId) => {
    const action = actions.find(a => a.id === actionId)
    return action ? action.title : actionId
  }

  // Format action name to be shorter for badges
  const getShortActionName = (actionId) => {
    const shortNames = {
      "cctv": "CCTV",
      "app": "Reporting App",
      "education": "Education",
      "drone": "Drones",
      "facial": "Facial Recognition" // Add short name for the new action
    };
    return shortNames[actionId] || actionId;
  }

  // Show the dialog when an action is selected
  useEffect(() => {
    if (hasActionSelected) {
      toast({
        title: "Action Selected",
        description: `You have selected an action for ${getDistrictName(districtWithAction)} in Round ${currentRound}. Selecting another district will replace this action.`,
        action: (
          <ToastAction altText="Close">Close</ToastAction>
        ),
        duration: 5000, // 5 seconds
      })
    }
  }, [districtActions])

  const getMetricColor = (metricType, value) => {
    switch(metricType) {
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
  
  const getTrustColor = (trust) => {
    if (trust >= 70) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
    if (trust >= 40) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
  }

  const getCrimeColor = (crimes) => {
    if (crimes <= 100) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
    if (crimes <= 200) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
  }

  const getFalseArrestColor = (rate) => {
    if (rate <= 10) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
    if (rate <= 20) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
  }

  return (
    <div className="p-5 space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Districts on the left */}
        <div className="md:w-3/4">
          <h3 className="text-lg font-medium mb-3">Select District</h3>
          <div className="grid grid-cols-2 gap-5">
            {["district1", "district2", "district3", "district4"].map((district) => {
              const demographics = getDistrictDemographics(district)
              const districtImplementedActions = implementedActions[district] || []

              return (
                <div
                  key={district}
                  className={`rounded-lg border-2 transition-all cursor-pointer ${
                    selectedDistrict === district
                      ? `ring-2 ring-offset-2 ring-offset-background ring-primary ${districtBgColors[district]}`
                      : "bg-muted hover:bg-muted/80"
                  }`}
                  onClick={() => {
                    setSelectedDistrict(district)
                    setSelectedAction(districtActions[district] || "")
                  }}
                >
                  {/* District Header with Title and Metrics */}
                  <div className={`p-3 ${selectedDistrict === district ? districtHeaderColors[district] : ""}`}>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white bg-gradient-to-br ${districtColors[district]}`}
                        >
                          <span className="text-xl">{districtEmojis[district]}</span>
                        </div>
                        <h3 className="font-bold text-base">{getDistrictName(district)}</h3>
                      </div>
                      
                      {/* Metrics badges */}
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
                                How much the community trusts the police. Higher trust leads to better cooperation.
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
                              <p className="text-sm">
                                Number of crimes reported in the district. Lower is better.
                              </p>
                            </PopoverContent>
                          </Popover>
                        </div>
                        
                        {/* False Arrests metric */}
                        <div className="flex items-center">
                          <Badge 
                            variant="outline" 
                            className={`px-1.5 py-0.5 text-xs ${getFalseArrestColor(gameMetrics.falseArrestRate[district])}`}
                          >
                            False Arrests.: {gameMetrics.falseArrestRate[district]}%
                          </Badge>
                          <Popover>
                            <PopoverTrigger>
                              <InfoIcon className="h-3.5 w-3.5 ml-0.5 text-muted-foreground cursor-pointer" />
                            </PopoverTrigger>
                            <PopoverContent className="w-64 p-2">
                              <p className="text-sm">
                                False Arrest Rate - percentage of arrests involving innocent individuals. Lower values indicate more accurate policing.
                              </p>
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="text-left flex-1">
                      {/* Remove the District metrics bar chart section */}
                      
                      {/* Charts section */}
                      <div className="mt-1">
                        <div className="grid grid-cols-2 gap-4">
                          {/* Ethnicity Pie Chart */}
                          <div className="flex gap-2 items-center">
                            <div className="flex flex-col">
                              <span className="text-sm font-medium">Ethnicity</span>
                              <div className="text-xs space-y-0.5 mt-1">
                                <div className="flex items-center">
                                  <span className="inline-block w-2.5 h-2.5 bg-blue-400 mr-1"></span>
                                  <span>White</span>
                                </div>
                                <div className="flex items-center">
                                  <span className="inline-block w-2.5 h-2.5 bg-green-400 mr-1"></span>
                                  <span>Black</span>
                                </div>
                                <div className="flex items-center">
                                  <span className="inline-block w-2.5 h-2.5 bg-yellow-400 mr-1"></span>
                                  <span>Hispanic</span>
                                </div>
                                <div className="flex items-center">
                                  <span className="inline-block w-2.5 h-2.5 bg-purple-400 mr-1"></span>
                                  <span>Other</span>
                                </div>
                              </div>
                            </div>
                            <PieChart 
                              data={demographics.ethnicity} 
                              colorMap={['#60a5fa', '#4ade80', '#facc15', '#c084fc']}
                              size={95}
                            />
                          </div>
                          
                          {/* Income Pie Chart */}
                          <div className="flex gap-2 items-center">
                            <div className="flex flex-col">
                              <span className="text-sm font-medium">Income</span>
                              <div className="text-xs space-y-0.5 mt-1">
                                <div className="flex items-center">
                                  <span className="inline-block w-2.5 h-2.5 bg-emerald-400 mr-1"></span>
                                  <span>High</span>
                                </div>
                                <div className="flex items-center">
                                  <span className="inline-block w-2.5 h-2.5 bg-amber-400 mr-1"></span>
                                  <span>Middle</span>
                                </div>
                                <div className="flex items-center">
                                  <span className="inline-block w-2.5 h-2.5 bg-red-400 mr-1"></span>
                                  <span>Low</span>
                                </div>
                              </div>
                            </div>
                            <PieChart 
                              data={demographics.income} 
                              colorMap={['#34d399', '#fbbf24', '#f87171']}
                              size={95}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Common crimes section */}
                      <div className="mt-3">
                        <div className="flex items-center text-sm font-medium mb-1">
                          <Popover>
                            <PopoverTrigger>
                              <InfoIcon className="h-3.5 w-3.5 text-muted-foreground cursor-pointer mr-1.5" />
                            </PopoverTrigger>
                            <PopoverContent className="w-80 p-2">
                              <p className="text-sm">Most frequent types of crime in this district.</p>
                            </PopoverContent>
                          </Popover>
                          <h4>Common Crimes:</h4>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {gameMetrics.commonCrimes[district].map((crime, index) => (
                            <span key={index} className="text-xs bg-muted px-2 py-0.5 rounded">
                              {crime}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Implemented actions */}
                      {districtImplementedActions.length > 0 && (
                        <div className="mt-3">
                          <p className="text-sm font-medium text-muted-foreground">Implemented Actions:</p>
                          <div className="flex flex-wrap gap-1.5 mt-1">
                            {districtImplementedActions.map((actionId, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs px-1.5 py-0">
                                {getShortActionName(actionId)}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {districtActions[district] ? (
                        <span className="inline-block mt-3 text-xs bg-primary/20 px-2.5 py-1 rounded-full">
                          Action selected
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Actions on the right */}
        <div className="md:w-1/4">
          <Card className="sticky top-4">
            <CardHeader className="pb-2 px-3 py-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base">Available Actions</CardTitle>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <HelpCircleIcon className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent side="top" align="end" className="max-w-sm">
                    <div className="space-y-2">
                      <h4 className="font-medium">Action Limit</h4>
                      <p className="text-sm">You can only implement ONE action in ONE district per round. Choose carefully!</p>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <CardDescription className="text-xs">Select an action for {getDistrictName(selectedDistrict)}</CardDescription>
            </CardHeader>
            <CardContent className="px-3 py-2">
              <RadioGroup value={selectedAction} onValueChange={setSelectedAction} className="space-y-2">
                {actions.map((action) => {
                  const isImplemented = implementedActions[selectedDistrict]?.includes(action.id)
                  
                  // Check if facial recognition requires CCTV prerequisite
                  const isFacialRecWithoutCCTV = action.id === "facial" && 
                    !implementedActions[selectedDistrict]?.includes("cctv")
                  
                  return (
                    <div 
                      key={action.id} 
                      className={`flex items-start space-x-2 border rounded-md p-1.5 ${
                        isImplemented || isFacialRecWithoutCCTV
                          ? "bg-muted opacity-60 cursor-not-allowed" 
                          : "hover:bg-muted/50"
                      }`}
                    >
                      <RadioGroupItem 
                        value={action.id} 
                        id={action.id} 
                        className="mt-1" 
                        disabled={isImplemented || isFacialRecWithoutCCTV}
                      />
                      <div className="grid gap-0.5">
                        <div className="flex items-center gap-1">
                          <Label htmlFor={action.id} className={`font-medium text-xs ${(isImplemented || isFacialRecWithoutCCTV) ? "text-muted-foreground" : ""}`}>
                            {action.title}
                          </Label>
                          {isImplemented && (
                            <Badge variant="outline" className="text-[9px] px-1 py-0">Implemented</Badge>
                          )}
                          {isFacialRecWithoutCCTV && (
                            <Badge variant="outline" className="text-[9px] px-1 py-0">Requires CCTV</Badge>
                          )}
                        </div>
                        <p className="text-[10px] text-muted-foreground leading-tight">{action.description}</p>
                        <div className="flex items-start gap-1">
                          <p className="text-[10px] text-muted-foreground italic leading-tight">{action.effects}</p>
                          <Popover>
                            <PopoverTrigger>
                              <InfoIcon className="h-3 w-3 text-muted-foreground cursor-pointer flex-shrink-0 mt-0.5" />
                            </PopoverTrigger>
                            <PopoverContent className="w-80 p-3">
                              <p className="text-xs">{action.detailedEffects}</p>
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </RadioGroup>
              <Button 
                onClick={handleConfirm} 
                disabled={!selectedAction || implementedActions[selectedDistrict]?.includes(selectedAction)} 
                className="w-full mt-3"
                size="sm"
              >
                Confirm Action
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

