"use client"

//import { PopulationPieChart } from "./charts/PopulationPieChart"
import { MyPieChart,MyLineChart, SingleLineChart,MyStackedChart,IncomeExpensesChart} from "./charts/chart-components"
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { InfoIcon, TrendingUp, TrendingDown } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, BarChart, Bar, ComposedChart, PieChart, Pie, Cell, 
  AreaChart, Area, ReferenceLine } from 'recharts'

// Change from default export to named export
export function DataAnalytics({ gameLog, getDistrictName, currentRound }) {
  // Process data for charts
  const processChartData = () => {
    if (!gameLog || gameLog.length === 0) return []
    
    return gameLog.map((entry, index) => {
      const round = entry.round
      
      // Define all individual data objects first to avoid reference errors
      const trustData = {
        round,
        district1: entry.metrics.communityTrust.district1,
        district2: entry.metrics.communityTrust.district2,
        district3: entry.metrics.communityTrust.district3,
        district4: entry.metrics.communityTrust.district4,
      }
      
      const crimesReportedData = {
        round,
        district1: entry.metrics.crimesReported.district1,
        district2: entry.metrics.crimesReported.district2,
        district3: entry.metrics.crimesReported.district3,
        district4: entry.metrics.crimesReported.district4,
      }
      
      const arrestsData = {
        round,
        district1: entry.metrics.arrests?.district1 || 0,
        district2: entry.metrics.arrests?.district2 || 0,
        district3: entry.metrics.arrests?.district3 || 0,
        district4: entry.metrics.arrests?.district4 || 0,
      }
      
      const falseArrestRateData = {
        round,
        district1: entry.metrics.falseArrestRate.district1,
        district2: entry.metrics.falseArrestRate.district2,
        district3: entry.metrics.falseArrestRate.district3,
        district4: entry.metrics.falseArrestRate.district4,
      }
      
      // Calculate clearance rates
      const clearanceRateData = {
        round,
        district1: entry.metrics.arrests && entry.metrics.crimesReported && 
                  entry.metrics.arrests.district1 && entry.metrics.crimesReported.district1 ? 
                  (entry.metrics.arrests.district1 / entry.metrics.crimesReported.district1) * 100 : 0,
        district2: entry.metrics.arrests && entry.metrics.crimesReported && 
                  entry.metrics.arrests.district2 && entry.metrics.crimesReported.district2 ? 
                  (entry.metrics.arrests.district2 / entry.metrics.crimesReported.district2) * 100 : 0,
        district3: entry.metrics.arrests && entry.metrics.crimesReported && 
                  entry.metrics.arrests.district3 && entry.metrics.crimesReported.district3 ? 
                  (entry.metrics.arrests.district3 / entry.metrics.crimesReported.district3) * 100 : 0,
        district4: entry.metrics.arrests && entry.metrics.crimesReported && 
                  entry.metrics.arrests.district4 && entry.metrics.crimesReported.district4 ? 
                  (entry.metrics.arrests.district4 / entry.metrics.crimesReported.district4) * 100 : 0,
      }
      
      // Add population data if available
      const populationData = entry.population ? {
        round,
        district1: entry.population.district1 || 0,
        district2: entry.population.district2 || 0,
        district3: entry.population.district3 || 0,
        district4: entry.population.district4 || 0
      } : null;
      
      // Return the combined data object
      return { 
        round, 
        trustData, 
        crimeData: crimesReportedData, // Renamed to avoid confusion
        arrestData: arrestsData, // Renamed to avoid confusion
        falseArrestData: falseArrestRateData, // Renamed to avoid confusion
        clearanceData: clearanceRateData, // Renamed to avoid confusion
        populationData
      }
    })
  }

  const chartData = processChartData()
  
  // Process police allocation data
  const processPoliceAllocationData = () => {
    if (!gameLog || gameLog.length === 0) return [];
    
    return gameLog.map((entry) => {
      if (!entry.policeAllocation) return null;
      
      return {
        round: entry.round,
        [getDistrictName("district1")]: 
          (entry.policeAllocation.district1?.day || 0) + 
          (entry.policeAllocation.district1?.night || 0),
        [getDistrictName("district2")]: 
          (entry.policeAllocation.district2?.day || 0) + 
          (entry.policeAllocation.district2?.night || 0),
        [getDistrictName("district3")]: 
          (entry.policeAllocation.district3?.day || 0) + 
          (entry.policeAllocation.district3?.night || 0),
        [getDistrictName("district4")]: 
          (entry.policeAllocation.district4?.day || 0) + 
          (entry.policeAllocation.district4?.night || 0)
      };
    }).filter(Boolean);
  };

  // Process budget data
  const getBudgetData = () => {
    if (!gameLog || gameLog.length === 0) return [];
    
    return gameLog.map((entry) => ({
      round: entry.round,
      income: entry.budget?.income || 0,
      expenses: entry.budget?.expenses || 0
    }));
  };

  // Process the budget data to track available budget over time
  const getOverBudgetData = () => {
    if (!gameLog || gameLog.length === 0) return [];
    
    return gameLog.map((entry) => {
      return {
        round: entry.round,
        budget: entry.budget?.current || 0  // Use the current budget value directly
      };
    });
  };

  // Calculate racial and economic bias data over time
  const processBiasData = () => {
    if (!gameLog || gameLog.length === 0) return [];
    
    return gameLog.map(entry => {
      let racialBias = 0;
      let economicBias = 0;
      
      // For the first round, use initial values from the game metrics
      if (entry.round === 1) {
        // Use absolute differences between districts as bias indicators
        racialBias = Math.abs(65 - 5) + Math.abs(15 - 85); // Use district3 black vs district1 white
        economicBias = Math.abs(75 - 5) + Math.abs(35 - 75); // Use district3/4 low income vs district1 high income
      }
      // For subsequent rounds, use the values from the current metrics
      else if (entry.metrics) {
        // Try to calculate racial bias
        if (entry.metrics.arrestsByRace) {
          racialBias = 
            Math.abs(entry.metrics.arrestsByRace.black?.district3 - entry.metrics.arrestsByRace.white?.district1 || 60) +
            Math.abs(entry.metrics.arrestsByRace.hispanic?.district3 - entry.metrics.arrestsByRace.white?.district1 || 10);
        } else {
          // Fallback if data is missing
          racialBias = 70; // Default value based on initial conditions
        }
        
        // Try to calculate economic bias
        if (entry.metrics.arrestsByIncome) {
          economicBias = 
            Math.abs(entry.metrics.arrestsByIncome.low?.district3 - entry.metrics.arrestsByIncome.high?.district1 || 70) +
            Math.abs(entry.metrics.arrestsByIncome.low?.district4 - entry.metrics.arrestsByIncome.high?.district1 || 30);
        } else {
          // Fallback if data is missing
          economicBias = 100; // Default value based on initial conditions
        }
      }
      
      return {
        round: entry.round,
        racialBias: racialBias / 2, // Normalize to 0-100 scale
        economicBias: economicBias / 2 // Normalize to 0-100 scale
      };
    });
  };

  const policeAllocationData = processPoliceAllocationData();
  const budgetData = getBudgetData();
  const overBudgetData = getOverBudgetData();
  const biasData = processBiasData();

  // Format data for line charts
  const formatLineData = (dataType) => {
    return chartData.map(entry => ({
      round: entry.round,
      ...entry[dataType]
    })).filter(entry => entry !== null);
  }

  const trustData = formatLineData('trustData');
  const crimeData = formatLineData('crimeData');
  const arrestData = formatLineData('arrestData');
  const falseArrestData = formatLineData('falseArrestData');
  const clearanceData = formatLineData('clearanceData');
  const populationData = formatLineData('populationData').filter(entry => entry != null && entry.district1 != null);

  // Calculate latest population distribution for pie chart
  const calculatePopulationPieData = () => {
    if (!populationData || populationData.length === 0) return [];
    
    const latestPopulationData = populationData[populationData.length - 1];
    
    return [
      { name: getDistrictName("district1"), value: latestPopulationData?.district1 || 0, id: "district1" },
      { name: getDistrictName("district2"), value: latestPopulationData?.district2 || 0, id: "district2" },
      { name: getDistrictName("district3"), value: latestPopulationData?.district3 || 0, id: "district3" },
      { name: getDistrictName("district4"), value: latestPopulationData?.district4 || 0, id: "district4" },
    ];
  };
  
  // Calculate total population trend data
  const calculateTotalPopulationTrend = () => {
    if (!populationData || populationData.length === 0) return [];
    
    return populationData.map(data => ({
      round: data.round,
      totalPopulation: 
        (data.district1 || 0) + 
        (data.district2 || 0) + 
        (data.district3 || 0) + 
        (data.district4 || 0)
    }));
  };

  const populationPieData = calculatePopulationPieData();
  const totalPopulationTrend = calculateTotalPopulationTrend();

  // Generate district colors for charts
  const districtColors = {
    district1: "#3b82f6", // blue-500
    district2: "#10b981", // emerald-500
    district3: "#f59e0b", // amber-500
    district4: "#8b5cf6", // violet-500
  }
  
  // Function to properly extract arrest data from game log
  const processArrestData = () => {
    if (!gameLog || gameLog.length === 0) return [];
    
    return gameLog.map(entry => {
      return {
        round: entry.round,
        district1: entry.metrics?.arrests?.district1 || 0,
        district2: entry.metrics?.arrests?.district2 || 0,
        district3: entry.metrics?.arrests?.district3 || 0,
        district4: entry.metrics?.arrests?.district4 || 0
      };
    });
  };

  // Calculate arrests data
  const arrestsData = processArrestData();

  // No data message if game just started
  if (gameLog.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center p-8">
          <h3 className="font-semibold text-xl mb-2">No Analytics Data Yet</h3>
          <p className="text-muted-foreground">Complete at least one round to see performance metrics.</p>
        </div>
      </div>
    );
  }

  // Check if population data is available for charts
  const hasPopulationData = populationData && populationData.length > 0 && populationPieData && populationPieData.length > 0;

  // Chart component to standardize the styling and size
  const ChartCard = ({ title, description, children, className = "" }) => (
    <Card className={className}>
      <CardHeader className="py-2 px-3">
        <CardTitle className="text-sm">{title}</CardTitle>
        <CardDescription className="text-xs">{description}</CardDescription>
      </CardHeader>
      <CardContent className="p-0 h-[200px]">
        {children}
      </CardContent>
    </Card>
  );

  return (
    <div className="p-4">
      <Tabs defaultValue="population" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-4">
          <TabsTrigger value="population">Population & Demographics</TabsTrigger>
          <TabsTrigger value="crime">Crime Statistics</TabsTrigger>
          <TabsTrigger value="resources">Resources & Budget</TabsTrigger>
          <TabsTrigger value="bias">Equity Indicators</TabsTrigger>
        </TabsList>
        
        {/* Population & Demographics Tab */}
        <TabsContent value="population" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Current Population Distribution */}
            <ChartCard 
              title="Population Distribution" 
              description="Population breakdown by district"
            >
              <ResponsiveContainer width="100%" height="100%">
                {hasPopulationData ? (
                  <MyPieChart data={populationPieData} districtColors={districtColors} />
                  
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <p className="text-muted-foreground text-sm">No population data available</p>
                    </div>
                  </div>
                )}
              </ResponsiveContainer>
            </ChartCard>
            
            {/* Total Population Trend */}
            <ChartCard 
              title="Total City Population" 
              description="Combined population across all districts"
            >
              <ResponsiveContainer width="100%" height="100%">
                {hasPopulationData ? (
                  <SingleLineChart data={totalPopulationTrend} line_name="Total Population" />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <p className="text-muted-foreground text-sm">No population data available</p>
                    </div>
                  </div>
                )}
              </ResponsiveContainer>
            </ChartCard>
            
            {/* Population by District Over Time */}
            <ChartCard 
              title="Population by District" 
              description="Population trends over time"
            >
              <ResponsiveContainer width="100%" height="100%">
                {hasPopulationData ? (
                  <MyLineChart data={populationData} districtColors={districtColors} getDistrictName={getDistrictName} />

                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <p className="text-muted-foreground text-sm">No population data available</p>
                    </div>
                  </div>
                )}
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </TabsContent>
        
        {/* Crime Statistics Tab */}
        <TabsContent value="crime" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* First row - 3 columns */}
            {/* Crimes vs. Arrests chart */}
            <ChartCard 
              title="Crimes vs. Arrests" 
              description="Comparing total crimes reported with suspects arrested citywide"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData.map(entry => ({
                  round: entry.round,
                  "Crimes Reported": 
                    entry.crimeData.district1 + 
                    entry.crimeData.district2 + 
                    entry.crimeData.district3 + 
                    entry.crimeData.district4,
                  "Suspects Arrested":
                    (entry.arrestData.district1 || 0) + 
                    (entry.arrestData.district2 || 0) + 
                    (entry.arrestData.district3 || 0) + 
                    (entry.arrestData.district4 || 0)
                }))} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="round" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ fontSize: '12px' }} />
                  <Legend verticalAlign="top" height={36} />
                  <Line 
                    type="monotone" 
                    dataKey="Crimes Reported" 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    activeDot={{ r: 5 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="Suspects Arrested" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
            
            {/* Crimes Reported */}
            <ChartCard 
              title="Crime Reports" 
              description="Crimes reported by district"
            >
              <ResponsiveContainer width="100%" height="100%">
                <MyLineChart data={crimeData} districtColors={districtColors} getDistrictName={getDistrictName} />
              </ResponsiveContainer>
            </ChartCard>
            
            {/* Arrests Made */}
            <ChartCard 
              title="Arrests Made" 
              description="Arrests made by district"
            >
              <ResponsiveContainer width="100%" height="100%">
                <MyLineChart data={arrestData} districtColors={districtColors} getDistrictName={getDistrictName} />
              </ResponsiveContainer>
            </ChartCard>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Second row - 3 columns */}
            {/* False Arrest Rate */}
            <ChartCard 
              title="False Arrest Rates" 
              description="% arrests of innocent individuals"
            >
              <ResponsiveContainer width="100%" height="100%">
                <MyLineChart data={falseArrestData} districtColors={districtColors} getDistrictName={getDistrictName} />
              </ResponsiveContainer>
            </ChartCard>
            
            {/* Clearance Rate */}
            <ChartCard 
              title="Clearance Rates" 
              description="% crimes resulting in arrests"
            >
              <ResponsiveContainer width="100%" height="100%">
                <MyLineChart data={clearanceData} districtColors={districtColors} getDistrictName={getDistrictName} />
              </ResponsiveContainer>
            </ChartCard>
            
            {/* Community Trust */}
            <ChartCard 
              title="Community Trust" 
              description="Trust in police by district"
            >
              <ResponsiveContainer width="100%" height="100%">
                <MyLineChart data={trustData} districtColors={districtColors} getDistrictName={getDistrictName} />
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </TabsContent>
        
        {/* Resources & Budget Tab */}
        <TabsContent value="resources" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Police Allocation - Fixed to single column */}
            <ChartCard 
              title="Police Allocation" 
              description="Officers per district"
            >
              <ResponsiveContainer width="100%" height="100%">
                <MyStackedChart data={policeAllocationData} districtColors={districtColors} getDistrictName={getDistrictName} />
                
              </ResponsiveContainer>
            </ChartCard>
            
            {/* Available Budget */}
            <ChartCard 
              title="Available Budget" 
              description="Budget per round"
            >
              
              <ResponsiveContainer width="100%" height="100%">
                
                <LineChart data={overBudgetData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="round" tick={{ fontSize: 10 }} />
                  <YAxis tickFormatter={(value) => `$${value}`} tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(value) => [`$${value}`, "Available Budget"]} />
                  <Line 
                    type="monotone" 
                    dataKey="budget" 
                    name="Budget" 
                    stroke="#3b82f6" 
                    strokeWidth={2} 
                    fill="#3b82f6" 
                    dot={{ r: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
            
            {/* Income vs. Expenses - Fixed to single column */}
            <ChartCard 
              title="Income vs. Expenses" 
              description="Budget flows per round"
            >
              <IncomeExpensesChart data={budgetData} />
              
            </ChartCard>
          </div>
        </TabsContent>
        
        {/* Equity Indicators Tab */}
        <TabsContent value="bias" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Bias Indicators */}
            <ChartCard 
              title="Bias Indicators" 
              description="Racial & economic disparities"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={biasData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="round" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
                  <Legend layout="horizontal" verticalAlign="top" align="right" height={20} />
                  <ReferenceLine y={30} stroke="#ef4444" strokeDasharray="3 3" />
                  <Line 
                    type="monotone" 
                    dataKey="racialBias" 
                    name="Racial Bias Index" 
                    stroke="#f43f5e" 
                    strokeWidth={2}
                    dot={{ r: 2 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="economicBias" 
                    name="Economic Bias Index" 
                    stroke="#f97316" 
                    strokeWidth={2}
                    dot={{ r: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
            
            
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Also add a default export to support both import methods
export default DataAnalytics;
