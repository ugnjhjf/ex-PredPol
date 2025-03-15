import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { InfoIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"

export default function DistrictMetrics({ gameMetrics, getDistrictName }) {
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

  const districtEmojis = {
    district1: "🏙️",
    district2: "🏘️",
    district3: "🏚️",
    district4: "🏫",
  }

  // Helper function to render a pie chart - same implementation as in action-selection.tsx
  const PieChart = ({ data, size = 60 }) => {
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
      const percentage = value // already in percentage
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
          fill={colors[key]} 
          stroke="#fff" 
          strokeWidth="1"
        />
      )
      
      // Add percentage labels for larger segments
      if (percentage > 10) {
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
            {Math.round(percentage)}%
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

  const getTrustColor = (trust) => {
    if (trust >= 70) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
    if (trust >= 40) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
  }

  const getCrimeColor = (crime) => {
    if (crime <= 30) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
    if (crime <= 60) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
  }

  const getFalseArrestColor = (rate) => {
    if (rate <= 10) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
    if (rate <= 20) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
  }

  return (
    <div className="grid grid-cols-2 gap-4 p-2">
      {["district1", "district2", "district3", "district4"].map((district) => (
        <Card key={district} className={`overflow-hidden border-2 ${districtColors[district]}`}>
          <CardHeader className={`py-2 px-3 ${districtHeaderColors[district]}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">{districtEmojis[district]}</span>
                <CardTitle className="text-base">{getDistrictName(district)}</CardTitle>
              </div>
              <div className="flex items-center gap-1.5">
                {/* Trust metric with info icon */}
                <div className="flex items-center">
                  <Badge 
                    variant="outline" 
                    className={`px-2 py-0.5 text-xs font-medium ${getTrustColor(gameMetrics.communityTrust[district])}`}
                  >
                    Trust: {gameMetrics.communityTrust[district]}%
                  </Badge>
                  <Popover>
                    <PopoverTrigger>
                      <InfoIcon className="h-3 w-3 ml-1 text-muted-foreground cursor-pointer" />
                    </PopoverTrigger>
                    <PopoverContent className="w-64 p-2">
                      <p className="text-xs">
                        How much the community trusts the police. Higher trust leads to better cooperation.
                      </p>
                    </PopoverContent>
                  </Popover>
                </div>
                
                {/* Crime metric with info icon */}
                <div className="flex items-center">
                  <Badge 
                    variant="outline" 
                    className={`px-2 py-0.5 text-xs font-medium ${getCrimeColor(gameMetrics.crimeRate[district])}`}
                  >
                    Crime: {gameMetrics.crimeRate[district]}%
                  </Badge>
                  <Popover>
                    <PopoverTrigger>
                      <InfoIcon className="h-3 w-3 ml-1 text-muted-foreground cursor-pointer" />
                    </PopoverTrigger>
                    <PopoverContent className="w-64 p-2">
                      <p className="text-xs">
                        Percentage of criminal activity in the district. Lower is better.
                      </p>
                    </PopoverContent>
                  </Popover>
                </div>
                
                {/* False Arrests metric with info icon */}
                <div className="flex items-center">
                  <Badge 
                    variant="outline" 
                    className={`px-2 py-0.5 text-xs font-medium ${getFalseArrestColor(gameMetrics.falseArrestRate[district])}`}
                  >
                    F.A.R.: {gameMetrics.falseArrestRate[district]}%
                  </Badge>
                  <Popover>
                    <PopoverTrigger>
                      <InfoIcon className="h-3 w-3 ml-1 text-muted-foreground cursor-pointer" />
                    </PopoverTrigger>
                    <PopoverContent className="w-64 p-2">
                      <p className="text-xs">
                        False Arrest Rate - percentage of arrests involving innocent individuals. Lower values indicate more accurate policing.
                      </p>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-3 space-y-4">
            {/* Demographic Information */}
            <div className="grid grid-cols-2 gap-4">
              {/* Arrests by Race */}
              <div>
                <div className="flex justify-between items-center text-xs font-medium mb-2">
                  <h4>Arrests by Race</h4>
                  <Popover>
                    <PopoverTrigger>
                      <InfoIcon className="h-3 w-3 text-muted-foreground cursor-pointer" />
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <p className="text-sm">
                        Distribution of arrests across racial demographics. Disparities may indicate bias.
                      </p>
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex gap-2">
                  {/* Legend on left */}
                  <div className="text-[9px] space-y-1.5 mt-1">
                    <div className="flex items-center">
                      <span className="inline-block w-2 h-2 bg-blue-400 mr-1"></span>
                      <span>White: {gameMetrics.arrestsByRace.white[district]}%</span>
                    </div>
                    <div className="flex items-center">
                      <span className="inline-block w-2 h-2 bg-green-400 mr-1"></span>
                      <span>Black: {gameMetrics.arrestsByRace.black[district]}%</span>
                    </div>
                    <div className="flex items-center">
                      <span className="inline-block w-2 h-2 bg-yellow-400 mr-1"></span>
                      <span>Hispanic: {gameMetrics.arrestsByRace.hispanic[district]}%</span>
                    </div>
                    <div className="flex items-center">
                      <span className="inline-block w-2 h-2 bg-purple-400 mr-1"></span>
                      <span>Other: {gameMetrics.arrestsByRace.other[district]}%</span>
                    </div>
                  </div>
                  
                  {/* Larger pie chart */}
                  <div className="flex-1 flex items-center justify-center">
                    <PieChart 
                      data={{
                        white: gameMetrics.arrestsByRace.white[district],
                        black: gameMetrics.arrestsByRace.black[district],
                        hispanic: gameMetrics.arrestsByRace.hispanic[district],
                        other: gameMetrics.arrestsByRace.other[district]
                      }} 
                      size={85}
                    />
                  </div>
                </div>
              </div>

              {/* Arrests by Income */}
              <div>
                <div className="flex justify-between items-center text-xs font-medium mb-2">
                  <h4>Arrests by Income</h4>
                  <Popover>
                    <PopoverTrigger>
                      <InfoIcon className="h-3 w-3 text-muted-foreground cursor-pointer" />
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <p className="text-sm">
                        Distribution of arrests across income levels. Disparities may indicate economic bias.
                      </p>
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex gap-2">
                  {/* Legend on left */}
                  <div className="text-[9px] space-y-1.5 mt-1">
                    <div className="flex items-center">
                      <span className="inline-block w-2 h-2 bg-emerald-400 mr-1"></span>
                      <span>High: {gameMetrics.arrestsByIncome.high[district]}%</span>
                    </div>
                    <div className="flex items-center">
                      <span className="inline-block w-2 h-2 bg-amber-400 mr-1"></span>
                      <span>Middle: {gameMetrics.arrestsByIncome.middle[district]}%</span>
                    </div>
                    <div className="flex items-center">
                      <span className="inline-block w-2 h-2 bg-red-400 mr-1"></span>
                      <span>Low: {gameMetrics.arrestsByIncome.low[district]}%</span>
                    </div>
                  </div>
                  
                  {/* Larger pie chart */}
                  <div className="flex-1 flex items-center justify-center">
                    <PieChart 
                      data={{
                        high: gameMetrics.arrestsByIncome.high[district],
                        middle: gameMetrics.arrestsByIncome.middle[district],
                        low: gameMetrics.arrestsByIncome.low[district],
                      }} 
                      size={85}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Common Crimes - Info icon moved to the left of the heading */}
            <div>
              <div className="flex items-center text-xs font-medium mb-1">
                <Popover>
                  <PopoverTrigger>
                    <InfoIcon className="h-3 w-3 text-muted-foreground cursor-pointer mr-1" />
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-2">
                    <p className="text-xs">Most frequent types of crime in this district.</p>
                  </PopoverContent>
                </Popover>
                <h4>Common Crimes:</h4>
              </div>
              <div className="flex flex-wrap gap-1">
                {gameMetrics.commonCrimes[district].map((crime, index) => (
                  <span key={index} className="text-xs bg-muted px-1.5 py-0.5 rounded">
                    {crime}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

