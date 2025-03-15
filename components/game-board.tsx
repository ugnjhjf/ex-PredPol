"use client"

import { useState, useEffect } from "react" // Add useEffect
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { InfoIcon, TrendingUp, TrendingDown, Minus, AlertCircle, ChevronDown, ChevronRight } from "lucide-react"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import CityMap from "./city-map"
import ActionSelection from "./action-selection"
import OverallMetrics from "./overall-metrics"
import GameLog from "./game-log"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator" // Import Separator component
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area" // Add this import
import { Progress } from "@/components/ui/progress" // Also add Progress for budget visualization
import PerformanceCharts from "./performance-charts" // Add this import
import GameOverview from "./game-overview"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

// Add district styling variables
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

// Add the missing districtEmojis object
const districtEmojis = {
  district1: "🏙️",
  district2: "🏘️",
  district3: "🏚️",
  district4: "🏫",
}

export default function GameBoard({
  currentRound,
  policeAllocation,
  setPoliceAllocation,
  gameMetrics,
  districtActions,
  setDistrictActions,
  onNextRound,
  showRoundSummary,
  roundSummary,
  closeRoundSummary,
  getDistrictName,
  gameLog,
  implementedActions,
  onRestart, // Add this prop
  isFirstPlay, // Add this prop
}) {
  // Show the summary tab as the default tab when a new round starts
  const [activeTab, setActiveTab] = useState(showRoundSummary || (currentRound === 1 && isFirstPlay) ? "summary" : "map")
  const [showHelpDialog, setShowHelpDialog] = useState(false)
  const [isRoundResultsOpen, setIsRoundResultsOpen] = useState(false)
  const [showRestartConfirmDialog, setShowRestartConfirmDialog] = useState(false);

  // Use this effect to switch to summary tab when new round starts
  useEffect(() => {
    if (showRoundSummary) {
      setActiveTab("summary")
    }
  }, [showRoundSummary, currentRound]) // Add currentRound as a dependency

  const handlePoliceAllocation = (district, shift, value) => {
    const newValue = Number.parseInt(value)
    const oldValue = policeAllocation[district][shift]
    const difference = newValue - oldValue

    if (policeAllocation.unallocated - difference >= 0) {
      setPoliceAllocation({
        ...policeAllocation,
        [district]: {
          ...policeAllocation[district],
          [shift]: newValue,
        },
        unallocated: policeAllocation.unallocated - difference,
      })
    }
  }
  
  // Calculate total allocated officers (out of 20)
  const totalAllocatedOfficers = 20 - policeAllocation.unallocated;

  // Handle continue to next round
  const handleContinueToNextRound = () => {
    closeRoundSummary()
    if (currentRound <= 10) {
      setActiveTab("map") // Switch to map tab for the next round
    }
  }

  // Modify the onNextRound function to wrap it and set the active tab
  const handleNextRound = () => {
    // Set the active tab to summary before calling the original onNextRound
    setActiveTab("summary")
    onNextRound()
  }

  // Handle restart with confirmation
  const handleRestartClick = () => {
    setShowRestartConfirmDialog(true);
  }

  const handleConfirmRestart = () => {
    setShowRestartConfirmDialog(false);
    onRestart();
  }

  return (
    <div className="h-[90vh] flex flex-col">
      <div className="flex justify-between items-center mb-4">
        {/* Move Round badge to the left */}
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="text-lg px-3 py-1">
            Round: {currentRound}/10
          </Badge>
          
          {/* Add budget badge */}
          <Badge variant="outline" className={`text-lg px-3 py-1 ${gameMetrics.budget < 200 ? 'bg-red-50 text-red-700' : ''}`}>
            Budget: ${gameMetrics.budget}
          </Badge>
        </div>
        
        {/* Move buttons to the right */}
        <div className="flex items-center gap-4">
          {/* Updated display for police allocation */}
          <Badge variant="outline" className="text-lg px-3 py-1">
            Allocated Police: {totalAllocatedOfficers}/20 👮
          </Badge>
          <Dialog open={showHelpDialog} onOpenChange={setShowHelpDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon">
                <InfoIcon className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Simulation Help</DialogTitle>
                <DialogDescription>Understanding metrics and game mechanics</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <h3 className="text-lg font-medium">Key Metrics</h3>
                  <ul className="list-disc pl-6 mt-2 space-y-2">
                    <li>
                      <strong>Community Trust:</strong> Represents how much the community trusts the police. Higher
                      trust leads to better cooperation and crime reporting.
                    </li>
                    <li>
                      <strong>Crime Rate:</strong> The percentage of criminal activity in a district. Lower is better.
                    </li>
                    <li>
                      <strong>Arrests by Race/Income:</strong> Shows the distribution of arrests across different
                      demographic groups. Disparities may indicate bias.
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium">Game Mechanics</h3>
                  <ul className="list-disc pl-6 mt-2 space-y-2">
                    <li>
                      <strong>Police Allocation:</strong> You have 20 officers to distribute across 4 districts and 2
                      shifts. Each district must have at least 1 officer per shift.
                    </li>
                    <li>
                      <strong>Actions:</strong> Each round, you can implement ONE action in ONE district. Choose
                      carefully based on district needs.
                    </li>
                    <li>
                      <strong>Round Summary:</strong> After each round, you'll see how your decisions affected the
                      metrics in each district.
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium">District Profiles</h3>
                  <ul className="list-disc pl-6 mt-2 space-y-2">
                    <li>
                      <strong>Downtown (District 1):</strong> High income, primarily white population, low crime rate,
                      high trust in police
                    </li>
                    <li>
                      <strong>Westside (District 2):</strong> Mixed income, diverse population, moderate crime rate,
                      moderate trust
                    </li>
                    <li>
                      <strong>South Side (District 3):</strong> Low income, primarily minority population, high crime
                      rate, low trust
                    </li>
                    <li>
                      <strong>Eastside (District 4):</strong> Mixed demographic with historical tensions with police
                    </li>
                  </ul>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          {/* Add restart button */}
          <Button variant="outline" onClick={handleRestartClick}>
            Restart
          </Button>
          {/* Fixed End Round button - Remove the disabled attribute entirely */}
          <Button onClick={handleNextRound}>
            End Round
          </Button>
        </div>
      </div>

      <OverallMetrics gameMetrics={gameMetrics} currentRound={currentRound} />

      {/* Replace Tabs with Sidebar + Content layout */}
      <div className="flex flex-1 mt-4 gap-4 overflow-hidden">
        {/* Left Sidebar Menu */}
        <div className="w-56 bg-muted/30 rounded-md border p-2 flex flex-col gap-1">
          <Button 
            variant={activeTab === "summary" ? "default" : "ghost"} 
            className="justify-start"
            onClick={() => setActiveTab("summary")}
          >
            <span className="mr-2">{currentRound === 1 && isFirstPlay ? "📋" : "📊"}</span>
            {currentRound === 1 && isFirstPlay ? "Game Overview" : "Round Summary"}
          </Button>
          <Button 
            variant={activeTab === "map" ? "default" : "ghost"} 
            className="justify-start"
            onClick={() => setActiveTab("map")}
          >
            <span className="mr-2">🗺️</span>
            City Map
          </Button>
          <Button 
            variant={activeTab === "actions" ? "default" : "ghost"} 
            className="justify-start"
            onClick={() => setActiveTab("actions")}
          >
            <span className="mr-2">⚙️</span>
            Actions
          </Button>
          <Button 
            variant={activeTab === "performance" ? "default" : "ghost"} 
            className="justify-start"
            onClick={() => setActiveTab("performance")}
          >
            <span className="mr-2">📈</span>
            Performance
          </Button>
          <Button 
            variant={activeTab === "log" ? "default" : "ghost"} 
            className="justify-start"
            onClick={() => setActiveTab("log")}
          >
            <span className="mr-2">📜</span>
            Round History
          </Button>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-background border rounded-md overflow-hidden">
          {/* Summary Tab Content */}
          {activeTab === "summary" && (
            <div className="h-full overflow-auto">
              {currentRound === 1 && isFirstPlay ? (
                <div className="p-4 space-y-4">
                  <GameOverview isEmbedded={true} onStart={() => setActiveTab("map")} />
                </div>
              ) : (
                <div className="p-4 space-y-4">
                  {/* Add introductory paragraph before district metrics */}
                  <div className="bg-muted/50 p-4 rounded-md border">
                    <p className="leading-relaxed">
                      {currentRound >= 10 ? 
                        "This is the final round. Your decisions in this round will complete your policing strategy. Make your final resource allocations and policy decisions carefully." : 
                        `As Round ${currentRound > 1 ? currentRound - 1 : currentRound} concludes, your resource allocation and policy decisions have affected each district differently. Review how crime rates, community trust, and policing accuracy have changed in response to your strategy.`
                      }
                    </p>
                  </div>

                  {/* Add nested tabs for the round summary */}
                  <Tabs defaultValue="districts" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="districts">District Metrics</TabsTrigger>
                      <TabsTrigger value="budget">Budget</TabsTrigger>
                      <TabsTrigger value="feedback">Feedback</TabsTrigger>
                    </TabsList>
                    
                    {/* District Metrics Tab */}
                    <TabsContent value="districts" className="pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {["district1", "district2", "district3", "district4"].map((district) => (
                          <Card key={district} className={`overflow-hidden border-2 ${districtColors[district]}`}>
                            <CardHeader className={`py-3 ${districtHeaderColors[district]}`}>
                              <CardTitle className="text-lg flex items-center gap-2">
                                <span>{districtEmojis[district]}</span>
                                {getDistrictName(district)}
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4">
                              {/* Keep all the existing district metrics content */}
                              <div className="grid grid-cols-3 gap-3">
                                {/* Metric 1: Community Trust */}
                                <div className="bg-muted/30 p-2 rounded-md">
                                  <div className="flex items-center gap-1 mb-1">
                                    <span className="font-medium text-xs">Trust</span>
                                    <Popover>
                                      <PopoverTrigger>
                                        <InfoIcon className="h-3 w-3 text-muted-foreground cursor-pointer" />
                                      </PopoverTrigger>
                                      <PopoverContent className="w-72 p-2">
                                        <p className="text-xs">
                                          Community trust in police. Higher trust leads to better cooperation and crime reporting.
                                        </p>
                                      </PopoverContent>
                                    </Popover>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span className="font-semibold text-sm">{gameMetrics.communityTrust[district]}%</span>
                                    {roundSummary.metricChanges[district].trust !== 0 && (
                                      <span 
                                        className={`flex items-center text-xs ${
                                          roundSummary.metricChanges[district].trust > 0 
                                            ? "text-green-600 dark:text-green-400" 
                                            : "text-red-600 dark:text-red-400"
                                        }`}
                                      >
                                        {roundSummary.metricChanges[district].trust > 0 ? (
                                          <TrendingUp className="h-3 w-3 mr-0.5" />
                                        ) : (
                                          <TrendingDown className="h-3 w-3 mr-0.5" />
                                        )}
                                        {roundSummary.metricChanges[district].trust > 0 ? "+" : ""}
                                        {roundSummary.metricChanges[district].trust}%
                                      </span>
                                    )}
                                  </div>
                                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mt-1">
                                    <div 
                                      className={`h-full ${
                                        gameMetrics.communityTrust[district] >= 70 ? "bg-green-500" : 
                                        gameMetrics.communityTrust[district] >= 40 ? "bg-yellow-500" : 
                                        "bg-red-500"
                                      }`} 
                                      style={{ width: `${gameMetrics.communityTrust[district]}%` }}
                                    ></div>
                                  </div>
                                </div>
                                
                                {/* Metric 2: Crimes */}
                                <div className="bg-muted/30 p-2 rounded-md">
                                  <div className="flex items-center gap-1 mb-1">
                                    <span className="font-medium text-xs">Crimes</span>
                                    <Popover>
                                      <PopoverTrigger>
                                        <InfoIcon className="h-3 w-3 text-muted-foreground cursor-pointer" />
                                      </PopoverTrigger>
                                      <PopoverContent className="w-72 p-2">
                                        <p className="text-xs">
                                          Number of crimes reported in this district. Lower is better.
                                        </p>
                                      </PopoverContent>
                                    </Popover>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span className="font-semibold text-sm">{gameMetrics.crimesReported[district]}</span>
                                    {roundSummary.metricChanges[district].crimes !== 0 && (
                                      <span 
                                        className={`flex items-center text-xs ${
                                          roundSummary.metricChanges[district].crimes < 0 
                                            ? "text-green-600 dark:text-green-400" 
                                            : "text-red-600 dark:text-red-400"
                                        }`}
                                      >
                                        {roundSummary.metricChanges[district].crimes < 0 ? (
                                          <TrendingDown className="h-3 w-3 mr-0.5" />
                                        ) : (
                                          <TrendingUp className="h-3 w-3 mr-0.5" />
                                        )}
                                        {roundSummary.metricChanges[district].crimes > 0 ? "+" : ""}
                                        {roundSummary.metricChanges[district].crimes}
                                      </span>
                                    )}
                                  </div>
                                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mt-1">
                                    <div 
                                      className={`h-full ${
                                        gameMetrics.crimesReported[district] <= 100 ? "bg-green-500" : 
                                        gameMetrics.crimesReported[district] <= 200 ? "bg-yellow-500" : 
                                        "bg-red-500"
                                      }`} 
                                      style={{ width: `${Math.min(100, gameMetrics.crimesReported[district]/5)}%` }}
                                    ></div>
                                  </div>
                                </div>
                                
                                {/* Metric 3: False Arrest Rate */}
                                <div className="bg-muted/30 p-2 rounded-md">
                                  <div className="flex items-center gap-1 mb-1">
                                    <span className="font-medium text-xs">False Arrests</span>
                                    <Popover>
                                      <PopoverTrigger>
                                        <InfoIcon className="h-3 w-3 text-muted-foreground cursor-pointer" />
                                      </PopoverTrigger>
                                      <PopoverContent className="w-72 p-2">
                                        <p className="text-xs">
                                          Percentage of arrests involving innocent people. Lower indicates more accurate policing.
                                        </p>
                                      </PopoverContent>
                                    </Popover>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span className="font-semibold text-sm">{gameMetrics.falseArrestRate[district]}%</span>
                                    {roundSummary.metricChanges[district].falseArrest !== 0 && (
                                      <span 
                                        className={`flex items-center text-xs ${
                                          roundSummary.metricChanges[district].falseArrest < 0 
                                            ? "text-green-600 dark:text-green-400" 
                                            : "text-red-600 dark:text-red-400"
                                        }`}
                                      >
                                        {roundSummary.metricChanges[district].falseArrest < 0 ? (
                                          <TrendingDown className="h-3 w-3 mr-0.5" />
                                        ) : (
                                          <TrendingUp className="h-3 w-3 mr-0.5" />
                                        )}
                                        {roundSummary.metricChanges[district].falseArrest > 0 ? "+" : ""}
                                        {roundSummary.metricChanges[district].falseArrest}%
                                      </span>
                                    )}
                                  </div>
                                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mt-1">
                                    <div 
                                      className={`h-full ${
                                        gameMetrics.falseArrestRate[district] <= 10 ? "bg-green-500" : 
                                        gameMetrics.falseArrestRate[district] <= 20 ? "bg-yellow-500" : 
                                        "bg-red-500"
                                      }`} 
                                      style={{ width: `${gameMetrics.falseArrestRate[district] * 2}%` }}
                                    ></div>
                                  </div>
                                </div>
                                
                                {/* Metric 4: Arrests */}
                                <div className="bg-muted/30 p-2 rounded-md">
                                  <div className="flex items-center gap-1 mb-1">
                                    <span className="font-medium text-xs">Arrests</span>
                                    <Popover>
                                      <PopoverTrigger>
                                        <InfoIcon className="h-3 w-3 text-muted-foreground cursor-pointer" />
                                      </PopoverTrigger>
                                      <PopoverContent className="w-72 p-2">
                                        <p className="text-xs">
                                          Number of arrests made in this district. Should be proportional to crimes reported.
                                        </p>
                                      </PopoverContent>
                                    </Popover>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span className="font-semibold text-sm">{gameMetrics.arrests[district]}</span>
                                    {roundSummary.metricChanges[district].arrests !== 0 && (
                                      <span className="flex items-center text-xs text-muted-foreground">
                                        {roundSummary.metricChanges[district].arrests > 0 ? "+" : ""}
                                        {roundSummary.metricChanges[district].arrests}
                                      </span>
                                    )}
                                  </div>
                                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mt-1">
                                    <div 
                                      className="bg-blue-500 h-full"
                                      style={{ width: `${Math.min(100, (gameMetrics.arrests[district] / gameMetrics.crimesReported[district]) * 100)}%` }}
                                    ></div>
                                  </div>
                                </div>
                                
                                {/* Metric 5: Clearance Rate */}
                                <div className="bg-muted/30 p-2 rounded-md">
                                  <div className="flex items-center gap-1 mb-1">
                                    <span className="font-medium text-xs">Clearance Rate</span>
                                    <Popover>
                                      <PopoverTrigger>
                                        <InfoIcon className="h-3 w-3 text-muted-foreground cursor-pointer" />
                                      </PopoverTrigger>
                                      <PopoverContent className="w-72 p-2">
                                        <p className="text-xs">
                                          Percentage of reported crimes that result in arrests. Indicates police effectiveness.
                                        </p>
                                      </PopoverContent>
                                    </Popover>
                                  </div>
                                  <div className="font-semibold text-sm">
                                    {Math.round((gameMetrics.arrests[district] / gameMetrics.crimesReported[district]) * 100)}%
                                  </div>
                                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mt-1">
                                    <div 
                                      className={`h-full ${
                                        (gameMetrics.arrests[district] / gameMetrics.crimesReported[district]) * 100 >= 70 ? "bg-green-500" : 
                                        (gameMetrics.arrests[district] / gameMetrics.crimesReported[district]) * 100 >= 40 ? "bg-yellow-500" : 
                                        "bg-blue-500"
                                      }`} 
                                      style={{ width: `${Math.min(100, (gameMetrics.arrests[district] / gameMetrics.crimesReported[district]) * 100)}%` }}
                                    ></div>
                                  </div>
                                </div>
                                
                                {/* Metric 6: Police Allocation */}
                                <div className="bg-muted/30 p-2 rounded-md">
                                  <div className="flex items-center gap-1 mb-1">
                                    <span className="font-medium text-xs">Police Officers</span>
                                    <Popover>
                                      <PopoverTrigger>
                                        <InfoIcon className="h-3 w-3 text-muted-foreground cursor-pointer" />
                                      </PopoverTrigger>
                                      <PopoverContent className="w-72 p-2">
                                        <p className="text-xs">
                                          Number of officers allocated to this district by shift.
                                        </p>
                                      </PopoverContent>
                                    </Popover>
                                  </div>
                                  <div className="font-semibold text-sm">
                                    Day: {policeAllocation[district].day} / Night: {policeAllocation[district].night}
                                  </div>
                                  
                                </div>
                                {/* NEW: Combined Population Metric (replacing Police Allocation) */}
                                <div className="bg-muted/30 p-2 rounded-md">
                                  <div className="flex items-center gap-1 mb-1">
                                    <span className="font-medium text-xs">Population</span>
                                    <Popover>
                                      <PopoverTrigger>
                                        <InfoIcon className="h-3 w-3 text-muted-foreground cursor-pointer" />
                                      </PopoverTrigger>
                                      <PopoverContent className="w-72 p-2">
                                        <p className="text-xs">
                                          District population. Changes based on crime rates, trust levels, and policing intensity.
                                        </p>
                                      </PopoverContent>
                                    </Popover>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span className="font-semibold text-sm">{gameMetrics.population[district].toLocaleString()}</span>
                                    {roundSummary.metricChanges && roundSummary.metricChanges[district].population !== 0 && (
                                      <span 
                                        className={`flex items-center text-xs ${
                                          roundSummary.metricChanges[district].population > 0 
                                            ? "text-green-600 dark:text-green-400" 
                                            : "text-red-600 dark:text-red-400"
                                        }`}
                                      >
                                        {roundSummary.metricChanges[district].population > 0 ? (
                                          <TrendingUp className="h-3 w-3 mr-0.5" />
                                        ) : (
                                          <TrendingDown className="h-3 w-3 mr-0.5" />
                                        )}
                                        {roundSummary.metricChanges[district].population > 0 ? "+" : ""}
                                        {roundSummary.metricChanges[district].population.toLocaleString()}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>
                    
                    {/* Budget Tab with improved presentation */}
                    <TabsContent value="budget" className="pt-4">
                      {roundSummary.budget && (
                        <Card>
                          <CardHeader className="border-b bg-muted/30">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-xl flex items-center gap-2">
                                <span className="text-2xl">💰</span>Budget Summary
                              </CardTitle>
                              <Badge 
                                variant={roundSummary.budget.income >= roundSummary.budget.expenses ? "outline" : "destructive"}
                                className="px-3 py-1 text-base"
                              >
                                {roundSummary.budget.income >= roundSummary.budget.expenses ? "Surplus" : "Deficit"}
                              </Badge>
                            </div>
                            <CardDescription>Financial overview for round {currentRound > 1 ? currentRound - 1 : currentRound}</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-6 pt-6">
                            {/* Previous budget card */}
                            <div className="flex justify-between items-center mb-4 p-4 bg-muted/20 rounded-lg border">
                              <span className="font-medium text-lg">Previous Budget</span>
                              <span className="font-bold text-xl">${roundSummary.budget.previous}</span>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* Revenue section - with enhanced styling */}
                              <div className="space-y-3">
                                <h3 className="text-lg font-medium flex items-center gap-2">
                                  <span className="p-1 rounded bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                                    <TrendingUp className="h-5 w-5" />
                                  </span>
                                  Revenue
                                </h3>
                                
                                <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg border border-green-200 dark:border-green-800">
                                  {/* Revenue items with improved visual hierarchy */}
                                  <div className="space-y-2 mb-3">
                                    {roundSummary.budget.details
                                      .filter(detail => detail.includes('+'))
                                      .map((detail, index) => {
                                        const [title, amount] = detail.split(':').map(s => s.trim());
                                        return (
                                          <div key={index} className="flex items-center justify-between border-b border-green-200 dark:border-green-800 pb-2 last:border-0">
                                            <div className="text-sm">{title}</div>
                                            <div className="text-right font-medium text-green-700 dark:text-green-400">{amount}</div>
                                          </div>
                                        );
                                      })}
                                  </div>
                                  
                                  {/* Total revenue with divider and larger text */}
                                  <div className="flex justify-between items-center pt-2 border-t border-green-300 dark:border-green-700">
                                    <span className="font-semibold">Total Revenue</span>
                                    <span className="font-bold text-lg text-green-700 dark:text-green-400">+${roundSummary.budget.income}</span>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Expenses section - with enhanced styling */}
                              <div className="space-y-3">
                                <h3 className="text-lg font-medium flex items-center gap-2">
                                  <span className="p-1 rounded bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">
                                    <TrendingDown className="h-5 w-5" />
                                  </span>
                                  Expenses
                                </h3>
                                
                                <div className="bg-red-50 dark:bg-red-950 p-4 rounded-lg border border-red-200 dark:border-red-800">
                                  {/* Expense items with improved visual hierarchy */}
                                  <div className="space-y-2 mb-3">
                                    {roundSummary.budget.details
                                      .filter(detail => detail.includes('-'))
                                      .map((detail, index) => {
                                        const [title, amount] = detail.split(':').map(s => s.trim());
                                        return (
                                          <div key={index} className="flex items-center justify-between border-b border-red-200 dark:border-red-800 pb-2 last:border-0">
                                            <div className="text-sm">{title}</div>
                                            <div className="text-right font-medium text-red-700 dark:text-red-400">{amount}</div>
                                          </div>
                                        );
                                      })}
                                  </div>
                                  
                                  {/* Total expenses with divider and larger text */}
                                  <div className="flex justify-between items-center pt-2 border-t border-red-300 dark:border-red-700">
                                    <span className="font-semibold">Total Expenses</span>
                                    <span className="font-bold text-lg text-red-700 dark:text-red-400">-${roundSummary.budget.expenses}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            {/* Net change and current budget - with enhanced styling */}
                            <div className="bg-muted/20 p-6 rounded-lg border mt-6">
                              <div className="flex flex-col md:flex-row md:justify-between items-center gap-4">
                                {/* Net change with arrow icon */}
                                <div className="flex flex-col items-center md:items-start gap-1 w-full md:w-auto">
                                  <span className="text-sm text-muted-foreground">Net Change</span>
                                  <div className="flex items-center gap-2">
                                    {roundSummary.budget.income >= roundSummary.budget.expenses ? (
                                      <span className="p-1 rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                                        <TrendingUp className="h-5 w-5" />
                                      </span>
                                    ) : (
                                      <span className="p-1 rounded-full bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">
                                        <TrendingDown className="h-5 w-5" />
                                      </span>
                                    )}
                                    <span className={`font-medium text-lg ${
                                      roundSummary.budget.income >= roundSummary.budget.expenses
                                        ? "text-green-700 dark:text-green-400"
                                        : "text-red-700 dark:text-red-400"
                                    }`}>
                                      ${roundSummary.budget.income - roundSummary.budget.expenses}
                                    </span>
                                  </div>
                                </div>
                                
                                {/* Vertical divider for larger screens */}
                                <div className="hidden md:block w-px h-14 bg-border"></div>
                                
                                {/* Horizontal divider for mobile */}
                                <div className="md:hidden w-full h-px bg-border"></div>
                                
                                {/* Current budget with larger display */}
                                <div className="flex flex-col items-center md:items-start gap-1 w-full md:w-auto">
                                  <span className="text-sm text-muted-foreground">Current Budget</span>
                                  <span className="font-bold text-2xl">${roundSummary.budget.current}</span>
                                </div>
                                
                                {/* Visual progress bar */}
                                <div className="w-full md:w-1/2">
                                  <div className="h-5 bg-muted rounded-full overflow-hidden">
                                    <div 
                                      className={`h-full ${
                                        roundSummary.budget.current > roundSummary.budget.previous 
                                          ? "bg-green-500" 
                                          : "bg-red-500"
                                    }`}
                                      style={{ 
                                        width: `${Math.min(100, Math.max(5, (roundSummary.budget.current / 2000) * 100))}%` 
                                      }}
                                    ></div>
                                  </div>
                                  <div className="flex justify-between text-xs mt-1">
                                    <span>$0</span>
                                    <span>$1,000</span>
                                    <span>$2,000</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            {/* New budget insights section */}
                            <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                              <h3 className="text-base font-medium mb-2 flex items-center gap-1.5">
                                <InfoIcon className="h-4 w-4 text-blue-600" />
                                Budget Insights
                              </h3>
                              <ul className="space-y-1 text-sm">
                                <li className="flex items-center gap-1.5">
                                  <span className="inline-block w-2 h-2 rounded-full bg-blue-500"></span>
                                  Police salary costs are proportional to the number of officers deployed
                                </li>
                                <li className="flex items-center gap-1.5">
                                  <span className="inline-block w-2 h-2 rounded-full bg-blue-500"></span>
                                  Each district contributes tax revenue based on population and income level
                                </li>
                                <li className="flex items-center gap-1.5">
                                  <span className="inline-block w-2 h-2 rounded-full bg-blue-500"></span>
                                  Special actions and initiatives require additional budget
                                </li>
                              </ul>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </TabsContent>
                    
                    {/* Feedback Tab - Reorganized into two columns */}
                    <TabsContent value="feedback" className="pt-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-xl">Round Analysis</CardTitle>
                          <CardDescription>Key insights and feedback from your decisions</CardDescription>
                        </CardHeader>
                        <CardContent>
                          {roundSummary.feedback ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {/* Column 1: Key Findings */}
                              <div className="bg-muted/30 p-4 rounded-lg border">
                                <h3 className="font-medium mb-3 text-lg">Key Findings</h3>
                                <ul className="space-y-3">
                                  {roundSummary.feedback.split('. ').filter(item => item.trim()).slice(0, Math.ceil(roundSummary.feedback.split('. ').length / 2)).map((point, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                      <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                                      <span>{point.trim()}{!point.endsWith('.') ? '.' : ''}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              
                              {/* Column 2: Round Summary */}
                              <div className="bg-muted/30 p-4 rounded-lg border">
                                <h3 className="font-medium mb-3 text-lg">Round Summary</h3>
                                <div className="space-y-2">
                                  {roundSummary.feedback.split('. ').filter(item => item.trim()).slice(Math.ceil(roundSummary.feedback.split('. ').length / 2)).map((point, index) => (
                                    <p key={index} className="flex items-start gap-2 text-sm">
                                      <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                                      <span>{point.trim()}{!point.endsWith('.') ? '.' : ''}</span>
                                    </p>
                                  ))}
                                  
                                  {roundSummary.changes && roundSummary.changes.length > 0 && (
                                    <div className="mt-4 pt-4 border-t">
                                      <h4 className="font-medium mb-2">Policy Effects</h4>
                                      {roundSummary.changes.map((change, index) => (
                                        <p key={index} className="flex items-start gap-2 text-sm mb-2">
                                          {change.includes("Crime rate -") || change.includes("Community trust +") || change.includes("False arrests -") ? (
                                            <TrendingDown className="h-4 w-4 text-green-600 mt-0.5" />
                                          ) : change.includes("Crime rate +") || change.includes("Community trust -") || change.includes("False arrests +") ? (
                                            <TrendingUp className="h-4 w-4 text-red-600 mt-0.5" />
                                          ) : (
                                            <Minus className="h-4 w-4 text-amber-600 mt-0.5" />
                                          )}
                                          <span>{change}</span>
                                        </p>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center py-8 text-muted-foreground">
                              No feedback available for this round.
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>
              )}
            </div>
          )}

          {/* Map Tab Content */}
          {activeTab === "map" && (
            <div className="h-full overflow-auto">
              <CityMap
                policeAllocation={policeAllocation}
                handlePoliceAllocation={handlePoliceAllocation}
                gameMetrics={gameMetrics}
                getDistrictName={getDistrictName}
              />
            </div>
          )}

          {/* Actions Tab Content */}
          {activeTab === "actions" && (
            <div className="h-full overflow-auto">
              <ActionSelection
                districtActions={districtActions}
                setDistrictActions={setDistrictActions}
                getDistrictName={getDistrictName}
                currentRound={currentRound}
                gameMetrics={gameMetrics}
                implementedActions={implementedActions}
              />
            </div>
          )}

          {/* Performance Tab Content */}
          {activeTab === "performance" && (
            <div className="h-full overflow-auto">
              <PerformanceCharts 
                gameLog={gameLog} 
                getDistrictName={getDistrictName} 
                currentRound={currentRound}
              />
            </div>
          )}

          {/* Game Log Tab Content */}
          {activeTab === "log" && (
            <div className="h-full overflow-auto">
              <GameLog gameLog={gameLog} getDistrictName={getDistrictName} currentRound={currentRound} />
            </div>
          )}
        </div>
      </div>
      
      {/* Add restart confirmation dialog */}
      <AlertDialog open={showRestartConfirmDialog} onOpenChange={setShowRestartConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to restart?</AlertDialogTitle>
            <AlertDialogDescription>
              This will reset the simulation to Round 1 and all your progress will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="outline" onClick={() => setShowRestartConfirmDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmRestart}>
              Restart
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

