"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogFooter, 
  AlertDialogHeader, AlertDialogTitle, AlertDialogDescription } from "@/components/ui/alert-dialog"
import { InfoIcon, HelpCircleIcon, XIcon, Users, CircleDollarSign, CheckCircle2, Clock } from "lucide-react"
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
      emoji: "📹",
      title: "Implement CCTV Surveillance",
      description: "Install cameras in public areas to monitor and deter crime.",
      infoPoints: [
        "Reduces crime through deterrence and detection",
        "More effective in affluent areas, less trusted in marginalized communities",
        "Can lower community trust, especially in minority neighborhoods",
        "More effective with strategic placement in high-crime locations"
      ]
    },
    {
      id: "app",
      emoji: "📱",
      title: "Develop Anonymous Crime Reporting App",
      description: "Create a mobile app that allows citizens to report crimes anonymously.",
      infoPoints: [
        "Addresses fear of retaliation when reporting crimes",
        "Particularly effective in low-trust neighborhoods",
        "Increases tips that help solve crimes",
        "Requires digital literacy and smartphone access"
      ]
    },
    {
      id: "education",
      emoji: "🎓",
      title: "Public Education and Consultation",
      description: "Hold community meetings and educational programs about policing.",
      infoPoints: [
        "Builds relationships between police and community",
        "Strengthens social cohesion and community-based support",
        "Heals historical tensions with police",
        "Long-term investment with compounding benefits"
      ]
    },
    {
      id: "drone",
      emoji: "🚁",
      title: "Drone Surveillance",
      description: "Deploy drones for aerial monitoring of high-crime areas.",
      infoPoints: [
        "Covers more ground than traditional patrols",
        "Enables faster response to incidents",
        "Can increase false arrests due to visual identification limitations",
      ]
    },
    {
      id: "facial",
      emoji: "👤",
      title: "Facial Recognition Technology",
      description: "Deploy AI-powered facial recognition to identify suspects from surveillance footage.",
      infoPoints: [
        "Higher error rates for women and darker-skinned individuals",
        "More acceptable in whiter, wealthier areas",
        "Can significantly damage trust in diverse communities",
      ]
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
    <div className="p-3 space-y-4">
      <div className="flex flex-col md:flex-row gap-3">
        {/* Districts on the left */}
        <div className="md:w-3/4">
          <h3 className="text-sm font-semibold mb-2">Select District</h3>
          <div className="grid grid-cols-2 gap-3">
            {["district1", "district2", "district3", "district4"].map((district) => {
              const demographics = getDistrictDemographics(district)
              const districtImplementedActions = implementedActions[district] || []

              return (
                <Card
                  key={district}
                  className={`overflow-hidden border ${
                    selectedDistrict === district
                      ? `ring-2 ring-offset-2 ring-offset-background ring-primary ${districtColors[district]}`
                      : "bg-muted/30 hover:bg-muted/50"
                  } cursor-pointer`}
                  onClick={() => {
                    setSelectedDistrict(district)
                    setSelectedAction(districtActions[district] || "")
                  }}
                >
                  {/* District Header with Title and Metrics */}
                  <CardHeader className={`py-1 px-2 ${selectedDistrict === district ? districtHeaderColors[district] : ""}`}>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-sm flex items-center gap-1.5">
                        <span className="text-lg">{districtEmojis[district]}</span>
                        {getDistrictName(district)}
                      </CardTitle>
                      
                      {/* Metrics badges */}
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
                              F.A.: {gameMetrics.falseArrestRate[district]}%
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
                          <Users size={12} />
                          <span className="font-medium">Population:</span> 
                          <span>{gameMetrics.population[district].toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-left flex-1">
                      {/* Charts section */}
                      <div className="grid grid-cols-2 gap-3">
                        {/* Ethnicity Pie Chart */}
                        <div className="flex gap-2 items-center">
                          <div className="flex flex-col">
                            <span className="text-xs font-medium">Ethnicity</span>
                            <div className="text-[10px] space-y-0.5 mt-1">
                              <div className="flex items-center">
                                <span className="inline-block w-2 h-2 bg-blue-400 mr-1"></span>
                                <span>White</span>
                              </div>
                              <div className="flex items-center">
                                <span className="inline-block w-2 h-2 bg-green-400 mr-1"></span>
                                <span>Black</span>
                              </div>
                              <div className="flex items-center">
                                <span className="inline-block w-2 h-2 bg-yellow-400 mr-1"></span>
                                <span>Hispanic</span>
                              </div>
                              <div className="flex items-center">
                                <span className="inline-block w-2 h-2 bg-purple-400 mr-1"></span>
                                <span>Other</span>
                              </div>
                            </div>
                          </div>
                          <PieChart 
                            data={demographics.ethnicity} 
                            colorMap={['#60a5fa', '#4ade80', '#facc15', '#c084fc']}
                            size={85}
                          />
                        </div>
                        
                        {/* Income Pie Chart */}
                        <div className="flex gap-2 items-center">
                          <div className="flex flex-col">
                            <span className="text-xs font-medium">Income</span>
                            <div className="text-[10px] space-y-0.5 mt-1">
                              <div className="flex items-center">
                                <span className="inline-block w-2 h-2 bg-emerald-400 mr-1"></span>
                                <span>High</span>
                              </div>
                              <div className="flex items-center">
                                <span className="inline-block w-2 h-2 bg-amber-400 mr-1"></span>
                                <span>Middle</span>
                              </div>
                              <div className="flex items-center">
                                <span className="inline-block w-2 h-2 bg-red-400 mr-1"></span>
                                <span>Low</span>
                              </div>
                            </div>
                          </div>
                          <PieChart 
                            data={demographics.income} 
                            colorMap={['#34d399', '#fbbf24', '#f87171']}
                            size={85}
                          />
                        </div>
                      </div>

                      {/* Common crimes section */}
                      <div className="mt-3">
                        <div className="flex items-center">
                          <h4 className="text-xs font-medium mb-1">Common Crimes:</h4>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="ghost" className="h-4 w-4 p-0 ml-1 text-muted-foreground cursor-help">
                                <HelpCircleIcon className="h-3 w-3" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80 p-2 text-xs">
                              <p>Most frequent types of crime in this district.</p>
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

                      {/* Implemented actions */}
                      {districtImplementedActions.length > 0 && (
                        <div className="mt-3">
                          <p className="text-xs font-medium mb-1">Implemented Actions:</p>
                          <div className="flex flex-wrap gap-1">
                            {districtImplementedActions.map((actionId, idx) => (
                              <Badge key={idx} variant="secondary" className="text-[10px] px-1.5 py-0">
                                {getShortActionName(actionId)}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {districtActions[district] ? (
                        <span className="inline-block mt-3 text-[10px] bg-primary/20 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="h-3 w-3 inline mr-1 text-primary" />
                          Action selected
                        </span>
                      ) : null}
                    </div>
                  </CardContent>
                </Card>
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
                          <span className="mr-0.5 text-base">{action.emoji}</span>
                          <Label htmlFor={action.id} className={`font-medium text-sm ${(isImplemented || isFacialRecWithoutCCTV) ? "text-muted-foreground" : ""}`}>
                            {action.title}
                          </Label>
                          {isImplemented && (
                            <Badge variant="outline" className="text-[9px] px-1 py-0">Implemented</Badge>
                          )}
                          {isFacialRecWithoutCCTV && (
                            <Badge variant="outline" className="text-[9px] px-1 py-0">Requires CCTV</Badge>
                          )}
                        </div>
                        <p className="text-[10px] text-muted-foreground leading-tight">{action.description}
                        <Popover>
                            <PopoverTrigger>
                              <InfoIcon className="h-3 w-3 text-muted-foreground cursor-pointer flex-shrink-0 mt-0.5" />
                            </PopoverTrigger>
                            <PopoverContent className="w-64 p-2">
                              <p className="text-xs font-medium mb-1">Effects</p>
                              <ul className="text-xs space-y-0.5">
                                {action.infoPoints.map((point, index) => (
                                  <li key={index} className="flex items-start">
                                    <span className="text-xs mr-1">•</span>
                                    <span>{point}</span>
                                  </li>
                                ))}
                              </ul>
                            </PopoverContent>
                          </Popover>

                        </p>

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

