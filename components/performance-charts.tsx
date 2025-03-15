"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, ComposedChart } from 'recharts'

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

  const policeAllocationData = processPoliceAllocationData();
  const budgetData = getBudgetData();
  const overBudgetData = getOverBudgetData();

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
      <h2 className="text-2xl font-semibold mb-6">Performance Metrics</h2>
      
      {/* Grid of charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Chart 1: Population */}
        <Card>
          <CardHeader className="py-2">
            <CardTitle className="text-sm">Population</CardTitle>
            <CardDescription className="text-xs">Population changes over time by district</CardDescription>
          </CardHeader>
          <CardContent className="p-0 pl-2">
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart 
                  data={populationData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="round" />
                  <YAxis 
                    width={45} 
                    tickFormatter={(value) => value.toLocaleString()}
                    domain={['auto', 'auto']} 
                  />
                  <Tooltip formatter={(value) => value.toLocaleString()} />
                  <Legend />
                  <Line type="monotone" dataKey="district1" name={getDistrictName("district1")} stroke={districtColors.district1} strokeWidth={2} />
                  <Line type="monotone" dataKey="district2" name={getDistrictName("district2")} stroke={districtColors.district2} strokeWidth={2} />
                  <Line type="monotone" dataKey="district3" name={getDistrictName("district3")} stroke={districtColors.district3} strokeWidth={2} />
                  <Line type="monotone" dataKey="district4" name={getDistrictName("district4")} stroke={districtColors.district4} strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* NEW CHART: Crime Reports */}
        <Card>
          <CardHeader className="py-2">
            <CardTitle className="text-sm">Crime Reports</CardTitle>
            <CardDescription className="text-xs">Number of crime reports by district over time</CardDescription>
          </CardHeader>
          <CardContent className="p-0 pl-2">
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart 
                  data={crimeData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="round" />
                  <YAxis width={45} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="district1" name={getDistrictName("district1")} stroke={districtColors.district1} strokeWidth={2} />
                  <Line type="monotone" dataKey="district2" name={getDistrictName("district2")} stroke={districtColors.district2} strokeWidth={2} />
                  <Line type="monotone" dataKey="district3" name={getDistrictName("district3")} stroke={districtColors.district3} strokeWidth={2} />
                  <Line type="monotone" dataKey="district4" name={getDistrictName("district4")} stroke={districtColors.district4} strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Number of Arrests Chart - corrected to use actual data from gameMetrics */}
        <Card>
          <CardHeader className="py-2">
            <CardTitle className="text-sm">No. of Arrests</CardTitle>
            <CardDescription className="text-xs">Number of arrests by district over time</CardDescription>
          </CardHeader>
          <CardContent className="p-0 pl-2">
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart 
                  data={arrestsData} // Use the renamed variable here
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="round" />
                  <YAxis width={45} domain={[0, 'auto']} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="district1" name={getDistrictName("district1")} stroke={districtColors.district1} strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="district2" name={getDistrictName("district2")} stroke={districtColors.district2} strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="district3" name={getDistrictName("district3")} stroke={districtColors.district3} strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="district4" name={getDistrictName("district4")} stroke={districtColors.district4} strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* NEW Chart: Total Arrested - FIXED */}
        <Card>
          <CardHeader className="py-2">
            <CardTitle className="text-sm">Total Arrested</CardTitle>
            <CardDescription className="text-xs">Total arrests across all districts per round</CardDescription>
          </CardHeader>
          <CardContent className="p-0 pl-2">
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={arrestsData.map(entry => ({  // Use the renamed variable here
                    round: entry.round,
                    totalArrested: 
                      (entry.district1 || 0) +
                      (entry.district2 || 0) +
                      (entry.district3 || 0) +
                      (entry.district4 || 0)
                  }))}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="round" />
                  <YAxis 
                    width={45} 
                    domain={[0, 'auto']}
                  />
                  <Tooltip formatter={(value) => [`${value} arrests`, "Total Arrests"]} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="totalArrested"
                    stroke="#f97316"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    name="Total Arrested"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Chart 3: Community Trust Trend */}
        <Card>
          <CardHeader className="py-2">
            <CardTitle className="text-sm">Community Trust Trend</CardTitle>
            <CardDescription className="text-xs">Trust percentage over time</CardDescription>
          </CardHeader>
          <CardContent className="p-0 pl-2">
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart 
                  data={trustData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="round" />
                  <YAxis width={45} domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="district1" name={getDistrictName("district1")} stroke={districtColors.district1} strokeWidth={2} />
                  <Line type="monotone" dataKey="district2" name={getDistrictName("district2")} stroke={districtColors.district2} strokeWidth={2} />
                  <Line type="monotone" dataKey="district3" name={getDistrictName("district3")} stroke={districtColors.district3} strokeWidth={2} />
                  <Line type="monotone" dataKey="district4" name={getDistrictName("district4")} stroke={districtColors.district4} strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Chart 4: False Arrest Rate Trend */}
        <Card>
          <CardHeader className="py-2">
            <CardTitle className="text-sm">False Arrest Rate Trend</CardTitle>
            <CardDescription className="text-xs">Percentage of false arrests over time</CardDescription>
          </CardHeader>
          <CardContent className="p-0 pl-2">
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart 
                  data={falseArrestData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="round" />
                  <YAxis 
                    width={45} 
                    domain={[0, 'dataMax']}
                  />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="district1" name={getDistrictName("district1")} stroke={districtColors.district1} strokeWidth={2} />
                  <Line type="monotone" dataKey="district2" name={getDistrictName("district2")} stroke={districtColors.district2} strokeWidth={2} />
                  <Line type="monotone" dataKey="district3" name={getDistrictName("district3")} stroke={districtColors.district3} strokeWidth={2} />
                  <Line type="monotone" dataKey="district4" name={getDistrictName("district4")} stroke={districtColors.district4} strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Chart 5: Police Allocation as stacked bar chart */}
        <Card>
          <CardHeader className="py-2">
            <CardTitle className="text-sm">Police Allocation</CardTitle>
            <CardDescription className="text-xs">Officers assigned to each district over time</CardDescription>
          </CardHeader>
          <CardContent className="p-0 pl-2">
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={policeAllocationData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="round" />
                  <YAxis width={45} />
                  <Tooltip formatter={(value, name) => [`${value} officers`, name]} />
                  <Legend />
                  <Bar dataKey={getDistrictName("district1")} stackId="a" fill={districtColors.district1} />
                  <Bar dataKey={getDistrictName("district2")} stackId="a" fill={districtColors.district2} />
                  <Bar dataKey={getDistrictName("district3")} stackId="a" fill={districtColors.district3} />
                  <Bar dataKey={getDistrictName("district4")} stackId="a" fill={districtColors.district4} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Chart 6: Income vs. Expense (renamed from Budget Trends) */}
        <Card>
          <CardHeader className="py-2">
            <CardTitle className="text-sm">Income vs. Expense</CardTitle>
            <CardDescription className="text-xs">Income and expenses over time</CardDescription>
          </CardHeader>
          <CardContent className="p-0 pl-2">
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={budgetData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="round" />
                  <YAxis width={45} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="income" name="Income" fill="#34d399" />
                  <Bar dataKey="expenses" name="Expenses" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* NEW Chart 7: Available Budget over time (renamed from Over Budget) */}
        <Card>
          <CardHeader className="py-2">
            <CardTitle className="text-sm">Available Budget</CardTitle>
            <CardDescription className="text-xs">Budget available each round</CardDescription>
          </CardHeader>
          <CardContent className="p-0 pl-2">
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={overBudgetData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="round" />
                  <YAxis 
                    width={45}
                    tickFormatter={(value) => `$${value}`}  
                  />
                  <Tooltip 
                    formatter={(value) => [`$${value}`, "Available Budget"]}
                  />
                  <Legend />
                  <Bar 
                    dataKey="budget" 
                    name="Available Budget" 
                    fill="#22c55e"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
