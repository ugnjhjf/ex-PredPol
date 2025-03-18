"use client"

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  RefreshCcw, ArrowRight, ArrowLeft, AlertTriangle, 
  TrendingUp, TrendingDown
} from "lucide-react";

// EXTRACTED COMPONENT 1: ScoreGradeDisplay - Display score and letter grade
const ScoreGradeDisplay = ({ totalScore, scoreGrade }) => (
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
);

// EXTRACTED COMPONENT 2: MetricCard - Display key metrics with consistent styling
const MetricCard = ({ metric }) => (
  <div className="border rounded-md p-4">
    <div className="flex items-start justify-between mb-2">
      <div>
        <h4 className="font-bold mb-1">{metric.name}</h4>
        <div className="flex items-center gap-2">
          <span className={`text-xl font-bold ${
            metric.achieved ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
          }`}>
            {metric.value}
          </span>
          <Badge variant={metric.achieved ? "outline" : "secondary"} className="text-xs">
            Target: {metric.target}
          </Badge>
        </div>
      </div>
    </div>
    
    <div className="mb-4">
      <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full">
        <div 
          className={`h-2 rounded-full ${metric.color}`} 
          style={{ width: `${metric.percentage}%` }}
        ></div>
      </div>
    </div>
    
    <p className="text-sm text-muted-foreground mb-3">{metric.description}</p>
    
    <div className="space-y-2">
      <div>
        <p className="text-xs font-medium text-green-600 dark:text-green-400 mb-1">What Improved This:</p>
        <ul className="text-xs space-y-1">
          {metric.improves.map((item, i) => (
            <li key={i} className="flex items-start">
              <span className="text-green-500 mr-1.5">+</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <div>
        <p className="text-xs font-medium text-red-600 dark:text-red-400 mb-1">What Reduced This:</p>
        <ul className="text-xs space-y-1">
          {metric.reduces.map((item, i) => (
            <li key={i} className="flex items-start">
              <span className="text-red-500 mr-1.5">-</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

// EXTRACTED COMPONENT 3: LessonSection - Display AI and bias content sections
const LessonSection = ({ section }) => (
  <div className="mb-4">
    <h4 className="text-base font-semibold mb-1">{section.title}</h4>
    <p className="text-sm mb-2">{section.content}</p>
    <ul className="space-y-1 text-sm">
      {section.key_points.map((point, idx) => (
        <li key={idx} className="flex items-start">
          <span className="text-primary inline-block mr-1.5">•</span>
          <span>{point}</span>
        </li>
      ))}
    </ul>
  </div>
);

// Main component
const GameResults: React.FC<{
  metrics: any;
  onReset: () => void;
  gameLog: any[];
  gameEndReason?: "completed" | "bankrupt";
}> = ({ metrics, onReset, gameLog, gameEndReason = "completed" }) => {
  // Add state to track which page we're showing
  const [currentPage, setCurrentPage] = useState<"metrics" | "lessons">("metrics");

  // Calculate key metrics
  const avgTrust = (metrics.communityTrust.district1 + 
                    metrics.communityTrust.district2 + 
                    metrics.communityTrust.district3 + 
                    metrics.communityTrust.district4) / 4;

  const avgCrime = (Math.min(100, metrics.crimesReported.district1 / 2) +
                    Math.min(100, metrics.crimesReported.district2 / 2) +
                    Math.min(100, metrics.crimesReported.district3 / 2) +
                    Math.min(100, metrics.crimesReported.district4 / 2)) / 4

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
      target: "< 50%",
      achieved: avgCrime < 50,
      color: avgCrime < 50 ? "bg-green-500" : avgCrime <= 100 ? "bg-yellow-500" : "bg-red-500",
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
    
    if (avgCrime < 50) {
      takeaways.push("You successfully reduced crime to low levels across the city.")
    } else if (avgCrime <= 100) {
      takeaways.push("Crime remained at moderate levels, indicating potential for improved strategies.")
    } else {
      takeaways.push("Severe crime rates greatly impacted community safety and population growth.")
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
          {/* Game Over Alert for Bankruptcy */}
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
          
          {/* Using ScoreGradeDisplay component */}
          <ScoreGradeDisplay totalScore={totalScore} scoreGrade={scoreGrade} />
          
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

                {/* Detailed metrics explanation - Using MetricCard component */}
                <div>
                  <h3 className="text-base font-medium mb-2">Your Performance Metrics Explained</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Your performance was evaluated across four key dimensions, each worth 25 points of your total score.
                    Understanding these metrics can help you improve your approach in future simulations.
                  </p>

                  {/* Individual Metrics - 2 column grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {coreMetrics.map((metric, idx) => (
                      <MetricCard key={idx} metric={metric} />
                    ))}
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

            {/* Page 2: Key Takeaways & Lessons */}
            {currentPage === "lessons" && (
              <div className="space-y-4">
                {/* Two-column layout for lessons page */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Main takeaways in first column */}
                  <div className="border rounded-lg overflow-hidden h-fit">
                    <div className="p-2.5 bg-green-50 dark:bg-green-900/30">
                      <h3 className="font-medium text-sm">Main Takeaways</h3>
                    </div>
                    <div className="p-3">
                      <ul className="space-y-2 text-sm">
                        {getTakeaways().map((takeaway, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-primary inline-block mr-1.5">•</span>
                            <span>{takeaway}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Key lessons in second column */}
                  <div className="border rounded-lg overflow-hidden h-fit">
                    <div className="p-2.5 bg-blue-50 dark:bg-blue-900/30">
                      <h3 className="font-medium text-sm">Key Lessons on Algorithmic Policing</h3>
                    </div>
                    <div className="p-3">
                      <ul className="space-y-2 text-sm">
                        {keyLessons.map((lesson, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-primary inline-block mr-1.5">•</span>
                            <span>{lesson}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* AI and bias content using the LessonSection component */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="p-2.5 bg-indigo-50 dark:bg-indigo-900/30">
                    <h3 className="font-medium text-sm">{aiAndBiasContent.title}</h3>
                  </div>
                  <div className="p-3">
                    <p className="text-sm mb-4">{aiAndBiasContent.introduction}</p>
                    {aiAndBiasContent.sections.map((section, idx) => (
                      <LessonSection key={idx} section={section} />
                    ))}
                    
                    <div className="mt-4">
                      <h4 className="text-base font-semibold mb-1">Recommendations</h4>
                      <ul className="space-y-1 text-sm">
                        {aiAndBiasContent.recommendations.map((rec, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-primary inline-block mr-1.5">•</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Navigation to previous page */}
                <div className="flex justify-between">
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage("metrics")} className="flex items-center gap-1">
                    <ArrowLeft className="h-3 w-3" />
                    <span>Back to Performance</span>
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

