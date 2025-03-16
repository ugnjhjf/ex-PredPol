Resign the game balance.

The number of crimes and arrest in each district is too high, make it lower.
Make the effect of night and day shift police allocation different for different districts.
In the current game, if the player doesn't do anything, he will still pass some game objectives. we want to make sure the player allocates a number of police correctly to different districts and performs the appropriate game action before he can pass the game objectives. They should have the right day and night shift police before they can get good marks.
In the initial rounds, the player should handle the most pressing challenges first.
Special Events will be triggered if 1) Over-policing in race minority areas in a certain district with low trust level, 2) High crime rate. This event will trigger big drop in trust.
Low trust in the police or high crime rate, people will leave the district which results in lost of income.
End result should also depend on the trust of the citizens.
The crime has a happening at night. Police allocate to night shift has more effect. Generate a plan for me without edit code

===


Game Balance Redesign Plan
To improve the game balance, I'll outline changes to make the simulation more challenging, realistic, and ensure players must engage strategically to succeed. Here's a comprehensive plan without code changes:

1. Lower Crime and Arrest Numbers
Currently, crime numbers are too high (e.g., district3 starts with 340 crimes). We should scale these down to more realistic values:

Downtown (District 1): 15-20 crimes (was 40)
Westside (District 2): 40-50 crimes (was 160)
South Side (District 3): 70-90 crimes (was 340)
Eastside (District 4): 45-55 crimes (was 200)
Arrest numbers should be proportionally adjusted:

District 1: 12-16 arrests (80% clearance)
District 2: 20-25 arrests (50% clearance)
District 3: 21-27 arrests (30% clearance)
District 4: 22-28 arrests (50% clearance)
2. Day/Night Shift Police Allocation Effects
Implement district-specific day/night shift effectiveness:

Downtown (District 1):

Day shift: Normal effectiveness (crime reduction 3% per officer)
Night shift: 70% effectiveness (crime reduction 2.1% per officer)
Low crime at night, mostly white-collar crime during day
Westside (District 2):

Day shift: 90% effectiveness (crime reduction 2.7% per officer)
Night shift: 110% effectiveness (crime reduction 3.3% per officer)
Mixed crime patterns throughout day/night
South Side (District 3):

Day shift: 70% effectiveness (crime reduction 2.1% per officer)
Night shift: 130% effectiveness (crime reduction 3.9% per officer)
Significantly higher crime rates at night
Eastside (District 4):

Day shift: 80% effectiveness (crime reduction 2.4% per officer)
Night shift: 120% effectiveness (crime reduction 3.6% per officer)
Higher crime rates in evening and night
3. Make Game Objectives Require Strategic Action
Modify the natural deterioration of metrics to ensure player action is required:

Accelerate natural crime increase:

District 1: +3 per round (was minor)
District 2: +6 per round
District 3: +12 per round
District 4: +8 per round
Faster trust deterioration:

All districts lose 3-5% trust per round if no positive actions taken
Add optimal police allocation requirements:

Each district should have minimum thresholds to prevent deterioration
South Side needs at least 4 officers at night to stabilize
Downtown needs balanced day/night coverage
Make false arrest rates worsen more quickly without intervention

4. Pressing Initial Challenges
Add urgent problems that require immediate attention:

South Side (District 3) starts with critical issues:

Very low trust (15%)
High crime (90 crimes)
High false arrest rate (30%)
Player should prioritize trust-building here first
Eastside (District 4) has escalating tensions:

Medium trust (45%) but rapidly declining
Rising crime rate with special events if not addressed
Resource Constraint:

Start with fewer available police officers (16 instead of 20)
Increase officer cost to make budget management crucial
5. Special Events System
Implement triggered events based on player decisions:

Race-based Over-policing Event:

Triggered when: South Side has > 7 officers AND trust < 25%
Effect: Trust drops by 15%, protests occur, budget penalty of $200
Message: "Protests erupt over aggressive policing in minority neighborhoods"
High Crime Events:

Triggered when: Any district reaches >80 crimes for 2 consecutive rounds
Effect: Major incident occurs, trust drops by 10%, bad publicity
Message: "Major crime incident makes headlines, undermining public confidence"
Recovery Events:

Triggered when: Trust increases above 60% in a low-trust district
Effect: Positive media coverage, small trust boost in all districts
Message: "Community engagement success story highlighted in media"
6. Population and Revenue Dynamics
Enhance the economic consequences:

Population Migration:

Low trust (<30%): 3% population leaves per round
High crime (>60): 2% population leaves per round
Combined effect: 5% leaves per round
High trust (>70%) AND low crime (<30): 2% population growth
Revenue Model:

Downtown: $0.03 per citizen in tax revenue
Westside: $0.02 per citizen
South Side: $0.01 per citizen
Eastside: $0.015 per citizen
Population loss directly impacts tax revenue
Budget Stress:

Start with lower budget ($800 instead of $1000)
Police salary increased to $60 per officer
Action costs increased by 25%
7. Trust-Dependent End Results
Modify the scoring system to heavily weight trust:

Success Metrics Reweighting:

Trust score: 35% of final score (was 25%)
Crime reduction: 25% (unchanged)
Equitable policing: 25% (unchanged)
Police accuracy: 15% (was 25%)
Trust Thresholds:

<40% average trust: Cannot achieve above C grade regardless of other metrics
65% average trust: Minimum B grade if other metrics are reasonable

Minimum District Trust:

Add requirement that no district can have <30% trust for top grades
Forces players to address all districts, not just focus on "easy wins"
8. Night Crime Patterns
Implement night-specific crime mechanics:

Crime Distribution:

Downtown: 30% of crimes at night / 70% during day
Westside: 45% of crimes at night / 55% during day
South Side: 65% of crimes at night / 35% during day
Eastside: 55% of crimes at night / 45% during day
Night Officer Effect:

Night officers in South Side are 30% more effective at reducing crime
Night officers in Downtown are 30% less effective (less crime happens)
Shift-specific Events:

Certain high-impact crimes only occur at night
Understaffed night shifts lead to specific negative outcomes
Feedback messages highlight time-of-day patterns
This comprehensive plan will create a more challenging, engaging simulation that requires strategic thinking while remaining believable. The player will need to understand district-specific needs and allocate resources appropriately to succeed.