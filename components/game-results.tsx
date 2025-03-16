"use client"

import React from "react";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertTriangle, RefreshCcw, ArrowRight, ArrowLeft, AlertCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

// Change to arrow function with explicit typing
const GameResults: React.FC<{
  metrics: any;
  onReset: () => void;
  gameLog: any[];
  gameEndReason?: "completed" | "bankrupt";
}> = ({ metrics, onReset, gameLog, gameEndReason = "completed" }) => {
  // Add state to track which page we're showing
  const [currentPage, setCurrentPage] = React.useState<"metrics" | "lessons">("metrics");

  // Calculate key metrics
  const avgTrust = (metrics.communityTrust.district1 + 
                    metrics.communityTrust.district2 + 
                    metrics.communityTrust.district3 + 
                    metrics.communityTrust.district4) / 4

  const avgCrime = (Math.min(100, metrics.crimesReported.district1 / 5) +
                    Math.min(100, metrics.crimesReported.district2 / 5) +
                    Math.min(100, metrics.crimesReported.district3 / 5) +
                    Math.min(100, metrics.crimesReported.district4 / 5)) / 4

  const avgFalseArrest = (metrics.falseArrestRate.district1 +
                          metrics.falseArrestRate.district2 +
                          metrics.falseArrestRate.district3 +
                          metrics.falseArrestRate.district4) / 4

  // Simplify bias calculations
  const racialBias = Math.abs(metrics.arrestsByRace.black.district3 - metrics.arrestsByRace.white.district1) / 2
  const incomeBias = Math.abs(metrics.arrestsByIncome.low.district3 - metrics.arrestsByIncome.high.district1) / 2

  // Calculate total score (simplified scoring)
  const trustScore = Math.min(25, Math.round((avgTrust / 100) * 25))
  const crimeScore = Math.min(25, Math.round((1 - avgCrime / 100) * 25))
  const falseArrestScore = Math.min(25, Math.round((1 - avgFalseArrest / 50) * 25))
  const equityScore = Math.min(25, Math.round((2 - ((racialBias + incomeBias) / 100)) * 25))
  
  const totalScore = trustScore + crimeScore + falseArrestScore + equityScore

  // Simplified grade calculation - Modified to force F grade on bankruptcy
  const getGrade = (score: number) => {
    // If game ended due to bankruptcy, force F grade regardless of score
    if (gameEndReason === "bankrupt") {
      return { 
        letter: "F", 
        label: "Failed", 
        description: "Your city went bankrupt. Without proper budget management, even the best policing strategies cannot be sustained."
      }
    }
    
    // Normal grade calculation for completed games
    if (score >= 90) return { letter: "A", label: "Exceptional", description: "You've achieved a remarkable balance between crime reduction and community trust." }
    if (score >= 80) return { letter: "B+", label: "Excellent", description: "Your policing approach was highly effective with only minor shortcomings." }
    if (score >= 70) return { letter: "B", label: "Good", description: "You maintained a good balance between enforcement and community relations." }
    if (score >= 60) return { letter: "C+", label: "Fair", description: "Your strategy had mixed results with room for improvement." }
    if (score >= 50) return { letter: "C", label: "Average", description: "Your approach achieved baseline objectives but had significant gaps." }
    if (score >= 40) return { letter: "D", label: "Poor", description: "Your strategy struggled to maintain both order and community relations." }
    return { letter: "F", label: "Failed", description: "Your approach failed to address key community policing challenges." }
  }

  const scoreGrade = getGrade(totalScore)
  
  // Core metrics to focus on with improved Equity Index explanation
  const coreMetrics = [
    {
      name: "Community Trust",
      value: avgTrust.toFixed(1) + "%",
      target: "> 60%",
      achieved: avgTrust > 60,
      color: avgTrust > 70 ? "bg-green-500" : avgTrust > 40 ? "bg-yellow-500" : "bg-red-500",
      percentage: Math.min(100, avgTrust),
      description: "Average level of community trust in police across all districts. Higher trust leads to better crime reporting and community cooperation.",
      improves: [
        "Community education initiatives",
        "Crime reporting apps in low-trust areas",
        "Avoiding over-policing in minority districts",
        "Maintaining low false arrest rates",
        "Using the right proportion of day/night shifts per district"
      ],
      reduces: [
        "Facial recognition in diverse communities",
        "Drone surveillance without community buy-in",
        "Excessive police presence (over 7 officers in a district)",
        "High false arrest rates",
        "Under-policing high crime areas (citizens feel unsafe)"
      ]
    },
    {
      name: "Crime Rate",
      value: avgCrime.toFixed(1) + "%",
      target: "< 40%",
      achieved: avgCrime < 40,
      color: avgCrime < 30 ? "bg-green-500" : avgCrime < 60 ? "bg-yellow-500" : "bg-red-500",
      percentage: Math.min(100, avgCrime),
      description: "Average crime rate across all districts. Lower values reflect safer neighborhoods and more effective policing strategies.",
      improves: [
        "CCTV and drone surveillance (effective in high-crime areas)",
        "Balanced police allocation (4-5 officers per district)",
        "Proper day/night shift balance based on district crime patterns",
        "Building community trust (increases crime reporting)",
        "Crime reporting apps in areas with sufficient trust"
      ],
      reduces: [
        "Under-policing (less than 3 officers per district)",
        "Very low trust leading to lack of community cooperation",
        "Ignoring district-specific crime patterns in shift allocation",
        "Not addressing early warning signs of crime increases"
      ]
    },
    {
      name: "False Arrest Rate",
      value: avgFalseArrest.toFixed(1) + "%",
      target: "< 15%",
      achieved: avgFalseArrest < 15,
      color: avgFalseArrest < 10 ? "bg-green-500" : avgFalseArrest < 20 ? "bg-yellow-500" : "bg-red-500",
      percentage: Math.min(100, avgFalseArrest * 2),
      description: "Based on false arrest rates. Measures how often police are arresting innocent people vs. actual offenders. Lower false arrest rates indicate more precise and fair policing.",
      improves: [
        "Community education (improves witness cooperation)",
        "CCTV in areas with sufficient trust",
        "Crime reporting apps that gather better evidence",
        "Avoiding over-policing which creates pressure for arrests",
        "Building higher trust which improves evidence gathering"
      ],
      reduces: [
        "Facial recognition technology in diverse neighborhoods",
        "Low community trust leading to poor evidence collection",
        "Over-policing which incentivizes higher arrest numbers",
        "Drone surveillance without supporting evidence systems"
      ]
    },
    {
      name: "Equity Index",
      value: ((100 - ((racialBias + incomeBias) / 2))).toFixed(1) + "%",
      target: "> 70%",
      achieved: (100 - ((racialBias + incomeBias) / 2)) > 70,
      color: (racialBias + incomeBias) / 2 < 30 ? "bg-green-500" : (racialBias + incomeBias) / 2 < 50 ? "bg-yellow-500" : "bg-red-500",
      percentage: 100 - Math.min(100, (racialBias + incomeBias) / 2),
      description: "Measures fairness in how police treat different groups. A higher score means arrests are more evenly distributed across races and income levels, without targeting specific groups unfairly.",
      improves: [
        "Public education programs in diverse communities",
        "Balanced police allocation across different demographic areas",
        "Crime reporting apps that reduce subjective enforcement",
        "Proportionate policing response across different communities",
        "CCTV in all districts (not just wealthy areas)"
      ],
      reduces: [
        "Facial recognition technology (biased against minorities)",
        "Over-policing minority districts vs. wealthy districts",
        "Unequal resource allocation based on district demographics",
        "Ignoring trust disparities between communities"
      ]
    }
  ]

  // Main takeaways based on results
  const getTakeaways = () => {
    const takeaways = []
    
    if (avgTrust < 40) {
      takeaways.push("Low community trust undermined police effectiveness and cooperation.")
    } else if (avgTrust > 70) {
      takeaways.push("Strong community trust improved crime reporting and police-community relations.")
    }
    
    if (avgCrime < 30) {
      takeaways.push("You successfully reduced crime across the city.")
    } else if (avgCrime > 60) {
      takeaways.push("Crime rates remained high, indicating need for better resource allocation.")
    }
    
    if (avgFalseArrest > 20) {
      takeaways.push("High false arrest rates damaged community relations and police legitimacy.")
    } else if (avgFalseArrest < 10) {
      takeaways.push("Low false arrest rates reflected fair and accurate policing practices.")
    }
    
    if ((racialBias + incomeBias) / 2 > 50) {
      takeaways.push("Significant disparities in arrests across demographic groups indicated systemic bias.")
    } else if ((racialBias + incomeBias) / 2 < 30) {
      takeaways.push("Your approach minimized demographic disparities in policing outcomes.")
    }
    
    if (takeaways.length === 0) {
      takeaways.push("Your policing approach achieved mixed results across different metrics.")
    }
    
    return takeaways
  }

  // Key lessons - Completely rewritten to focus on AI and algorithmic bias
  const keyLessons = [
    "Predictive policing algorithms can reinforce existing patterns of bias when trained on historical data",
    "Technologies like facial recognition have higher error rates for women and people of color",
    "Data collection itself isn't neutral - it reflects where police have focused their efforts in the past",
    "Technology implementation without community input risks damaging trust, especially in minority communities",
    "Over-surveillance of specific neighborhoods creates feedback loops that lead to more arrests in those areas",
    "The harm from false arrests falls disproportionately on already marginalized groups"
  ];

  // Expanded and enhanced AI and bias content
  const aiAndBiasContent = {
    title: "AI, Big Data & Algorithmic Bias in Policing",
    introduction: "This simulation explored how technology can help or harm police-community relations. Modern policing increasingly relies on AI and big data, which introduces new considerations around bias and fairness.",
    sections: [
      {
        title: "What is Algorithmic Bias?",
        content: "Algorithmic bias happens when computer systems make unfair decisions because they were trained using biased data. In policing, this means facial recognition systems misidentify Black faces more often than white faces, or predictive policing tools send officers primarily to neighborhoods with more people of color.",
        key_points: [
          "AI systems learn from historical arrest data, which may reflect discriminatory practices rather than actual crime patterns",
          "Facial recognition has significantly higher error rates for women and people with darker skin",
          "Predictive policing can create feedback loops: police patrol certain areas more, make more arrests there, which then justifies even more policing"
        ]
      },
      {
        title: "Big Data in Policing",
        content: "Big data refers to collecting and analyzing huge amounts of information to identify patterns and predict criminal activity. While it might seem objective, these systems often end up targeting the same neighborhoods and communities that have historically faced over-policing.",
        key_points: [
          "Data isn't neutral—it reflects where police have focused their attention in the past",
          "Neighborhoods with greater police presence generate more crime data, creating a self-reinforcing cycle",
          "Computer algorithms hide human biases behind a façade of mathematical objectivity"
        ]
      },
      {
        title: "Impact on Minority Communities",
        content: "Surveillance technologies and algorithmic policing tools typically have worse outcomes for minority communities. This reinforces historical tensions between these communities and law enforcement, leading to decreased trust.",
        key_points: [
          "Over-surveillance creates a feeling of being targeted rather than protected",
          "False positives in facial recognition lead to unnecessary and traumatic police stops",
          "When algorithms make decisions, it becomes harder to challenge unfair treatment or hold anyone accountable"
        ]
      },
      {
        title: "The Data Feedback Loop",
        content: "A major problem with predictive policing is the 'feedback loop' it creates. Police patrol areas the algorithm flags as high-risk, make more arrests there, which then reinforces the algorithm's belief that these areas have more crime.",
        key_points: [
          "More policing leads to more arrests, regardless of actual crime rates",
          "Areas with fewer police resources generate less crime data, even if crime is occurring",
          "This creates a self-fulfilling prophecy that justifies continued targeted policing"  
        ]
      }
    ],
    recommendations: [
      "Involve communities in decisions about what technologies to deploy and how to use them",
      "Regularly test algorithms for bias and adjust them when disparities are found",
      "Be transparent with the public about what data is being collected and how it's used",
      "Consider technology as a supplement to community policing, not a replacement",
      "Implement 'algorithmic impact assessments' before deploying new technologies"
    ]
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 max-w-5xl mx-auto">
      <Card className="w-full">
        {/* Header with prominent restart button and game status */}
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-2">
            <Button 
              onClick={onReset}
              size="sm" 
              className="px-4 py-2 bg-primary hover:bg-primary/90 font-semibold flex items-center gap-1"
            >
              <RefreshCcw className="h-4 w-4" />
              {gameEndReason === "bankrupt" ? "Try Again" : "Play Again"}
            </Button>
          </div>
          
          <CardTitle className="text-xl">
            {gameEndReason === "bankrupt" ? (
              <span className="text-red-600 dark:text-red-500">GAME OVER - City Bankruptcy</span>
            ) : (
              "Policing Simulation Results"
            )}
          </CardTitle>
          
          <CardDescription className="max-w-lg mx-auto text-sm">
            {gameEndReason === "bankrupt" ? 
              "Your city ran out of funds and could no longer maintain police operations. Consider a more balanced budget approach next time." :
              "Your 10-round term as Police Commissioner has ended. Here's how your policing strategy performed."}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Game Over Alert for Bankruptcy - more compact */}
          {gameEndReason === "bankrupt" && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 dark:bg-red-900/50 dark:text-red-100 text-sm">
              <div className="flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2" />
                <p className="font-bold">Financial Crisis</p>
              </div>
              <p className="mt-0.5">
                Without sufficient funds, the police department cannot maintain operations. 
                City services collapsed before completing the full 10-round term.
              </p>
            </div>
          )}
          
          {/* Score & Grade Display - more compact */}
          <div className="flex flex-col md:flex-row gap-3 items-center justify-center py-1 border-b pb-3">
            <div className="flex items-center gap-3">
              <div className={`
                w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold
                ${totalScore >= 70 ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" : 
                  totalScore >= 50 ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100" : 
                  "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"}
              `}>
                {scoreGrade.letter}
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-xl font-bold">{totalScore}/100 Points</h3>
                <p className="text-sm font-medium">{scoreGrade.label} Performance</p>
              </div>
            </div>
            
            <div className="flex-1 max-w-md">
              <p className="text-center md:text-left text-sm">{scoreGrade.description}</p>
            </div>
          </div>
          
          {/* Page Navigation */}
          <div className="flex justify-center gap-2">
            <Button 
              variant={currentPage === "metrics" ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentPage("metrics")}
              className="flex items-center gap-1"
            >
              <span>Performance Metrics</span>
            </Button>
            <Button 
              variant={currentPage === "lessons" ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentPage("lessons")}
              className="flex items-center gap-1"
            >
              <span>Key Lessons</span>
            </Button>
          </div>

          {/* Page Content */}
          <div className="min-h-[400px]">
            {/* Page 1: Metrics & Explanations */}
            {currentPage === "metrics" && (
              <div className="space-y-4">
                {/* Score breakdown - more compact grid */}
                <div className="grid grid-cols-4 gap-2">
                  <div className="p-2 rounded-md bg-blue-50 dark:bg-blue-950 text-center">
                    <h4 className="text-xs font-medium">Trust</h4>
                    <div className="text-xl font-bold text-blue-600 dark:text-blue-400">{trustScore}/25</div>
                  </div>
                  
                  <div className="p-2 rounded-md bg-green-50 dark:bg-green-950 text-center">
                    <h4 className="text-xs font-medium">Crime</h4>
                    <div className="text-xl font-bold text-green-600 dark:text-green-400">{crimeScore}/25</div>
                  </div>
                  
                  <div className="p-2 rounded-md bg-amber-50 dark:bg-amber-950 text-center">
                    <h4 className="text-xs font-medium">Accuracy</h4>
                    <div className="text-xl font-bold text-amber-600 dark:text-amber-400">{falseArrestScore}/25</div>
                  </div>
                  
                  <div className="p-2 rounded-md bg-purple-50 dark:bg-purple-950 text-center">
                    <h4 className="text-xs font-medium">Equity</h4>
                    <div className="text-xl font-bold text-purple-600 dark:text-purple-400">{equityScore}/25</div>
                  </div>
                </div>

                {/* Detailed metrics explanation - Two-column layout with INCREASED font sizes */}
                <div>
                  <h3 className="text-base font-medium mb-2">Your Performance Metrics Explained</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Your performance was evaluated across four key dimensions, each worth 25 points of your total score.
                    Understanding these metrics can help you improve your approach in future simulations.
                  </p>

                  {/* Individual Metrics - 2 column grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {coreMetrics.map((metric, idx) => (
                      <div key={idx} className="border rounded-lg overflow-hidden">
                        <div className={`p-2 ${
                          metric.name === "Community Trust" ? "bg-blue-50 dark:bg-blue-900/30" : 
                          metric.name === "Crime Rate" ? "bg-green-50 dark:bg-green-900/30" : 
                          metric.name === "False Arrest Rate" ? "bg-amber-50 dark:bg-amber-900/30" : 
                          "bg-purple-50 dark:bg-purple-900/30"
                        }`}>
                          <h4 className="font-medium flex items-center justify-between text-sm">
                            <span>{metric.name}</span>
                            <Badge variant={metric.achieved ? "success" : "destructive"} className="text-xs">
                              {metric.value} (Target: {metric.target})
                            </Badge>
                          </h4>
                        </div>
                        <div className="p-3 space-y-2">
                          <p className="text-sm">{metric.description}</p>
                          
                          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                            <div 
                              className={`h-2 ${metric.color}`} 
                              style={{ width: `${metric.name === "Crime Rate" ? 100 - metric.percentage : metric.percentage}%` }}
                            />
                          </div>
                          
                          {/* Factors that influence this metric - INCREASED font sizes */}
                          <div className="grid grid-cols-2 gap-2 pt-1">
                            <div>
                              <h5 className="text-xs font-medium text-green-600 dark:text-green-400">What improves this metric:</h5>
                              <ul className="text-xs space-y-1">
                                {metric.improves.map((item, i) => (
                                  <li key={i} className="flex items-start gap-1">
                                    <span className="text-green-500 flex-shrink-0">+</span>
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h5 className="text-xs font-medium text-red-600 dark:text-red-400">What worsens this metric:</h5>
                              <ul className="text-xs space-y-1">
                                {metric.reduces.map((item, i) => (
                                  <li key={i} className="flex items-start gap-1">
                                    <span className="text-red-500 flex-shrink-0">−</span>
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* District comparison - more compact with INCREASED font sizes */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="p-2 bg-muted/50">
                    <h4 className="font-medium text-sm">District Performance Comparison</h4>
                  </div>
                  <div className="p-2">
                    <div className="space-y-2">
                      <div className="grid grid-cols-5 gap-2 mb-1">
                        <div className="text-xs font-medium">District</div>
                        <div className="text-xs font-medium text-center">Trust</div>
                        <div className="text-xs font-medium text-center">Crimes</div>
                        <div className="text-xs font-medium text-center">False Arrests</div>
                        <div className="text-xs font-medium text-center">Population</div>
                      </div>
                      
                      {["district1", "district2", "district3", "district4"].map((district, idx) => (
                        <div key={idx} className="grid grid-cols-5 gap-2 p-2 bg-muted rounded-md">
                          <div className="text-xs font-medium">
                            {district === "district1" ? "Downtown" :
                            district === "district2" ? "Westside" :
                            district === "district3" ? "South Side" : "Eastside"}
                          </div>
                          <div className={`text-xs text-center ${metrics.communityTrust[district] >= 60 ? "text-green-600" : "text-red-600"}`}>
                            {metrics.communityTrust[district]}%
                          </div>
                          <div className={`text-xs text-center ${metrics.crimesReported[district] <= 40 ? "text-green-600" : "text-red-600"}`}>
                            {metrics.crimesReported[district]}
                          </div>
                          <div className={`text-xs text-center ${metrics.falseArrestRate[district] <= 15 ? "text-green-600" : "text-red-600"}`}>
                            {metrics.falseArrestRate[district]}%
                          </div>
                          <div className="text-xs text-center">
                            {metrics.population[district].toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Navigation to next page */}
                <div className="flex justify-end">
                  <Button size="sm" onClick={() => setCurrentPage("lessons")} className="flex items-center gap-1">
                    <span>Continue to Key Lessons</span>
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )}

            {/* Page 2: Key Takeaways & Lessons with INCREASED font sizes */}
            {currentPage === "lessons" && (
              <div className="space-y-4">
                {/* Two-column layout for lessons page */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Main takeaways in first column */}
                  <div className="border rounded-lg overflow-hidden h-fit">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/30">
                      <h4 className="font-medium text-sm">Key Takeaways From Your Approach</h4>
                    </div>
                    <div className="p-3 space-y-1.5">
                      {getTakeaways().map((takeaway, index) => (
                        <div key={index} className="flex items-start text-sm gap-2 pb-2">
                          <span className="text-primary mt-0.5">•</span>
                          <span className="flex-1">{takeaway}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* What this simulation teaches in second column */}
                  <div className="border rounded-lg overflow-hidden h-fit">
                    <div className="p-2 bg-green-50 dark:bg-green-900/30">
                      <h4 className="font-medium text-sm">Key Lessons About Technology & Bias in Policing</h4>
                    </div>
                    <div className="p-3 space-y-1.5">
                      {keyLessons.map((lesson, index) => (
                        <div key={index} className="flex items-start text-sm gap-2 pb-2">
                          <span className="text-green-600 dark:text-green-400 mt-0.5">•</span>
                          <span className="flex-1">{lesson}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* NEW SECTION: AI, Big Data & Algorithmic Bias - More compact accordion with INCREASED font sizes */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="p-2.5 bg-indigo-50 dark:bg-indigo-900/30">
                    <h4 className="font-medium flex items-center gap-2 text-sm">
                      <AlertCircle className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                      {aiAndBiasContent.title}
                    </h4>
                  </div>
                  <div className="p-3">
                    <p className="text-sm mb-3">{aiAndBiasContent.introduction}</p>
                    
                    <Accordion type="single" collapsible className="w-full">
                      {aiAndBiasContent.sections.map((section, index) => (
                        <AccordionItem key={index} value={`section-${index}`} className="border-b py-1">
                          <AccordionTrigger className="text-sm font-medium py-1.5">{section.title}</AccordionTrigger>
                          <AccordionContent className="pt-1 pb-2.5">
                            <div className="space-y-2.5 text-sm">
                              <p>{section.content}</p>
                              <div className="bg-muted/50 p-2.5 rounded-md">
                                <h5 className="font-medium text-xs mb-1.5">Key Points:</h5>
                                <ul className="space-y-1.5">
                                  {section.key_points.map((point, pointIndex) => (
                                    <li key={pointIndex} className="flex items-start text-xs gap-1.5">
                                      <span className="text-indigo-600 dark:text-indigo-400 mt-0.5">•</span>
                                      <span>{point}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                      
                      <AccordionItem value="predictive-policing" className="border-b py-1">
                        <AccordionTrigger className="text-sm font-medium py-1.5">Predictive Policing & Its Risks</AccordionTrigger>
                        <AccordionContent className="pt-1 pb-2.5">
                          <div className="space-y-2.5 text-sm">
                            <p>Predictive policing uses algorithms to forecast where crimes will likely occur, helping departments allocate resources. However, these systems often reinforce existing patterns of over-policing in minority communities.</p>
                            <div className="bg-muted/50 p-2.5 rounded-md">
                              <h5 className="font-medium text-xs mb-1.5">The Problem with Prediction:</h5>
                              <ul className="space-y-1.5">
                                <li className="flex items-start text-xs gap-1.5">
                                  <span className="text-indigo-600 dark:text-indigo-400 mt-0.5">•</span>
                                  <span>Algorithms trained on historical arrest data perpetuate existing biases in where police have focused attention</span>
                                </li>
                                <li className="flex items-start text-xs gap-1.5">
                                  <span className="text-indigo-600 dark:text-indigo-400 mt-0.5">•</span>
                                  <span>More police presence leads to more arrests, creating a self-reinforcing feedback loop</span>
                                </li>
                                <li className="flex items-start text-xs gap-1.5">
                                  <span className="text-indigo-600 dark:text-indigo-400 mt-0.5">•</span>
                                  <span>Neighborhoods with fewer police resources generate less crime data, even if crime occurs there</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="recommendations" className="border-b py-1">
                        <AccordionTrigger className="text-sm font-medium py-1.5">Best Practices for Technology in Policing</AccordionTrigger>
                        <AccordionContent className="pt-1 pb-2.5">
                          <div className="bg-green-50 dark:bg-green-900/20 p-2.5 rounded-md">
                            <ul className="space-y-1.5">
                              {aiAndBiasContent.recommendations.map((rec, recIndex) => (
                                <li key={recIndex} className="flex items-start text-xs gap-1.5">
                                  <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                                  <span>{rec}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>

                    {/* Real-world examples - More compact with INCREASED font sizes */}
                    <div className="mt-4 border border-indigo-100 dark:border-indigo-800 rounded-md">
                      <div className="p-2 bg-indigo-50 dark:bg-indigo-900/50 text-sm font-medium">
                        Real-world Examples
                      </div>
                      <div className="p-2.5 text-xs space-y-2">
                        <ul className="space-y-2">
                          <li className="flex items-start gap-1.5">
                            <span className="text-indigo-600 dark:text-indigo-400 mt-0.5">•</span>
                            <span>
                              <strong>Facial Recognition:</strong> A 2019 study found some commercial algorithms had error rates up to 34% higher for darker-skinned females compared to lighter-skinned males. Several cities have since banned facial recognition use by police.
                            </span>
                          </li>
                          <li className="flex items-start gap-1.5">
                            <span className="text-indigo-600 dark:text-indigo-400 mt-0.5">•</span>
                            <span>
                              <strong>PredPol:</strong> A predictive policing system used in over 60 police departments that forecasts crime based on historical arrest data. Studies found it consistently directed officers to the same neighborhoods, regardless of actual crime distribution.
                            </span>
                          </li>
                          <li className="flex items-start gap-1.5">
                            <span className="text-indigo-600 dark:text-indigo-400 mt-0.5">•</span>
                            <span>
                              <strong>COMPAS:</strong> A risk assessment tool that predicted Black defendants were at higher risk of reoffending than they actually were, while white defendants were predicted to be less risky than they actually were.
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Critical Balance Factors - 2-column grid with INCREASED font sizes */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="p-2.5 bg-purple-50 dark:bg-purple-900/30">
                    <h4 className="font-medium text-sm">Critical Balance Factors</h4>
                  </div>
                  <div className="p-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <h5 className="font-medium text-sm">Trust vs. Enforcement</h5>
                        <p className="text-sm">
                          Finding the right balance between aggressive enforcement and community trust is crucial. 
                          While high police presence can reduce crime in the short term, it may damage community 
                          relationships, leading to less cooperation and higher crime in the long term.
                        </p>
                      </div>
                      
                      <div className="space-y-1.5">
                        <h5 className="font-medium text-sm">Technology vs. Community Engagement</h5>
                        <p className="text-sm">
                          Technological solutions (CCTV, facial recognition) can be effective crime-fighting tools but 
                          may create civil liberties concerns. Community engagement approaches build lasting trust but 
                          may take longer to impact crime rates.
                        </p>
                      </div>
                      
                      <div className="space-y-1.5">
                        <h5 className="font-medium text-sm">Resource Allocation</h5>
                        <p className="text-sm">
                          Limited resources must be allocated strategically. This may mean addressing the highest-crime 
                          areas first, but also being cognizant of equity concerns in different neighborhoods.
                        </p>
                      </div>

                      <div className="space-y-1.5">
                        <h5 className="font-medium text-sm">Technology Benefits vs. Disparate Impact</h5>
                        <p className="text-sm">
                          Technologies that increase efficiency must be weighed against their potential for unequal impact 
                          across different demographic groups. What works in one neighborhood may cause harm in another due 
                          to underlying social contexts and historical relationships with law enforcement.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Learning opportunity note - More compact with INCREASED font sizes */}
                <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 p-3 rounded-md">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                    <div>
                      <h3 className="font-medium mb-1 text-sm">Learning Opportunity</h3>
                      <p className="text-sm">
                        This simulation simplifies complex social issues but illustrates important trade-offs in policing. 
                        Real-world policing involves many more variables and deeply embedded social factors. The way 
                        technology is implemented matters as much as which technologies are chosen.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Navigation to previous page */}
                <div className="flex justify-between">
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage("metrics")} className="flex items-center gap-1">
                    <ArrowLeft className="h-3 w-3" />
                    <span>Back to Performance Metrics</span>
                  </Button>
                  <Button size="sm" onClick={onReset} className="flex items-center gap-1">
                    <RefreshCcw className="h-3 w-3" />
                    <span>Play Again</span>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GameResults;

