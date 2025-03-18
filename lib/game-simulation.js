// ...existing code...

// Updated crime impact coefficients to match new thresholds
const CRIME_REDUCTION_PER_OFFICER = {
  district1: 1.5,  // Each officer reduces crime by 1.5 points
  district2: 1.2,  // Each officer reduces crime by 1.2 points
  district3: 1.0,  // Each officer reduces crime by 1.0 points - less effective in low-trust area
  district4: 1.1,  // Each officer reduces crime by 1.1 points
};

// Updated metrics for shift effectiveness to match new thresholds
const SHIFT_EFFECTIVENESS = {
  district1: { day: 1.0, night: 0.7 },  // Downtown: more day crime
  district2: { day: 0.9, night: 1.1 },  // Westside: slightly more night crime
  district3: { day: 0.7, night: 1.3 },  // South Side: significantly more night crime
  district4: { day: 0.8, night: 1.2 },  // Eastside: more evening/night crime
};

// Updated arrest rate coefficients based on police presence
const ARREST_RATE_PER_OFFICER = {
  district1: 1.2,  // Each officer makes 1.2 arrests on average
  district2: 1.0,  // Each officer makes 1.0 arrests on average
  district3: 0.8,  // Each officer makes 0.8 arrests on average - less effective in low-trust area
  district4: 0.9,  // Each officer makes 0.9 arrests on average
};

// Updated false arrest rate factors
const FALSE_ARREST_FACTORS = {
  LOW_TRUST_MULTIPLIER: 1.2,    // Lower trust = higher false arrests
  OVER_POLICING_THRESHOLD: 7,   // More than 7 officers = over-policing
  OVER_POLICING_PENALTY: 1.5,   // Over-policing increases false arrests by 50%
  UNDER_POLICING_THRESHOLD: 3,  // Fewer than 3 officers = under-policing
  UNDER_POLICING_PENALTY: 1.3,  // Under-policing increases false arrests by 30%
  
  // Base false arrest rates by district - adjusted to new thresholds
  BASE_RATES: {
    district1: 3,   // 3% base rate in high-income area
    district2: 5,   // 5% base rate in mixed-income area
    district3: 8,   // 8% base rate in low-income area
    district4: 6,   // 6% base rate in area with tensions
  }
};

// ...existing code...

// Function to simulate crime based on police allocation
function simulateCrime(gameState) {
  const { policeAllocation, metrics } = gameState;
  const newCrimes = { ...metrics.crimesReported };
  
  // For each district
  Object.keys(newCrimes).forEach(district => {
    // Base crime tendency adjusted to new scale
    let baseCrime = {
      district1: 20,  // Low baseline (0-24)
      district2: 35,  // Moderate baseline (25-50)
      district3: 65,  // High baseline (51+)
      district4: 45,  // Moderate-high baseline (near 50)
    }[district];
    
    // Calculate total effective police presence
    const dayOfficers = policeAllocation[district].day || 0;
    const nightOfficers = policeAllocation[district].night || 0;
    
    const effectiveDayForce = dayOfficers * SHIFT_EFFECTIVENESS[district].day;
    const effectiveNightForce = nightOfficers * SHIFT_EFFECTIVENESS[district].night;
    const totalEffectiveForce = effectiveDayForce + effectiveNightForce;
    
    // Calculate crime reduction based on police presence
    const crimeReduction = totalEffectiveForce * CRIME_REDUCTION_PER_OFFICER[district];
    
    // Trust affects crime rates (higher trust = better reporting but lower crime)
    const trustAdjustment = (metrics.communityTrust[district] >= 70) ? -5 : 
                           (metrics.communityTrust[district] >= 40) ? 0 : 5;
    
    // Calculate final crime value with minimum floor to prevent negative crime
    newCrimes[district] = Math.max(5, Math.round(baseCrime - crimeReduction + trustAdjustment));
  });
  
  return newCrimes;
}

// ...existing code...
