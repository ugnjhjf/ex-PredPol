"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge" // Add Badge import
import { InfoIcon, Trophy, Settings2 } from "lucide-react" // Add InfoIcon, Trophy and Settings2 import
import { ScrollArea } from "@/components/ui/scroll-area" // Add ScrollArea import

export default function GameOverview({ onStart, isEmbedded = false }) {
  // District styling for consistency
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
  
  return isEmbedded ? (
    <div className="space-y-4 p-3">
      <div>
        <h2 className="text-lg font-bold">Predictive Policing Simulation</h2>
      </div>
      
      {/* Game Background section */}
      <div>
        <Card className="border border-primary/20">
          <CardHeader className="py-1.5 px-3 bg-gray-100 dark:bg-gray-900">
            <CardTitle className="text-sm flex items-center gap-1.5">
              <InfoIcon className="h-4 w-4" />
              Game Background
            </CardTitle>
          </CardHeader>
          <CardContent className="py-2.5 px-3.5">
            <p className="text-sm">
              This simulation challenges you to manage police resources across four distinct districts, 
              each with unique demographics, crime patterns, and community relationships. Your decisions 
              will impact crime rates, community trust, and social equity.
            </p>
            <p className="text-sm mt-2">
              Navigate the complex balance between effective law enforcement and community relations 
              while addressing systemic issues in policing practices.
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* What is Predictive Policing section */}
      <div>
        <Card className="border border-primary/20">
          <CardHeader className="py-1.5 px-3 bg-blue-100 dark:bg-blue-900">
            <CardTitle className="text-sm flex items-center gap-1.5">
              <InfoIcon className="h-4 w-4" />
              What is Predictive Policing?
            </CardTitle>
          </CardHeader>
          <CardContent className="py-2.5 px-3.5">
            <p className="text-sm">
              Predictive policing uses data analysis tools to anticipate, prevent, and respond to crime. 
              It combines technology, officer deployment strategies, and resource allocation decisions to maximize public safety.
            </p>
            <p className="text-sm mt-2">
              In this simulation, you'll balance algorithmic insights with human judgment while considering impacts on different communities.
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Success Metrics Section */}
      <div>
        <Card className="border border-primary/20">
          <CardHeader className="py-1.5 px-3 bg-orange-100 dark:bg-orange-900">
            <CardTitle className="text-sm flex items-center gap-1.5">
              <Trophy className="h-4 w-4" />
              Success Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="py-2.5 px-3.5">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 pr-4 font-medium text-muted-foreground">Metric</th>
                    <th className="text-left py-2 pr-4 font-medium text-muted-foreground">Target</th>
                    <th className="text-left py-2 font-medium text-muted-foreground">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="py-2 pr-4 font-medium">Crime Rate</td>
                    <td className="py-2 pr-4"><Badge variant="outline" className="px-2 py-0.5">≤35%</Badge></td>
                    <td className="py-2 text-muted-foreground">Average across all districts</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-medium">Community Trust</td>
                    <td className="py-2 pr-4"><Badge variant="outline" className="px-2 py-0.5">≥55%</Badge></td>
                    <td className="py-2 text-muted-foreground">Average across all districts</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-medium">District Gap</td>
                    <td className="py-2 pr-4"><Badge variant="outline" className="px-2 py-0.5">≤25%</Badge></td>
                    <td className="py-2 text-muted-foreground">Crime/trust gap between highest and lowest</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-medium">False Arrest Rate</td>
                    <td className="py-2 pr-4"><Badge variant="outline" className="px-2 py-0.5">≤15%</Badge></td>
                    <td className="py-2 text-muted-foreground">In all districts</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-medium">Disparity Index</td>
                    <td className="py-2 pr-4"><Badge variant="outline" className="px-2 py-0.5">≤30%</Badge></td>
                    <td className="py-2 text-muted-foreground">Racial and economic disparities</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Districts section */}
      <div>
        <h3 className="text-sm font-semibold mb-1.5">The Four Districts</h3>
        <div className="grid grid-cols-2 gap-2">
          {[
            {
              id: "district1",
              name: "Downtown",
              emoji: "🏙️",
              description: "High income, primarily white population with low crime rate and high trust in police",
              challenge: "White collar crime during daytime hours"
            },
            {
              id: "district2",
              name: "Westside",
              emoji: "🏘️",
              description: "Mixed income, diverse population with moderate crime and trust levels",
              challenge: "Balanced crime patterns with slight night emphasis"
            },
            {
              id: "district3",
              name: "South Side",
              emoji: "🏚️",
              description: "Low income, primarily minority population with high crime rate and low trust",
              challenge: "Significant night crime and community tension"
            },
            {
              id: "district4", 
              name: "Eastside",
              emoji: "🏫",
              description: "Mixed demographics with historical tensions and ongoing community issues",
              challenge: "Higher crime rates during evening and night hours"
            }
          ].map(district => (
            <Card key={district.id} className={`border ${districtColors[district.id]}`}>
              <CardHeader className={`py-1 px-2 ${districtHeaderColors[district.id]}`}>
                <div className="flex items-center gap-1.5">
                  <div className="text-lg">{district.emoji}</div>
                  <CardTitle className="text-sm">{district.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="py-2.5 px-3.5">
                <p className="text-sm">{district.description}</p>
                <p className="text-xs mt-1.5 font-medium">Challenge: {district.challenge}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Game Mechanics Section - embedded */}
      <div>
        <Card className="border border-primary/20">
          <CardHeader className="py-1.5 px-3 bg-rose-100 dark:bg-rose-900">
            <CardTitle className="text-sm flex items-center gap-1.5">
              <Settings2 className="h-4 w-4" />
              Game Mechanics
            </CardTitle>
          </CardHeader>
          <CardContent className="py-2.5 px-3.5">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 pr-4 font-medium text-muted-foreground">Mechanic</th>
                    <th className="text-left py-2 font-medium text-muted-foreground">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="py-2 pr-4 font-medium">Resource Allocation</td>
                    <td className="py-2 text-muted-foreground">Distribute 20 officers across day/night in 4 districts</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-medium">Actions</td>
                    <td className="py-2 text-muted-foreground">Each round, implement one community action in one district</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-medium">Dashboard</td>
                    <td className="py-2 text-muted-foreground">Monitor trust, crime rates, arrests, and disparities</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-medium">Duration</td>
                    <td className="py-2 text-muted-foreground">5 rounds total with evaluation at the end</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Trust Thresholds section */}
      <div>
        <h3 className="text-sm font-semibold mb-1.5">Trust Thresholds</h3>
        <Card className="border border-primary/20">
          <CardContent className="py-2.5 px-3.5">
            <p className="text-sm mb-2">
              Each district has a minimum trust threshold you must maintain:
            </p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
              <div className="text-sm">Downtown: <Badge variant="outline" className="px-1.5 py-0.5">≥50%</Badge></div>
              <div className="text-sm">Westside: <Badge variant="outline" className="px-1.5 py-0.5">≥40%</Badge></div>
              <div className="text-sm">South Side: <Badge variant="outline" className="px-1.5 py-0.5">≥30%</Badge></div>
              <div className="text-sm">Eastside: <Badge variant="outline" className="px-1.5 py-0.5">≥40%</Badge></div>
            </div>
            <p className="text-sm mt-2 text-amber-700 dark:text-amber-500">
              <InfoIcon className="h-3.5 w-3.5 inline mr-1.5" />
              Failing to meet these thresholds will limit your maximum achievable grade.
            </p>
          </CardContent>
        </Card>
      </div>
        
      <Button size="default" onClick={onStart} className="w-full">
        Start Simulation
      </Button>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center min-h-screen w-full">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Predictive Policing Simulation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Game Background section */}
          <div>
            <Card className="border border-primary/20">
              <CardHeader className="py-3 px-4 bg-gray-100 dark:bg-gray-900">
                <CardTitle className="text-sm flex items-center gap-2">
                  <InfoIcon className="h-5 w-5" />
                  Game Background
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <p className="text-sm">
                  This simulation challenges you to manage police resources across four distinct districts, 
                  each with unique demographics, crime patterns, and community relationships. Your decisions 
                  will impact crime rates, community trust, and social equity.
                </p>
                <p className="text-sm mt-2">
                  Navigate the complex balance between effective law enforcement and community relations 
                  while addressing systemic issues in policing practices.
                </p>
              </CardContent>
            </Card>
          </div>
          {/* What is Predictive Policing section */}
          <div>
            <Card className="border border-primary/20">
              <CardHeader className="py-3 px-4 bg-blue-100 dark:bg-blue-900">
                <CardTitle className="text-sm flex items-center gap-2">
                  <InfoIcon className="h-5 w-5" />
                  What is Predictive Policing?
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <p className="text-sm">
                  Predictive policing uses data analysis tools to anticipate, prevent, and respond to crime. 
                  It combines technology, officer deployment strategies, and resource allocation decisions to maximize public safety.
                </p>
                <p className="text-sm mt-2">
                  In this simulation, you'll balance algorithmic insights with human judgment while considering impacts on different communities.
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Success Metrics Section */}
          <div>
            <Card className="border border-primary/20">
              <CardHeader className="py-3 px-4 bg-orange-100 dark:bg-orange-900">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Success Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 pr-4 font-medium text-muted-foreground">Metric</th>
                        <th className="text-left py-2 pr-4 font-medium text-muted-foreground">Target</th>
                        <th className="text-left py-2 font-medium text-muted-foreground">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      <tr>
                        <td className="py-2 pr-4 font-medium">Crime Rate</td>
                        <td className="py-2 pr-4"><Badge variant="outline" className="px-2 py-0.5">≤35%</Badge></td>
                        <td className="py-2 text-muted-foreground">Average across all districts</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4 font-medium">Community Trust</td>
                        <td className="py-2 pr-4"><Badge variant="outline" className="px-2 py-0.5">≥55%</Badge></td>
                        <td className="py-2 text-muted-foreground">Average across all districts</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4 font-medium">District Gap</td>
                        <td className="py-2 pr-4"><Badge variant="outline" className="px-2 py-0.5">≤25%</Badge></td>
                        <td className="py-2 text-muted-foreground">Crime/trust gap between highest and lowest</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4 font-medium">False Arrest Rate</td>
                        <td className="py-2 pr-4"><Badge variant="outline" className="px-2 py-0.5">≤15%</Badge></td>
                        <td className="py-2 text-muted-foreground">In all districts</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4 font-medium">Disparity Index</td>
                        <td className="py-2 pr-4"><Badge variant="outline" className="px-2 py-0.5">≤30%</Badge></td>
                        <td className="py-2 text-muted-foreground">Racial and economic disparities</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Game Mechanics Section - desktop */}
          <div>
            <Card className="border border-primary/20">
              <CardHeader className="py-3 px-4 bg-rose-100 dark:bg-rose-900">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Settings2 className="h-5 w-5" />
                  Game Mechanics
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 pr-4 font-medium text-muted-foreground">Mechanic</th>
                        <th className="text-left py-2 font-medium text-muted-foreground">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      <tr>
                        <td className="py-2 pr-4 font-medium">Resource Allocation</td>
                        <td className="py-2 text-muted-foreground">Distribute 20 officers across day/night in 4 districts</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4 font-medium">Actions</td>
                        <td className="py-2 text-muted-foreground">Each round, implement one community action in one district</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4 font-medium">Dashboard</td>
                        <td className="py-2 text-muted-foreground">Monitor trust, crime rates, arrests, and disparities</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4 font-medium">Duration</td>
                        <td className="py-2 text-muted-foreground">5 rounds total with evaluation at the end</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Districts section - retain desktop styling */}
          <div>
            <h3 className="text-base font-semibold mb-2">The Four Districts</h3>
            <div className="grid grid-cols-2 gap-4">
              {/* ...same district cards as embedded version but with larger padding... */}
            </div>
          </div>

          {/* ...rest of the desktop view with larger text and padding... */}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button size="lg" onClick={onStart}>
            Start Simulation
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

