// chart-components.tsx
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, BarChart, Bar, ComposedChart, PieChart, Pie, Cell, 
  AreaChart, Area, ReferenceLine } from 'recharts'

// Common wrapper component for charts
export const ChartCard = ({ title, description, children, className = "" }) => (
  <Card className={className}>
    <CardHeader className="py-2 px-3">
      <CardTitle className="text-sm">{title}</CardTitle>
      <CardDescription className="text-xs">{description}</CardDescription>
    </CardHeader>
    <CardContent className="p-0 h-[200px]">
      {children}
    </CardContent>
  </Card>
)

// Pie Chart
export const MyPieChart = ({ data, districtColors }) => (
  <PieChart width={350} height={200}>
    <Pie
      data={data}
      cx="50%"
      cy="50%"
      labelLine={true}
      outerRadius={70}
      fill="#8884d8"
      dataKey="value"
      nameKey="name"
      label={({ name, percent, x, y, midAngle, payload }) => {
        const RADIAN = Math.PI / 180;
        const radius = 90;
        const cx = 350 / 2;
        const cy = 200 / 2;
        
        // Calculate position for the label
        const sin = Math.sin(-RADIAN * midAngle);
        const cos = Math.cos(-RADIAN * midAngle);
        const ex = cx + radius * cos;
        const ey = cy + radius * sin;
        
        // Use the same color as the pie segment
        const fill = districtColors[payload.id]; 
        
        return (
          <text
            x={ex}
            y={ey}
            fill={fill}
            textAnchor={ex > cx ? "start" : "end"}
            dominantBaseline="central"
            fontSize="12px"
            fontWeight="bold"
          >
            {`${name} ${(percent * 100).toFixed(0)}%`}
          </text>
        );
      }}
    >
      {data.map((entry, index) => (
        <Cell key={`cell-${index}`} fill={districtColors[entry.id]} />
      ))}
    </Pie>
    <Tooltip 
      formatter={(value) => new Intl.NumberFormat().format(value)} 
      contentStyle={{ fontSize: "10px" }}
    />
  </PieChart>
)

// Total Population Trend Chart
// Total Population Trend Chart
export const SingleLineChart = ({ data, line_name }) => (
  <ResponsiveContainer width="100%" height="100%">
    <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
      <XAxis dataKey="round" tick={{ fontSize: 10 }} />
      <YAxis 
        tickFormatter={(value) => new Intl.NumberFormat('en', { notation: 'compact' }).format(value)}
        tick={{ fontSize: 10 }}
      />
      <Tooltip formatter={(value) => new Intl.NumberFormat().format(value)} />
      <Legend wrapperStyle={{ fontSize: 12 }} />
      <Line 
        type="monotone" 
        dataKey="totalPopulation" 
        stroke="#8884d8" 
        name={line_name}
      />
    </LineChart>
  </ResponsiveContainer>
)

// District Population Chart
export const DistrictPopulationChart = ({ data, districtColors, getDistrictName }) => (
  <ResponsiveContainer width="100%" height="100%">
    <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
      <XAxis dataKey="round" tick={{ fontSize: 10 }} />
      <YAxis 
        tickFormatter={(value) => new Intl.NumberFormat('en', { notation: 'compact' }).format(value)}
        tick={{ fontSize: 10 }}
      />
      <Tooltip formatter={(value) => new Intl.NumberFormat().format(value)} />
      <Legend layout="horizontal" verticalAlign="top" align="right" height={20} />
      <Line 
        type="monotone" 
        dataKey="district1" 
        name={getDistrictName("district1")} 
        stroke={districtColors.district1} 
        strokeWidth={2} 
        dot={{ r: 2 }}
      />
      <Line 
        type="monotone" 
        dataKey="district2" 
        name={getDistrictName("district2")} 
        stroke={districtColors.district2} 
        strokeWidth={2}
        dot={{ r: 2 }}
      />
      <Line 
        type="monotone" 
        dataKey="district3" 
        name={getDistrictName("district3")} 
        stroke={districtColors.district3} 
        strokeWidth={2}
        dot={{ r: 2 }}
      />
      <Line 
        type="monotone" 
        dataKey="district4" 
        name={getDistrictName("district4")} 
        stroke={districtColors.district4} 
        strokeWidth={2}
        dot={{ r: 2 }}
      />
    </LineChart>
  </ResponsiveContainer>
)

