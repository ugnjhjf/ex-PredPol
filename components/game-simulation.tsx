"use client"

import { useState } from "react"
import GameBoard from "./game-board"
import GameResults from "./game-results"

export default function GameSimulation() {
  const [gameState, setGameState] = useState<"playing" | "results">("playing")
  const [currentRound, setCurrentRound] = useState(1)
  const [showRoundSummary, setShowRoundSummary] = useState(true) // Start with showing summary
  const [isFirstPlay, setIsFirstPlay] = useState(true) // Track if it's the first play
  
  // Update initial values to create more extreme starting conditions
  const [gameMetrics, setGameMetrics] = useState({
    budget: 1000, // Starting budget
    income: 0,    // Current round income
    expenses: 0,  // Current round expenses
    population: {
      district1: 10000,  
      district2: 15000,
      district3: 20000,
      district4: 12000,
    },
    communityTrust: {
      district1: 90, // Increased from 85
      district2: 60,
      district3: 15, // Decreased from 30
      district4: 45,
    },
    crimesReported: { // Changed from crimeRate
      district1: 40,  // Was 10% crime rate, now 40 actual crimes
      district2: 160, // Was 40% crime rate, now 160 actual crimes
      district3: 340, // Was 85% crime rate, now 340 actual crimes
      district4: 200, // Was 50% crime rate, now 200 actual crimes
    },
    arrests: { // New metric
      district1: 32,  // 80% clearance rate (arrests/crimes)
      district2: 96,  // 60% clearance rate
      district3: 136, // 40% clearance rate
      district4: 120, // 60% clearance rate
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

  // Define police cost per officer
  const policeCostPerOfficer = 50;

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

  const startGame = () => {
    setGameState("playing")
  }

  // Update the handleNextRound function to properly show round summary
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

    // Budget tracking for this round
    let income = 0;
    let expenses = 0;
    let budgetChanges = [];

    // Calculate income based on population (tax revenue)
    for (const district of ["district1", "district2", "district3", "district4"]) {
      // Different districts have different tax rates
      let taxRatePerCapita = district === "district1" ? 0.02 : 
                              district === "district2" ? 0.015 : 
                              district === "district3" ? 0.01 : 0.0125;
      
      const districtIncome = Math.round(newMetrics.population[district] * taxRatePerCapita);
      income += districtIncome;
      budgetChanges.push(`Income from ${getDistrictName(district)}: +$${districtIncome}`);
    }

    // Calculate police expenses
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
    for (const district of ["district1", "district2", "district3", "district4"]) {
      // Natural crime increase now uses absolute numbers
      const naturalCrimeIncrease = district === "district3" ? 16 : 8;
      newMetrics.crimesReported[district] = Math.min(500, newMetrics.crimesReported[district] + naturalCrimeIncrease);
      metricChanges[district].crimes += naturalCrimeIncrease;
      
      // Adjust arrests based on natural crime increase (maintain clearance rate)
      const currentClearanceRate = newMetrics.arrests[district] / (newMetrics.crimesReported[district] - naturalCrimeIncrease);
      const newArrests = Math.round(naturalCrimeIncrease * currentClearanceRate);
      newMetrics.arrests[district] += newArrests;
      metricChanges[district].arrests += newArrests;
      
      // Natural trust erosion - trust slowly declines if not maintained
      const naturalTrustDecrease = district === "district3" ? 3 : 2;
      newMetrics.communityTrust[district] = Math.max(5, newMetrics.communityTrust[district] - naturalTrustDecrease);
      metricChanges[district].trust -= naturalTrustDecrease;
      
      // False arrests tend to rise naturally without supervision/training
      const naturalFalseArrestIncrease = district === "district1" ? 1 : 2; // Lower in wealthy areas
      newMetrics.falseArrestRate[district] = Math.min(50, newMetrics.falseArrestRate[district] + naturalFalseArrestIncrease);
      metricChanges[district].falseArrest += naturalFalseArrestIncrease;
    }

    // Add a comment about natural deterioration to changes list
    //changes.push("All districts experienced increased crime and reduced trust due to normal social pressures.");
    
    // Find which district has an action
    const actionDistrict = Object.keys(districtActions).find((district) => districtActions[district] !== "")
    const action = actionDistrict ? districtActions[actionDistrict] : ""

    // Track action expense if any
    if (actionDistrict && action) {
      const actionCost = actionCosts[action] || 0;
      expenses += actionCost;
      budgetChanges.push(`${getActionName(action)} in ${getDistrictName(actionDistrict)}: -$${actionCost}`);
      
      // Record this action as implemented for the district
      setImplementedActions(prev => ({
        ...prev,
        [actionDistrict]: [...prev[actionDistrict], action]
      }))
      
      // Process the action for the selected district with district-specific impacts
      switch (action) {
        case "cctv":
          // Base effects
          let cctvTrustChange = -5;
          let cctvCrimeChange = -8;
          let cctvFalseArrestChange = -2;
          
          // District-specific modifications
          if (actionDistrict === "district1") { // Downtown - high income, primarily white
            cctvTrustChange = -3; // Less trust impact in affluent areas
            cctvCrimeChange = -10; // Higher crime reduction
          } else if (actionDistrict === "district3") { // South Side - low income, minority
            cctvTrustChange = -10; // Much higher trust impact due to surveillance concerns
            cctvFalseArrestChange = 0; // Less effective at reducing false arrests
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
          // Base effects
          let appTrustChange = 10;
          let appCrimeChange = -5;
          let appFalseArrestChange = -3;
          
          // District-specific modifications
          if (actionDistrict === "district1") { // Downtown - high income, primarily white
            appTrustChange = 5; // Less impact (already high)
            appCrimeChange = -3; // Less impact (already low)
          } else if (actionDistrict === "district3") { // South Side - low income, minority
            appTrustChange = 15; // Higher impact where trust is low
            appCrimeChange = -8; // More effective where crime is high
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
          // Base effects
          let eduTrustChange = 15;
          let eduCrimeChange = 0;
          let eduFalseArrestChange = -5;
          
          // District-specific modifications
          if (actionDistrict === "district3" || actionDistrict === "district4") { 
            // More impactful in areas with low trust
            eduTrustChange = 20;
            eduCrimeChange = -3; // Some crime reduction through community engagement
            eduFalseArrestChange = -8; // Better identification of actual suspects
          }
          
          newMetrics.communityTrust[actionDistrict] += eduTrustChange;
          newMetrics.crimesReported[actionDistrict] += eduCrimeChange;
          newMetrics.falseArrestRate[actionDistrict] += eduFalseArrestChange;
          
          metricChanges[actionDistrict].trust = eduTrustChange;
          metricChanges[actionDistrict].crimes = eduCrimeChange;
          metricChanges[actionDistrict].falseArrest = eduFalseArrestChange;
          
          changes.push(
            `Public education in ${getDistrictName(actionDistrict)}: Community trust +${eduTrustChange}%${eduCrimeChange !== 0 ? `, Crime rate ${eduCrimeChange}%` : ''}, False arrests ${eduFalseArrestChange}%`,
          );
          break;

        case "drone":
          // Base effects
          let droneTrustChange = -10;
          let droneCrimeChange = -12;
          let droneFalseArrestChange = 4;
          
          // District-specific modifications
          if (actionDistrict === "district1") { 
            droneTrustChange = -5; // Less negative impact in affluent areas
          } else if (actionDistrict === "district3") {
            droneTrustChange = -18; // Much higher trust impact in marginalized communities
            droneFalseArrestChange = 8; // Higher false arrests due to profiling
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
          // Dramatically different effects based on district
          let trustChange, falseArrestChange;
          const crimeReduction = -15; // Same crime reduction in all districts
          
          if (actionDistrict === "district1") { // Downtown - high income, white
            trustChange = -5; // Minor trust decrease
            falseArrestChange = -2; // Reduce false arrests
          } else if (actionDistrict === "district3") { // South Side - minority heavy
            trustChange = -25; // Severe trust impact
            falseArrestChange = 15; // Significant increase in false arrests
          } else if (actionDistrict === "district4") { // Mixed area with tensions
            trustChange = -18; // Strong trust decrease
            falseArrestChange = 10; // Notable increase in false arrests
          } else { // District 2 - mixed demographics
            trustChange = -12; // Moderate trust decrease
            falseArrestChange = 5; // Some increase in false arrests
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
            `Facial Recognition in ${getDistrictName(actionDistrict)}: Crime rate ${crimeReduction}%, Community trust ${trustChange}%, False arrests ${falseArrestChange > 0 ? '+' : ''}${falseArrestChange}%`
          );
          break;
      }
    } else {
      changes.push("No specific action was implemented this round, allowing conditions to deteriorate.")
    }

    // STEP 2: Apply effects of police allocation with enhanced mechanics
    for (const district of ["district1", "district2", "district3", "district4"]) {
      // Calculate police coverage and total officers
      const totalPolice = policeAllocation[district].day + policeAllocation[district].night;
      const policeCoverage = totalPolice / 10; // 10 would be max coverage (5 day + 5 night)
      
      // IMPLEMENT UNDER-POLICING MECHANICS
      if (totalPolice <= 2) {
        // Under-policed district - crime increases, trust decreases
        const crimeIncrease = district === "district3" ? 15 : 10; // Higher crime increase in high crime area
        const trustDecrease = 5; // Trust decreases as people feel unsafe
        
        newMetrics.crimesReported[district] = Math.min(500, newMetrics.crimesReported[district] + crimeIncrease);
        newMetrics.communityTrust[district] = Math.max(5, newMetrics.communityTrust[district] - trustDecrease);
        
        metricChanges[district].crimes += crimeIncrease;
        metricChanges[district].trust -= trustDecrease;
        
        changes.push(`Under-policing in ${getDistrictName(district)}: Crime rate +${crimeIncrease}%, Community trust -${trustDecrease}%`);
      }
      // IMPLEMENT OVER-POLICING MECHANICS
      else if (totalPolice >= 8) {
        let crimeDecrease = 0;
        let trustChange = 0;
        let falseArrestChange = 0;
        
        // Different effects based on district demographics
        if (district === "district1") { // Downtown - affluent, white
          crimeDecrease = 5; // Moderate crime decrease
          trustChange = 2;   // Small trust increase
          falseArrestChange = -1; // Small decrease in false arrests
        } else if (district === "district3") { // South Side - low income, minority
          crimeDecrease = 8; // Significant crime decrease
          trustChange = -10; // Severe trust decrease
          falseArrestChange = 8; // Large increase in false arrests
        } else { // Mixed districts
          crimeDecrease = 6; // Moderate crime decrease
          trustChange = -5;  // Moderate trust decrease
          falseArrestChange = 3; // Moderate increase in false arrests
        }
        
        newMetrics.crimesReported[district] = Math.max(5, newMetrics.crimesReported[district] - crimeDecrease);
        newMetrics.communityTrust[district] = Math.min(100, Math.max(5, newMetrics.communityTrust[district] + trustChange));
        newMetrics.falseArrestRate[district] = Math.min(50, Math.max(1, newMetrics.falseArrestRate[district] + falseArrestChange));
        
        metricChanges[district].crimes -= crimeDecrease;
        metricChanges[district].trust += trustChange;
        metricChanges[district].falseArrest += falseArrestChange;
        
        changes.push(`Over-policing in ${getDistrictName(district)}: Crime rate -${crimeDecrease}%, Community trust ${trustChange > 0 ? '+' : ''}${trustChange}%, False arrests ${falseArrestChange > 0 ? '+' : ''}${falseArrestChange}%`);
      }
      // NORMAL POLICING LEVEL
      else {
        // Original mechanics for police allocation
        const crimeReduction = Math.round(policeCoverage * 3); // Up to 3% reduction
        newMetrics.crimesReported[district] = Math.max(5, newMetrics.crimesReported[district] - crimeReduction);
        
        let trustChange = 0;
        if (district === "district1") {
          trustChange = Math.round(policeCoverage * 2);
        } else if (district === "district3") {
          trustChange = totalPolice > 4 ? -2 : 1;
        } else {
          trustChange = totalPolice > 6 ? -1 : 1;
        }
        
        newMetrics.communityTrust[district] = Math.min(100, Math.max(5, newMetrics.communityTrust[district] + trustChange));
        
        // Record changes if significant
        if (crimeReduction > 0) {
          metricChanges[district].crimes -= crimeReduction;
        }
        if (trustChange !== 0) {
          metricChanges[district].trust += trustChange;
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

    // Update population based on crime rate, trust, and over-policing
    for (const district of ["district1", "district2", "district3", "district4"]) {
      // Population changes based on conditions
      let populationChange = 0;
      
      // High crime rate causes people to leave
      if (newMetrics.crimesReported[district] > 300) {
        populationChange -= Math.round(newMetrics.population[district] * 0.02); // 2% leave
        changes.push(`High crime in ${getDistrictName(district)} caused population decline.`);
      }
      
      // Low trust causes people to leave
      if (newMetrics.communityTrust[district] < 30) {
        populationChange -= Math.round(newMetrics.population[district] * 0.01); // 1% leave
        changes.push(`Low trust in ${getDistrictName(district)} caused population decline.`);
      }
      
      // Over-policing causes people to leave
      const totalPolice = policeAllocation[district].day + policeAllocation[district].night;
      if (totalPolice >= 8) {
        populationChange -= Math.round(newMetrics.population[district] * 0.015); // 1.5% leave
        changes.push(`Over-policing in ${getDistrictName(district)} caused population decline.`);
      }
      
      // Safe district with high trust attracts people
      if (newMetrics.crimesReported[district] < 100 && newMetrics.communityTrust[district] > 70) {
        populationChange += Math.round(newMetrics.population[district] * 0.02); // 2% growth
        changes.push(`Safe and trusted ${getDistrictName(district)} attracted new residents.`);
      }
      
      // Apply population changes
      newMetrics.population[district] += populationChange;
      metricChanges[district].population = populationChange;
    }

    // Update budget
    newMetrics.income = income;
    newMetrics.expenses = expenses;
    newMetrics.budget = newMetrics.budget + income - expenses;

    // Generate feedback based on police allocation and district needs
    let feedback = ""

    // Add feedback about deteriorating conditions if no action was taken
    if (!action) {
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
      }
    })

    // Add to game log
    const logEntry = {
      round: currentRound,
      action: action ? {
        type: action,
        district: actionDistrict,
        districtName: getDistrictName(actionDistrict)
      } : null,
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
      }
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
      // For round 10, transition directly to results when End Round button is clicked
      setGameState("results")
    }
  }

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
      budget: 1000, // Starting budget
      income: 0,    // Current round income
      expenses: 0,  // Current round expenses
      population: {
        district1: 10000,  
        district2: 15000,
        district3: 20000,
        district4: 12000,
      },
      communityTrust: {
        district1: 90, // Increased from 85
        district2: 60,
        district3: 15, // Decreased from 30
        district4: 45,
      },
      crimesReported: { // Changed from crimeRate
        district1: 40,  // Was 10% crime rate, now 40 actual crimes
        district2: 160, // Was 40% crime rate, now 160 actual crimes
        district3: 340, // Was 85% crime rate, now 340 actual crimes
        district4: 200, // Was 50% crime rate, now 200 actual crimes
      },
      arrests: { // New metric
        district1: 32,  // 80% clearance rate (arrests/crimes)
        district2: 96,  // 60% clearance rate
        district3: 136, // 40% clearance rate
        district4: 120, // 60% clearance rate
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
  }

  if (gameState === "results") {
    return <GameResults metrics={gameMetrics} onReset={resetGame} gameLog={gameLog} />
  }

  return (
    <GameBoard
      currentRound={currentRound}
      policeAllocation={policeAllocation}
      setPoliceAllocation={setPoliceAllocation}
      gameMetrics={gameMetrics}
      districtActions={districtActions}
      setDistrictActions={setDistrictActions}
      onNextRound={handleNextRound}
      showRoundSummary={showRoundSummary}
      roundSummary={roundSummary}
      closeRoundSummary={closeRoundSummary}
      getDistrictName={getDistrictName}
      gameLog={gameLog}
      implementedActions={implementedActions}
      onRestart={resetGame} // Pass the reset function
      isFirstPlay={isFirstPlay} // Pass first play state
    />
  )
}

