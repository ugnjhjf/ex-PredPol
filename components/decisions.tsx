"use client"

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HelpCircle, Users, CheckCircle2, Sun, Moon, Shield, Info, UserCheck, Plus, AlertTriangle } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

export default function CityMap({ 
  policeAllocation, 
  handlePoliceAllocation, 
  gameMetrics, 
  getDistrictName, 
  districtActions = {}, 
  setDistrictActions = () => {}, 
  implementedActions = {},
  availableActionPoints = 2
}) {
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
      cost: 200,
    },
    {
      id: "app",
      emoji: "📱",
      title: "Crime Reporting App",
      description: "Allow citizens to anonymously report crimes via mobile app.",
      cost: 150,
    },
    {
      id: "education",
      emoji: "🎓",
      title: "Public Education",
      description: "Hold community meetings and educational programs about policing.",
      cost: 100,
    },
    {
      id: "drone",
      emoji: "🚁",
      title: "Drone Surveillance",
      description: "Deploy drones for aerial monitoring of high-crime areas.",
      cost: 300,
    },
    {
      id: "facial",
      emoji: "👤",
      title: "Facial Recognition",
      description: "Use AI-powered facial recognition to identify suspects.",
      cost: 250,
    }
  ];

  // Function to handle opening the action dialog
  const openActionDialog = (district) => {
    setSelectedDistrict(district);
    setSelectedAction(districtActions[district] || "");
    setShowActionDialog(true);
  };

  // Function to confirm action selection - Updated to allow same action in different districts
  const confirmAction = () => {
    if (!selectedDistrict || !selectedAction) return;
    
    // Calculate how many actions are already selected
    const currentActionCount = Object.values(districtActions).filter(action => action !== "").length;
    
    // Check if this district already has an action and we're just changing it
    const isReplacingExistingAction = districtActions[selectedDistrict] !== "";
    
    // Check if we're exceeding the action limit
    if (!isReplacingExistingAction && currentActionCount >= availableActionPoints) {
      toast({
        title: "Action Limit Reached",
        description: `You can only select ${availableActionPoints} actions per round. Remove an action before adding a new one.`,
        variant: "destructive",
        duration: 3000,
      });
      setShowActionDialog(false);
      return;
    }
    
    // Check if this action is already implemented in this district
    if (implementedActions[selectedDistrict]?.includes(selectedAction)) {
      toast({
        title: "Action Already Implemented",
        description: `${actions.find(a => a.id === selectedAction)?.title} has already been implemented in ${getDistrictName(selectedDistrict)}.`,
        variant: "destructive",
        duration: 3000,
      });
      setShowActionDialog(false);
      return;
    }
    
    // Create new object based on current actions
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

  // Function to clear an action for a district
  const clearAction = (district) => {
    const newDistrictActions = {
      ...districtActions,
    };

    // Clear the action for this district
    newDistrictActions[district] = "";
    
    // Update the state
    setDistrictActions(newDistrictActions);
    
    toast({
      title: "Action Removed",
      description: `Action for ${getDistrictName(district)} has been removed.`,
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
  
  // Helper function to render pie charts for demographics - Updated to make charts larger
  const PieChart = ({ data, colorMap, size = 70 }) => {
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

  // Updated crime color thresholds
  const getCrimeColor = (crimes) => {
    if (crimes <= 24) return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
    if (crimes <= 50) return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
    return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
  }

  // Helper function to get crime severity label - updated thresholds
  const getCrimeSeverityLabel = (crimes) => {
    if (crimes <= 24) return "Low"
    if (crimes <= 50) return "Moderate"
    return "High"
  }

  const getFalseArrestColor = (rate) => {
    if (rate < 5) return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
    if (rate <= 10) return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
    return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
  }

  // Helper function for false arrest severity label
  const getFalseArrestSeverityLabel = (rate) => {
    if (rate < 5) return "Good"
    if (rate <= 10) return "Medium"
    return "High"
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

  // Helper function to check if a metric needs attention and provide tips
  const getMetricWarningInfo = (district, metricType) => {
    switch(metricType) {
      case 'crime':
        if (gameMetrics.crimesReported[district] > 50) {
          return {
            warning: true,
            title: "Crime Rate", // Removed "High"
            description: "Crime rate is at a concerning level in this district.",
            tips: [
              "Increase police presence, especially during high-crime hours",
              "Consider implementing CCTV or crime reporting app",
              "Balance day and night shifts based on crime patterns",
              "Target specific areas where common crimes occur"
            ]
          };
        }
        return { warning: false };
        
      case 'falseArrest':
        if (gameMetrics.falseArrestRate[district] > 10) {
          return {
            warning: true,
            title: "False Arrest Rate", // Removed "High"
            description: "False arrests are damaging community trust and may trigger protests.",
            tips: [
              "Implement community education programs",
              "Avoid over-policing which creates pressure for arrests",
              "Be cautious with facial recognition in diverse communities",
              "Focus on quality evidence gathering rather than quantity of arrests"
            ]
          };
        }
        return { warning: false };
        
      case 'racialBias':
        // Calculate a simple racial bias indicator (comparing arrest percentages to demographics)
        const demographics = getDistrictDemographics(district);
        const arrests = gameMetrics.arrestsByRace;
        
        // Check if Black arrest percentage is significantly higher than demographic percentage
        const blackBias = arrests.black[district] - demographics.ethnicity.black;
        
        if (blackBias > 20) {
          return {
            warning: true,
            title: "Potential Racial Bias", // This one was fine - already doesn't use "High"
            description: "Arrests show significant demographic disparities compared to population.",
            tips: [
              "Implement community education and engagement",
              "Avoid over-policing certain neighborhoods",
              "Review and adjust patrol allocation practices",
              "Consider anonymous reporting tools to reduce subjective enforcement"
            ]
          };
        }
        return { warning: false };
        
      default:
        return { warning: false };
    }
  };

  // Calculate used action points
  const usedActionPoints = Object.values(districtActions).filter(action => action !== "").length;
  const remainingActionPoints = Math.max(0, availableActionPoints - usedActionPoints);

  return (
    <div className="p-3">
      {/* Action Points Indicator */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Available Actions: {remainingActionPoints}/{availableActionPoints}</span>
          <Popover>
            <PopoverTrigger asChild>
              <Info className="h-4 w-4 text-muted-foreground cursor-help" />
            </PopoverTrigger>
            <PopoverContent className="w-80 p-3 text-sm">
              <p>You can implement up to {availableActionPoints} actions per round. The same action can be used in different districts, but each district can only have one action per round. You can change your selections before ending the round.</p>
            </PopoverContent>
          </Popover>
        </div>
        <Progress 
          value={(usedActionPoints / availableActionPoints) * 100} 
          className="w-40 h-2" 
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {["district1", "district2", "district3", "district4"].map((district) => {
          const demographics = getDistrictDemographics(district);
          const districtImplementedActions = implementedActions[district] || [];
          const totalPolice = policeAllocation[district].day + policeAllocation[district].night;
          const hasSelectedAction = districtActions[district] !== "";
          
          // Get warning info for each metric
          const crimeWarning = getMetricWarningInfo(district, 'crime');
          const falseArrestWarning = getMetricWarningInfo(district, 'falseArrest');
          const racialBiasWarning = getMetricWarningInfo(district, 'racialBias');
          
          return (
            <Card 
              key={district} 
              className={`border ${districtColors[district]} shadow-sm`}
            >
              <CardHeader className={`py-1.5 px-3 ${districtHeaderColors[district]}`}>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-sm flex items-center gap-1">
                    <span className="text-base">{districtEmojis[district]}</span>
                    {getDistrictName(district)}
                  </CardTitle>
                  {hasSelectedAction ? (
                    <div className="flex items-center gap-2">
                      <Badge 
                        className={`${getActionBadgeColor(districtActions[district])} text-xs`}
                        variant="outline"
                      >
                        {actions.find(a => a.id === districtActions[district])?.emoji} {getShortActionName(districtActions[district])}
                      </Badge>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        className="h-7 px-2 text-xs"
                        onClick={() => clearAction(district)}
                      >
                        ✕
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      size="sm" 
                      variant="secondary"
                      onClick={() => openActionDialog(district)}
                      className="h-7 text-xs px-2.5 bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-1"
                      disabled={remainingActionPoints === 0 && !hasSelectedAction}
                    >
                      <Plus className="h-3 w-3" />
                      Select Action
                    </Button>
                  )}
                </div>
                <CardDescription className="text-xs">
                  {district === "district1" && "High income area, primarily white population"}
                  {district === "district2" && "Mixed income area with diverse population"}
                  {district === "district3" && "Low income area, primarily minority population"}
                  {district === "district4" && "Mixed demographic with historical tensions"}
                </CardDescription>
              </CardHeader>

              <CardContent className="p-3">
                {/* 5 key metrics at the top in grid layout */}
                <div className="grid grid-cols-5 gap-1.5 text-xs mb-3">
                  {/* Population */}
                  <div className="p-1.5 rounded flex flex-col items-center bg-violet-100 dark:bg-violet-900 text-violet-800 dark:text-violet-200">
                    <span>Population</span>
                    <span className="font-bold text-sm">{gameMetrics.population[district].toLocaleString()}</span>
                  </div>
                  
                  {/* Community Trust */}
                  <div className={`p-1.5 rounded flex flex-col items-center ${getTrustColor(gameMetrics.communityTrust[district])}`}>
                    <span>Trust</span>
                    <span className="font-bold text-sm">{gameMetrics.communityTrust[district]}%</span>
                  </div>
                  
                  {/* Crimes Reported - Fix bullet points */}
                  <div className={`p-1.5 rounded flex flex-col items-center ${getCrimeColor(gameMetrics.crimesReported[district])}`}>
                    <div className="flex items-center gap-1">
                      <span>Crimes</span>
                      {crimeWarning.warning && (
                        <Popover>
                          <PopoverTrigger>
                            <AlertTriangle 
                              className="h-3 w-3 text-red-600 dark:text-red-400 cursor-help" 
                            />
                          </PopoverTrigger>
                          <PopoverContent className="w-64 p-2.5">
                            <div className="space-y-1.5">
                              <h4 className="font-medium text-sm flex items-center gap-1.5">
                                <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                                {crimeWarning.title}
                              </h4>
                              <p className="text-xs">{crimeWarning.description}</p>
                              <div className="pt-0.5">
                                <p className="text-[10px] font-medium mb-0.5">Tips:</p>
                                <ul className="text-[9px] space-y-0.5 pl-4">
                                  {crimeWarning.tips.map((tip, i) => (
                                    <li key={i} className="flex items-start">
                                      <span className="text-primary inline-block mr-1.5 ml-[-1rem]">•</span>
                                      <span>{tip}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      )}
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="font-bold text-sm">{gameMetrics.crimesReported[district]}</span>
                    </div>
                  </div>
                  
                  {/* Suspects Arrested */}
                  <div className="p-1.5 rounded flex flex-col items-center bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                    <span>Arrests</span>
                    <span className="font-bold text-sm">{gameMetrics.arrests?.[district] || 0}</span>
                  </div>
                  
                  {/* False Arrest Rate - Fix bullet points */}
                  <div className={`p-1.5 rounded flex flex-col items-center ${getFalseArrestColor(gameMetrics.falseArrestRate[district])}`}>
                    <div className="flex items-center gap-1">
                      <span>False Arrests</span>
                      {falseArrestWarning.warning && (
                        <Popover>
                          <PopoverTrigger>
                            <AlertTriangle 
                              className="h-3 w-3 text-red-600 dark:text-red-400 cursor-help" 
                            />
                          </PopoverTrigger>
                          <PopoverContent className="w-64 p-2.5">
                            <div className="space-y-1.5">
                              <h4 className="font-medium text-sm flex items-center gap-1.5">
                                <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                                {falseArrestWarning.title}
                              </h4>
                              <p className="text-xs">{falseArrestWarning.description}</p>
                              <div className="pt-0.5">
                                <p className="text-[10px] font-medium mb-0.5">Tips:</p>
                                <ul className="text-[9px] space-y-0.5 pl-4">
                                  {falseArrestWarning.tips.map((tip, i) => (
                                    <li key={i} className="flex items-start">
                                      <span className="text-primary inline-block mr-1.5 ml-[-1rem]">•</span>
                                      <span>{tip}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      )}
                    </div>
                    <span className="font-bold text-sm">{gameMetrics.falseArrestRate[district]}%</span>

                    
                  </div>
                </div>
                
                {/* Remaining content in two columns */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Left column: Community trust and police allocation */}
                  <div className="space-y-2">
                    {/* Community Trust */}

                    
                    {/* Police allocation controls */}
                    <div className="bg-muted/40 p-2 rounded space-y-2">
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="text-xs font-medium flex items-center">
                          <Shield className="h-3.5 w-3.5 mr-1" />
                          Police: {totalPolice} officers
                        </h4>
                        <div>
                          {totalPolice > 7 && (
                            <Badge variant="destructive" className="text-[10px] px-1.5 py-0">Over-policed</Badge>
                          )}
                          {totalPolice < 3 && (
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0">Under-policed</Badge>
                          )}
                        </div>
                      </div>
                      
                      {/* Day shift with sun icon - Added effectiveness info popover */}
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Sun className="h-3 w-3 mr-1 text-amber-500" />
                          <label className="text-xs">Day Shift:</label>
                          <Popover>
                            <PopoverTrigger>
                              <Info className="h-3 w-3 ml-1 text-muted-foreground cursor-help" />
                            </PopoverTrigger>
                            <PopoverContent side="right" className="p-2 text-xs w-60">
                              {getShiftEffectivenessInfo(district)}
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div className="flex space-x-1 items-center">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-5 w-5 p-0 text-xs"
                            onClick={() => {
                              if (policeAllocation[district].day > 1) {
                                handlePoliceAllocation(district, "day", policeAllocation[district].day - 1)
                              }
                            }}
                            disabled={policeAllocation[district].day <= 1}
                          >
                            -
                          </Button>
                          <span className="w-4 text-center text-xs">{policeAllocation[district].day}</span>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-5 w-5 p-0 text-xs"
                            onClick={() => handlePoliceAllocation(district, "day", policeAllocation[district].day + 1)}
                            disabled={policeAllocation.unallocated <= 0}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                      
                      {/* Night shift with moon icon - Added effectiveness info popover */}
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Moon className="h-3 w-3 mr-1 text-indigo-400" />
                          <label className="text-xs">Night Shift:</label>
                          <Popover>
                            <PopoverTrigger>
                              <Info className="h-3 w-3 ml-1 text-muted-foreground cursor-help" />
                            </PopoverTrigger>
                            <PopoverContent side="right" className="p-2 text-xs w-60">
                              {getShiftEffectivenessInfo(district)}
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div className="flex space-x-1 items-center">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-5 w-5 p-0 text-xs"
                            onClick={() => {
                              if (policeAllocation[district].night > 1) {
                                handlePoliceAllocation(district, "night", policeAllocation[district].night - 1)
                              }
                            }}
                            disabled={policeAllocation[district].night <= 1}
                          >
                            -
                          </Button>
                          <span className="w-4 text-center text-xs">{policeAllocation[district].night}</span>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-5 w-5 p-0 text-xs"
                            onClick={() => handlePoliceAllocation(district, "night", policeAllocation[district].night + 1)}
                            disabled={policeAllocation.unallocated <= 0}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                      
                      {/* Removed the separate shift effectiveness info section that was here */}
                    </div>

                    {/* Common crimes */}
                    <div className="text-xs">
                      <h4 className="font-medium mb-0.5">Common Crimes:</h4>
                      <div className="flex flex-wrap gap-1">
                        {gameMetrics.commonCrimes[district].map((crime, index) => (
                          <Badge key={index} variant="outline" className="text-[10px] py-0">{crime}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Right column: demographics and actions */}
                  <div className="space-y-2">                    
                    {/* Demographics with pie charts */}
                    <div className="space-y-1">
                      <div className="flex items-center">
                        <h5 className="text-xs font-medium">Demographics</h5>
                        {/* Racial bias warning with fixed bullet points */}
                        {racialBiasWarning.warning && (
                          <Popover>
                            <PopoverTrigger>
                              <AlertTriangle 
                                className="h-3 w-3 ml-1.5 text-red-600 dark:text-red-400 cursor-help" 
                              />
                            </PopoverTrigger>
                            <PopoverContent className="w-64 p-2.5">
                              <div className="space-y-1.5">
                                <h4 className="font-medium text-sm flex items-center gap-1.5">
                                  <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                                  {racialBiasWarning.title}
                                </h4>
                                <p className="text-xs">{racialBiasWarning.description}</p>
                                <div className="pt-0.5">
                                  <p className="text-[10px] font-medium mb-0.5">Tips:</p>
                                  <ul className="text-[9px] space-y-0.5 pl-4">
                                    {racialBiasWarning.tips.map((tip, i) => (
                                      <li key={i} className="flex items-start">
                                        <span className="text-primary inline-block mr-1.5 ml-[-1rem]">•</span>
                                        <span>{tip}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 bg-muted/30 p-2 rounded">
                        {/* Ethnicity pie chart */}
                        <div>
                          <h6 className="text-[10px] mb-0.5 text-center">Ethnicity</h6>
                          <div className="flex justify-center">
                            <PieChart 
                              data={demographics.ethnicity} 
                              size={60}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-x-1 mt-1">
                            {Object.entries(demographics.ethnicity).map(([key, value]) => (
                              <div key={key} className="flex items-center text-[9px]">
                                <div 
                                  className="w-1.5 h-1.5 rounded-full mr-0.5"
                                  style={{ 
                                    backgroundColor: key === 'white' ? '#60a5fa' : 
                                                    key === 'black' ? '#4ade80' :
                                                    key === 'hispanic' ? '#facc15' : '#c084fc'
                                  }}
                                />
                                <span>{key.charAt(0).toUpperCase() + key.slice(1)}: {value}%</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Income pie chart */}
                        <div>
                          <h6 className="text-[10px] mb-0.5 text-center">Income</h6>
                          <div className="flex justify-center">
                            <PieChart 
                              data={demographics.income} 
                              size={60}
                            />
                          </div>
                          <div className="grid grid-cols-1 gap-x-1 mt-1">
                            {Object.entries(demographics.income).map(([key, value]) => (
                              <div key={key} className="flex items-center text-[9px]">
                                <div 
                                  className="w-1.5 h-1.5 rounded-full mr-0.5"
                                  style={{ 
                                    backgroundColor: key === 'high' ? '#34d399' : 
                                                    key === 'middle' ? '#fbbf24' : '#f87171'
                                  }}
                                />
                                <span>{key.charAt(0).toUpperCase() + key.slice(1)}: {value}%</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Implemented actions */}
                    <div className="text-xs">
                      <h5 className="font-medium">Implemented Actions:</h5>
                      {districtImplementedActions.length > 0 ? (
                        <div className="flex flex-wrap gap-1 mt-0.5">
                          {districtImplementedActions.map((actionId, idx) => (
                            <Badge 
                              key={idx}
                              className={`${getActionBadgeColor(actionId)} text-[10px]`}
                              style={{ 
                                backgroundColor: actionId === "cctv" ? "var(--blue-100) !important" : 
                                               actionId === "app" ? "var(--green-100) !important" :
                                               actionId === "education" ? "var(--amber-100) !important" : 
                                               actionId === "drone" ? "var(--purple-100) !important" :
                                               actionId === "facial" ? "var(--rose-100) !important" : "var(--gray-100) !important",
                                color: actionId === "cctv" ? "var(--blue-800) !important" : 
                                      actionId === "app" ? "var(--green-800) !important" :
                                      actionId === "education" ? "var(--amber-800) !important" : 
                                      actionId === "drone" ? "var(--purple-800) !important" :
                                      actionId === "facial" ? "var(--rose-800) !important" : "var(--gray-800) !important",
                                opacity: "1 !important"
                              }}
                            >
                              {getShortActionName(actionId)}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[10px] text-muted-foreground italic">No actions implemented yet</p>
                      )}
                    </div>
                    
                    {/* Selected action for this round */}
                    {districtActions[district] && (
                      <div className="bg-primary/10 p-1.5 rounded-md flex items-center">
                        <CheckCircle2 className="h-3.5 w-3.5 text-primary mr-1" />
                        <span className="text-[10px]">
                          <span className="font-medium">{actions.find(a => a.id === districtActions[district])?.title}</span> selected for this round
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {/* Action Selection Dialog */}
      <Dialog open={showActionDialog} onOpenChange={setShowActionDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select Action for {selectedDistrict && getDistrictName(selectedDistrict)}</DialogTitle>
            <DialogDescription>
              Choose an action to implement in this district for the current round. 
              You can select up to {availableActionPoints} actions per round ({remainingActionPoints} remaining).
            </DialogDescription>
          </DialogHeader>
          <div className="py-3">
            <div className="space-y-3">
              {actions.map((action) => {
                // Only check if this specific action is already implemented in this specific district
                const isAlreadyImplemented = selectedDistrict && implementedActions[selectedDistrict]?.includes(action.id);
                const isFacialRecWithoutCCTV = action.id === "facial" && 
                  selectedDistrict && !implementedActions[selectedDistrict]?.includes("cctv");
                
                return (
                  <div 
                    key={action.id}
                    className={`flex items-center space-x-3 p-2 rounded border ${
                      selectedAction === action.id ? "border-primary bg-primary/5" : "border-border"
                    } ${
                      isAlreadyImplemented || isFacialRecWithoutCCTV ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                    }`}
                    onClick={() => {
                      if (!isAlreadyImplemented && !isFacialRecWithoutCCTV) {
                        setSelectedAction(action.id);
                      }
                    }}
                  >
                    <div className="text-2xl">{action.emoji}</div>
                    <div className="flex-1">
                      <div className="font-medium text-sm flex items-center gap-2">
                        {action.title}
                        {isAlreadyImplemented && <Badge variant="secondary" className="text-xs">Already Implemented</Badge>}
                        {isFacialRecWithoutCCTV && <Badge variant="outline" className="text-xs">Requires CCTV First</Badge>}
                      </div>
                      <div className="text-xs text-muted-foreground">{action.description}</div>
                    </div>
                    <div className="text-xs font-medium">
                      Cost: ${action.cost}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowActionDialog(false)}>Cancel</Button>
            <Button 
              disabled={!selectedAction || (selectedDistrict && implementedActions[selectedDistrict]?.includes(selectedAction))}
              onClick={confirmAction}
            >
              Confirm Selection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
