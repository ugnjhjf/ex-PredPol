"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Minus, InfoIcon, User as UserIcon, AlertTriangle, ChevronDown, ChevronRight, FileText, CheckCircle2 } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

export default function CityMap({ 
  policeAllocation, 
  handlePoliceAllocation, 
  gameMetrics, 
  getDistrictName, 
  districtActions = {}, 
  setDistrictActions = () => {}, 
  implementedActions = {},
  availableActionPoints = 2 // New prop for tracking available action points
}) {
  // Add state to track which districts have expanded details
  const [expandedInfo, setExpandedInfo] = useState({
    district1: false,
    district2: false,
    district3: false,
    district4: false
  });

  // Add state for action selection dialog
  const [showActionDialog, setShowActionDialog] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedAction, setSelectedAction] = useState("");
  const { toast } = useToast();

  // Action definition
  const actions = [
    {
      id: "cctv",
      emoji: "📹",
      title: "CCTV Surveillance",
      description: "Install cameras in public areas to monitor and deter crime.",
    },
    {
      id: "app",
      emoji: "📱",
      title: "Crime Reporting App",
      description: "Allow citizens to anonymously report crimes via mobile app.",
    },
    {
      id: "education",
      emoji: "🎓",
      title: "Public Education",
      description: "Hold community meetings and educational programs about policing.",
    },
    {
      id: "drone",
      emoji: "🚁",
      title: "Drone Surveillance",
      description: "Deploy drones for aerial monitoring of high-crime areas.",
    },
    {
      id: "facial",
      emoji: "👤",
      title: "Facial Recognition",
      description: "Use AI-powered facial recognition to identify suspects.",
    }
  ];

  // Function to handle opening the action dialog
  const openActionDialog = (district) => {
    setSelectedDistrict(district);
    setSelectedAction(districtActions[district] || "");
    setShowActionDialog(true);
  };

  // Function to confirm action selection - Updated for multiple actions
  const confirmAction = () => {
    if (!selectedDistrict || !selectedAction) return;
    
    // Create new object based on current actions rather than clearing all
    const newDistrictActions = {
      ...districtActions,
    };

    // Set the current district action
    newDistrictActions[selectedDistrict] = selectedAction;
    
    // Update the state
    setDistrictActions(newDistrictActions);
    
    // Close the dialog
    setShowActionDialog(false);
    
    // Show a confirmation toast
    toast({
      title: "Action Selected",
      description: `${actions.find(a => a.id === selectedAction)?.title} will be implemented in ${getDistrictName(selectedDistrict)} this round.`,
      duration: 3000,
    });
  };

  // Function to get a short name for an action (for badges)
  const getShortActionName = (actionId) => {
    const shortNames = {
      "cctv": "CCTV",
      "app": "Reporting App",
      "education": "Education",
      "drone": "Drones",
      "facial": "Facial Recognition"
    };
    return shortNames[actionId] || actionId;
  };

  // Function to get badge color based on action type
  const getActionBadgeColor = (actionId) => {
    switch(actionId) {
      case "cctv": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "app": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "education": return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300";
      case "drone": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "facial": return "bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const toggleDistrictInfo = (district) => {
    setExpandedInfo(prev => ({
      ...prev,
      [district]: !prev[district]
    }));
  };

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

  // Get district demographics for charts
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
    };

    return demographics[district];
  };
  
  // Helper function to render pie charts for demographics
  const PieChart = ({ data, colorMap, size = 60 }) => {
    const total = Object.values(data).reduce((sum, value) => sum + value, 0);
    let currentAngle = 0;
    const center = size / 2;
    const radius = size / 2;
    const segments = [];
    
    // Colors for pie segments
    const colors = {
      white: '#60a5fa', // blue-400
      black: '#4ade80', // green-400
      hispanic: '#facc15', // yellow-400
      other: '#c084fc', // purple-400
      high: '#34d399', // emerald-400
      middle: '#fbbf24', // amber-400
      low: '#f87171', // red-400
    };

    Object.entries(data).forEach(([key, value]) => {
      const percentage = (value / total) * 100;
      const angle = (percentage / 100) * 360;
      const largeArcFlag = angle > 180 ? 1 : 0;
      
      const startX = center + radius * Math.cos((currentAngle * Math.PI) / 180);
      const startY = center + radius * Math.sin((currentAngle * Math.PI) / 180);
      
      const endAngle = currentAngle + angle;
      const endX = center + radius * Math.cos((endAngle * Math.PI) / 180);
      const endY = center + radius * Math.sin((endAngle * Math.PI) / 180);
      
      const path = [
        `M ${center},${center}`,
        `L ${startX},${startY}`,
        `A ${radius},${radius} 0 ${largeArcFlag},1 ${endX},${endY}`,
        'Z'
      ].join(' ');
      
      segments.push(
        <path 
          key={key} 
          d={path} 
          fill={colors[key] || colorMap[key]} 
          stroke="#fff" 
          strokeWidth="1"
        />
      );
      
      currentAngle = endAngle;
    });
    
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {segments}
      </svg>
    );
  };

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

  // Calculate used action points
  const usedActionPoints = Object.values(districtActions).filter(action => action !== "").length;
  const remainingActionPoints = Math.max(0, 2 - usedActionPoints);

  return (
    <div className="p-3">
      {/* Action Points Indicator */}
      <div className="flex justify-between items-center mb-3">
        
        <Badge variant="outline" className="px-3 py-1">
          Remaining Actions: <span className="font-bold ml-1">{remainingActionPoints}/2</span>
        </Badge>
      </div>
      
      <div className="flex flex-col md:flex-row gap-3">
        {/* Main districts grid - 75% width */}
        <div className="md:w-3/4 grid grid-cols-2 gap-3">
          {["district1", "district2", "district3", "district4"].map((district) => {
            const districtImplementedActions = implementedActions[district] || [];
            const currentAction = districtActions[district] || "";
            const actionDetails = actions.find(a => a.id === currentAction);
            
            return (
              <Card key={district} className={`overflow-hidden border-2 ${districtColors[district]} ${currentAction ? 'ring-2 ring-primary ring-offset-1 ring-offset-background' : ''}`}>
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
                          <p>Percentage of arrests involving innocent individuals. Lower values indicate more accurate policing.</p>
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
                  <div className="grid grid-cols-2 gap-3">
                    {/* Day shift with emoji */}
                    <div className="space-y-1 border rounded-md p-2 bg-blue-50/50 dark:bg-blue-950/50">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-medium flex items-center gap-1">
                          <span className="text-base">☀️</span> Day Shift
                        </label>
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
                      <div className="flex items-center pt-1">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => decrementPolice(district, "day")}
                          disabled={policeAllocation[district].day <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <div className="w-10 text-center font-medium text-xs">
                          {policeAllocation[district].day} 👮
                        </div>
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
                    
                    {/* Night shift with emoji */}
                    <div className="space-y-1 border rounded-md p-2 bg-indigo-50/50 dark:bg-indigo-950/50">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-medium flex items-center gap-1">
                          <span className="text-base">🌙</span> Night Shift
                        </label>
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
                      <div className="flex items-center pt-1">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => decrementPolice(district, "night")}
                          disabled={policeAllocation[district].night <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <div className="w-10 text-center font-medium text-xs">
                          {policeAllocation[district].night} 👮
                        </div>
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
                  
                  {/* Action Section - UPDATED */}
                  <div className="mt-3 border-t pt-3">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-medium">Actions:</h4>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-6 text-xs"
                        onClick={() => openActionDialog(district)}
                        disabled={remainingActionPoints < 1 && !currentAction} // Disable if no action points left
                      >
                        {currentAction ? "Change Action" : "Add Action"}
                      </Button>
                    </div>
                    
                    <div className="mt-1.5">
                      {currentAction ? (
                        <div className="bg-primary/20 rounded-md p-2 border-2 border-primary text-xs">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-1.5">
                              <span className="text-base">{actionDetails?.emoji || "⚙️"}</span>
                              <span className="font-medium">{actionDetails?.title || currentAction}</span>
                            </div>
                            <Badge className="bg-primary text-[10px]">This Round</Badge>
                          </div>
                          <p className="mt-1 text-[10px] text-muted-foreground">
                            {actionDetails?.description || "Custom action to be implemented"}
                          </p>
                        </div>
                      ) : (
                        <div className="text-xs p-2 border border-dashed border-muted-foreground/30 rounded-md text-muted-foreground text-center">
                          No actions selected for this round
                        </div>
                      )}
                      
                      {districtImplementedActions.length > 0 && (
                        <div className="mt-2">
                          <div className="text-[10px] text-muted-foreground mb-1">Implemented actions:</div>
                          <div className="flex flex-wrap gap-1.5">
                            {districtImplementedActions.map((actionId, idx) => (
                              <Badge 
                                key={idx} 
                                className={`text-[10px] ${getActionBadgeColor(actionId)}`}
                              >
                                <CheckCircle2 className="h-2.5 w-2.5 mr-0.5" />
                                {getShortActionName(actionId)}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Replace District Details button with an icon button */}
                  <div className="mt-3 flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 rounded-full p-0"
                      onClick={() => toggleDistrictInfo(district)}
                    >
                      <FileText className={`h-4 w-4 ${expandedInfo[district] ? 'text-primary' : 'text-muted-foreground'}`} />
                      <span className="sr-only">District Details</span>
                    </Button>
                  </div>
                  
                  {/* Collapsible content */}
                  {expandedInfo[district] && (
                    <div className="mt-2 pt-2 border-t">
                      {/* Common crimes section */}
                      <div className="mb-2">
                        <div className="flex items-center">
                          <h4 className="text-xs font-medium mb-1">Common Crimes:</h4>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {gameMetrics.commonCrimes[district].map((crime, index) => (
                            <span key={index} className="text-[10px] bg-muted px-1.5 py-0.5 rounded">
                              {crime}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      {/* Demographics section */}
                      <div className="mb-2">
                        <h4 className="text-xs font-medium mb-1">Demographics:</h4>
                        <div className="grid grid-cols-2 gap-2 text-[10px]">
                          {/* Ethnicity */}
                          <div className="flex items-center gap-1">
                            <PieChart 
                              data={getDistrictDemographics(district).ethnicity} 
                              colorMap={{
                                white: '#60a5fa', 
                                black: '#4ade80', 
                                hispanic: '#facc15', 
                                other: '#c084fc'
                              }}
                            />
                            <div className="space-y-0.5">
                              <div className="font-medium">Ethnicity</div>
                              <div className="flex items-center">
                                <span className="inline-block w-2 h-2 bg-blue-400 mr-1"></span>
                                <span>White {getDistrictDemographics(district).ethnicity.white}%</span>
                              </div>
                              <div className="flex items-center">
                                <span className="inline-block w-2 h-2 bg-green-400 mr-1"></span>
                                <span>Black {getDistrictDemographics(district).ethnicity.black}%</span>
                              </div>
                              <div className="flex items-center">
                                <span className="inline-block w-2 h-2 bg-yellow-400 mr-1"></span>
                                <span>Hispanic {getDistrictDemographics(district).ethnicity.hispanic}%</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Income */}
                          <div className="flex items-center gap-1">
                            <PieChart 
                              data={getDistrictDemographics(district).income} 
                              colorMap={{
                                high: '#34d399',
                                middle: '#fbbf24',
                                low: '#f87171'
                              }}
                            />
                            <div className="space-y-0.5">
                              <div className="font-medium">Income</div>
                              <div className="flex items-center">
                                <span className="inline-block w-2 h-2 bg-emerald-400 mr-1"></span>
                                <span>High {getDistrictDemographics(district).income.high}%</span>
                              </div>
                              <div className="flex items-center">
                                <span className="inline-block w-2 h-2 bg-amber-400 mr-1"></span>
                                <span>Middle {getDistrictDemographics(district).income.middle}%</span>
                              </div>
                              <div className="flex items-center">
                                <span className="inline-block w-2 h-2 bg-red-400 mr-1"></span>
                                <span>Low {getDistrictDemographics(district).income.low}%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* District-specific hint */}
                      <div className="text-[10px] bg-muted p-1.5 rounded">
                        {district === "district1" && "💡 Downtown has more white-collar crime during day hours. Consider a balanced approach."}
                        {district === "district2" && "💡 Westside needs fairly even coverage with slight emphasis on night shifts."}
                        {district === "district3" && "💡 South Side experiences significantly more crime at night. Consider allocating more night officers."}
                        {district === "district4" && "💡 Eastside has higher crime rates in evening and night hours."}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        {/* Population panel - 25% width on the right */}
        <div className="md:w-1/4">
          <Card className="sticky top-4">
            <CardHeader className="py-2 px-3">
              <CardTitle className="text-sm flex items-center">
                <UserIcon className="h-4 w-4 mr-1" />
                Population Overview
              </CardTitle>
              <CardDescription className="text-xs">District population distribution</CardDescription>
            </CardHeader>
            <CardContent className="px-3 py-2">
              <ScrollArea className="h-[calc(100vh-280px)]">
                {/* Population pie chart with improved responsive layout */}
                <div className="flex flex-col items-center mb-4">
                  <div>
                    <PieChart 
                      data={{
                        district1: gameMetrics.population.district1,
                        district2: gameMetrics.population.district2,
                        district3: gameMetrics.population.district3,
                        district4: gameMetrics.population.district4
                      }}
                      colorMap={{
                        district1: '#3b82f6', // blue-500
                        district2: '#10b981', // green-500
                        district3: '#f59e0b', // amber-500
                        district4: '#8b5cf6'  // purple-500
                      }}
                      size={120}
                    />
                  </div>
                  
                  {/* Legend moved below the chart for better responsiveness */}
                  <div className="mt-2 w-full">
                    <div className="space-y-2">
                      {["district1", "district2", "district3", "district4"].map((district) => (
                        <div key={district} className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <span className={`inline-block w-3 h-3 rounded-full ${
                              district === "district1" ? "bg-blue-500" : 
                              district === "district2" ? "bg-green-500" : 
                              district === "district3" ? "bg-amber-500" : 
                              "bg-purple-500"
                            }`}></span>
                            <div className="flex items-center text-xs">
                              <span className="text-xs">{districtEmojis[district]} {getDistrictName(district)}</span>
                            </div>
                          </div>
                          <span className="text-xs font-medium">
                            {gameMetrics.population[district].toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Total population */}
                <div className="mt-6 pt-4 border-t">
                  <div className="font-medium text-xs mb-2">Total City Population</div>
                  <div className="text-xl font-bold">
                    {(
                      gameMetrics.population.district1 +
                      gameMetrics.population.district2 +
                      gameMetrics.population.district3 +
                      gameMetrics.population.district4
                    ).toLocaleString()}
                  </div>
                </div>

                {/* ...existing police allocation section... */}
                <div className="mt-4 pt-4 border-t">
                  <div className="font-medium text-xs mb-2">Police Allocation</div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Available Officers:</span>
                      <span className="font-bold">{policeAllocation.unallocated} 👮</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Allocated Officers:</span>
                      <span className="font-bold">{20 - policeAllocation.unallocated} 👮</span>
                    </div>
                    <div className="flex justify-between text-xs border-t pt-1 mt-1">
                      <span>Total Force:</span>
                      <span className="font-bold">20 👮</span>
                    </div>
                    
                    
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Action Selection Dialog */}
      <Dialog open={showActionDialog} onOpenChange={setShowActionDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Select Action for {selectedDistrict && getDistrictName(selectedDistrict)}</DialogTitle>
            <DialogDescription>
              Choose an action to implement in this district for the current round.
            </DialogDescription>
            {/* Move the Badge outside DialogDescription to fix the hydration error */}
            <Badge variant="outline" className="mt-2">
              Remaining Action Points: {remainingActionPoints}/2
            </Badge>
          </DialogHeader>
          
          <div className="py-4">
            <RadioGroup value={selectedAction} onValueChange={setSelectedAction} className="space-y-2">
              {actions.map((action) => {
                const isImplemented = selectedDistrict && implementedActions[selectedDistrict]?.includes(action.id);
                const isFacialRecWithoutCCTV = action.id === "facial" && 
                  selectedDistrict && !implementedActions[selectedDistrict]?.includes("cctv");
                
                return (
                  <div 
                    key={action.id} 
                    className={`flex items-start space-x-2 border rounded-md p-2 ${
                      selectedAction === action.id ? "bg-primary/10 border-primary/30" : ""
                    } ${
                      isImplemented || isFacialRecWithoutCCTV
                        ? "bg-muted opacity-60 cursor-not-allowed" 
                        : "hover:bg-muted/50"
                    }`}
                  >
                    <RadioGroupItem 
                      value={action.id} 
                      id={action.id + "-dialog"} 
                      className="mt-1" 
                      disabled={isImplemented || isFacialRecWithoutCCTV}
                    />
                    <div className="grid gap-0.5">
                      <div className="flex items-center gap-1">
                        <span className="mr-0.5 text-base">{action.emoji}</span>
                        <Label htmlFor={action.id + "-dialog"} className={`font-medium ${(isImplemented || isFacialRecWithoutCCTV) ? "text-muted-foreground" : ""}`}>
                          {action.title}
                        </Label>
                        {isImplemented && (
                          <Badge variant="secondary" className="text-xs px-1 py-0">Already Implemented</Badge>
                        )}
                        {isFacialRecWithoutCCTV && (
                          <Badge variant="outline" className="text-xs px-1 py-0">Requires CCTV</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{action.description}</p>
                    </div>
                  </div>
                );
              })}
            </RadioGroup>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowActionDialog(false)}>Cancel</Button>
            <Button 
              onClick={confirmAction} 
              disabled={!selectedAction || (remainingActionPoints < 1 && !districtActions[selectedDistrict])}
            >
              Confirm Action
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
