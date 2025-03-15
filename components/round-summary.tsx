import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { InfoIcon, TrendingUp, TrendingDown, Minus, AlertCircle } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

// District styling variables
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

// District emojis
const districtEmojis = {
  district1: "🏙️",
  district2: "🏘️",
  district3: "🏚️",
  district4: "🏫",
}

// Reusable district metric component
const DistrictMetric = ({ 
    title, 
    value, 
    change = 0, 
    tooltipText, 
    unit = "", 
    isPositiveGood = true,
    children
  }) => {
    return (
      <div className="bg-muted/30 p-1.5 rounded-md">
        <div className="flex items-center justify-between mb-0.5">
          <div className="flex items-center gap-0.5">
            <span className="font-medium text-xs">{title}</span>
            <Popover>
              <PopoverTrigger>
                <InfoIcon className="h-2.5 w-2.5 text-muted-foreground cursor-pointer ml-0.5" />
              </PopoverTrigger>
              <PopoverContent className="w-72 p-2">
                <p className="text-xs">{tooltipText}</p>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="flex items-center">
          <span className="font-semibold text-sm flex items-center">
            {value}{unit}
            {change !== 0 && (
              <span 
                className={`flex items-center text-[10px] ml-2 ${
                  (change > 0 && isPositiveGood) || (change < 0 && !isPositiveGood)
                    ? "text-green-600 dark:text-green-400" 
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {(change > 0 && isPositiveGood) || (change < 0 && !isPositiveGood)
                  ? <TrendingUp className="h-2.5 w-2.5 mr-0.5" />
                  : <TrendingDown className="h-2.5 w-2.5 mr-0.5" />
                }
                {change > 0 ? "+" : ""}
                {change}{unit === "%" ? "%" : ""}
              </span>
            )}
          </span>
        </div>
        {children}
      </div>
    );
  };

export const RoundSummary = ({currentRound, gameMetrics, policeAllocation, roundSummary, getDistrictName}) => {
    return (
      <div className="p-4 space-y-4">
        {/* Introductory paragraph before district metrics */}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {["district1", "district2", "district3", "district4"].map((district) => (
                <Card key={district} className={`overflow-hidden border-2 ${districtColors[district]}`}>
                <CardHeader className={`py-3 ${districtHeaderColors[district]}`}>
                    <CardTitle className="text-lg flex items-center gap-2">
                    <span>{districtEmojis[district]}</span>
                    {getDistrictName(district)}
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                    <div className="grid grid-cols-3 gap-0">

                    {/* Metric 6: Police Officers */}
                    <DistrictMetric
                      title="Police Officers"
                      value=""
                      tooltipText="Number of officers allocated to this district by shift."
                    >
                      <div className="font-semibold text-sm">
                        Day: {policeAllocation[district].day} / Night: {policeAllocation[district].night}
                      </div>
                    </DistrictMetric>
                    
                    {/* Metric 7: Population */}
                    <DistrictMetric
                      title="Population"
                      value={gameMetrics.population[district].toLocaleString()}
                      change={roundSummary.metricChanges && roundSummary.metricChanges[district].population}
                      tooltipText="District population. Changes based on crime rates, trust levels, and policing intensity."
                      isPositiveGood={true}
                    />

                    {/* Metric 1: Community Trust */}
                    <DistrictMetric
                      title="Trust"
                      value={gameMetrics.communityTrust[district]}
                      unit="%"
                      change={roundSummary.metricChanges[district].trust}
                      tooltipText="Community trust in police. Higher trust leads to better cooperation and crime reporting."
                      isPositiveGood={true}
                    />
                    
                    {/* Metric 2: Crimes */}
                    <DistrictMetric
                      title="Crimes"
                      value={gameMetrics.crimesReported[district]}
                      change={roundSummary.metricChanges[district].crimes}
                      tooltipText="Number of crimes reported in this district. Lower is better."
                    />
                    
                    {/* Metric 3: False Arrest Rate */}
                    <DistrictMetric
                      title="False Arrests"
                      value={gameMetrics.falseArrestRate[district]}
                      unit="%"
                      change={roundSummary.metricChanges[district].falseArrest}
                      tooltipText="Percentage of arrests involving innocent people. Lower indicates more accurate policing."
                      isPositiveGood={false}
                    />
                    
                    {/* Metric 4: Arrests */}
                    <DistrictMetric
                      title="Arrests"
                      value={gameMetrics.arrests[district]}
                      change={roundSummary.metricChanges[district].arrests}
                      tooltipText="Number of arrests made in this district. Should be proportional to crimes reported."
                      isPositiveGood={true}
                    />
                    </div>
                </CardContent>
           </Card>
            ))}
            </div>
        </TabsContent>          


        {/* Budget Tab with improved presentation */}
        <TabsContent value="budget" className="pt-4">
            {roundSummary.budget && (
            <Card className="text-sm">
                <CardHeader className="border-b bg-muted/30 py-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                    <span className="text-xl">💰</span>Budget Summary
                    <Popover>
                                <PopoverTrigger>
                                    <InfoIcon className="h-2.5 w-2.5 text-muted-foreground cursor-pointer ml-0.5" />
                                </PopoverTrigger>
                                <PopoverContent className="w-72 p-3">
                                    <ul className="space-y-1.5 text-[10px] text-muted-foreground">
                                        <li className="flex items-start gap-1.5">
                                            <span className="shrink-0 w-1 h-1 mt-0.5 rounded-full bg-black"></span>
                                            <span>Police salary costs are proportional to the number of officers deployed</span>
                                        </li>
                                        <li className="flex items-start gap-1.5">
                                            <span className="shrink-0 w-1 h-1 mt-0.5 rounded-full bg-black"></span>
                                            <span>Each district contributes tax revenue based on population and income level</span>
                                        </li>
                                        <li className="flex items-start gap-1.5">
                                            <span className="shrink-0 w-1 h-1 mt-0.5 rounded-full bg-black"></span>
                                            <span>Special actions and initiatives require additional budget</span>
                                        </li>
                                    </ul>
                                </PopoverContent>
                            </Popover>
                    </CardTitle>


                    <Badge 
                    variant={roundSummary.budget.income >= roundSummary.budget.expenses ? "outline" : "destructive"}
                    className="px-2 py-0.5 text-sm"
                    >
                    {roundSummary.budget.income >= roundSummary.budget.expenses ? "Surplus" : "Deficit"}
                    </Badge>
                </div>
                <CardDescription className="text-xs">Financial overview for round {currentRound > 1 ? currentRound - 1 : currentRound}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                {/* Previous budget card */}
                <div className="flex justify-between items-center mb-2 p-3 bg-muted/20 rounded-lg border">
                    <span className="font-medium">Previous Budget</span>
                    <span className="font-bold">${roundSummary.budget.previous}</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Revenue section - with enhanced styling */}
                    <div className="space-y-2">
                    <h3 className="text-sm font-medium flex items-center gap-2">
                        <span className="p-1 rounded bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                        <TrendingUp className="h-4 w-4" />
                        </span>
                        Revenue
                    </h3>
                    
                    <div className="bg-green-50 dark:bg-green-950 p-2 rounded-lg border border-green-200 dark:border-green-800">
                        {/* Revenue items with improved visual hierarchy */}
                        <div className="space-y-1 mb-2">
                        {roundSummary.budget.details
                            .filter(detail => detail.includes('+'))
                            .map((detail, index) => {
                            const [title, amount] = detail.split(':').map(s => s.trim());
                            return (
                                <div key={index} className="flex items-center justify-between border-b border-green-200 dark:border-green-800 pb-1 last:border-0">
                                <div className="text-xs">{title}</div>
                                <div className="text-right font-medium text-green-700 dark:text-green-400 text-xs">{amount}</div>
                                </div>
                            );
                            })}
                        </div>
                        
                        {/* Total revenue with divider and larger text */}
                        <div className="flex justify-between items-center pt-1 border-t border-green-300 dark:border-green-700">
                        <span className="font-semibold text-xs">Total Revenue</span>
                        <span className="font-bold text-sm text-green-700 dark:text-green-400">+${roundSummary.budget.income}</span>
                        </div>
                    </div>
                    </div>
                    
                    {/* Expenses section - with enhanced styling */}
                    <div className="space-y-2">
                    <h3 className="text-sm font-medium flex items-center gap-2">
                        <span className="p-1 rounded bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">
                        <TrendingDown className="h-4 w-4" />
                        </span>
                        Expenses
                    </h3>
                    
                    <div className="bg-red-50 dark:bg-red-950 p-2 rounded-lg border border-red-200 dark:border-red-800">
                        {/* Expense items with improved visual hierarchy */}
                        <div className="space-y-1 mb-2">
                        {roundSummary.budget.details
                            .filter(detail => detail.includes('-'))
                            .map((detail, index) => {
                            const [title, amount] = detail.split(':').map(s => s.trim());
                            return (
                                <div key={index} className="flex items-center justify-between border-b border-red-200 dark:border-red-800 pb-1 last:border-0">
                                <div className="text-xs">{title}</div>
                                <div className="text-right font-medium text-red-700 dark:text-red-400 text-xs">{amount}</div>
                                </div>
                            );
                            })}
                        </div>
                        
                        {/* Total expenses with divider and larger text */}
                        <div className="flex justify-between items-center pt-1 border-t border-red-300 dark:border-red-700">
                        <span className="font-semibold text-xs">Total Expenses</span>
                        <span className="font-bold text-sm text-red-700 dark:text-red-400">-${roundSummary.budget.expenses}</span>
                        </div>
                    </div>
                    </div>
                </div>
                
                {/* Net change and current budget - with enhanced styling */}
                <div className="bg-muted/20 p-3 rounded-lg border mt-3">
                    <div className="flex flex-col md:flex-row md:justify-between items-center gap-2">
                    {/* Net change with arrow icon */}
                    <div className="flex flex-col items-center md:items-start gap-1 w-full md:w-auto">
                        <span className="text-xs text-muted-foreground">Net Change</span>
                        <div className="flex items-center gap-1">
                        {roundSummary.budget.income >= roundSummary.budget.expenses ? (
                            <span className="p-0.5 rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                            <TrendingUp className="h-3 w-3" />
                            </span>
                        ) : (
                            <span className="p-0.5 rounded-full bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">
                            <TrendingDown className="h-3 w-3" />
                            </span>
                        )}
                        <span className={`font-medium text-sm ${
                            roundSummary.budget.income >= roundSummary.budget.expenses
                            ? "text-green-700 dark:text-green-400"
                            : "text-red-700 dark:text-red-400"
                        }`}>
                            ${roundSummary.budget.income - roundSummary.budget.expenses}
                        </span>
                        </div>
                    </div>
                    
                    {/* Vertical divider for larger screens */}
                    <div className="hidden md:block w-px h-10 bg-border"></div>
                    
                    {/* Horizontal divider for mobile */}
                    <div className="md:hidden w-full h-px bg-border"></div>
                    
                    {/* Current budget with larger display */}
                    <div className="flex flex-col items-center md:items-start gap-1 w-full md:w-auto">
                        <span className="text-xs text-muted-foreground">Current Budget</span>
                        <span className="font-bold text-base">${roundSummary.budget.current}</span>
                    </div>
                    

                    </div>
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
                    <h3 className="font-medium mb-3">Key Findings</h3>
                    <ul className="space-y-3 text-sm">
                        {roundSummary.feedback.split('. ').filter(item => item.trim()).slice(0, Math.ceil(roundSummary.feedback.split('. ').length / 2)).map((point, index) => (
                        <li key={index} className="flex items-start gap-3">
                            <AlertCircle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                            <span>{point.trim()}{!point.endsWith('.') ? '.' : ''}</span>
                        </li>
                        ))}
                    </ul>
                    </div>
                    
                    {/* Column 2: Round Summary */}
                    <div className="bg-muted/30 p-4 rounded-lg border">
                    <h3 className="font-medium mb-3">Feedbacks</h3>
                    <div className="space-y-2 text-sm">
                        {roundSummary.feedback.split('. ').filter(item => item.trim()).slice(Math.ceil(roundSummary.feedback.split('. ').length / 2)).map((point, index) => (
                        <p key={index} className="flex items-start gap-3">
                            <AlertCircle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                            <span>{point.trim()}{!point.endsWith('.') ? '.' : ''}</span>
                        </p>
                        ))}
                        
                        {roundSummary.changes && roundSummary.changes.length > 0 && (
                        <div className="mt-4 pt-4 border-t">
                            <h4 className="font-medium mb-3">Policy Effects</h4>
                            {roundSummary.changes.map((change, index) => (
                            <p key={index} className="flex items-start gap-3 mb-2 text-sm">
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
                <div className="text-center py-8 text-muted-foreground text-sm">
                    No feedback available for this round.
                </div>
                )}
            </CardContent>
            </Card>
        </TabsContent>        
        </Tabs>
      </div>
    )
  }