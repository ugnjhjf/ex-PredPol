"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function GameOverview({ onStart, isEmbedded = false }) {
  return isEmbedded ? (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Welcome to Predictive Policing Simulation</h2>
        <p className="text-lg text-muted-foreground">
          Explore the complex dynamics of policing, bias, and community trust
        </p>
        
        {/* Game Objectives Section */}
        <h3 className="text-xl font-semibold">Game Objectives</h3>
        <div className="bg-primary/10 p-4 rounded-md border border-primary/20">
          <p className="font-medium mb-2">
            Your goal is to balance effective policing with community trust while minimizing disparities between districts.
          </p>
          <p className="text-sm mb-2">Success is measured by these metrics:</p>
          <ul className="list-disc pl-6 space-y-1 text-sm">
            <li>Average crime rate below 35% across all districts</li>
            <li>Average community trust above 55% across all districts</li>
            <li>Crime/trust gap between highest and lowest district less than 25%</li>
            <li>False arrest rate below 15% in all districts</li>
            <li>Racial and economic disparity indexes below 30%</li>
          </ul>
        </div>

        <h3 className="text-xl font-semibold">Game Mechanics</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Resource Allocation:</strong> You have 20 police officers (👮) to allocate across day and night
            shifts in four districts
          </li>
          <li>
            <strong>Actions:</strong> Each round, implement one action per district to address specific issues
          </li>
          <li>
            <strong>Metrics:</strong> Track crime rates, community trust, and arrest patterns by race and income
          </li>
          <li>
            <strong>Duration:</strong> The simulation runs for 10 rounds, with a summary after each round
          </li>
        </ul>
        
        
        <Button size="lg" onClick={onStart} className="w-full md:w-auto">
          Let's Get Started
        </Button>
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center min-h-[90vh]">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="text-3xl text-center">Predictive Policing Simulation</CardTitle>
          <CardDescription className="text-center text-lg">
            Explore the complex dynamics of policing, bias, and community trust
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Game Overview</h3>
            <p>
              In this simulation, you will manage police resources across four districts with different demographic
              profiles and challenges. Your decisions will impact crime rates, community trust, and arrest patterns.
            </p>
            
            {/* Game Objectives Section */}
            <h3 className="text-xl font-semibold">Game Objectives</h3>
            <div className="bg-primary/10 p-4 rounded-md border border-primary/20">
              <p className="font-medium mb-2">
                Your goal is to balance effective policing with community trust while minimizing disparities between districts.
              </p>
              <p className="text-sm mb-2">Success is measured by these metrics:</p>
              <ul className="list-disc pl-6 space-y-1 text-sm">
                <li>Average crime rate below 35% across all districts</li>
                <li>Average community trust above 55% across all districts</li>
                <li>Crime/trust gap between highest and lowest district less than 25%</li>
                <li>False arrest rate below 15% in all districts</li>
                <li>Racial and economic disparity indexes below 30%</li>
              </ul>
            </div>


            <h3 className="text-xl font-semibold">Game Mechanics</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Resource Allocation:</strong> You have 20 police officers (👮) to allocate across day and night
                shifts in four districts
              </li>
              <li>
                <strong>Actions:</strong> Each round, implement one action per district to address specific issues
              </li>
              <li>
                <strong>Metrics:</strong> Track crime rates, community trust, and arrest patterns by race and income
              </li>
              <li>
                <strong>Duration:</strong> The simulation runs for 10 rounds, with a summary after each round
              </li>
            </ul>
            

          </div>
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

