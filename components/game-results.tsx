"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"

export default function GameResults({ metrics, onReset }) {
  // Calculate overall scores
  const avgTrust =
    (metrics.communityTrust.district1 +
      metrics.communityTrust.district2 +
      metrics.communityTrust.district3 +
      metrics.communityTrust.district4) /
    4

  // Update this to use crimesReported instead of crimeRate
  const totalCrimes = 
    metrics.crimesReported.district1 +
    metrics.crimesReported.district2 +
    metrics.crimesReported.district3 +
    metrics.crimesReported.district4

  // Calculate average crime as a percentage based on reported crimes
  const avgCrime =
    (Math.min(100, metrics.crimesReported.district1 / 5) +
      Math.min(100, metrics.crimesReported.district2 / 5) +
      Math.min(100, metrics.crimesReported.district3 / 5) +
      Math.min(100, metrics.crimesReported.district4 / 5)) /
    4

  const avgFalseArrest =
    (metrics.falseArrestRate.district1 +
      metrics.falseArrestRate.district2 +
      metrics.falseArrestRate.district3 +
      metrics.falseArrestRate.district4) /
    4

  // Calculate bias scores
  const racialBias =
    Math.abs(metrics.arrestsByRace.black.district3 - metrics.arrestsByRace.white.district1) +
    Math.abs(metrics.arrestsByRace.hispanic.district3 - metrics.arrestsByRace.white.district1)

  const incomeBias =
    Math.abs(metrics.arrestsByIncome.low.district3 - metrics.arrestsByIncome.high.district1) +
    Math.abs(metrics.arrestsByIncome.low.district4 - metrics.arrestsByIncome.high.district1)

  // Calculate gaps between highest and lowest districts
  const trustGap = Math.max(
    Math.abs(metrics.communityTrust.district1 - metrics.communityTrust.district2),
    Math.abs(metrics.communityTrust.district1 - metrics.communityTrust.district3),
    Math.abs(metrics.communityTrust.district1 - metrics.communityTrust.district4),
    Math.abs(metrics.communityTrust.district2 - metrics.communityTrust.district3),
    Math.abs(metrics.communityTrust.district2 - metrics.communityTrust.district4),
    Math.abs(metrics.communityTrust.district3 - metrics.communityTrust.district4)
  )
  
  // Calculate gaps between highest and lowest districts - update for crimesReported
  const crimeGap = Math.max(
    Math.abs(metrics.crimesReported.district1 / 5 - metrics.crimesReported.district2 / 5),
    Math.abs(metrics.crimesReported.district1 / 5 - metrics.crimesReported.district3 / 5),
    Math.abs(metrics.crimesReported.district1 / 5 - metrics.crimesReported.district4 / 5),
    Math.abs(metrics.crimesReported.district2 / 5 - metrics.crimesReported.district3 / 5),
    Math.abs(metrics.crimesReported.district2 / 5 - metrics.crimesReported.district4 / 5),
    Math.abs(metrics.crimesReported.district3 / 5 - metrics.crimesReported.district4 / 5)
  )

  const falseArrestGap = Math.max(
    Math.abs(metrics.falseArrestRate.district1 - metrics.falseArrestRate.district2),
    Math.abs(metrics.falseArrestRate.district1 - metrics.falseArrestRate.district3),
    Math.abs(metrics.falseArrestRate.district1 - metrics.falseArrestRate.district4),
    Math.abs(metrics.falseArrestRate.district2 - metrics.falseArrestRate.district3),
    Math.abs(metrics.falseArrestRate.district2 - metrics.falseArrestRate.district4),
    Math.abs(metrics.falseArrestRate.district3 - metrics.falseArrestRate.district4)
  )
  
  // Calculate objective fulfillment
  const objectives = [
    {
      name: "Average crime rate below 35%",
      achieved: avgCrime < 35,
      value: `${avgCrime.toFixed(1)}%`,
      target: "< 35%"
    },
    {
      name: "Average community trust above 55%",
      achieved: avgTrust > 55,
      value: `${avgTrust.toFixed(1)}%`,
      target: "> 55%"
    },
    {
      name: "Crime/trust gap between districts less than 25%",
      achieved: trustGap < 25 && crimeGap < 25,
      value: `Trust: ${trustGap.toFixed(1)}%, Crime: ${crimeGap.toFixed(1)}%`,
      target: "< 25%"
    },
    {
      name: "False arrest rate below 15% in all districts",
      achieved: 
        metrics.falseArrestRate.district1 < 15 && 
        metrics.falseArrestRate.district2 < 15 && 
        metrics.falseArrestRate.district3 < 15 && 
        metrics.falseArrestRate.district4 < 15,
      value: `${Math.max(
        metrics.falseArrestRate.district1,
        metrics.falseArrestRate.district2,
        metrics.falseArrestRate.district3,
        metrics.falseArrestRate.district4
      ).toFixed(1)}%`,
      target: "< 15%"
    },
    {
      name: "Racial and economic disparity indexes below 30%",
      achieved: racialBias / 2 < 30 && incomeBias / 2 < 30,
      value: `R: ${(racialBias / 2).toFixed(1)}%, E: ${(incomeBias / 2).toFixed(1)}%`,
      target: "< 30%"
    }
  ]
  
  // NEW: Calculate detailed score breakdown (0-100 points total)
  const scoreBreakdown = {
    crimeReduction: {
      title: "Crime Reduction",
      description: "Effectiveness in reducing crime rates across districts",
      maxPoints: 25,
      points: 0,
      details: []
    },
    communityTrust: {
      title: "Community Trust",
      description: "Building and maintaining trust with citizens",
      maxPoints: 25,
      points: 0,
      details: []
    },
    equitablePolicing: {
      title: "Equitable Policing",
      description: "Fairness across districts and demographic groups",
      maxPoints: 25,
      points: 0,
      details: []
    },
    policeAccuracy: {
      title: "Police Accuracy",
      description: "Minimizing false arrests and maintaining accountability",
      maxPoints: 25,
      points: 0,
      details: []
    }
  }
  
  // Calculate Crime Reduction score (25 points max)
  if (avgCrime <= 25) {
    scoreBreakdown.crimeReduction.points = 25;
    scoreBreakdown.crimeReduction.details.push("Exceptional crime reduction across all districts");
  } else if (avgCrime <= 35) {
    scoreBreakdown.crimeReduction.points = 20;
    scoreBreakdown.crimeReduction.details.push("Very effective crime reduction across districts");
  } else if (avgCrime <= 45) {
    scoreBreakdown.crimeReduction.points = 15;
    scoreBreakdown.crimeReduction.details.push("Good crime reduction, but room for improvement");
  } else if (avgCrime <= 55) {
    scoreBreakdown.crimeReduction.points = 10;
    scoreBreakdown.crimeReduction.details.push("Moderate crime reduction");
  } else if (avgCrime <= 65) {
    scoreBreakdown.crimeReduction.points = 5;
    scoreBreakdown.crimeReduction.details.push("Limited crime reduction effectiveness");
  } else {
    scoreBreakdown.crimeReduction.points = 0;
    scoreBreakdown.crimeReduction.details.push("Failed to achieve meaningful crime reduction");
  }
  
  // Add points for most dangerous district improvement
  // Update this to use crimesReported instead of crimeRate
  if (metrics.crimesReported.district3 / 5 < 50) {
    scoreBreakdown.crimeReduction.details.push("Successfully reduced crime in high-crime South Side");
    // Bonus already included in overall average calculation
  }
  
  // Calculate Community Trust score (25 points max)
  if (avgTrust >= 75) {
    scoreBreakdown.communityTrust.points = 25;
    scoreBreakdown.communityTrust.details.push("Exceptional community trust across all districts");
  } else if (avgTrust >= 65) {
    scoreBreakdown.communityTrust.points = 20;
    scoreBreakdown.communityTrust.details.push("Very good community trust across districts");
  } else if (avgTrust >= 55) {
    scoreBreakdown.communityTrust.points = 15;
    scoreBreakdown.communityTrust.details.push("Good community trust across districts");
  } else if (avgTrust >= 45) {
    scoreBreakdown.communityTrust.points = 10;
    scoreBreakdown.communityTrust.details.push("Moderate community trust");
  } else if (avgTrust >= 35) {
    scoreBreakdown.communityTrust.points = 5;
    scoreBreakdown.communityTrust.details.push("Low community trust in police");
  } else {
    scoreBreakdown.communityTrust.points = 0;
    scoreBreakdown.communityTrust.details.push("Failed to maintain community trust");
  }
  
  // Check trust in high-minority district 
  if (metrics.communityTrust.district3 >= 50) {
    scoreBreakdown.communityTrust.details.push("Built strong trust in traditionally underserved South Side");
    // Bonus already included in overall average calculation
  }
  
  // Calculate Equitable Policing score (25 points max)
  let equityPoints = 0;
  
  // Trust gap accounts for 8 points
  if (trustGap <= 15) {
    equityPoints += 8;
    scoreBreakdown.equitablePolicing.details.push("Minimal trust gap between districts (+8)");
  } else if (trustGap <= 25) {
    equityPoints += 5;
    scoreBreakdown.equitablePolicing.details.push("Moderate trust gap between districts (+5)");
  } else if (trustGap <= 40) {
    equityPoints += 2;
    scoreBreakdown.equitablePolicing.details.push("Significant trust gap between districts (+2)");
  } else {
    scoreBreakdown.equitablePolicing.details.push("Extreme trust gap between districts (+0)");
  }
  
  // Crime gap accounts for 8 points
  if (crimeGap <= 15) {
    equityPoints += 8;
    scoreBreakdown.equitablePolicing.details.push("Minimal crime gap between districts (+8)");
  } else if (crimeGap <= 25) {
    equityPoints += 5;
    scoreBreakdown.equitablePolicing.details.push("Moderate crime gap between districts (+5)");
  } else if (crimeGap <= 40) {
    equityPoints += 2;
    scoreBreakdown.equitablePolicing.details.push("Significant crime gap between districts (+2)");
  } else {
    scoreBreakdown.equitablePolicing.details.push("Extreme crime gap between districts (+0)");
  }
  
  // Racial/economic disparities account for 9 points
  const normalizedRacialBias = racialBias / 2;
  const normalizedEconomicBias = incomeBias / 2;
  
  if (normalizedRacialBias <= 20 && normalizedEconomicBias <= 20) {
    equityPoints += 9;
    scoreBreakdown.equitablePolicing.details.push("Minimal bias in arrest patterns (+9)");
  } else if (normalizedRacialBias <= 30 && normalizedEconomicBias <= 30) {
    equityPoints += 6;
    scoreBreakdown.equitablePolicing.details.push("Limited bias in arrest patterns (+6)");
  } else if (normalizedRacialBias <= 40 && normalizedEconomicBias <= 40) {
    equityPoints += 3;
    scoreBreakdown.equitablePolicing.details.push("Noticeable bias in arrest patterns (+3)");
  } else {
    scoreBreakdown.equitablePolicing.details.push("Significant bias in arrest patterns (+0)");
  }
  
  scoreBreakdown.equitablePolicing.points = equityPoints;
  
  // Calculate Police Accuracy score (25 points max)
  let accuracyPoints = 0;
  
  // Average false arrest rate accounts for 15 points
  if (avgFalseArrest <= 5) {
    accuracyPoints += 15;
    scoreBreakdown.policeAccuracy.details.push("Exceptionally low false arrest rates (+15)");
  } else if (avgFalseArrest <= 10) {
    accuracyPoints += 12;
    scoreBreakdown.policeAccuracy.details.push("Very low false arrest rates (+12)");
  } else if (avgFalseArrest <= 15) {
    accuracyPoints += 9;
    scoreBreakdown.policeAccuracy.details.push("Good false arrest rates (+9)");
  } else if (avgFalseArrest <= 20) {
    accuracyPoints += 6;
    scoreBreakdown.policeAccuracy.details.push("Moderate false arrest rates (+6)");
  } else if (avgFalseArrest <= 25) {
    accuracyPoints += 3;
    scoreBreakdown.policeAccuracy.details.push("High false arrest rates (+3)");
  } else {
    scoreBreakdown.policeAccuracy.details.push("Very high false arrest rates (+0)");
  }
  
  // False arrest gap accounts for 10 points
  if (falseArrestGap <= 5) {
    accuracyPoints += 10;
    scoreBreakdown.policeAccuracy.details.push("Consistent accuracy across all districts (+10)");
  } else if (falseArrestGap <= 10) {
    accuracyPoints += 7;
    scoreBreakdown.policeAccuracy.details.push("Good consistency in accuracy across districts (+7)");
  } else if (falseArrestGap <= 15) {
    accuracyPoints += 4;
    scoreBreakdown.policeAccuracy.details.push("Some disparity in accuracy across districts (+4)");
  } else if (falseArrestGap <= 20) {
    accuracyPoints += 2;
    scoreBreakdown.policeAccuracy.details.push("Significant disparity in accuracy across districts (+2)");
  } else {
    scoreBreakdown.policeAccuracy.details.push("Extreme disparity in accuracy across districts (+0)");
  }
  
  scoreBreakdown.policeAccuracy.points = accuracyPoints;
  
  // Calculate total score from components
  const totalScore = 
    scoreBreakdown.crimeReduction.points + 
    scoreBreakdown.communityTrust.points + 
    scoreBreakdown.equitablePolicing.points + 
    scoreBreakdown.policeAccuracy.points;
  
  // Performance grade based on score
  const getGrade = (score) => {
    if (score >= 90) return { letter: "A", label: "Exceptional", description: "Your balanced approach to policing achieved remarkable results across all metrics." };
    if (score >= 80) return { letter: "B+", label: "Excellent", description: "Your strategy produced very good results with only minor shortcomings." };
    if (score >= 70) return { letter: "B", label: "Very Good", description: "Your approach was effective in most areas with some room for improvement." };
    if (score >= 60) return { letter: "C+", label: "Good", description: "Your strategy showed promise but had significant gaps in effectiveness." };
    if (score >= 50) return { letter: "C", label: "Average", description: "Your approach achieved mixed results with substantial room for improvement." };
    if (score >= 40) return { letter: "D", label: "Below Average", description: "Your strategy had major shortcomings across multiple metrics." };
    return { letter: "F", label: "Poor", description: "Your approach failed to achieve meaningful results in most areas." };
  };
  
  const scoreGrade = getGrade(totalScore);

  // Generate feedback based on metrics
  const getFeedback = () => {
    // ... existing code for generating feedback ...
    const feedback = []

    if (avgTrust < 40) {
      feedback.push(
        "Community trust is critically low. This could lead to reduced crime reporting and cooperation with police.",
      )
    } else if (avgTrust > 70) {
      feedback.push(
        "You've built strong community trust. This is likely to improve police-community relations and cooperation.",
      )
    }

    if (avgCrime < 30) {
      feedback.push("Crime rates are low across the city, indicating effective policing strategies.")
    } else if (avgCrime > 60) {
      feedback.push("Crime rates remain high. Consider different resource allocation or community-based approaches.")
    }

    if (avgFalseArrest < 10) {
      feedback.push(
        "Your policing practices have resulted in very few false arrests, indicating high accuracy and fairness.",
      )
    } else if (avgFalseArrest > 20) {
      feedback.push("The high rate of false arrests suggests issues with policing practices that need to be addressed.")
    }

    if (racialBias > 80) {
      feedback.push(
        "There appears to be significant racial disparity in arrests. This could indicate systemic bias in policing.",
      )
    } else if (racialBias < 40) {
      feedback.push("Arrest patterns show relatively balanced outcomes across racial demographics.")
    }

    if (incomeBias > 80) {
      feedback.push(
        "There's a strong correlation between income levels and arrest rates, suggesting potential economic bias in policing.",
      )
    } else if (incomeBias < 40) {
      feedback.push("Your approach has minimized economic disparities in policing outcomes.")
    }

    if (metrics.communityTrust.district3 < 25) {
      feedback.push(
        "Trust in South Side is extremely low. Minority communities may feel targeted or over-policed without adequate support.",
      )
    }

    // Update references to crimeRate in the feedback function
    if (metrics.crimesReported.district1 < 50 && metrics.crimesReported.district3 > 300) {
      feedback.push(
        "There's a stark disparity in crime rates between Downtown and South Side, reflecting potential resource allocation issues.",
      )
    }

    if (metrics.falseArrestRate.district3 > 30 && metrics.falseArrestRate.district1 < 10) {
      feedback.push(
        "The disparity in false arrest rates between districts suggests systemic issues in how different communities are policed.",
      )
    }

    return feedback
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] p-4">
      <Card className="w-full max-w-5xl">
        <CardHeader>
          <CardTitle className="text-3xl text-center">Policing Strategy Evaluation</CardTitle>
          <CardDescription className="text-center text-lg mb-4">Analysis of your 10-round policing strategy</CardDescription>
          
          {/* Score overview with grade */}
          <div className="flex flex-col items-center mt-4 space-y-2">
            <div className="flex items-center gap-3">
              <div className={`
                w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold
                ${totalScore >= 70 ? "bg-green-100 text-green-800" : 
                  totalScore >= 50 ? "bg-yellow-100 text-yellow-800" : 
                  "bg-red-100 text-red-800"}
              `}>
                {scoreGrade.letter}
              </div>
              <div>
                <h3 className="text-2xl font-bold">{totalScore}/100 Points</h3>
                <p className="text-lg">{scoreGrade.label} Performance</p>
              </div>
            </div>
            <p className="text-center max-w-xl">{scoreGrade.description}</p>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Detailed score breakdown table */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Score Breakdown</h3>
            <Table>
              <TableCaption>Detailed analysis of your policing strategy across key metrics</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/4">Category</TableHead>
                  <TableHead className="w-1/6 text-center">Score</TableHead>
                  <TableHead>Analysis</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.values(scoreBreakdown).map((category) => (
                  <TableRow key={category.title}>
                    <TableCell className="font-medium">
                      <div>{category.title}</div>
                      <div className="text-xs text-muted-foreground">{category.description}</div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge 
                        variant={category.points >= category.maxPoints * 0.7 ? "success" : 
                                category.points >= category.maxPoints * 0.4 ? "warning" : "destructive"}
                        className="px-2 py-1"
                      >
                        {category.points}/{category.maxPoints}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <ul className="list-disc pl-5 text-sm">
                        {category.details.map((detail, i) => (
                          <li key={i}>{detail}</li>
                        ))}
                      </ul>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-muted">
                  <TableCell className="font-bold">Total Score</TableCell>
                  <TableCell className="text-center font-bold">{totalScore}/100</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          
          {/* Game objectives section */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Objectives Achieved</h3>
            <div className="space-y-3">
              {objectives.map((objective, index) => (
                <div key={index} className="flex items-center justify-between bg-muted p-3 rounded-md">
                  <div className="flex items-center gap-3">
                    {objective.achieved ? (
                      <CheckCircle className="text-green-500 h-5 w-5" />
                    ) : (
                      <XCircle className="text-red-500 h-5 w-5" />
                    )}
                    <span className={objective.achieved ? "font-medium" : ""}>{objective.name}</span>
                  </div>
                  <div>
                    <Badge variant={objective.achieved ? "success" : "destructive"}>
                      {objective.value} (Target: {objective.target})
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Overall Metrics</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Average Community Trust:</span>
                    <span className="font-medium">{avgTrust.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div className="bg-primary h-2.5 rounded-full" style={{ width: `${avgTrust}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span>Average Crime Rate:</span>
                    <span className="font-medium">{avgCrime.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div className="bg-destructive h-2.5 rounded-full" style={{ width: `${avgCrime}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span>Average False Arrest Rate:</span>
                    <span className="font-medium">{avgFalseArrest.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div className="bg-orange-500 h-2.5 rounded-full" style={{ width: `${avgFalseArrest * 2}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span>Racial Disparity Index:</span>
                    <span className="font-medium">{(racialBias / 2).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div className="bg-orange-500 h-2.5 rounded-full" style={{ width: `${racialBias / 2}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span>Economic Disparity Index:</span>
                    <span className="font-medium">{(incomeBias / 2).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: `${incomeBias / 2}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Analysis</h3>
              <div className="space-y-2">
                {getFeedback().map((item, index) => (
                  <p key={index} className="text-sm">
                    • {item}
                  </p>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-muted p-4 rounded-md mt-6">
            <h3 className="text-lg font-semibold mb-2">Key Takeaways</h3>
            <p>
              This simulation highlights the complex balance between effective policing, resource allocation, and
              community trust. In real-world scenarios, these dynamics are even more nuanced and influenced by
              historical, social, and economic factors.
            </p>
            <p className="mt-2">
              Effective policing requires thoughtful resource allocation, community engagement, and awareness of
              potential biases in enforcement practices. Building trust while reducing crime often requires innovative
              approaches that address root causes rather than symptoms.
            </p>
          </div>
          
          {/* Educational call-to-action */}
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 p-4 rounded-md">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-6 w-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold mb-1 text-blue-800 dark:text-blue-300">Learning Opportunity</h3>
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  This simulation is designed to foster understanding of complex policing dynamics. 
                  Consider how your decisions reinforced or disrupted systemic patterns, 
                  and how different policing approaches impacted various communities differently.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button size="lg" onClick={onReset}>
            Restart Simulation
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

