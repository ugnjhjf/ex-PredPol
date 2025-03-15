"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { InfoIcon, TrendingUp, TrendingDown } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, BarChart, Bar, ComposedChart, PieChart, Pie, Cell, 
  AreaChart, Area, ReferenceLine } from 'recharts'

export default function PerformanceCharts({ gameLog, getDistrictName, currentRound }) {
  // Process data for charts
  const processChartData = () => {
    if (!gameLog || gameLog.length === 0) return []
    
    return gameLog.map((entry, index) => {
      const round = entry.round
      const trustData = {
        round,
        district1: entry.metrics.communityTrust.district1,
        district2: entry.metrics.communityTrust.district2,
        district3: entry.metrics.communityTrust.district3,
        district4: entry.metrics.communityTrust.district4,
      }
      
      const crimeData = {
        round,
        district1: entry.metrics.crimesReported.district1,
        district2: entry.metrics.crimesReported.district2,
        district3: entry.metrics.crimesReported.district3,
        district4: entry.metrics.crimesReported.district4,
      }
      
      const arrestData = {
        round,
        district1: entry.metrics.arrests?.district1 || 0,
        district2: entry.metrics.arrests?.district2 || 0,
        district3: entry.metrics.arrests?.district3 || 0,
        district4: entry.metrics.arrests?.district4 || 0,
      }
      
      const falseArrestData = {
        round,
        district1: entry.metrics.falseArrestRate.district1,
        district2: entry.metrics.falseArrestRate.district2,
        district3: entry.metrics.falseArrestRate.district3,
        district4: entry.metrics.falseArrestRate.district4,
      }
      
      // Calculate clearance rates
      const clearanceData = {
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
      
      return { 
        round, 
        trustData, 
        crimeData, 
        arrestData, 
        falseArrestData, 
        clearanceData,
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
      const racialBias = entry.metrics.arrestsByRace ? 
        Math.abs(entry.metrics.arrestsByRace.black?.district3 - entry.metrics.arrestsByRace.white?.district1) +
        Math.abs(entry.metrics.arrestsByRace.hispanic?.district3 - entry.metrics.arrestsByRace.white?.district1) : 0;
        
      const economicBias = entry.metrics.arrestsByIncome ? 
        Math.abs(entry.metrics.arrestsByIncome.low?.district3 - entry.metrics.arrestsByIncome.high?.district1) +
        Math.abs(entry.metrics.arrestsByIncome.low?.district4 - entry.metrics.arrestsByIncome.high?.district1) : 0;
      
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
  const populationData = formatLineData('populationData');

  // Calculate latest population distribution for pie chart
  const calculatePopulationPieData = () => {
    if (!populationData || populationData.length === 0) return [];
    
    const latestPopulationData = populationData[populationData.length - 1];
    
    return [
      { name: getDistrictName("district1"), value: latestPopulationData.district1, id: "district1" },
      { name: getDistrictName("district2"), value: latestPopulationData.district2, id: "district2" },
      { name: getDistrictName("district3"), value: latestPopulationData.district3, id: "district3" },
      { name: getDistrictName("district4"), value: latestPopulationData.district4, id: "district4" },
    ];
  };
  
  // Calculate total population trend data
  const calculateTotalPopulationTrend = () => {
    if (!populationData || populationData.length === 0) return [];
    
    return populationData.map(data => ({
      round: data.round,
      totalPopulation: 
        data.district1 + 
        data.district2 + 
        data.district3 + 
        data.district4
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

  // Add in component function, alongside other data processing
  const arrestsData = processArrestData();

  // No data message if game just started
  if (gameLog.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center p-8">
          <h3 className="font-semibold text-xl mb-2">No Performance Data Yet</h3>
          <p className="text-muted-foreground">Complete at least one round to see performance charts.</p>
        </div>
      </div>
    );
  }

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Current Population Distribution */}
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-lg">Population Distribution</CardTitle>
                <CardDescription>Current population breakdown by district</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={populationPieData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={90}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {populationPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={districtColors[entry.id]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => new Intl.NumberFormat().format(value)} 
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            {/* Total Population Trend */}
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-lg">Total City Population</CardTitle>
                <CardDescription>Combined population across all districts over time</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={totalPopulationTrend}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="round" label={{ value: 'Round', position: 'insideBottom', offset: -5 }} />
                    <YAxis 
                      tickFormatter={(value) => new Intl.NumberFormat('en', { notation: 'compact' }).format(value)}
                      domain={['auto', 'auto']}
                      label={{ value: 'Population', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip formatter={(value) => new Intl.NumberFormat().format(value)} />
                    <Area 
                      type="monotone" 
                      dataKey="totalPopulation" 
                      stroke="#8884d8" 
                      fill="#8884d8" 
                      name="Total Population" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          {/* Population by District Over Time */}
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-lg">Population by District</CardTitle>
              <CardDescription>Population trends for each district over time</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={populationData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="round" label={{ value: 'Round', position: 'insideBottom', offset: -5 }} />
                  <YAxis 
                    tickFormatter={(value) => new Intl.NumberFormat('en', { notation: 'compact' }).format(value)}
                    domain={['auto', 'auto']}
                    label={{ value: 'Population', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip formatter={(value) => new Intl.NumberFormat().format(value)} />
                  <Legend />
                  <Line type="monotone" dataKey="district1" name={getDistrictName("district1")} stroke={districtColors.district1} strokeWidth={2} />
                  <Line type="monotone" dataKey="district2" name={getDistrictName("district2")} stroke={districtColors.district2} strokeWidth={2} />
                  <Line type="monotone" dataKey="district3" name={getDistrictName("district3")} stroke={districtColors.district3} strokeWidth={2} />
                  <Line type="monotone" dataKey="district4" name={getDistrictName("district4")} stroke={districtColors.district4} strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Crime Statistics Tab */}
        <TabsContent value="crime" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Crimes Reported */}
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-lg">Crime Reports</CardTitle>
                <CardDescription>Number of crimes reported by district over time</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={crimeData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="round" label={{ value: 'Round', position: 'insideBottom', offset: -5 }} />
                    <YAxis label={{ value: 'Crime Reports', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="district1" name={getDistrictName("district1")} stroke={districtColors.district1} strokeWidth={2} />
                    <Line type="monotone" dataKey="district2" name={getDistrictName("district2")} stroke={districtColors.district2} strokeWidth={2} />
                    <Line type="monotone" dataKey="district3" name={getDistrictName("district3")} stroke={districtColors.district3} strokeWidth={2} />
                    <Line type="monotone" dataKey="district4" name={getDistrictName("district4")} stroke={districtColors.district4} strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            {/* Arrests Made */}
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-lg">Arrests Made</CardTitle>
                <CardDescription>Number of arrests made by district over time</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={arrestsData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="round" label={{ value: 'Round', position: 'insideBottom', offset: -5 }} />
                    <YAxis label={{ value: 'Arrests', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="district1" name={getDistrictName("district1")} stroke={districtColors.district1} strokeWidth={2} />
                    <Line type="monotone" dataKey="district2" name={getDistrictName("district2")} stroke={districtColors.district2} strokeWidth={2} />
                    <Line type="monotone" dataKey="district3" name={getDistrictName("district3")} stroke={districtColors.district3} strokeWidth={2} />
                    <Line type="monotone" dataKey="district4" name={getDistrictName("district4")} stroke={districtColors.district4} strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* False Arrest Rate */}
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-lg">False Arrest Rates</CardTitle>
                <CardDescription>Percentage of arrests involving innocent individuals</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={falseArrestData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="round" label={{ value: 'Round', position: 'insideBottom', offset: -5 }} />
                    <YAxis label={{ value: 'False Arrest %', angle: -90, position: 'insideLeft' }} />
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Legend />
                    <ReferenceLine y={15} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'Target (15%)', position: 'right' }} />
                    <Line type="monotone" dataKey="district1" name={getDistrictName("district1")} stroke={districtColors.district1} strokeWidth={2} />
                    <Line type="monotone" dataKey="district2" name={getDistrictName("district2")} stroke={districtColors.district2} strokeWidth={2} />
                    <Line type="monotone" dataKey="district3" name={getDistrictName("district3")} stroke={districtColors.district3} strokeWidth={2} />
                    <Line type="monotone" dataKey="district4" name={getDistrictName("district4")} stroke={districtColors.district4} strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            {/* Clearance Rate */}
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-lg">Clearance Rates</CardTitle>
                <CardDescription>Percentage of reported crimes that result in arrests</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={clearanceData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="round" label={{ value: 'Round', position: 'insideBottom', offset: -5 }} />
                    <YAxis label={{ value: 'Clearance %', angle: -90, position: 'insideLeft' }} />
                    <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
                    <Legend />
                    <Line type="monotone" dataKey="district1" name={getDistrictName("district1")} stroke={districtColors.district1} strokeWidth={2} />
                    <Line type="monotone" dataKey="district2" name={getDistrictName("district2")} stroke={districtColors.district2} strokeWidth={2} />
                    <Line type="monotone" dataKey="district3" name={getDistrictName("district3")} stroke={districtColors.district3} strokeWidth={2} />
                    <Line type="monotone" dataKey="district4" name={getDistrictName("district4")} stroke={districtColors.district4} strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          {/* Community Trust */}
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-lg">Community Trust</CardTitle>
              <CardDescription>Trust in police across different districts over time</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trustData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="round" label={{ value: 'Round', position: 'insideBottom', offset: -5 }} />
                  <YAxis domain={[0, 100]} label={{ value: 'Trust %', angle: -90, position: 'insideLeft' }} />
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Legend />
                  <ReferenceLine y={55} stroke="#15803d" strokeDasharray="3 3" label={{ value: 'Target (55%)', position: 'right' }} />
                  <Line type="monotone" dataKey="district1" name={getDistrictName("district1")} stroke={districtColors.district1} strokeWidth={2} />
                  <Line type="monotone" dataKey="district2" name={getDistrictName("district2")} stroke={districtColors.district2} strokeWidth={2} />
                  <Line type="monotone" dataKey="district3" name={getDistrictName("district3")} stroke={districtColors.district3} strokeWidth={2} />
                  <Line type="monotone" dataKey="district4" name={getDistrictName("district4")} stroke={districtColors.district4} strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Resources & Budget Tab */}
        <TabsContent value="resources" className="space-y-4">
          {/* Police Allocation */}
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-lg">Police Allocation by District</CardTitle>
              <CardDescription>Officers assigned to each district over time</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={policeAllocationData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="round" label={{ value: 'Round', position: 'insideBottom', offset: -5 }} />
                  <YAxis label={{ value: 'Officers', angle: -90, position: 'insideLeft' }} />
                  <Tooltip formatter={(value, name) => [`${value} officers`, name]} />
                  <Legend />
                  <Bar dataKey={getDistrictName("district1")} stackId="a" fill={districtColors.district1} />
                  <Bar dataKey={getDistrictName("district2")} stackId="a" fill={districtColors.district2} />
                  <Bar dataKey={getDistrictName("district3")} stackId="a" fill={districtColors.district3} />
                  <Bar dataKey={getDistrictName("district4")} stackId="a" fill={districtColors.district4} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Income vs. Expenses */}
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-lg">Income vs. Expenses</CardTitle>
                <CardDescription>Budget flows per round</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={budgetData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="round" label={{ value: 'Round', position: 'insideBottom', offset: -5 }} />
                    <YAxis label={{ value: 'Amount ($)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip formatter={(value) => `$${value}`} />
                    <Legend />
                    <Bar dataKey="income" name="Income" fill="#22c55e" /> {/* Green */}
                    <Bar dataKey="expenses" name="Expenses" fill="#ef4444" /> {/* Red */}
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            {/* Available Budget */}
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-lg">Available Budget</CardTitle>
                <CardDescription>Budget available each round</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={overBudgetData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="round" label={{ value: 'Round', position: 'insideBottom', offset: -5 }} />
                    <YAxis tickFormatter={(value) => `$${value}`} label={{ value: 'Budget ($)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip formatter={(value) => [`$${value}`, "Available Budget"]} />
                    <Legend />
                    <Line type="monotone" dataKey="budget" name="Available Budget" stroke="#3b82f6" strokeWidth={2} fill="#3b82f6" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Equity Indicators Tab */}
        <TabsContent value="bias" className="space-y-4">
          {/* Bias Indicators */}
          <Card>
            <CardHeader className="py-3">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-lg">Bias Indicators</CardTitle>
                  <CardDescription>Racial and economic disparities in policing outcomes</CardDescription>
                </div>
                <Popover>
                  <PopoverTrigger>
                    <InfoIcon className="h-5 w-5 text-muted-foreground cursor-pointer" />
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-3">
                    <p className="text-sm mb-2 font-medium">About Bias Indicators</p>
                    <p className="text-xs mb-1">
                      <strong>Racial Bias Index:</strong> Measures disparity in arrest patterns across racial groups. Lower values indicate more equitable policing.
                    </p>
                    <p className="text-xs">
                      <strong>Economic Bias Index:</strong> Measures disparity in arrest patterns across income groups. Lower values indicate more equitable policing.
                    </p>
                  </PopoverContent>
                </Popover>
              </div>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={biasData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="round" label={{ value: 'Round', position: 'insideBottom', offset: -5 }} />
                  <YAxis label={{ value: 'Bias Index (%)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
                  <Legend />
                  <ReferenceLine y={30} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'Target (30%)', position: 'right' }} />
                  <Line type="monotone" dataKey="racialBias" name="Racial Bias Index" stroke="#f43f5e" strokeWidth={2} />
                  <Line type="monotone" dataKey="economicBias" name="Economic Bias Index" stroke="#f97316" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          {/* Trust vs Crime Gap Comparison */}
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-lg">District Disparity Analysis</CardTitle>
              <CardDescription>Gap between highest and lowest districts on key metrics</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={gameLog.map(entry => {
                  // Calculate gaps for each round
                  const trustValues = [
                    entry.metrics.communityTrust.district1, 
                    entry.metrics.communityTrust.district2,
                    entry.metrics.communityTrust.district3, 
                    entry.metrics.communityTrust.district4
                  ];
                  
                  const crimeValues = [
                    entry.metrics.crimesReported.district1, 
                    entry.metrics.crimesReported.district2,
                    entry.metrics.crimesReported.district3, 
                    entry.metrics.crimesReported.district4
                  ];
                  
                  const falseArrestValues = [
                    entry.metrics.falseArrestRate.district1, 
                    entry.metrics.falseArrestRate.district2,
                    entry.metrics.falseArrestRate.district3, 
                    entry.metrics.falseArrestRate.district4
                  ];
                  
                  // Calculate max differences
                  const trustGap = Math.max(...trustValues) - Math.min(...trustValues);
                  const crimeGap = Math.max(...crimeValues) - Math.min(...crimeValues);
                  const falseArrestGap = Math.max(...falseArrestValues) - Math.min(...falseArrestValues);
                  
                  return {
                    round: entry.round,
                    trustGap,
                    crimeGap: crimeGap / 5, // Normalized to percentage
                    falseArrestGap
                  };
                })}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="round" label={{ value: 'Round', position: 'insideBottom', offset: -5 }} />
                  <YAxis domain={[0, 'auto']} label={{ value: 'Gap', angle: -90, position: 'insideLeft' }} />
                  <Tooltip formatter={(value, name) => {
                    if (name === "trustGap") return [`${value.toFixed(1)}%`, "Trust Gap"];
                    if (name === "crimeGap") return [`${value.toFixed(1)}%`, "Crime Gap (%)"];
                    if (name === "falseArrestGap") return [`${value.toFixed(1)}%`, "False Arrest Gap"];
                    return [value, name];
                  }} />
                  <Legend />
                  <ReferenceLine y={25} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'Target (25%)', position: 'right' }} />
                  <Line type="monotone" dataKey="trustGap" name="Trust Gap" stroke="#3b82f6" strokeWidth={2} />
                  <Line type="monotone" dataKey="crimeGap" name="Crime Gap (%)" stroke="#f59e0b" strokeWidth={2} />
                  <Line type="monotone" dataKey="falseArrestGap" name="False Arrest Gap" stroke="#10b981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
