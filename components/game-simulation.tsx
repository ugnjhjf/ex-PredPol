"use client"

import { useState } from "react"
import GameBoard from "./game-board"
import GameResults from "./game-results"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"

export default function GameSimulation() {
  const [gameState, setGameState] = useState<"playing" | "results">("playing")
  const [currentRound, setCurrentRound] = useState(1)
  const [showRoundSummary, setShowRoundSummary] = useState(true) // Start with showing summary
  const [isFirstPlay, setIsFirstPlay] = useState(true) // Track if it's the first play
  const [showResultsDialog, setShowResultsDialog] = useState(false)
  const [gameEndReason, setGameEndReason] = useState<"completed" | "bankrupt">("completed")
  
  // Update initial values to create more extreme starting conditions
  const [gameMetrics, setGameMetrics] = useState({
    budget: 5000, // Increased from 700 to 5000 to provide more budget flexibility
    income: 0,    // Current round income
    expenses: 0,  // Current round expenses
    population: {
      district1: 10000,  
      district2: 15000,
      district3: 20000,
      district4: 12000,
    },
    communityTrust: {
      district1: 90, 
      district2: 60,
      district3: 15, // Critical issue - extremely low trust
      district4: 35, // Changed from 45 to create more urgent situation
    },
    crimesReported: {
      district1: 18,
      district2: 45,
      district3: 95,  // Increased from 85 to make it a more pressing challenge
      district4: 65,  // Increased from 50 to make it more urgent
    },
    arrests: { // New metric
      district1: 14,  // ~80% clearance rate (arrests/crimes)
      district2: 22,  // ~50% clearance rate
      district3: 25,  // ~30% clearance rate
      district4: 25,  // ~50% clearance rate
    },
    falseArrestRate: {
      district1: 5,
      district2: 15,
      district3: 30, // Increased from 25
      district4: 18,
    },
    arrestsByRace: {
      white: { district1: 85, district2: 50, district3: 15, district4: 40 }, // Made more extreme
      black: { district1: 5, district2: 30, district3: 65, district4: 35 },  // Made more extreme
      hispanic: { district1: 5, district2: 15, district3: 15, district4: 20 },
      other: { district1: 5, district2: 5, district3: 5, district4: 5 },
    },
    arrestsByIncome: {
      high: { district1: 75, district2: 30, district3: 5, district4: 25 }, // Made more extreme
      middle: { district1: 20, district2: 40, district3: 20, district4: 40 },
      low: { district1: 5, district2: 30, district3: 75, district4: 35 },  // Made more extreme
    },
    commonCrimes: {
      district1: ["Property Theft", "Fraud", "Car Theft"], // Changed "DUI" to "Car Theft"
      district2: ["Burglary", "Assault", "Drug Possession"],
      district3: ["Drug Dealing", "Violent Crime", "Robbery"],
      district4: ["Vandalism", "Domestic Disputes", "Theft"],
    },
  })

  const [previousMetrics, setPreviousMetrics] = useState({ ...gameMetrics })

  const [policeAllocation, setPoliceAllocation] = useState({
    district1: { day: 1, night: 1 },
    district2: { day: 1, night: 1 },
    district3: { day: 1, night: 1 },
    district4: { day: 1, night: 1 },
    unallocated: 12,
  })

  const [districtActions, setDistrictActions] = useState({
    district1: "",
    district2: "",
    district3: "",
    district4: "",
  })

  // Add gameLog state to track history
  const [gameLog, setGameLog] = useState([])

  const [roundSummary, setRoundSummary] = useState({
    changes: [],
    feedback: "",
    metricChanges: {
      district1: { trust: 0, crimes: 0, arrests: 0 },
      district2: { trust: 0, crimes: 0, arrests: 0 },
      district3: { trust: 0, crimes: 0, arrests: 0 },
      district4: { trust: 0, crimes: 0, arrests: 0 },
    },
  })

  // Track implemented actions for each district
  const [implementedActions, setImplementedActions] = useState({
    district1: [],
    district2: [],
    district3: [],
    district4: []
  })

  // Define action costs
  const actionCosts = {
    cctv: 200,
    app: 150,
    education: 100,
    drone: 300,
    facial: 250,
  };

  // Define police cost per officer - REDUCED COST
  const policeCostPerOfficer = 40; // Reduced from 50/60 to 40 to make police more affordable

  // Add getActionName function
  const getActionName = (actionId) => {
    const actionNames = {
      cctv: "CCTV Surveillance",
      app: "Crime Reporting App",
      education: "Public Education",
      drone: "Drone Surveillance",
      facial: "Facial Recognition"
    };
    return actionNames[actionId] || actionId;
  };

  // Add state to track special events that have occurred
  const [triggeredEvents, setTriggeredEvents] = useState([]);

  // Add state to store special events for alert display
  const [currentSpecialEvents, setCurrentSpecialEvents] = useState([]);

  const startGame = () => {
    setGameState("playing")
  }

  // Update the handleNextRound function to process multiple actions
  const handleNextRound = () => {
    // Store previous metrics for comparison
    setPreviousMetrics({ ...gameMetrics })

    // Calculate effects of actions on metrics
    const newMetrics = { ...gameMetrics }
    const changes = []
    const metricChanges = {
      district1: { trust: 0, crimes: 0, arrests: 0, falseArrest: 0, population: 0 },
      district2: { trust: 0, crimes: 0, arrests: 0, falseArrest: 0, population: 0 },
      district3: { trust: 0, crimes: 0, arrests: 0, falseArrest: 0, population: 0 },
      district4: { trust: 0, crimes: 0, arrests: 0, falseArrest: 0, population: 0 },
    }

    // Initialize feedback variable here
    let feedback = "";

    // Budget tracking for this round
    let income = 0;
    let expenses = 0;
    let budgetChanges = [];

    // Calculate income based on population with updated rates - REDUCED RATES
    for (const district of ["district1", "district2", "district3", "district4"]) {
      // Significantly reduced tax rates to make budget management harder
      let taxRatePerCapita = district === "district1" ? 0.095 : // reduced from 0.035
                             district === "district2" ? 0.028 : // reduced from 0.025
                             district === "district3" ? 0.018 : // reduced from 0.012
                             0.022; // reduced from 0.018
      
      // Add multiplier that reduces income when trust/crime metrics are poor
      const trustModifier = Math.max(0.7, gameMetrics.communityTrust[district] / 100);
      const crimeModifier = Math.max(0.7, 1 - (gameMetrics.crimesReported[district] / 200));
      const economicMultiplier = (trustModifier + crimeModifier) / 2;
      
      // Apply the modifier to tax income
      const districtIncome = Math.round(newMetrics.population[district] * taxRatePerCapita * economicMultiplier);
      income += districtIncome;
      budgetChanges.push(`Income from ${getDistrictName(district)}: +$${districtIncome}`);
    }

    // Increase fixed expenses - add infrastructure and administrative costs
    const fixedExpenses = 250; // Reduced from 300 to 250
    expenses += fixedExpenses;
    budgetChanges.push(`Administrative overhead: -$${fixedExpenses}`);

    // Apply REDUCED police costs
    const policeCostPerOfficer = 40; // Reduced from 60 to 40 to make police more affordable
    
    // Calculate police expenses with the new rate
    let policeExpense = 0;
    for (const district of ["district1", "district2", "district3", "district4"]) {
      const officersCount = policeAllocation[district].day + policeAllocation[district].night;
      const districtPoliceExpense = officersCount * policeCostPerOfficer;
      policeExpense += districtPoliceExpense;
    }
    expenses += policeExpense;
    budgetChanges.push(`Police salary expenses: -$${policeExpense}`);

    // STEP 0: Natural deterioration - all districts naturally get worse each round if no action is taken
    // This creates urgency and makes the "do nothing" approach lead to bad outcomes
    // Make certain districts deteriorate faster to create pressing challenges
    for (const district of ["district1", "district2", "district3", "district4"]) {
      // For early rounds (1-3), make South Side and Eastside deteriorate faster
      const isEarlyRound = currentRound <= 3;
      const isPriorityCrisisDistrict = district === "district3" || district === "district4";
      
      // Natural crime increase - exaggerated in crisis districts in early rounds
      const naturalCrimeIncrease = district === "district1" ? 3 : 
                                  district === "district2" ? 6 : 
                                  district === "district3" ? (isEarlyRound ? 15 : 12) : 
                                  (isEarlyRound ? 10 : 8);
                                  
      newMetrics.crimesReported[district] = Math.min(500, newMetrics.crimesReported[district] + naturalCrimeIncrease);
      metricChanges[district].crimes += naturalCrimeIncrease;
      
      // Adjust arrests based on natural crime increase (maintain clearance rate)
      const currentClearanceRate = newMetrics.arrests[district] / (newMetrics.crimesReported[district] - naturalCrimeIncrease);
      const newArrests = Math.round(naturalCrimeIncrease * currentClearanceRate);
      newMetrics.arrests[district] += newArrests;
      metricChanges[district].arrests += newArrests;
      
      // Natural trust erosion - exaggerated in priority districts in early rounds
      const naturalTrustDecrease = district === "district3" ? (isEarlyRound ? 7 : 5) : 
                                  district === "district4" ? (isEarlyRound ? 5 : 3) : 3;
      
      newMetrics.communityTrust[district] = Math.max(5, newMetrics.communityTrust[district] - naturalTrustDecrease);
      metricChanges[district].trust -= naturalTrustDecrease;
      
      // False arrests tend to rise naturally without supervision/training
      const naturalFalseArrestIncrease = district === "district1" ? 2 : 3; // Lower in wealthy areas
      newMetrics.falseArrestRate[district] = Math.min(50, newMetrics.falseArrestRate[district] + naturalFalseArrestIncrease);
      metricChanges[district].falseArrest += naturalFalseArrestIncrease;

      // Add warning for critical conditions in early rounds
      if (isEarlyRound && isPriorityCrisisDistrict && 
          newMetrics.communityTrust[district] < 20 && 
          newMetrics.crimesReported[district] > 90) {
        changes.push(`⚠️ CRITICAL: ${getDistrictName(district)} requires immediate attention - crime and trust have reached crisis levels`);
      }
    }

    // Add a comment about natural deterioration to changes list
    //changes.push("All districts experienced increased crime and reduced trust due to normal social pressures.");
    
    // Process ALL selected actions instead of just one
    const selectedActions = Object.entries(districtActions).filter(([district, action]) => action !== "");
    
    if (selectedActions.length === 0) {
      changes.push("No specific actions were implemented this round, allowing conditions to deteriorate.");
    }
    
    // Process each selected action
    selectedActions.forEach(([actionDistrict, action]) => {
      console.log(`Processing action: ${action} in district: ${actionDistrict}`);
      
      // Track action expense
      const actionCost = actionCosts[action] || 0;
      expenses += actionCost;
      budgetChanges.push(`${getActionName(action)} in ${getDistrictName(actionDistrict)}: -$${actionCost}`);
      
      // Record this action as implemented for the district
      setImplementedActions(prev => ({
        ...prev,
        [actionDistrict]: [...(prev[actionDistrict] || []), action]
      }));

      // Process the action effects based on type - GREATLY ENHANCED EFFECTS
      switch(action) {
        case "cctv":
          // Enhanced base effects
          let cctvTrustChange = -3; // Less negative impact on trust (was -5)
          let cctvCrimeChange = -20; // Much stronger crime reduction (was -8)
          let cctvFalseArrestChange = -6; // Stronger false arrest reduction (was -2)
          
          // District-specific modifications
          if (actionDistrict === "district1") {
            // Downtown (wealthy area) - even better reception and effectiveness
            cctvTrustChange = -1; // Almost no trust impact in wealthy areas
            cctvCrimeChange = -25; // Very effective crime reduction
            cctvFalseArrestChange = -8; // Excellent false arrest reduction
          } else if (actionDistrict === "district3") {
            // South Side (poor area) - more resistance but still helpful
            cctvTrustChange = -6; // More trust concerns but less than before
            cctvCrimeChange = -18; // Still significant crime reduction
            cctvFalseArrestChange = -5; // Moderate false arrest improvement
          }
          
          newMetrics.communityTrust[actionDistrict] += cctvTrustChange;
          newMetrics.crimesReported[actionDistrict] += cctvCrimeChange;
          newMetrics.falseArrestRate[actionDistrict] += cctvFalseArrestChange;
          
          metricChanges[actionDistrict].trust = cctvTrustChange;
          metricChanges[actionDistrict].crimes = cctvCrimeChange;
          metricChanges[actionDistrict].falseArrest = cctvFalseArrestChange;
          
          changes.push(
            `CCTV in ${getDistrictName(actionDistrict)}: Crime rate ${cctvCrimeChange}%, Community trust ${cctvTrustChange}%, False arrests ${cctvFalseArrestChange}%`,
          );
          break;

        case "app":
          // Enhanced base effects
          let appTrustChange = 20; // Double trust improvement (was 10)
          let appCrimeChange = -12; // More than double crime reduction (was -5)
          let appFalseArrestChange = -6; // Double false arrest reduction (was -3)
          
          // District-specific modifications
          if (actionDistrict === "district1") {
            // Downtown - somewhat less impactful due to already high metrics
            appTrustChange = 15; 
            appCrimeChange = -8;
            appFalseArrestChange = -4;
          } else if (actionDistrict === "district3") {
            // South Side - much more impactful where trust is low
            appTrustChange = 25; 
            appCrimeChange = -15;
            appFalseArrestChange = -8;
          }
          
          newMetrics.communityTrust[actionDistrict] += appTrustChange;
          newMetrics.crimesReported[actionDistrict] += appCrimeChange;
          newMetrics.falseArrestRate[actionDistrict] += appFalseArrestChange;
          
          metricChanges[actionDistrict].trust = appTrustChange;
          metricChanges[actionDistrict].crimes = appCrimeChange;
          metricChanges[actionDistrict].falseArrest = appFalseArrestChange;
          
          changes.push(
            `Crime reporting app in ${getDistrictName(actionDistrict)}: Crime rate ${appCrimeChange}%, Community trust +${appTrustChange}%, False arrests ${appFalseArrestChange}%`,
          );
          break;

        case "education":
          // Enhanced base effects
          let eduTrustChange = 30; // Double trust improvement (was 15)
          let eduCrimeChange = -10; // Now has significant crime reduction (was 0)
          let eduFalseArrestChange = -10; // Double false arrest reduction (was -5)
          
          // District-specific modifications
          if (actionDistrict === "district3" || actionDistrict === "district4") {
            // More impactful in low-trust districts with historical tensions
            eduTrustChange = 35;
            eduCrimeChange = -15;
            eduFalseArrestChange = -12;
          }
          
          newMetrics.communityTrust[actionDistrict] += eduTrustChange;
          newMetrics.crimesReported[actionDistrict] += eduCrimeChange;
          newMetrics.falseArrestRate[actionDistrict] += eduFalseArrestChange;
          
          metricChanges[actionDistrict].trust = eduTrustChange;
          metricChanges[actionDistrict].crimes = eduCrimeChange;
          metricChanges[actionDistrict].falseArrest = eduFalseArrestChange;
          
          changes.push(
            `Public education in ${getDistrictName(actionDistrict)}: Community trust +${eduTrustChange}%, Crime rate ${eduCrimeChange}%, False arrests ${eduFalseArrestChange}%`,
          );
          break;

        case "drone":
          // Enhanced base effects
          let droneTrustChange = -5; // Less negative trust impact (was -10)
          let droneCrimeChange = -25; // Double crime reduction (was -12)
          let droneFalseArrestChange = 3; // Less negative false arrest impact (was 4)
          
          // District-specific modifications
          if (actionDistrict === "district1") {
            // Downtown - more acceptance, more effective
            droneTrustChange = -2;
            droneCrimeChange = -28;
            droneFalseArrestChange = 1;
          } else if (actionDistrict === "district3") {
            // South Side - more resistance, still effective for crime
            droneTrustChange = -8;
            droneCrimeChange = -22;
            droneFalseArrestChange = 4;
          }
          
          newMetrics.communityTrust[actionDistrict] += droneTrustChange;
          newMetrics.crimesReported[actionDistrict] += droneCrimeChange;
          newMetrics.falseArrestRate[actionDistrict] += droneFalseArrestChange;
          
          metricChanges[actionDistrict].trust = droneTrustChange;
          metricChanges[actionDistrict].crimes = droneCrimeChange;
          metricChanges[actionDistrict].falseArrest = droneFalseArrestChange;
          
          changes.push(
            `Drone surveillance in ${getDistrictName(actionDistrict)}: Crime rate ${droneCrimeChange}%, Community trust ${droneTrustChange}%, False arrests +${droneFalseArrestChange}%`,
          );
          break;

        case "facial":
          // Enhanced facial recognition effects - dramatically different based on district
          let trustChange, falseArrestChange;
          const crimeReduction = -30; // Double crime reduction (was -15)
          
          if (actionDistrict === "district1") {
            // Downtown (wealthy/white) - well received
            trustChange = -2; // Minimal trust reduction
            falseArrestChange = -3; // Now reduces false arrests in wealthy areas
          } else if (actionDistrict === "district3") {
            // South Side (poor/minority) - strongly negative reception
            trustChange = -15; // Significant trust reduction, but less than before
            falseArrestChange = 5; // Still increases false arrests but less than before
          } else if (actionDistrict === "district4") {
            // Eastside (mixed) - mixed reception
            trustChange = -8;
            falseArrestChange = 2;
          } else {
            // Westside (also mixed) - mixed reception
            trustChange = -5;
            falseArrestChange = 0;
          }

          // Apply the effects
          newMetrics.communityTrust[actionDistrict] += trustChange;
          newMetrics.crimesReported[actionDistrict] += crimeReduction;
          newMetrics.falseArrestRate[actionDistrict] += falseArrestChange;
          
          // Record metric changes
          metricChanges[actionDistrict].trust = trustChange;
          metricChanges[actionDistrict].crimes = crimeReduction;
          metricChanges[actionDistrict].falseArrest = falseArrestChange;
          
          // Create description of changes
          changes.push(
            `Facial recognition in ${getDistrictName(actionDistrict)}: Crime rate ${crimeReduction}%, Community trust ${trustChange}%, False arrests ${falseArrestChange > 0 ? '+' : ''}${falseArrestChange}%`
          );
          break;
      }
    });

    // STEP 2: Apply effects of police allocation with ENHANCED effectiveness
    for (const district of ["district1", "district2", "district3", "district4"]) {
      // Calculate police coverage and total officers
      const dayOfficers = policeAllocation[district].day;
      const nightOfficers = policeAllocation[district].night;
      const totalPolice = dayOfficers + nightOfficers;
      
      // Apply district-specific effectiveness multipliers for day/night shifts
      let dayEffectiveness, nightEffectiveness;
      
      // Enhanced district-specific effectiveness
      switch(district) {
        case "district1":
          dayEffectiveness = 1.2; // Was 1.0
          nightEffectiveness = 0.9; // Was 1.0
          break;
        case "district2":
          dayEffectiveness = 1.0; // Was 1.0
          nightEffectiveness = 1.1; // Was 1.0
          break;
        case "district3":
          dayEffectiveness = 0.9; // Was 1.0
          nightEffectiveness = 1.3; // Was 1.0
          break;
        case "district4":
          dayEffectiveness = 1.0; // Was 1.0
          nightEffectiveness = 1.2; // Was 1.0
          break;
        default:
          dayEffectiveness = 1.0;
          nightEffectiveness = 1.0;
      }
      
      // Calculate weighted police coverage based on effectiveness
      const effectivePoliceForce = (dayOfficers * dayEffectiveness) + (nightOfficers * nightEffectiveness);
      const policeCoverage = effectivePoliceForce / 10; // 10 would be max coverage
      
      // IMPLEMENT UNDER-POLICING MECHANICS
      if (totalPolice <= 2) {
        // Under-policed district - crime increases, trust decreases
        const crimeIncrease = district === "district3" ? 20 : 15; // Higher crime increase in high crime area
        const trustDecrease = 8; // Trust decreases as people feel unsafe
        
        newMetrics.crimesReported[district] = Math.min(500, newMetrics.crimesReported[district] + crimeIncrease);
        newMetrics.communityTrust[district] = Math.max(5, newMetrics.communityTrust[district] - trustDecrease);
        
        metricChanges[district].crimes += crimeIncrease;
        metricChanges[district].trust -= trustDecrease;
        
        changes.push(`Under-policing in ${getDistrictName(district)}: Crime rate +${crimeIncrease}%, Community trust -${trustDecrease}%`);
      }
      // IMPLEMENT OVER-POLICING MECHANICS - ENHANCED CRIME REDUCTION
      else if (totalPolice >= 8) {
        let crimeDecrease = 0;
        let trustChange = 0;
        let falseArrestChange = 0;
        
        // Different effects based on district demographics - ENHANCED CRIME REDUCTION
        if (district === "district1") {
          // Downtown - wealthy area better accepts heavy policing
          crimeDecrease = 25; // Was lower (e.g. 15)
          trustChange = -2; // Less negative impact on trust
          falseArrestChange = 1; 
        } else if (district === "district3") {
          // South Side - more sensitive to over-policing
          crimeDecrease = 18; // Was lower (e.g. 10)
          trustChange = -7; // Less negative impact than before
          falseArrestChange = 3; 
        } else {
          // Other districts - balanced effects
          crimeDecrease = 20; // Was lower (e.g. 12)
          trustChange = -4;
          falseArrestChange = 2;
        }
        
        newMetrics.crimesReported[district] = Math.max(5, newMetrics.crimesReported[district] - crimeDecrease);
        newMetrics.communityTrust[district] = Math.min(100, Math.max(5, newMetrics.communityTrust[district] + trustChange));
        newMetrics.falseArrestRate[district] = Math.min(50, Math.max(1, newMetrics.falseArrestRate[district] + falseArrestChange));
        
        metricChanges[district].crimes -= crimeDecrease;
        metricChanges[district].trust += trustChange;
        metricChanges[district].falseArrest += falseArrestChange;
        
        changes.push(`Over-policing in ${getDistrictName(district)}: Crime rate -${crimeDecrease}%, Community trust ${trustChange > 0 ? '+' : ''}${trustChange}%, False arrests ${falseArrestChange > 0 ? '+' : ''}${falseArrestChange}%`);
      }
      // NORMAL POLICING LEVEL - SIGNIFICANTLY IMPROVED EFFECTIVENESS
      else {
        // Use district-specific day/night effectiveness for crime reduction
        // Base effectiveness depends on proper balance of officers
        const optimalDayNightRatio = district === "district1" ? 0.5 : // equal day/night is best
                                     district === "district2" ? 0.45 : // slightly more night
                                     district === "district3" ? 0.35 : // much more night
                                     0.4; // more night for district4
                                     
        // Calculate how close the allocation is to optimal
        const currentDayNightRatio = dayOfficers / (totalPolice || 1);
        const ratioDistance = Math.abs(currentDayNightRatio - optimalDayNightRatio);
        
        // Penalize effectiveness if the ratio is far from optimal
        const allocationEffectiveness = Math.max(0.6, 1 - ratioDistance); // Increased minimum from 0.5 to 0.6
        
        // Calculate crime reduction based on weighted allocation and optimal ratio - SIGNIFICANTLY IMPROVED
        const crimeReduction = Math.round(policeCoverage * 6 * allocationEffectiveness); // Was 3, increased to 6 (doubled)
        newMetrics.crimesReported[district] = Math.max(5, newMetrics.crimesReported[district] - crimeReduction);
        
        // Trust changes depend on optimal allocation and district - IMPROVED
        let trustChange = 0;
        if (ratioDistance < 0.2) { // Close to optimal ratio
          trustChange = district === "district1" ? 2 : 
                       district === "district3" ? 3 : 2;
        } else {
          trustChange = district === "district1" ? 0 : 
                       district === "district3" ? -1 : 0;
        }
        
        // Bonus for district3 if allocating properly for night shift - ENHANCED
        if (district === "district3" && nightOfficers >= 4 && dayOfficers >= 2) {
          trustChange += 3; // Increased from 2
          changes.push(`Effective shift balance in ${getDistrictName(district)} improved community relations.`);
        }
        
        // Bonus for district1 if maintaining balanced coverage - ENHANCED
        if (district === "district1" && Math.abs(dayOfficers - nightOfficers) <= 1) {
          trustChange += 2; // Added or increased from previous value
        }
        
        newMetrics.communityTrust[district] = Math.min(100, Math.max(5, newMetrics.communityTrust[district] + trustChange));
        
        // Record changes if significant
        if (crimeReduction > 0) {
          metricChanges[district].crimes -= crimeReduction;
        }
        if (trustChange !== 0) {
          metricChanges[district].trust += trustChange;
        }
        
        // Add feedback about allocation effectiveness
        if (ratioDistance < 0.1) {
          changes.push(`Optimal police shift allocation in ${getDistrictName(district)}: Crime rate -${crimeReduction}, Trust ${trustChange >= 0 ? '+' : ''}${trustChange}%`);
        }
      }
      
      // STEP 3: IMPLEMENT FEEDBACK LOOP SYSTEM
      
      // Low trust increases crime rate (breakdown in community-police cooperation)
      if (newMetrics.communityTrust[district] < 30) {
        const trustBasedCrimeIncrease = Math.floor((30 - newMetrics.communityTrust[district]) / 10) + 2;
        newMetrics.crimesReported[district] = Math.min(100, newMetrics.crimesReported[district] + trustBasedCrimeIncrease);
        metricChanges[district].crimes += trustBasedCrimeIncrease;
        
        // Only add a significant change to the changes list
        if (trustBasedCrimeIncrease >= 3) {
          changes.push(`Low trust in ${getDistrictName(district)} increased crime rate by ${trustBasedCrimeIncrease}%`);
        }
      }
      
      // High false arrest rates decrease trust
      if (newMetrics.falseArrestRate[district] > 20) {
        const falseArrestTrustDecrease = Math.floor((newMetrics.falseArrestRate[district] - 20) / 5) + 3;
        newMetrics.communityTrust[district] = Math.max(5, newMetrics.communityTrust[district] - falseArrestTrustDecrease);
        metricChanges[district].trust -= falseArrestTrustDecrease;
        
        // Only add a significant change to the changes list
        if (falseArrestTrustDecrease >= 4) {
          changes.push(`High false arrest rate in ${getDistrictName(district)} decreased trust by ${falseArrestTrustDecrease}%`);
        }
      }
      
      // Effect on false arrest rate - depends on trust and police allocation
      let falseArrestChange = 0;
      // More police with low trust increases false arrests
      if (newMetrics.communityTrust[district] < 40 && totalPolice > 6) {
        falseArrestChange = 2;
      }
      // High trust with balanced policing reduces false arrests
      else if (newMetrics.communityTrust[district] > 70 && totalPolice <= 6) {
        falseArrestChange = -1;
      }
      
      newMetrics.falseArrestRate[district] = Math.min(
        50,
        Math.max(1, newMetrics.falseArrestRate[district] + falseArrestChange),
      );
      
      metricChanges[district].falseArrest += falseArrestChange;
    }

    // Enhanced population impact - much stronger consequences for trust and crime issues
    for (const district of ["district1", "district2", "district3", "district4"]) {
      // Population changes based on conditions - higher sensitivity
      let populationChange = 0;
      let populationChangeReasons = [];
      
      // High crime rate causes more people to leave
      if (newMetrics.crimesReported[district] > 80) { // Lower threshold
        const crimePopulationLoss = Math.round(newMetrics.population[district] * 
          (newMetrics.crimesReported[district] > 150 ? 0.035 : 0.02)); // Up to 3.5% leave
        populationChange -= crimePopulationLoss;
        populationChangeReasons.push(`high crime (-${crimePopulationLoss})`);
      }
      
      // Low trust causes more people to leave - stronger impact
      if (newMetrics.communityTrust[district] < 30) {
        const trustPopulationLoss = Math.round(newMetrics.population[district] * 
          (newMetrics.communityTrust[district] < 20 ? 0.03 : 0.015)); // Up to 3% leave
        populationChange -= trustPopulationLoss;
        populationChangeReasons.push(`low trust (-${trustPopulationLoss})`);
      }
      
      // Over-policing causes people to leave
      const totalPolice = policeAllocation[district].day + policeAllocation[district].night;
      if (totalPolice >= 8) {
        const overPolicingLoss = Math.round(newMetrics.population[district] * 0.02); // 2% leave
        populationChange -= overPolicingLoss;
        populationChangeReasons.push(`over-policing (-${overPolicingLoss})`);
      }
      
      // Safe district with high trust attracts people - stronger positive impact
      if (newMetrics.crimesReported[district] < 40 && newMetrics.communityTrust[district] > 70) {
        const attractedPopulation = Math.round(newMetrics.population[district] * 0.025); // 2.5% growth
        populationChange += attractedPopulation;
        populationChangeReasons.push(`improved conditions (+${attractedPopulation})`);
      }
      
      // Apply population changes with specific message
      if (populationChange !== 0) {
        newMetrics.population[district] += populationChange;
        metricChanges[district].population = populationChange;
        
        if (populationChange < 0) {
          changes.push(`${getDistrictName(district)} lost ${Math.abs(populationChange).toLocaleString()} residents due to ${populationChangeReasons.join(", ")}.`);
        } else {
          changes.push(`${getDistrictName(district)} gained ${populationChange.toLocaleString()} new residents due to ${populationChangeReasons.join(", ")}.`);
        }
      }
    }

    // STEP 3: Check for special event triggers
    const specialEvents = checkForSpecialEvents(newMetrics, policeAllocation, metricChanges);
    
    if (specialEvents.length > 0) {
      // Limit to at most 3 events per round
      const limitedEvents = specialEvents.slice(0, 3);
      
      // Store the special events to display in notifications but NOT in round summary
      setCurrentSpecialEvents(limitedEvents);
      
      // Apply the effects of the events
      limitedEvents.forEach(event => {
        // Apply budget effects
        if (event.budgetEffect) {
          newMetrics.budget += event.budgetEffect;
          budgetChanges.push(`${event.title}: ${event.budgetEffect > 0 ? '+' : ''}$${event.budgetEffect}`);
        }
        
        // Apply trust effects to specific or all districts
        if (event.trustEffect) {
          if (event.district) {
            // District-specific trust effect
            newMetrics.communityTrust[event.district] = Math.min(100, 
              Math.max(5, newMetrics.communityTrust[event.district] + event.trustEffect));
            metricChanges[event.district].trust += event.trustEffect;
          } else {
            // Global trust effect
            for (const district of ["district1", "district2", "district3", "district4"]) {
              newMetrics.communityTrust[district] = Math.min(100, 
                Math.max(5, newMetrics.communityTrust[district] + event.trustEffect));
              metricChanges[district].trust += event.trustEffect;
            }
          }
        }
        
        // Apply crime effects
        if (event.crimeEffect) {
          if (event.district) {
            // District-specific crime effect
            newMetrics.crimesReported[event.district] = Math.max(5, 
              newMetrics.crimesReported[event.district] + event.crimeEffect);
            metricChanges[event.district].crimes += event.crimeEffect;
          } else {
            // Global crime effect
            for (const district of ["district1", "district2", "district3", "district4"]) {
              newMetrics.crimesReported[district] = Math.max(5, 
                newMetrics.crimesReported[district] + event.crimeEffect);
              metricChanges[district].crimes += event.crimeEffect;
            }
          }
        }
        
        // Add this event to triggered events history
        setTriggeredEvents(prev => [...prev, ...limitedEvents.map(event => ({ ...event, round: currentRound }))]);
      });
    } else {
      // Clear any previous special events
      setCurrentSpecialEvents([]);
    }

    // Update budget
    newMetrics.income = income;
    newMetrics.expenses = expenses;
    newMetrics.budget = newMetrics.budget + income - expenses;

    // Check if budget has fallen to zero or below - GAME OVER
    if (newMetrics.budget <= 0) {
      // Add budget bankruptcy message to game log
      const bankruptcyMessage = {
        title: "BUDGET BANKRUPTCY",
        message: "The city has run out of funds. The police department can no longer function.",
        type: "negative"
      };
      
      // Add to special events and show alert
      setCurrentSpecialEvents([bankruptcyMessage]);
      
      // Set budget to exactly 0 for display purposes
      newMetrics.budget = 0;
      
      // Add the bankruptcy to the game log
      changes.push("❌ CRITICAL: City budget depleted! Police department operations can no longer be funded.");
      feedback = "The city has gone bankrupt. Without sufficient funds, the police department cannot continue operations. Game over.";
      
      // Add the game log entry before transitioning
      setGameLog(prevLog => [...prevLog, {
        round: currentRound,
        specialEvents: [{
          title: "BUDGET BANKRUPTCY",
          message: "The city has run out of funds. Police operations terminated.",
          type: "negative"
        }],
        // ...other log properties from before
        budget: {
          previous: gameMetrics.budget,
          current: 0,
          income: income,
          expenses: expenses,
          details: [...budgetChanges, "BANKRUPTCY: City funds depleted"]
        },
      }]);
      
      // Update metrics before ending
      setGameMetrics(newMetrics);
      
      // Set game end reason to bankrupt
      setGameEndReason("bankrupt")
      
      // Show the results dialog instead of changing game state
      setShowResultsDialog(true)
      
      return; // Stop processing the rest of the function
    }

    // Generate feedback based on police allocation and district needs - MOVED AFTER BANKRUPTCY CHECK
    feedback = ""

    // Add feedback about deteriorating conditions if no action was taken
    if (selectedActions.length === 0) {
      feedback += "Taking no action has allowed problems to worsen. Consider implementing specific policies to address issues. "
    }

    if (policeAllocation.district3.day + policeAllocation.district3.night < 6) {
      feedback += "The high crime rate in South Side might require more police presence. "
    }
    if (policeAllocation.district1.day + policeAllocation.district1.night > 6) {
      feedback += "Downtown may be over-policed relative to its crime rate. "
    }
    if (newMetrics.communityTrust.district3 < 25) {
      feedback += "Community trust in South Side is critically low. Consider trust-building actions. "
    }
    if (newMetrics.falseArrestRate.district3 > 30) {
      feedback +=
        "False arrest rate in South Side is alarmingly high. Consider better training and community engagement. "
    }

    // Add feedback about disparities
    const trustGap = Math.abs(newMetrics.communityTrust.district1 - newMetrics.communityTrust.district3)
    if (trustGap > 50) {
      feedback += "There's a significant trust gap between Downtown and South Side. "
    }

    const crimeGap = Math.abs(newMetrics.crimesReported.district3 - newMetrics.crimesReported.district1)
    if (crimeGap > 50) {
      feedback += "The crime rate disparity between districts is very high. "
    }

    const falseArrestGap = Math.abs(newMetrics.falseArrestRate.district3 - newMetrics.falseArrestRate.district1)
    if (falseArrestGap > 15) {
      feedback +=
        "The disparity in false arrest rates between districts suggests systemic issues in policing practices. "
    }

    // Add new feedback about under/over-policing
    const underPolicedDistricts = ["district1", "district2", "district3", "district4"]
      .filter(d => policeAllocation[d].day + policeAllocation[d].night <= 2)
      .map(getDistrictName);
    
    if (underPolicedDistricts.length > 0) {
      feedback += `${underPolicedDistricts.join(" and ")} ${underPolicedDistricts.length === 1 ? "is" : "are"} severely under-policed, leading to rising crime rates. `
    }
    
    const overPolicedDistricts = ["district1", "district2", "district3", "district4"]
      .filter(d => policeAllocation[d].day + policeAllocation[d].night >= 8)
      .map(getDistrictName);
    
    if (overPolicedDistricts.length > 0) {
      feedback += `The heavy police presence in ${overPolicedDistricts.join(" and ")} may be causing community tension. `
    }

    // Add critical feedback for urgent issues in early rounds
    if (currentRound <= 3) {
      if (newMetrics.crimesReported.district3 > 90 && newMetrics.communityTrust.district3 < 20) {
        feedback += "URGENT: South Side is in a state of crisis with extremely high crime and low trust. Immediate action required. ";
      }
      if (newMetrics.crimesReported.district4 > 70 && newMetrics.communityTrust.district4 < 40) {
        feedback += "ATTENTION: Eastside is developing serious issues that should be addressed promptly. ";
      }
    }

    // Add detailed feedback on population changes and economic impact
    const totalPopulationChange = 
      metricChanges.district1.population + 
      metricChanges.district2.population +
      metricChanges.district3.population + 
      metricChanges.district4.population;
    
    if (Math.abs(totalPopulationChange) > 500) {
      if (totalPopulationChange < 0) {
        feedback += `The city lost ${Math.abs(totalPopulationChange).toLocaleString()} residents this round, reducing tax revenue by approximately $${Math.round(Math.abs(totalPopulationChange) * 0.02).toLocaleString()}. `;
      } else {
        feedback += `The city attracted ${totalPopulationChange.toLocaleString()} new residents this round, increasing tax revenue by approximately $${Math.round(totalPopulationChange * 0.02).toLocaleString()}. `;
      }
    }

    // Add budget info to round summary
    setRoundSummary({
      changes,
      feedback,
      metricChanges,
      budget: {
        previous: gameMetrics.budget,
        current: newMetrics.budget,
        income: income,
        expenses: expenses,
        details: budgetChanges
      },
      specialEvents: specialEvents.slice(0, 3) // Make sure special events are passed to the round summary
    })

    // Add to game log
    const logEntry = {
      round: currentRound,
      action: selectedActions.length > 0 ? selectedActions.map(([actionDistrict, action]) => ({
        type: action,
        district: actionDistrict,
        districtName: getDistrictName(actionDistrict)
      })) : null,
      policeAllocation: {...policeAllocation},
      metrics: {
        communityTrust: {...newMetrics.communityTrust},
        crimesReported: {...newMetrics.crimesReported},
        falseArrestRate: {...newMetrics.falseArrestRate},
        arrests: {...newMetrics.arrests},
        arrestsByRace: {...newMetrics.arrestsByRace}, // Add this
        arrestsByIncome: {...newMetrics.arrestsByIncome} // Add this
      },
      metricChanges: { // Add metric changes to the log
        communityTrust: {
          district1: metricChanges.district1.trust,
          district2: metricChanges.district2.trust,
          district3: metricChanges.district3.trust,
          district4: metricChanges.district4.trust
        },
        crimesReported: {
          district1: metricChanges.district1.crimes,
          district2: metricChanges.district2.crimes,
          district3: metricChanges.district3.crimes,
          district4: metricChanges.district4.crimes
        },
        falseArrestRate: {
          district1: metricChanges.district1.falseArrest,
          district2: metricChanges.district2.falseArrest,
          district3: metricChanges.district3.falseArrest,
          district4: metricChanges.district4.falseArrest
        }
      },
      changes,
      feedback,
      budget: {
        previous: gameMetrics.budget,
        current: newMetrics.budget,
        income: income,
        expenses: expenses,
        details: budgetChanges
      },
      population: {
        ...newMetrics.population
      },
      specialEvents: specialEvents.slice(0, 3).map(event => ({
        title: event.title,
        message: event.message,
        type: event.type
      })),
    }
    
    setGameLog(prevLog => [...prevLog, logEntry])
    
    setGameMetrics(newMetrics)
    setShowRoundSummary(true) // Show summary after next round

    // Reset actions for next round
    setDistrictActions({
      district1: "",
      district2: "",
      district3: "",
      district4: "",
    })
    
    if (currentRound < 10) {
      // For rounds 1-9, move to next round
      setCurrentRound(currentRound + 1)
    } else if (currentRound === 10) {
      // For round 10, show results dialog when End Round button is clicked
      setGameEndReason("completed")
      setShowResultsDialog(true)
    }
  }

  // Enhanced checkForSpecialEvents function with updated criteria and explanations
  const checkForSpecialEvents = (metrics, allocation, changes) => {
    const triggeredEvents = [];
    
    // Only trigger events after round 1 (i.e., start in round 2)
    if (currentRound <= 1) {
      return triggeredEvents;
    }
    
    // Core events that can occur from round 2 onwards
    
    // 1. Over-policing protests - UPDATED: Changed criteria to police > 7 and simplified explanation
    for (const district of ["district1", "district2", "district3", "district4"]) {
      // Check if district has more than 7 officers total (day + night)
      if (allocation[district].day + allocation[district].night > 7 && 
          metrics.communityTrust[district] < 30) {
        triggeredEvents.push({
          type: "negative",
          title: "Citizens Protest Against Over-Policing",
          message: `Residents in ${getDistrictName(district)} are protesting against excessive police presence in their community, claiming it creates a hostile environment.`,
          district: district,
          trustEffect: -12,
          budgetEffect: -180,
          populationEffect: -800,
          round: currentRound
        });
        // Only trigger one over-policing protest per round
        break;
      }
    }
    
    // 2. Community boycott - MOVED EARLIER to round 2
    if (metrics.communityTrust.district3 < 20 && 
        metrics.falseArrestRate.district3 > 25 &&
        !gameLog.some(entry => entry.specialEvents?.some(e => e.title === "Community Cooperation Breakdown"))) {
      triggeredEvents.push({
        type: "negative",
        title: "Community Cooperation Breakdown",
        message: "South Side residents refuse to cooperate with police due to low trust and high false arrest rates",
        district: "district3",
        trustEffect: -10,
        budgetEffect: -100,
        populationEffect: -500,
        round: currentRound
      });
    }
    
    // 3. Population exodus - MOVED EARLIER to round 2
    for (const district of ["district2", "district4"]) {
      if (metrics.communityTrust[district] < 35 && 
          metrics.crimesReported[district] > 70 &&
          !gameLog.some(entry => 
            entry.specialEvents?.some(e => 
              e.type === "population-exodus" && e.district === district))) {
        triggeredEvents.push({
          type: "population-exodus",
          title: "Population Departure",
          message: `Rising crime and falling trust cause the middle class to leave ${getDistrictName(district)}.`,
          district: district,
          trustEffect: -5,
          budgetEffect: -150,
          populationEffect: -2000,
          round: currentRound
        });
        // Only trigger one exodus event per round
        break;
      }
    }
    
    // NEW EVENT: High false arrest rate scandal
    for (const district of ["district1", "district2", "district3", "district4"]) {
      if (metrics.falseArrestRate[district] > 28 && 
          !gameLog.some(entry => 
            entry.specialEvents?.some(e => 
              e.type === "false-arrest-scandal" && e.district === district))) {
        triggeredEvents.push({
          type: "false-arrest-scandal",
          title: "False Arrest Scandal",
          message: `A high-profile innocent individual was wrongfully arrested in ${getDistrictName(district)}, causing public outrage and media scrutiny.`,
          district: district,
          trustEffect: -15,
          budgetEffect: -220,
          crimeEffect: 5,
          round: currentRound
        });
        // Only trigger one false arrest scandal per round
        break;
      }
    }
    
    // Enhanced events that only occur after round 3
    if (currentRound > 3) {
      // Civil rights investigation - criteria unchanged
      const district3FalseArrestRate = metrics.falseArrestRate.district3;
      const district1FalseArrestRate = metrics.falseArrestRate.district1;
      
      if (district3FalseArrestRate > 30 && 
          district3FalseArrestRate - district1FalseArrestRate > 20 &&
          !gameLog.some(entry => entry.specialEvents?.some(e => e.type === "civil-rights"))) {
        triggeredEvents.push({
          type: "civil-rights",
          title: "Civil Rights Investigation",
          message: "Federal investigators launch inquiry into racial disparities in policing practices",
          district: "district3",
          trustEffect: -10,
          budgetEffect: -250,
          round: currentRound
        });
      }

      // ...other advanced events...
    }
    
    // Additional early warning events for round 2
    if (currentRound === 2) {
      // Add early warning event if metrics are critically bad in round 2
      if (metrics.communityTrust.district3 < 15 && metrics.crimesReported.district3 > 100) {
        triggeredEvents.push({
          type: "negative",
          title: "Critical Situation Developing",
          message: "Social workers warn that South Side is approaching a tipping point with dangerous community-police relations",
          district: "district3",
          trustEffect: 0, // Warning only, no immediate effects
          round: currentRound
        });
      }
    }
    
    return triggeredEvents;
  };

  const closeRoundSummary = () => {
    setShowRoundSummary(false)
    setIsFirstPlay(false) // No longer first play after continuing
    
    // Only transition to results after round 10 when the End Round button is clicked,
    // not when closing the summary
    // Remove the condition that was transitioning to results here
  }

  const getDistrictName = (districtKey) => {
    const names = {
      district1: "Downtown",
      district2: "Westside",
      district3: "South Side",
      district4: "Eastside",
    }
    return names[districtKey]
  }

  // Update the resetGame function to include falseArrestRate and clear game log
  const resetGame = () => {
    setGameState("playing")
    setCurrentRound(1)
    setShowRoundSummary(true)
    setIsFirstPlay(true) // Reset to first play state
    setGameLog([])
    setCurrentSpecialEvents([]) // Reset special events
    setTriggeredEvents([]) // Reset triggered events
    setPoliceAllocation({
      district1: { day: 1, night: 1 },
      district2: { day: 1, night: 1 },
      district3: { day: 1, night: 1 },
      district4: { day: 1, night: 1 },
      unallocated: 12,
    })
    setDistrictActions({
      district1: "",
      district2: "",
      district3: "",
      district4: "",
    })
    setGameMetrics({
      budget: 3000, 
      income: 0,
      expenses: 0,
      population: {
        district1: 10000,  
        district2: 15000,
        district3: 20000,
        district4: 12000,
      },
      communityTrust: {
        district1: 90,
        district2: 60,
        district3: 15, // Critical issue - extremely low trust
        district4: 35, // Changed from 45 to create more urgent situation
      },
      crimesReported: {
        district1: 18,
        district2: 45,
        district3: 95,  // Increased from 85 to create more urgent challenge
        district4: 65,  // Increased from 50 to create more urgent situation
      },
      arrests: { // New metric
        district1: 14,  // ~80% clearance rate (arrests/crimes)
        district2: 22,  // ~50% clearance rate
        district3: 25,  // ~30% clearance rate
        district4: 25,  // ~50% clearance rate
      },
      falseArrestRate: {
        district1: 5,
        district2: 15,
        district3: 30, // Increased from 25
        district4: 18,
      },
      arrestsByRace: {
        white: { district1: 85, district2: 50, district3: 15, district4: 40 }, // Made more extreme
        black: { district1: 5, district2: 30, district3: 65, district4: 35 },  // Made more extreme
        hispanic: { district1: 5, district2: 15, district3: 15, district4: 20 },
        other: { district1: 5, district2: 5, district3: 5, district4: 5 },
      },
      arrestsByIncome: {
        high: { district1: 75, district2: 30, district3: 5, district4: 25 }, // Made more extreme
        middle: { district1: 20, district2: 40, district3: 20, district4: 40 },
        low: { district1: 5, district2: 30, district3: 75, district4: 35 },  // Made more extreme
      },
      commonCrimes: {
        district1: ["Property Theft", "Fraud", "Car Theft"], // Changed "DUI" to "Car Theft"
        district2: ["Burglary", "Assault", "Drug Possession"],
        district3: ["Drug Dealing", "Violent Crime", "Robbery"],
        district4: ["Vandalism", "Domestic Disputes", "Theft"],
      },
    })
    
    // Reset implemented actions
    setImplementedActions({
      district1: [],
      district2: [],
      district3: [],
      district4: []
    })
    setTriggeredEvents([]);
    
    // Close the results dialog if open
    setShowResultsDialog(false)
  }

  if (gameState === "results") {
    return <GameResults metrics={gameMetrics} onReset={resetGame} gameLog={gameLog} />
  }

  return (
    <>
      <GameBoard
        currentRound={currentRound}
        policeAllocation={policeAllocation}
        setPoliceAllocation={setPoliceAllocation}
        gameMetrics={gameMetrics}
        districtActions={districtActions}
        setDistrictActions={setDistrictActions}
        onNextRound={handleNextRound}
        showRoundSummary={showRoundSummary}
        roundSummary={{...roundSummary, specialEvents: currentSpecialEvents}}
        closeRoundSummary={closeRoundSummary}
        getDistrictName={getDistrictName}
        gameLog={gameLog}
        implementedActions={implementedActions}
        onRestart={resetGame} // Pass the reset function
        isFirstPlay={isFirstPlay} // Pass first play state
      />

      {/* Results Dialog - Updated to prevent dismissal except through restart button */}
      <Dialog 
        open={showResultsDialog} 
        onOpenChange={() => {/* Prevent closing by clicking outside */}} 
      >
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto p-0">
          <DialogTitle className="sr-only">
            {gameEndReason === "bankrupt" ? "Game Over - City Bankruptcy" : "Game Results"}
          </DialogTitle>
          <GameResults 
            metrics={gameMetrics} 
            onReset={resetGame} 
            gameLog={gameLog} 
            gameEndReason={gameEndReason} 
          />
        </DialogContent>
      </Dialog>
    </>
  )
}

