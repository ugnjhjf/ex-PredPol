"use client"

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HelpCircle, Users, CheckCircle2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

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
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {["district1", "district2", "district3", "district4"].map((district) => {
          const demographics = getDistrictDemographics(district);
          const districtImplementedActions = implementedActions[district] || [];
          const totalPolice = policeAllocation[district].day + policeAllocation[district].night;
          
          return (
            <Card 
              key={district} 
              className={`border ${districtColors[district]}`}
            >
              <CardHeader className={`py-3 ${districtHeaderColors[district]}`}>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-1.5">
                    <span className="text-xl">{districtEmojis[district]}</span>
                    {getDistrictName(district)}
                  </CardTitle>
                  <Button 
                    size="sm" 
                    onClick={() => openActionDialog(district)}
                    disabled={Object.values(districtActions).filter(Boolean).length > 0 && !districtActions[district]}
                  >
                    Select Action
                  </Button>
                </div>
                <CardDescription>
                  {district === "district1" && "High income area, primarily white population"}
                  {district === "district2" && "Mixed income area with diverse population"}
                  {district === "district3" && "Low income area, primarily minority population"}
                  {district === "district4" && "Mixed demographic with historical tensions"}
                </CardDescription>
              </CardHeader>
              
              {/* Use tabs to organize the district content */}
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid grid-cols-2 rounded-none border-t">
                  <TabsTrigger value="overview" className="text-xs">Key Metrics</TabsTrigger>
                  <TabsTrigger value="details" className="text-xs">Demographics</TabsTrigger>
                </TabsList>
                
                {/* Overview Tab - Shows key metrics and police allocation */}
                <TabsContent value="overview" className="p-0 border-0">
                  <CardContent className="pt-4">
                    <div className="flex flex-col space-y-3">
                      {/* Current metrics */}
                      <div className="grid grid-cols-3 gap-2 text-sm mb-2">
                        <div className="p-2 bg-muted/50 rounded-md">
                          <div className="text-xs text-muted-foreground">Trust</div>
                          <div className="text-lg font-semibold">{gameMetrics.communityTrust[district]}%</div>
                        </div>
                        <div className="p-2 bg-muted/50 rounded-md">
                          <div className="text-xs text-muted-foreground">Crime</div>
                          <div className="text-lg font-semibold">{gameMetrics.crimesReported[district]}</div>
                        </div>
                        <div className="p-2 bg-muted/50 rounded-md">
                          <div className="text-xs text-muted-foreground">False Arrests</div>
                          <div className="text-lg font-semibold">{gameMetrics.falseArrestRate[district]}%</div>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <Users className="h-4 w-4" />
                            <span className="text-sm font-medium">Population:</span>
                          </div>
                          <span className="font-medium">{gameMetrics.population[district].toLocaleString()}</span>
                        </div>
                      </div>
                      
                      {/* Police allocation */}
                      <div className="mt-2">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-sm font-medium">Police Allocation</h3>
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-medium">{totalPolice} officers</span>
                            {totalPolice > 7 && (
                              <Badge variant="destructive" className="text-[10px] px-1.5 py-0">Over-policed</Badge>
                            )}
                            {totalPolice < 3 && (
                              <Badge variant="outline" className="text-[10px] px-1.5 py-0">Under-policed</Badge>
                            )}
                          </div>
                        </div>
                        
                        {/* Day Shift */}
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <label htmlFor={`${district}-day`} className="text-sm">Day Shift:</label>
                            <div className="flex space-x-2 items-center">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-6 w-6 p-0"
                                onClick={() => {
                                  if (policeAllocation[district].day > 1) {
                                    handlePoliceAllocation(district, "day", policeAllocation[district].day - 1)
                                  }
                                }}
                                disabled={policeAllocation[district].day <= 1}
                              >
                                -
                              </Button>
                              <span className="w-6 text-center">{policeAllocation[district].day}</span>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-6 w-6 p-0"
                                onClick={() => handlePoliceAllocation(district, "day", policeAllocation[district].day + 1)}
                                disabled={policeAllocation.unallocated <= 0}
                              >
                                +
                              </Button>
                            </div>
                          </div>
                          
                          {/* Night Shift */}
                          <div className="flex justify-between items-center">
                            <label htmlFor={`${district}-night`} className="text-sm">Night Shift:</label>
                            <div className="flex space-x-2 items-center">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-6 w-6 p-0"
                                onClick={() => {
                                  if (policeAllocation[district].night > 1) {
                                    handlePoliceAllocation(district, "night", policeAllocation[district].night - 1)
                                  }
                                }}
                                disabled={policeAllocation[district].night <= 1}
                              >
                                -
                              </Button>
                              <span className="w-6 text-center">{policeAllocation[district].night}</span>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-6 w-6 p-0"
                                onClick={() => handlePoliceAllocation(district, "night", policeAllocation[district].night + 1)}
                                disabled={policeAllocation.unallocated <= 0}
                              >
                                +
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Implemented Actions */}
                      {districtImplementedActions.length > 0 && (
                        <div className="mt-2">
                          <h3 className="text-sm font-medium mb-1">Implemented Actions:</h3>
                          <div className="flex flex-wrap gap-1.5">
                            {districtImplementedActions.map((actionId, idx) => (
                              <Badge key={idx} variant="secondary">{getShortActionName(actionId)}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Selected Action */}
                      {districtActions[district] && (
                        <div className="mt-2 p-2 bg-primary/10 rounded-md flex items-center">
                          <CheckCircle2 className="h-4 w-4 text-primary mr-2" />
                          <span className="text-sm">Action selected for this round: <span className="font-medium">{getShortActionName(districtActions[district])}</span></span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </TabsContent>
                
                {/* Details Tab - Shows demographic information */}
                <TabsContent value="details" className="p-0 border-0">
                  <CardContent className="pt-4">
                    <div className="flex flex-col space-y-4">
                      {/* Common crimes section */}
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <h3 className="font-medium text-sm">Common Crimes</h3>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                <HelpCircle className="h-3.5 w-3.5" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80 p-2 text-sm">
                              <p>Most frequent types of crime in this district.</p>
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {gameMetrics.commonCrimes[district].map((crime, index) => (
                            <Badge key={index} variant="outline">{crime}</Badge>
                          ))}
                        </div>
                      </div>
                      
                      {/* Demographics section */}
                      <div>
                        <h3 className="font-medium text-sm mb-2">Demographics</h3>
                        <div className="grid grid-cols-2 gap-4">
                          {/* Ethnicity breakdown */}
                          <div>
                            <h4 className="text-xs text-muted-foreground mb-1">Ethnicity</h4>
                            <div className="grid grid-cols-2 gap-0.5 text-sm">
                              <div className="bg-muted/50 p-1.5 rounded-sm flex justify-between">
                                <span>White</span>
                                <span className="font-medium">{demographics.ethnicity.white}%</span>
                              </div>
                              <div className="bg-muted/50 p-1.5 rounded-sm flex justify-between">
                                <span>Black</span>
                                <span className="font-medium">{demographics.ethnicity.black}%</span>
                              </div>
                              <div className="bg-muted/50 p-1.5 rounded-sm flex justify-between">
                                <span>Hispanic</span>
                                <span className="font-medium">{demographics.ethnicity.hispanic}%</span>
                              </div>
                              <div className="bg-muted/50 p-1.5 rounded-sm flex justify-between">
                                <span>Other</span>
                                <span className="font-medium">{demographics.ethnicity.other}%</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Income breakdown */}
                          <div>
                            <h4 className="text-xs text-muted-foreground mb-1">Income Level</h4>
                            <div className="grid grid-cols-1 gap-0.5 text-sm">
                              <div className="bg-muted/50 p-1.5 rounded-sm flex justify-between">
                                <span>High Income</span>
                                <span className="font-medium">{demographics.income.high}%</span>
                              </div>
                              <div className="bg-muted/50 p-1.5 rounded-sm flex justify-between">
                                <span>Middle Income</span>
                                <span className="font-medium">{demographics.income.middle}%</span>
                              </div>
                              <div className="bg-muted/50 p-1.5 rounded-sm flex justify-between">
                                <span>Low Income</span>
                                <span className="font-medium">{demographics.income.low}%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Arrests by Race */}
                      <div>
                        <h3 className="font-medium text-sm mb-1">Arrests by Race</h3>
                        <div className="grid grid-cols-4 gap-1 text-xs">
                          <div className="bg-muted/50 p-1.5 rounded-sm text-center">
                            <div>White</div>
                            <div className="font-medium text-sm">{gameMetrics.arrestsByRace.white[district]}%</div>
                          </div>
                          <div className="bg-muted/50 p-1.5 rounded-sm text-center">
                            <div>Black</div>
                            <div className="font-medium text-sm">{gameMetrics.arrestsByRace.black[district]}%</div>
                          </div>
                          <div className="bg-muted/50 p-1.5 rounded-sm text-center">
                            <div>Hispanic</div>
                            <div className="font-medium text-sm">{gameMetrics.arrestsByRace.hispanic[district]}%</div>
                          </div>
                          <div className="bg-muted/50 p-1.5 rounded-sm text-center">
                            <div>Other</div>
                            <div className="font-medium text-sm">{gameMetrics.arrestsByRace.other[district]}%</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </TabsContent>
              </Tabs>
            </Card>
          );
        })}
      </div>
      
      {/* Action dialogs and other UI elements remain unchanged */}
    </div>
  );
}