// Crime Reports Chart
export const MyLineChart = ({ data, districtColors, getDistrictName }) => (
  <ResponsiveContainer width="100%" height="100%">
    <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
      <XAxis dataKey="round" tick={{ fontSize: 10 }} />
      <YAxis tick={{ fontSize: 10 }} />
      <Tooltip 
        formatter={(value) => new Intl.NumberFormat().format(value)} 
        contentStyle={{ fontSize: '10px' }}
      />
      <Legend 
        layout="horizontal" 
        align="right" 
        height={30}
        wrapperStyle={{ fontSize: '12px', paddingLeft: '10px' }}
      />
      <Line 
        type="monotone" 
        dataKey="district1" 
        name={getDistrictName("district1")} 
        stroke={districtColors.district1} 
        strokeWidth={2}
        dot={{ r: 2 }}
      />
      <Line 
        type="monotone" 
        dataKey="district2" 
        name={getDistrictName("district2")} 
        stroke={districtColors.district2} 
        strokeWidth={2}
        dot={{ r: 2 }}
      />
      <Line 
        type="monotone" 
        dataKey="district3" 
        name={getDistrictName("district3")} 
        stroke={districtColors.district3} 
        strokeWidth={2}
        dot={{ r: 2 }}
      />
      <Line 
        type="monotone" 
        dataKey="district4" 
        name={getDistrictName("district4")} 
        stroke={districtColors.district4} 
        strokeWidth={2}
        dot={{ r: 2 }}
      />
    </LineChart>
  </ResponsiveContainer>
)


// Total Crime Trend Chart
export const TotalCrimeTrendChart = ({ data }) => (
  <ResponsiveContainer width="100%" height="100%">
    <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
      <XAxis dataKey="round" tick={{ fontSize: 10 }} />
      <YAxis tick={{ fontSize: 10 }} />
      <Tooltip formatter={(value) => [`${value} crimes`, "Total Crimes"]} />
      <Area 
        type="monotone" 
        dataKey="totalCrimes" 
        stroke="#ef4444" 
        fill="#fee2e2" 
        name="Total Crimes" 
      />
    </AreaChart>
  </ResponsiveContainer>
)
// Stacked Bar Chart
export const MyStackedChart = ({ data }) => (
  <ResponsiveContainer width="100%" height="100%">
    <BarChart 
      data={data} 
      margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
      barCategoryGap="10%" 
      barGap={0}
      maxBarSize = {50}
    >
      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
      <XAxis dataKey="round" tick={{ fontSize: 10 }} />
      <YAxis tick={{ fontSize: 10 }} />
      <Tooltip 
        formatter={(value, name) => [`${value} officers`, name]} 
        contentStyle={{ fontSize: '12px' }}
      />
      <Legend 
        layout="horizontal" 
        align="right" 
        height={30} 
        iconSize={12}
        wrapperStyle={{ fontSize: '12px' }}
      />
      {data[0] && Object.keys(data[0])
        .filter(key => key !== "round")
        .map((district, index) => {
          const colors = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"];
          return <Bar key={district} dataKey={district} stackId="a" fill={colors[index % colors.length]} />;
        })
      }
    </BarChart>
  </ResponsiveContainer>
)
// Budget Chart
export const BudgetChart = ({ data }) => (
  <ResponsiveContainer width="100%" height="100%">
    <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
)

// Income vs Expenses Chart
export const IncomeExpensesChart = ({ data }) => (
  <ResponsiveContainer width="100%" height="100%">
    <BarChart 
      data={data} 
      margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
      maxBarSize={60}
      barCategoryGap="15%"
      barGap={0.11}
    >
      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
      <XAxis dataKey="round" tick={{ fontSize: 10 }} />
      <YAxis tick={{ fontSize: 10 }} />
      <Tooltip formatter={(value) => `$${value}`} />
      <Legend layout="horizontal" verticalAlign="top" align="right" height={20} />
      <Bar dataKey="income" name="Income" fill="#22c55e" />
      <Bar dataKey="expenses" name="Expenses" fill="#ef4444" />
    </BarChart>
  </ResponsiveContainer>
)
// Bias Indicators Chart
export const BiasIndicatorsChart = ({ data }) => (
  <ResponsiveContainer width="100%" height="100%">
    <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
)

// District Disparity Chart
export const DistrictDisparityChart = ({ data }) => (
  <ResponsiveContainer width="100%" height="100%">
    <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
      <XAxis dataKey="round" tick={{ fontSize: 10 }} />
      <YAxis domain={[0, 'auto']} tick={{ fontSize: 10 }} />
      <Tooltip />
      <Legend layout="horizontal" verticalAlign="top" align="right" height={20} />
      <ReferenceLine y={25} stroke="#ef4444" strokeDasharray="3 3" />
      <Line 
        type="monotone" 
        dataKey="trustGap" 
        name="Trust Gap" 
        stroke="#3b82f6" 
        strokeWidth={2}
        dot={{ r: 2 }}
      />
      <Line 
        type="monotone" 
        dataKey="crimeGap" 
        name="Crime Gap (%)" 
        stroke="#f59e0b" 
        strokeWidth={2}
        dot={{ r: 2 }}
      />
      <Line 
        type="monotone" 
        dataKey="falseArrestGap" 
        name="False Arrest Gap" 
        stroke="#10b981" 
        strokeWidth={2}
        dot={{ r: 2 }}
      />
    </LineChart>
  </ResponsiveContainer>
)