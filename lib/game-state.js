export function createInitialGameState() {
  return {
    currentRound: 1,
    budget: 5000,
    gameLog: [],
    
    // Police allocation - keeping balanced initially
    policeAllocation: {
      district1: { day: 3, night: 2 },
      district2: { day: 3, night: 2 },
      district3: { day: 2, night: 3 },
      district4: { day: 2, night: 3 },
      unallocated: 0,
    },
    
    // Updated metrics to match new threshold scales
    metrics: {
      communityTrust: {
        district1: 85,  // High trust in wealthy area
        district2: 60,  // Moderate trust in mixed area
        district3: 35,  // Low trust in low-income area
        district4: 45,  // Lower moderate trust in area with historical tensions
      },
      
      // Crime rates adjusted to new scale:
      // Low (0-24), Moderate (25-50), High (51+)
      crimesReported: {
        district1: 15,  // Low crime in wealthy area
        district2: 30,  // Moderate crime in mixed area
        district3: 62,  // High crime in low-income area
        district4: 45,  // Higher moderate crime in area with tensions
      },
      
      // False arrest rates adjusted to new scale:
      // Good (<5%), Medium (5-10%), High (>10%)
      falseArrestRate: {
        district1: 3,   // Good - wealthy area with good policing
        district2: 6,   // Medium - mixed area
        district3: 12,  // High - over-policed low-income area
        district4: 8,   // Medium-high - area with historical tensions
      },
      
      // Population distribution
      population: {
        district1: 45000,  // Wealthy urban area
        district2: 65000,  // Mixed suburban/urban area
        district3: 85000,  // Densely populated low-income area
        district4: 55000,  // Mixed area
      },
      
      // Initial arrests - correlate with crime rates
      arrests: {
        district1: 9,
        district2: 15,
        district3: 22,
        district4: 18,
      },
      
      // Common crimes by district - reflect demographics
      commonCrimes: {
        district1: ["Fraud", "Theft", "Vandalism", "DUI", "Drug Possession"],
        district2: ["Theft", "Burglary", "Assault", "Drug Sales", "Robbery"],
        district3: ["Assault", "Drug Sales", "Gang Activity", "Robbery", "Homicide"],
        district4: ["Burglary", "Theft", "Assault", "Vandalism", "Drug Sales"],
      },
      
      // Race distribution in arrests - highlight disparities
      arrestsByRace: {
        white: { 
          district1: 70, 
          district2: 45, 
          district3: 15, 
          district4: 35 
        },
        black: { 
          district1: 15, 
          district2: 35, 
          district3: 65, 
          district4: 40 
        },
        hispanic: { 
          district1: 10, 
          district2: 15, 
          district3: 15, 
          district4: 20 
        },
        other: { 
          district1: 5, 
          district2: 5, 
          district3: 5, 
          district4: 5 
        },
      },
      
      // Income level distribution in arrests - highlight disparities
      arrestsByIncome: {
        high: { 
          district1: 15, 
          district2: 20, 
          district3: 5, 
          district4: 15 
        },
        middle: { 
          district1: 35, 
          district2: 40, 
          district3: 25, 
          district4: 35 
        },
        low: { 
          district1: 50, 
          district2: 40, 
          district3: 70, 
          district4: 50 
        },
      },
      
      // Crime rates (percentage-based version of crimesReported)
      crimeRate: {
        district1: 15,
        district2: 30,
        district3: 62,
        district4: 45,
      }
    },
  };
}
