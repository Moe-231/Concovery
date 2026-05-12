<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TYPE DEFINITIONS
// These define the shape of objects used throughout the component
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface Stage {
  id: number
  name: string
  shortName: string
  days: string
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// STATIC DATA — 6 AIS RECOVERY STAGES
// These never change. Used for the stage timeline at the bottom of the page.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const stages: Stage[] = [
  { id: 1, name: 'Complete Rest',          shortName: 'Rest',          days: '1-3'   },
  { id: 2, name: 'Light Aerobic',          shortName: 'Light Aerobic', days: '4-6'   },
  { id: 3, name: 'Sport Specific Exercise',shortName: 'Sport Specific',days: '7-9'   },
  { id: 4, name: 'Non-Contact Training',   shortName: 'Non-Contact',   days: '10-14' },
  { id: 5, name: 'Full Contact',           shortName: 'Full Contact',  days: '15-20' },
  { id: 6, name: 'Return to Play',         shortName: 'Return to Play',days: '21+'   },
]

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// NECK EXERCISE DEFINITIONS
// Each exercise has sets, reps, hold time, rest time, and diagram type.
// The exerciseDefinitions array drives the new guided exercise section.
// NOTE: neckExercises below is kept for backward compatibility but is unused
//       in the new template — exerciseDefinitions replaces it.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const exerciseDefinitions = [
  {
    name: 'Chin Tucks',
    reps: 10,
    sets: 3,
    holdSeconds: 5,
    restSeconds: 30,
    instructions: 'Gently pull your chin straight back — like you are making a double chin. Hold the position, then release slowly.',
    cue: 'Pull chin straight back — not down',
    diagram: 'chin-tuck',
  },
  {
    name: 'Neck Rotations',
    reps: 10,
    sets: 1,
    holdSeconds: 3,
    restSeconds: 20,
    instructions: 'Slowly turn your head to the left until you feel a gentle stretch. Hold briefly, then return to centre. Repeat to the right. That is one rep.',
    cue: 'Turn slowly — stop before pain',
    diagram: 'neck-rotation',
  },
  {
    name: 'Neck Isometrics',
    reps: 8,
    sets: 3,
    holdSeconds: 8,
    restSeconds: 30,
    instructions: 'Place your palm flat against your forehead. Push your head forward into your hand — resist with your neck so your head does not move. Hold for 8 seconds.',
    cue: 'Head must stay completely still',
    diagram: 'isometric',
  },
]

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 21-DAY DATA
// This is the core dataset. Each day (1-21) has unique content:
//   - stage:            which of the 6 AIS stages this day falls in
//   - stageName:        human-readable stage name
//   - brainRecoveryPct: estimated % neurometabolic recovery (from literature)
//   - cellularProcess:  what is happening in the brain at a cellular level
//   - dailyGoal:        plain English goal for the day
//   - allowed:          list of allowed activities, each with a detail description
//                       and optional interactive widget type ('breathing', 'cognitive', 'reaction')
//   - restricted:       list of restricted activities
//   - warningSign:      when to stop and seek medical help
//   - insight:          motivational/educational message for the day
//
// SOURCE: Giza & Hovda 2014 (Neurometabolic Cascade), AIS 2024 Return-to-Play Protocol
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const dayData: Record<number, {
  stage: number
  stageName: string
  brainRecoveryPct: number
  cellularProcess: string
  dailyGoal: string
  allowed: { activity: string; detail: string; interactive?: string }[]
  restricted: string[]
  warningSign: string
  insight: string
}> = {
  1: {
    stage: 1, stageName: 'Complete Rest', brainRecoveryPct: 5,
    cellularProcess: 'Neurometabolic crisis. Ion pumps working overtime to restore sodium-potassium balance. Glucose demand is at its peak but supply is restricted due to disrupted blood flow.',
    dailyGoal: 'Do absolutely nothing. Your brain needs every available resource to begin stabilising.',
    allowed: [
      { activity: 'Sleep', detail: 'As much as possible. Sleep is the single most powerful recovery tool on Day 1.' },
      { activity: 'Guided rest breathing', detail: '4-7-8 breathing reduces cognitive load and aids neurological recovery.', interactive: 'breathing' },
      { activity: 'Lying down in a dark room', detail: 'Minimise all sensory input. Close blinds, no TV, no phone.' },
      { activity: 'Light meals', detail: 'Eat if you can tolerate it. Avoid caffeine and alcohol entirely.' },
    ],
    restricted: ['No screens of any kind — phone, TV, laptop, tablet', 'No reading of any kind', 'No physical activity whatsoever', 'No driving', 'No school or work tasks', 'No loud environments or bright lights'],
    warningSign: 'Worsening headache, vomiting, or loss of consciousness — call 000 immediately.',
    insight: 'You will feel like you are doing nothing. You are not. Rest on Day 1 is the most active recovery choice you can make.',
  },
  2: {
    stage: 1, stageName: 'Complete Rest', brainRecoveryPct: 10,
    cellularProcess: 'Ion balance beginning to restore but energy reserves remain critically low. Inflammatory cascade is at its peak. Neurons are highly vulnerable to secondary injury.',
    dailyGoal: 'Continue complete rest. Do not be fooled if symptoms seem to be easing — the brain is still in crisis.',
    allowed: [
      { activity: 'Sleep and rest', detail: 'Continue prioritising sleep above everything else.' },
      { activity: 'Guided rest breathing', detail: 'Breathing exercises reduce stress hormones that slow brain recovery.', interactive: 'breathing' },
      { activity: 'Very short walks to bathroom', detail: 'Minimal movement only. Do not exert yourself.' },
      { activity: 'Light conversation', detail: 'Brief, calm conversation is fine. Avoid stressful topics.' },
    ],
    restricted: ['No screens of any kind', 'No physical exertion', 'No driving', 'No school or work', 'No alcohol'],
    warningSign: 'If symptoms are significantly worse than Day 1, see a GP today — do not wait.',
    insight: 'Day 2 is when most players want to check their phone. Do not. Neurons require energy your brain cannot spare right now.',
  },
  3: {
    stage: 1, stageName: 'Complete Rest', brainRecoveryPct: 15,
    cellularProcess: 'Inflammatory response beginning to stabilise. Mitochondria starting to restore ATP production. Blood flow slowly normalising but still below baseline.',
    dailyGoal: 'Begin very gentle cognitive activity if completely symptom-free. If any symptoms remain, continue complete rest.',
    allowed: [
      { activity: 'Short screen time if symptom-free', detail: 'Maximum 15 minutes at a time, only if no headache.' },
      { activity: 'Guided rest breathing', detail: 'Continue daily breathing practice to support recovery.', interactive: 'breathing' },
      { activity: 'Light reading', detail: 'Only if completely symptom-free. Stop if headache returns.' },
      { activity: 'Brief walk outdoors', detail: '5-10 minutes at a slow pace. Stop if any symptoms emerge.' },
    ],
    restricted: ['No sport or physical training', 'No driving', 'No full-time school or work', 'No alcohol', 'No activities that increase heart rate'],
    warningSign: 'Any return of headache, dizziness, or brain fog means back to complete rest immediately.',
    insight: 'Symptom-free does not mean brain-healed. You are at 15% recovery. Stage 2 starts tomorrow.',
  },
  4: {
    stage: 2, stageName: 'Light Aerobic', brainRecoveryPct: 22,
    cellularProcess: 'Mitochondrial recovery underway. ATP production improving but still 40% below normal. Inflammation decreasing. Axons beginning early-stage repair processes.',
    dailyGoal: 'Introduce light aerobic activity that does not raise heart rate above 60% of your maximum.',
    allowed: [
      { activity: 'Walking', detail: '10-15 minutes at a comfortable pace. If you can hold a conversation, the pace is right.' },
      { activity: 'Gentle stretching', detail: '10 minutes of light static stretching. No dynamic movements.' },
      { activity: 'Guided rest breathing', detail: 'Continue daily breathing practice.', interactive: 'breathing' },
      { activity: 'Cognitive load test', detail: 'Daily digit span test tracks your cognitive recovery progress.', interactive: 'cognitive' },
      { activity: 'School or work — reduced load', detail: 'Half days only. Take breaks every 30 minutes.' },
    ],
    restricted: ['No running or jogging', 'No gym or weight training', 'No contact of any kind', 'No activities causing sweating or elevated heart rate', 'No alcohol'],
    warningSign: 'Stop immediately if headache, dizziness, or nausea returns during or after activity.',
    insight: 'Light movement actually helps recovery by increasing cerebral blood flow. The moment symptoms return, stop.',
  },
  5: {
    stage: 2, stageName: 'Light Aerobic', brainRecoveryPct: 28,
    cellularProcess: 'Blood flow normalising. Mitochondria producing ATP more efficiently. Axonal repair mechanisms active. Neurotransmitter levels beginning to restabilise.',
    dailyGoal: 'Extend light aerobic activity by 5 minutes compared to yesterday if symptom-free.',
    allowed: [
      { activity: 'Walking', detail: '15-20 minutes. Slightly brisker pace than Day 4 if comfortable.' },
      { activity: 'Stationary bike', detail: '10 minutes at very low resistance. Heart rate below 60% max.' },
      { activity: 'Cognitive load test', detail: 'Compare your score to yesterday — track your brain speed recovering.', interactive: 'cognitive' },
      { activity: 'Reaction time test', detail: 'Light cognitive challenge to track brain speed recovery.', interactive: 'reaction' },
    ],
    restricted: ['No running', 'No resistance training', 'No contact sport', 'No high-intensity activity'],
    warningSign: 'Fatigue after light activity is normal. Headache is not — stop if it appears.',
    insight: 'You are at 28% recovery. Do not confuse symptom resolution with brain healing. They are not the same thing.',
  },
  6: {
    stage: 2, stageName: 'Light Aerobic', brainRecoveryPct: 34,
    cellularProcess: 'Energy metabolism at approximately 35% of baseline. Axonal connections stabilising in undamaged regions. Inflammation largely resolved in peripheral areas.',
    dailyGoal: 'Final day of Stage 2. Prepare to introduce sport-specific movement tomorrow.',
    allowed: [
      { activity: 'Brisk walking', detail: '20-25 minutes. You should feel slightly warmer but not out of breath.' },
      { activity: 'Stationary bike', detail: '15 minutes at low resistance. Heart rate can touch 65% max briefly.' },
      { activity: 'Swimming — gentle laps', detail: 'No flip turns, no diving. Easy freestyle only.' },
      { activity: 'Cognitive load test', detail: 'Final Stage 2 cognitive check before progressing.', interactive: 'cognitive' },
      { activity: 'Reaction time test', detail: 'Track your cognitive recovery progress.', interactive: 'reaction' },
    ],
    restricted: ['No running or jogging', 'No sport-specific drills', 'No weight training', 'No contact'],
    warningSign: 'If symptoms return today, reset to Day 4. Do not push through to Stage 3.',
    insight: 'Tomorrow you move to Stage 3. Trusting the process when you feel fine is what protects your long-term brain health.',
  },
  7: {
    stage: 3, stageName: 'Sport Specific Exercise', brainRecoveryPct: 40,
    cellularProcess: 'Axonal connections regenerating in damaged regions. Energy metabolism at 40% — enough for moderate exercise but insufficient to protect against collision. Myelin sheath repair beginning.',
    dailyGoal: 'Introduce running and sport-specific movement without any contact or collision risk.',
    allowed: [
      { activity: 'Light jogging', detail: '10-15 minutes where you can still hold a conversation. On grass if possible.' },
      { activity: 'Dribbling or ball skills', detail: 'Solo drills only. No other players involved.' },
      { activity: 'Cognitive load test', detail: 'Track your brain speed as physical load increases.', interactive: 'cognitive' },
      { activity: 'Reaction time test', detail: 'Daily cognitive recovery check.', interactive: 'reaction' },
    ],
    restricted: ['No contact or collision of any kind', 'No team training with other players', 'No heading the ball', 'No weight training', 'No match play or scrimmage'],
    warningSign: 'Most dangerous day of recovery. You feel 90% fine. Your brain is at 40%. Do not be fooled.',
    insight: 'This is the Day 7 trap. Axonal connections in the damaged area are still actively regenerating and are highly susceptible to re-injury.',
  },
  8: {
    stage: 3, stageName: 'Sport Specific Exercise', brainRecoveryPct: 46,
    cellularProcess: 'Myelin sheath repair progressing. Neural pathway efficiency improving but not restored. Energy reserves building but still significantly below pre-injury baseline.',
    dailyGoal: 'Build on yesterday — extend duration and increase skill complexity slightly.',
    allowed: [
      { activity: 'Jogging', detail: '15-20 minutes. Can include gentle direction changes.' },
      { activity: 'Sport-specific skills', detail: 'Passing drills, shooting practice — solo or with a stationary partner.' },
      { activity: 'Cognitive load test', detail: 'Daily digit span test.', interactive: 'cognitive' },
      { activity: 'Reaction time test', detail: 'Daily reaction test tracks cognitive recovery progress.', interactive: 'reaction' },
    ],
    restricted: ['No contact', 'No team training', 'No explosive plyometric movements', 'No heading the ball'],
    warningSign: 'Post-exercise fatigue lasting more than an hour means reduce intensity tomorrow.',
    insight: 'Consistency across Days 7, 8, and 9 matters more than any individual session.',
  },
  9: {
    stage: 3, stageName: 'Sport Specific Exercise', brainRecoveryPct: 52,
    cellularProcess: 'Over 50% of neurometabolic function restored. Axonal connections largely re-established in damaged areas. Vulnerability to secondary injury still significantly elevated.',
    dailyGoal: 'Final day of Stage 3. Push complexity of movement but maintain strict no-contact rule.',
    allowed: [
      { activity: 'Running', detail: '20-25 minutes including direction changes and moderate acceleration.' },
      { activity: 'Complex sport drills', detail: 'Multi-player passing, controlled shooting, position-specific patterns.' },
      { activity: 'Resistance training — upper body', detail: 'Light weights only, controlled movements. No maximal effort.' },
      { activity: 'Cognitive load test', detail: 'Check cognitive speed before moving to Stage 4.', interactive: 'cognitive' },
      { activity: 'Reaction time test', detail: 'Daily cognitive check.', interactive: 'reaction' },
    ],
    restricted: ['No contact whatsoever', 'No collision drills', 'No heading', 'No maximal sprint efforts'],
    warningSign: 'If symptom-free at end of today you are ready for Stage 4 tomorrow.',
    insight: 'You are past the halfway point. Over 50% of neurometabolic function is restored.',
  },
  10: {
    stage: 4, stageName: 'Non-Contact Training', brainRecoveryPct: 58,
    cellularProcess: 'Significant neurometabolic recovery underway. Energy systems approaching 60% of baseline. Axonal integrity largely restored. Brain can now tolerate higher cognitive and physical load.',
    dailyGoal: 'Return to full team training environment — but zero contact.',
    allowed: [
      { activity: 'Full team training — no contact', detail: 'Train with teammates at normal intensity. Step out of any contact drills.' },
      { activity: 'High intensity running', detail: 'Sprints, intervals, shuttle runs — push your cardiovascular system.' },
      { activity: 'Weight training', detail: 'Progressive resistance. Avoid heavy neck loading.' },
      { activity: 'Cognitive load test', detail: 'Track cognitive recovery as physical load increases.', interactive: 'cognitive' },
      { activity: 'Reaction time test', detail: 'Daily cognitive check.', interactive: 'reaction' },
    ],
    restricted: ['No contact or tackling', 'No collision drills', 'No heading', 'No match play'],
    warningSign: 'Returning to team environment brings pressure to make contact. Stick to the protocol.',
    insight: 'Your brain at 58% recovery cannot withstand a second impact — second impact syndrome risk remains real.',
  },
  11: {
    stage: 4, stageName: 'Non-Contact Training', brainRecoveryPct: 63,
    cellularProcess: 'Neural pathway efficiency approaching 65%. Neurotransmitter levels largely normalised. Cognitive function significantly recovered.',
    dailyGoal: 'Match pre-injury training intensity in all non-contact areas.',
    allowed: [
      { activity: 'Full training drills', detail: 'Participate in all drills that do not involve physical contact.' },
      { activity: 'Tactical training', detail: 'Team formations, set pieces, tactical movements — fully participate.' },
      { activity: 'Full gym session', detail: 'Normal weight training. Avoid neck loading exercises.' },
      { activity: 'Cognitive load test', detail: 'Daily cognitive check.', interactive: 'cognitive' },
      { activity: 'Reaction time test', detail: 'Daily cognitive check.', interactive: 'reaction' },
    ],
    restricted: ['No tackling', 'No physical contests', 'No heading', 'No match simulation with contact'],
    warningSign: 'Cognitive fatigue during training means reduce load.',
    insight: 'At 63% you are capable of playing. But capability is not readiness.',
  },
  12: {
    stage: 4, stageName: 'Non-Contact Training', brainRecoveryPct: 67,
    cellularProcess: 'Myelin sheath repair over 70% complete. Energy metabolism at approximately two-thirds of pre-injury baseline.',
    dailyGoal: 'Sustained high-intensity non-contact training.',
    allowed: [
      { activity: 'High intensity interval training', detail: 'Full HIIT session. Your cardiovascular system can handle it.' },
      { activity: 'Technical skill work at full speed', detail: 'Ball skills, footwork, positional drills at match pace.' },
      { activity: 'Full gym session', detail: 'All exercises except direct neck loading.' },
      { activity: 'Cognitive load test', detail: 'Daily cognitive check.', interactive: 'cognitive' },
      { activity: 'Reaction time test', detail: 'Daily cognitive check.', interactive: 'reaction' },
    ],
    restricted: ['No contact', 'No heading', 'No match play'],
    warningSign: 'Headache during high-intensity exercise means reduce load and reassess.',
    insight: 'Three more days of non-contact training. This discipline separates full recoveries from persistent symptoms.',
  },
  13: {
    stage: 4, stageName: 'Non-Contact Training', brainRecoveryPct: 72,
    cellularProcess: 'Axonal repair approximately 75% complete. Remaining vulnerable regions in deeper white matter tracts.',
    dailyGoal: 'Push training intensity to its absolute limit within the no-contact rule.',
    allowed: [
      { activity: 'Match-intensity training', detail: 'Every drill at full match pace — except contact.' },
      { activity: 'Plyometrics', detail: 'Explosive jumps, bounds, direction changes at full speed.' },
      { activity: 'Full team session', detail: 'Lead drills, play your position — step out only when contact unavoidable.' },
      { activity: 'Cognitive load test', detail: 'Daily cognitive check.', interactive: 'cognitive' },
      { activity: 'Reaction time test', detail: 'Daily cognitive check.', interactive: 'reaction' },
    ],
    restricted: ['No contact or tackling', 'No heading', 'No match play'],
    warningSign: 'Any symptom at this stage requires immediate medical review.',
    insight: 'You are doing everything at match pace except making contact. You are 72% recovered and 8 days from clearance.',
  },
  14: {
    stage: 4, stageName: 'Non-Contact Training', brainRecoveryPct: 76,
    cellularProcess: 'White matter tract repair at approximately 80%. Brain approaching the threshold where it can safely absorb contact forces.',
    dailyGoal: 'Final non-contact session. Confirm symptom-free before progressing to Stage 5.',
    allowed: [
      { activity: 'All non-contact training', detail: 'Full participation at match intensity.' },
      { activity: 'Pre-contact preparation drills', detail: 'Controlled technique without impact — if supervised by a coach.' },
      { activity: 'Cognitive load test', detail: 'Final cognitive check before contact phase.', interactive: 'cognitive' },
      { activity: 'Reaction time test', detail: 'Daily cognitive check.', interactive: 'reaction' },
    ],
    restricted: ['No full contact', 'No heading', 'No match play'],
    warningSign: 'Must be completely symptom-free at rest and during exercise to proceed tomorrow.',
    insight: 'Day 14 symptom-free. Tomorrow is a significant milestone.',
  },
  15: {
    stage: 5, stageName: 'Full Contact Practice', brainRecoveryPct: 80,
    cellularProcess: 'Brain architecture stable enough to absorb controlled contact forces. Axonal repair 85% complete. Energy metabolism at 80% of baseline.',
    dailyGoal: 'Reintroduce controlled contact in a supervised training environment.',
    allowed: [
      { activity: 'Controlled contact training', detail: 'Tackle practice at reduced intensity. Inform your coach this is your first contact session.' },
      { activity: 'Full team training with contact', detail: 'Participate fully but communicate if anything feels off.' },
      { activity: 'Contested marking or ruck work', detail: 'Physical contests at moderate intensity.' },
      { activity: 'Cognitive load test', detail: 'Daily cognitive check.', interactive: 'cognitive' },
      { activity: 'Reaction time test', detail: 'Daily cognitive check.', interactive: 'reaction' },
    ],
    restricted: ['No match play until medical clearance', 'No heading in training', 'Do not return without informing coach of concussion history'],
    warningSign: 'Any headache or dizziness during contact drills — stop immediately and return to Stage 4.',
    insight: 'Tell your coach and teammates this is your first contact session post-concussion. Transparency protects you.',
  },
  16: {
    stage: 5, stageName: 'Full Contact Practice', brainRecoveryPct: 84,
    cellularProcess: 'Contact forces absorbed without triggering symptom cascade. Deep white matter repair ongoing.',
    dailyGoal: 'Progress contact intensity if yesterday was completely symptom-free.',
    allowed: [
      { activity: 'Full contact training at normal intensity', detail: 'If Day 15 was symptom-free, train at normal match-preparation intensity.' },
      { activity: 'Match simulation drills', detail: 'Contested situations, game scenarios with full physical intensity.' },
      { activity: 'Heading practice', detail: 'Can reintroduce controlled heading if sport requires it and symptom-free.' },
      { activity: 'Cognitive load test', detail: 'Daily cognitive check.', interactive: 'cognitive' },
    ],
    restricted: ['No match play until medical clearance', 'Do not hide any symptoms from coach or medical staff'],
    warningSign: 'Symptoms on Day 16 after contact means return to Stage 4 and seek medical review.',
    insight: 'At 84% you are very close to full health. The remaining 16% continues repairing for weeks after return.',
  },
  17: {
    stage: 5, stageName: 'Full Contact Practice', brainRecoveryPct: 87,
    cellularProcess: 'Axonal repair approaching 90% completion. Energy metabolism at 87% of pre-injury baseline.',
    dailyGoal: 'Full training at match intensity including all contact situations.',
    allowed: [
      { activity: 'Full contact training', detail: 'All drills at match intensity. No restrictions on contact type.' },
      { activity: 'Contested situations', detail: 'Marking contests, tackles, physical duels — full intensity.' },
      { activity: 'Heading', detail: 'If sport requires it and completely symptom-free.' },
      { activity: 'Cognitive load test', detail: 'Daily cognitive check.', interactive: 'cognitive' },
    ],
    restricted: ['No match play until Day 21 medical clearance'],
    warningSign: 'Four days from return. Do not take risks that could set you back.',
    insight: 'Players who complete every day of the protocol come back at 100%. Those who rush come back at 80%.',
  },
  18: {
    stage: 5, stageName: 'Full Contact Practice', brainRecoveryPct: 90,
    cellularProcess: 'Over 90% neurometabolic recovery. Brain is functionally restored for sporting activity.',
    dailyGoal: 'Simulate match conditions as closely as possible in training.',
    allowed: [
      { activity: 'Match simulation', detail: 'Intra-squad games, practice matches — full intensity, full contact.' },
      { activity: 'All training activities', detail: 'No restrictions in the training environment.' },
      { activity: 'Cognitive load test', detail: 'Daily cognitive check.', interactive: 'cognitive' },
    ],
    restricted: ['No official match play until medical clearance on Day 21'],
    warningSign: 'Three days from clearance — any symptom now requires medical review.',
    insight: 'You are 90% recovered. The final 10% continues for weeks after return. That is normal and expected.',
  },
  19: {
    stage: 5, stageName: 'Full Contact Practice', brainRecoveryPct: 93,
    cellularProcess: 'Neurometabolic function at 93%. Brain performing at near-normal levels under physical load.',
    dailyGoal: 'Final preparation before medical clearance. Train with confidence.',
    allowed: [
      { activity: 'Full unrestricted training', detail: 'Everything except official match play.' },
      { activity: 'Cognitive load test', detail: 'Daily cognitive check.', interactive: 'cognitive' },
    ],
    restricted: ['No official competition until medical clearance'],
    warningSign: 'Two days from clearance. Do not take unnecessary risks.',
    insight: 'Almost there. Most players do not make it this far without cutting corners. You have done it properly.',
  },
  20: {
    stage: 5, stageName: 'Full Contact Practice', brainRecoveryPct: 96,
    cellularProcess: 'All primary axonal repair complete. White matter integrity restored. Brain ready for full competition following medical clearance.',
    dailyGoal: 'Final training day before medical clearance assessment tomorrow.',
    allowed: [
      { activity: 'All training activities', detail: 'Train as if tomorrow is match day.' },
      { activity: 'Cognitive load test', detail: 'Final cognitive check before clearance.', interactive: 'cognitive' },
    ],
    restricted: ['No official match play until after medical clearance on Day 21'],
    warningSign: 'Any symptom today delays clearance — seek medical review immediately.',
    insight: 'One day until clearance. You have protected your brain for 20 days. Tomorrow you return stronger.',
  },
  21: {
    stage: 6, stageName: 'Return to Play', brainRecoveryPct: 100,
    cellularProcess: 'Full neurometabolic recovery. Energy systems restored to baseline. Axonal integrity complete. Brain fully prepared for competitive sport.',
    dailyGoal: 'Obtain medical clearance and return to full competition.',
    allowed: [
      { activity: 'Medical clearance assessment', detail: 'See your GP or sports medicine doctor for formal sign-off before returning.' },
      { activity: 'Full return to competition', detail: 'Once medically cleared, you can play without restriction.' },
      { activity: 'All sport activities', detail: 'No limitations. You are fully recovered.' },
    ],
    restricted: ['Do not return without medical clearance — this is a legal and safety requirement', "Don't play through symptoms that emerge post-return", "Don't hide future concussions from coaching staff"],
    warningSign: 'If symptoms emerge after return to play, stop immediately and restart the protocol.',
    insight: 'You did it. 21 days. Every player who completes the full protocol comes back at 100%. Welcome back.',
  },
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SECTION 1 — DATE & DAY TRACKING STATE
// injuryDate:      the date the user entered (stored in localStorage)
// daysSinceInjury: calculated from injuryDate to today
// selectedDay:     which day the user is currently previewing on the timeline
//                  null = viewing their actual current day
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const injuryDate       = ref('')
const daysSinceInjury  = ref<number | null>(null)
const selectedDay      = ref<number | null>(null)

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SECTION 2 — CALENDAR STATE
// Controls the custom calendar dropdown for date selection
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const showCalendar    = ref(false)
const today           = new Date()
const calendarMonth   = ref(today.getMonth())
const calendarYear    = ref(today.getFullYear())
const monthNames      = ['January','February','March','April','May','June','July','August','September','October','November','December']

const calendarDaysInMonth = computed(() => new Date(calendarYear.value, calendarMonth.value + 1, 0).getDate())
const calendarStartDay    = computed(() => new Date(calendarYear.value, calendarMonth.value, 1).getDay())
const isNextMonthDisabled = computed(() => calendarYear.value === today.getFullYear() && calendarMonth.value >= today.getMonth())

function prevMonth() {
  if (calendarMonth.value === 0) { calendarMonth.value = 11; calendarYear.value-- }
  else calendarMonth.value--
}

function nextMonth() {
  if (calendarMonth.value === 11) { calendarMonth.value = 0; calendarYear.value++ }
  else calendarMonth.value++
}

function isFutureDay(day: number) {
  return new Date(calendarYear.value, calendarMonth.value, day) > today
}

function isToday(day: number) {
  return day === today.getDate() && calendarMonth.value === today.getMonth() && calendarYear.value === today.getFullYear()
}

function isSelectedCalDay(day: number) {
  if (!injuryDate.value) return false
  const d = new Date(injuryDate.value)
  return day === d.getDate() && calendarMonth.value === d.getMonth() && calendarYear.value === d.getFullYear()
}

function selectCalendarDate(day: number) {
  const d    = new Date(calendarYear.value, calendarMonth.value, day)
  const yyyy = d.getFullYear()
  const mm   = String(d.getMonth() + 1).padStart(2, '0')
  const dd   = String(d.getDate()).padStart(2, '0')
  injuryDate.value   = `${yyyy}-${mm}-${dd}`
  showCalendar.value = false
}

function formatDisplayDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SECTION 3 — SLEEP CHECK-IN
// User reports sleep quality each day. If 3 consecutive poor nights are
// detected, a warning is shown advising them to mention it to their GP.
// Data is saved to localStorage under key 'concovery_sleep'
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const sleepQuality   = ref<'well' | 'okay' | 'poorly' | null>(null)
const sleepHistory   = ref<{ date: string; quality: string; day: number }[]>([])
const sleepSubmitted = ref(false)

const consecutivePoorSleep = computed(() => {
  if (sleepHistory.value.length < 3) return false
  const last3 = sleepHistory.value.slice(-3)
  return last3.every(s => s.quality === 'poorly')
})

function submitSleep(quality: 'well' | 'okay' | 'poorly') {
  sleepQuality.value   = quality
  sleepSubmitted.value = true
  const entry = { date: new Date().toISOString().split('T')[0], quality, day: daysSinceInjury.value || 1 }
  const existing = sleepHistory.value.findIndex(s => s.date === entry.date)
  if (existing >= 0) { sleepHistory.value[existing] = entry }
  else               { sleepHistory.value.push(entry) }
  localStorage.setItem('concovery_sleep', JSON.stringify(sleepHistory.value))
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SECTION 4 — SYMPTOM CHECK (CONVERSATIONAL ONE-AT-A-TIME)
// symptomStep:     0=not started, 1/2/3=question index, 4=result
// symptomAnswers:  array of true/false/null for each of the 3 questions
// If any answer is true, the check stops immediately and shows a warning.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const symptomStep      = ref(0)
const symptomAnswers   = ref<(boolean | null)[]>([null, null, null])
const symptomQuestions = ['Do you have a headache?', 'Any dizziness or balance issues?', 'Difficulty concentrating?']
const showSymptomSection = ref(false)

function startSymptomCheck() {
  showSymptomSection.value = true
  symptomStep.value        = 1
}

function answerSymptom(answer: boolean) {
  const idx = symptomStep.value - 1
  symptomAnswers.value[idx] = answer
  if (answer === true)              { symptomStep.value = 4 }       // stop immediately on yes
  else if (symptomStep.value < 3)   { symptomStep.value++ }         // next question
  else                               { symptomStep.value = 4 }       // all answered
}

function resetSymptoms() {
  symptomStep.value    = 1
  symptomAnswers.value = [null, null, null]
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SECTION 5 — ACTIVITY CHECKLIST
// Allows users to tick off non-interactive allowed activities.
// Saved to localStorage under key 'concovery_activities'.
// Key format: `${dayNumber}-${activityName}` e.g. "7-Light jogging"
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const checkedActivities = ref<Record<string, boolean>>({})

function toggleActivity(key: string) {
  checkedActivities.value[key] = !checkedActivities.value[key]
  localStorage.setItem('concovery_activities', JSON.stringify(checkedActivities.value))
}

function isActivityChecked(key: string) {
  return checkedActivities.value[key] || false
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SECTION 6 — BREATHING EXERCISE (4-7-8 technique)
// Guides user through 3 cycles of: inhale 4s → hold 7s → exhale 8s
// Clinically recommended for concussion recovery to reduce cognitive load.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const breathingActive   = ref(false)
const breathingPhase    = ref<'inhale' | 'hold' | 'exhale' | 'idle'>('idle')
const breathingCount    = ref(0)
const breathingCycles   = ref(0)
const breathingProgress = ref(0)
let breathingInterval: ReturnType<typeof setInterval> | null = null

function startBreathing() {
  breathingActive.value = true
  breathingCycles.value = 0
  runBreathingCycle()
}

function runBreathingCycle() {
  // Phase 1: Inhale for 4 seconds
  breathingPhase.value    = 'inhale'
  breathingCount.value    = 4
  breathingProgress.value = 0
  let elapsed = 0
  breathingInterval = setInterval(() => {
    elapsed++
    breathingProgress.value = (elapsed / 4) * 100
    breathingCount.value    = 4 - elapsed
    if (elapsed >= 4) {
      clearInterval(breathingInterval!)
      // Phase 2: Hold for 7 seconds
      breathingPhase.value = 'hold'; breathingCount.value = 7; breathingProgress.value = 0; elapsed = 0
      breathingInterval = setInterval(() => {
        elapsed++
        breathingProgress.value = (elapsed / 7) * 100
        breathingCount.value    = 7 - elapsed
        if (elapsed >= 7) {
          clearInterval(breathingInterval!)
          // Phase 3: Exhale for 8 seconds
          breathingPhase.value = 'exhale'; breathingCount.value = 8; breathingProgress.value = 0; elapsed = 0
          breathingInterval = setInterval(() => {
            elapsed++
            breathingProgress.value = (elapsed / 8) * 100
            breathingCount.value    = 8 - elapsed
            if (elapsed >= 8) {
              clearInterval(breathingInterval!)
              breathingCycles.value++
              if (breathingCycles.value < 3) { runBreathingCycle() }  // next cycle
              else { breathingPhase.value = 'idle'; breathingActive.value = false; breathingProgress.value = 100 }
            }
          }, 1000)
        }
      }, 1000)
    }
  }, 1000)
}

function stopBreathing() {
  if (breathingInterval) clearInterval(breathingInterval)
  breathingActive.value   = false
  breathingPhase.value    = 'idle'
  breathingProgress.value = 0
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SECTION 7 — COGNITIVE LOAD TEST (Digit Span)
// Based on the SCAT5 digit span assessment used in clinical concussion testing.
// A sequence of digits flashes one at a time. User must recall them in order.
// Sequence length increases as recovery progresses (3 digits on Day 4 → 7 on Day 21).
// Results saved to localStorage under key 'concovery_cognitive'.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const cognitivePhase        = ref<'idle' | 'showing' | 'input' | 'result'>('idle')
const cognitiveSequence     = ref<number[]>([])
const cognitiveCurrentIndex = ref(0)
const cognitiveInput        = ref<number[]>([])
const cognitiveResult       = ref<'correct' | 'incorrect' | null>(null)
const cognitiveHistory      = ref<{ day: number; date: string; length: number; correct: boolean }[]>([])
const cognitiveShowDigit    = ref<number | null>(null)
let cognitiveTimeout: ReturnType<typeof setTimeout> | null = null

// Digit span length increases with recovery progress
function getDigitSpanLength(day: number): number {
  if (day <= 6)  return 3
  if (day <= 9)  return 4
  if (day <= 14) return 5
  if (day <= 20) return 6
  return 7
}

function startCognitiveTest() {
  const length             = getDigitSpanLength(viewingDay.value || 1)
  cognitiveSequence.value  = Array.from({ length }, () => Math.floor(Math.random() * 9) + 1)
  cognitiveInput.value     = []
  cognitiveCurrentIndex.value = 0
  cognitiveResult.value    = null
  cognitivePhase.value     = 'showing'
  cognitiveShowDigit.value = null
  showNextDigit()
}

function showNextDigit() {
  if (cognitiveCurrentIndex.value >= cognitiveSequence.value.length) {
    cognitiveShowDigit.value = null
    cognitivePhase.value     = 'input'
    return
  }
  cognitiveShowDigit.value = null
  cognitiveTimeout = setTimeout(() => {
    cognitiveShowDigit.value = cognitiveSequence.value[cognitiveCurrentIndex.value]
    cognitiveTimeout = setTimeout(() => {
      cognitiveShowDigit.value = null
      cognitiveCurrentIndex.value++
      cognitiveTimeout = setTimeout(showNextDigit, 400)
    }, 800)
  }, 400)
}

function tapCognitiveDigit(digit: number) {
  if (cognitivePhase.value !== 'input') return
  cognitiveInput.value.push(digit)
  if (cognitiveInput.value.length === cognitiveSequence.value.length) {
    const correct        = cognitiveInput.value.every((d, i) => d === cognitiveSequence.value[i])
    cognitiveResult.value = correct ? 'correct' : 'incorrect'
    cognitivePhase.value  = 'result'
    const entry = { day: daysSinceInjury.value || 1, date: new Date().toISOString().split('T')[0], length: cognitiveSequence.value.length, correct }
    cognitiveHistory.value.push(entry)
    localStorage.setItem('concovery_cognitive', JSON.stringify(cognitiveHistory.value))
  }
}

function deleteCognitiveInput() { cognitiveInput.value.pop() }

function resetCognitive() {
  cognitivePhase.value        = 'idle'
  cognitiveSequence.value     = []
  cognitiveInput.value        = []
  cognitiveResult.value       = null
  cognitiveShowDigit.value    = null
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SECTION 8 — REACTION TIME TEST
// 5 rounds. A green circle appears after a random delay (1.5-3.5s).
// User taps as fast as possible. Average time is calculated and interpreted.
// Results saved to localStorage under key 'concovery_reaction'.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const reactionPhase     = ref<'idle' | 'waiting' | 'ready' | 'result'>('idle')
const reactionTimes     = ref<number[]>([])
const reactionStartTime = ref(0)
const reactionResult    = ref(0)
const reactionRound     = ref(0)
let reactionTimeout: ReturnType<typeof setTimeout> | null = null

function startReactionTest() {
  reactionPhase.value = 'waiting'
  reactionTimes.value = []
  reactionRound.value = 1
  scheduleReaction()
}

function scheduleReaction() {
  const delay = 1500 + Math.random() * 2000   // random delay 1.5s - 3.5s
  reactionTimeout = setTimeout(() => {
    reactionPhase.value     = 'ready'
    reactionStartTime.value = Date.now()
  }, delay)
}

function tapReaction() {
  if (reactionPhase.value === 'waiting') {
    // Tapped too early — reset this round
    if (reactionTimeout) clearTimeout(reactionTimeout)
    scheduleReaction()
    return
  }
  if (reactionPhase.value === 'ready') {
    const time = Date.now() - reactionStartTime.value
    reactionTimes.value.push(time)
    if (reactionRound.value < 5) {
      reactionRound.value++
      reactionPhase.value = 'waiting'
      scheduleReaction()
    } else {
      // All 5 rounds done — calculate average
      reactionResult.value = Math.round(reactionTimes.value.reduce((a, b) => a + b, 0) / reactionTimes.value.length)
      reactionPhase.value  = 'result'
      const saved = JSON.parse(localStorage.getItem('concovery_reaction') || '[]')
      saved.push({ day: daysSinceInjury.value, avg: reactionResult.value, date: new Date().toISOString() })
      localStorage.setItem('concovery_reaction', JSON.stringify(saved))
    }
  }
}

function resetReaction() {
  reactionPhase.value = 'idle'
  reactionTimes.value = []
  reactionRound.value = 0
}

// Interpret reaction time result
function getReactionLabel(ms: number) {
  if (ms < 250) return { label: 'Excellent — brain speed fully recovered',      color: '#1B7C3D' }
  if (ms < 350) return { label: 'Good — cognitive recovery progressing well',   color: '#1A4FAB' }
  if (ms < 450) return { label: 'Fair — continue recovery protocol',            color: '#E65100' }
  return             { label: 'Slow — brain still recovering, do not rush return', color: '#C62828' }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SECTION 9 — RECOVERY JOURNAL
// User writes a daily entry about how they feel.
// Saved to localStorage under key 'concovery_journal'.
// Can be downloaded as a PDF to show GP at clearance appointment.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const journalEntry       = ref('')
const journalEntries     = ref<{ day: number; date: string; text: string }[]>([])
const journalSaved       = ref(false)
const showJournalHistory = ref(false)

const todayJournalEntry = computed(() => {
  const todayStr = new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })
  return journalEntries.value.find(e => e.date === todayStr)
})

function saveJournalEntry() {
  if (!journalEntry.value.trim()) return
  const entry = {
    day:  daysSinceInjury.value || 1,
    date: new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' }),
    text: journalEntry.value.trim(),
  }
  const existing = journalEntries.value.findIndex(e => e.date === entry.date)
  if (existing >= 0) { journalEntries.value[existing] = entry }
  else               { journalEntries.value.push(entry) }
  localStorage.setItem('concovery_journal', JSON.stringify(journalEntries.value))
  journalSaved.value = true
  setTimeout(() => { journalSaved.value = false }, 2000)
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SECTION 10 — NECK EXERCISES WITH CAMERA + STREAK TRACKING
//
// exerciseDefinitions: the 3 exercises with full metadata
// exerciseState:       per-exercise runtime state (phase, reps, sets, timer)
//   phase: 'idle'     = ready to start next rep
//   phase: 'holding'  = user is holding the position, timer counting down
//   phase: 'resting'  = rest between sets, timer counting down
//   phase: 'complete' = all sets done for today
//
// exerciseStreak:      how many consecutive days all 3 exercises were completed
// weeklyCompletion:    array of 7 booleans for the last 7 days (for the grid)
//
// Camera: uses browser MediaDevices API (front camera only, nothing recorded)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Per-exercise runtime state (one entry per exercise in exerciseDefinitions)
const exerciseState = ref(exerciseDefinitions.map(() => ({
  phase:              'idle' as 'idle' | 'holding' | 'resting' | 'complete',
  currentSet:         1,
  currentRep:         0,
  timer:              0,
  totalRepsCompleted: 0,
})))

// Camera state (one entry per exercise card)
const videoRefs      = ref<(HTMLVideoElement | null)[]>([null, null, null])
const cameraActive   = ref<boolean[]>([false, false, false])
const cameraStreams   = ref<(MediaStream | null)[]>([null, null, null])
const positionFeedback = ref<string[]>(['', '', ''])

// Exercise interval references (for cleanup on unmount)
let exerciseIntervals: (ReturnType<typeof setInterval> | null)[] = [null, null, null]

// Streak and weekly completion grid
const exerciseStreak    = ref(0)
const weeklyCompletion  = ref<boolean[]>([false, false, false, false, false, false, false])

function loadExerciseHistory() {
  const saved = localStorage.getItem('concovery_exercise_history')
  if (!saved) return
  const history: { date: string; completed: boolean }[] = JSON.parse(saved)

  // Calculate consecutive day streak
  let streak = 0
  for (let i = 0; i < 30; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().split('T')[0]
    const entry   = history.find(h => h.date === dateStr)
    if (entry?.completed) { streak++ }
    else if (i > 0)       { break }   // streak broken
  }
  exerciseStreak.value = streak

  // Fill last 7 days for weekly grid
  for (let i = 0; i < 7; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() - (6 - i))
    const dateStr = d.toISOString().split('T')[0]
    weeklyCompletion.value[i] = history.find(h => h.date === dateStr)?.completed || false
  }
}

function saveExerciseCompletion() {
  const saved   = localStorage.getItem('concovery_exercise_history')
  const history: { date: string; completed: boolean }[] = saved ? JSON.parse(saved) : []
  const todayStr = new Date().toISOString().split('T')[0]
  const existing = history.findIndex(h => h.date === todayStr)
  if (existing >= 0) { history[existing].completed = true }
  else               { history.push({ date: todayStr, completed: true }) }
  localStorage.setItem('concovery_exercise_history', JSON.stringify(history))
  loadExerciseHistory()
}

// True when all 3 exercises are in 'complete' phase
const allExercisesDone = computed(() =>
  exerciseState.value.every(s => s.phase === 'complete')
)

// Instructional text shown in the camera overlay during exercise
function getInstructionalCue(exerciseIdx: number, phase: string, timerPct: number): string {
  const exercise = exerciseDefinitions[exerciseIdx]
  if (phase === 'holding') {
    if (timerPct < 30) return exercise.cue
    if (timerPct < 70) return 'Hold steady — do not move'
    return 'Almost done — keep holding'
  }
  if (phase === 'resting') return 'Rest — breathe normally'
  return 'Position yourself in the frame'
}

// Start a single rep hold for a given exercise card
function startRep(idx: number) {
  const state     = exerciseState.value[idx]
  const def       = exerciseDefinitions[idx]
  state.phase     = 'holding'
  state.timer     = def.holdSeconds
  const totalTime = def.holdSeconds
  if (exerciseIntervals[idx]) clearInterval(exerciseIntervals[idx]!)

  exerciseIntervals[idx] = setInterval(() => {
    state.timer--
    const pct = ((totalTime - state.timer) / totalTime) * 100
    positionFeedback.value[idx] = getInstructionalCue(idx, 'holding', pct)

    if (state.timer <= 0) {
      clearInterval(exerciseIntervals[idx]!)
      state.currentRep++
      state.totalRepsCompleted++

      const setDone    = state.currentRep >= def.reps
      const allSetsDone = setDone && state.currentSet >= def.sets

      if (allSetsDone) {
        // All sets complete for this exercise
        state.phase = 'complete'
        positionFeedback.value[idx] = 'Exercise complete'
        if (allExercisesDone.value) saveExerciseCompletion()
      } else if (setDone) {
        // One set done — rest before next set
        state.phase     = 'resting'
        state.timer     = def.restSeconds
        state.currentRep = 0
        state.currentSet++
        positionFeedback.value[idx] = 'Rest — next set coming up'
        exerciseIntervals[idx] = setInterval(() => {
          state.timer--
          positionFeedback.value[idx] = `Rest — next set in ${state.timer}s`
          if (state.timer <= 0) {
            clearInterval(exerciseIntervals[idx]!)
            state.phase = 'idle'
            positionFeedback.value[idx] = 'Ready for next set'
          }
        }, 1000)
      } else {
        // Rep done — ready for next rep
        state.phase = 'idle'
        positionFeedback.value[idx] = 'Good — tap Start Rep to continue'
      }
    }
  }, 1000)
}

function resetExercise(idx: number) {
  if (exerciseIntervals[idx]) clearInterval(exerciseIntervals[idx]!)
  exerciseState.value[idx] = { phase: 'idle', currentSet: 1, currentRep: 0, timer: 0, totalRepsCompleted: 0 }
  positionFeedback.value[idx] = ''
}

// Camera functions
async function startCamera(idx: number) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: 320, height: 240 } })
    cameraStreams.value[idx]  = stream
    cameraActive.value[idx]   = true
    await new Promise(resolve => setTimeout(resolve, 100))
    const videoEl = videoRefs.value[idx]
    if (videoEl) { videoEl.srcObject = stream; videoEl.play() }
    positionFeedback.value[idx] = 'Camera ready — position yourself in the frame'
  } catch {
    positionFeedback.value[idx] = 'Camera access denied — please allow camera permissions'
  }
}

function stopCamera(idx: number) {
  const stream = cameraStreams.value[idx]
  if (stream) { stream.getTracks().forEach(t => t.stop()); cameraStreams.value[idx] = null }
  cameraActive.value[idx]     = false
  positionFeedback.value[idx] = ''
}

function stopAllCameras() { for (let i = 0; i < 3; i++) stopCamera(i) }

// Progress ring SVG calculation
function getRepRingDasharray(idx: number): string {
  const state = exerciseState.value[idx]
  const def   = exerciseDefinitions[idx]
  if (state.phase === 'complete') return '251.2 251.2'
  if (state.phase === 'holding')  return `${((def.holdSeconds  - state.timer) / def.holdSeconds)  * 251.2} 251.2`
  if (state.phase === 'resting')  return `${((def.restSeconds  - state.timer) / def.restSeconds)  * 251.2} 251.2`
  return '0 251.2'
}

function getRepRingColor(idx: number): string {
  const phase = exerciseState.value[idx].phase
  if (phase === 'complete') return '#1B7C3D'
  if (phase === 'resting')  return '#E65100'
  return '#1A4FAB'
}

function formatTimer(secs: number) { return `0:${String(secs).padStart(2, '0')}` }

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SECTION 11 — EXPANDABLE STAGE TIMELINE
// expandedStage: which of the 6 stage cards is currently open (null = all closed)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const expandedStage = ref<number | null>(null)

function toggleStage(stageId: number) {
  expandedStage.value = expandedStage.value === stageId ? null : stageId
}

// Get all days that belong to a given stage (for expanded day cards)
function getDaysForStage(stageId: number) {
  return Object.entries(dayData)
    .filter(([, d]) => d.stage === stageId)
    .map(([day, d]) => ({ day: parseInt(day), ...d }))
}

// Click a day card inside an expanded stage — scroll to top and show that day
function jumpToDay(day: number) {
  selectedDay.value = day
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SECTION 12 — LIFECYCLE HOOKS
// onMounted: load all saved localStorage data when the page loads
// onUnmounted: clear all timers and stop cameras when user leaves the page
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

onMounted(() => {
  // Restore injury date from previous session
  const savedDate = localStorage.getItem('concovery_injury_date')
  if (savedDate) { injuryDate.value = savedDate; calculateDays(savedDate) }

  // Restore activity checklist state
  const savedActivities = localStorage.getItem('concovery_activities')
  if (savedActivities) checkedActivities.value = JSON.parse(savedActivities)

  // Restore sleep history and check if already submitted today
  const savedSleep = localStorage.getItem('concovery_sleep')
  if (savedSleep) {
    sleepHistory.value = JSON.parse(savedSleep)
    const todayStr     = new Date().toISOString().split('T')[0]
    const todaySleep   = sleepHistory.value.find(s => s.date === todayStr)
    if (todaySleep) { sleepQuality.value = todaySleep.quality as any; sleepSubmitted.value = true }
  }

  // Restore journal entries
  const savedJournal = localStorage.getItem('concovery_journal')
  if (savedJournal) journalEntries.value = JSON.parse(savedJournal)

  // Restore cognitive test history
  const savedCognitive = localStorage.getItem('concovery_cognitive')
  if (savedCognitive) cognitiveHistory.value = JSON.parse(savedCognitive)

  // Load exercise streak and weekly grid
  loadExerciseHistory()
})

onUnmounted(() => {
  // Stop all cameras
  stopAllCameras()
  // Clear all exercise timers
  exerciseIntervals.forEach(i => { if (i) clearInterval(i) })
  // Clear breathing timer
  if (breathingInterval) clearInterval(breathingInterval)
  // Clear reaction timeout
  if (reactionTimeout) clearTimeout(reactionTimeout)
  // Clear cognitive timeout
  if (cognitiveTimeout) clearTimeout(cognitiveTimeout)
})

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SECTION 13 — COMPUTED PROPERTIES
// These auto-update whenever their dependencies change
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Which of the 6 AIS stages the user is currently in
const currentStage = computed(() => {
  if (!daysSinceInjury.value) return null
  const d = daysSinceInjury.value
  if (d <= 3)  return 1
  if (d <= 6)  return 2
  if (d <= 9)  return 3
  if (d <= 14) return 4
  if (d <= 20) return 5
  return 6
})

// Which day is currently displayed in the brain status section
// If user clicked a day on the timeline → show that day
// Otherwise → show their actual current day (capped at 21)
const viewingDay = computed(() => {
  if (selectedDay.value !== null)   return selectedDay.value
  if (daysSinceInjury.value)        return Math.min(daysSinceInjury.value, 21)
  return null
})

// Data for the currently viewed day
const viewingDayData = computed(() => {
  if (!viewingDay.value) return null
  return dayData[viewingDay.value]
})

// True when user is viewing their actual current day (not previewing another)
const isViewingToday = computed(() => {
  if (!daysSinceInjury.value || selectedDay.value === null) return true
  return selectedDay.value === Math.min(daysSinceInjury.value, 21)
})

// How many days until the user can return to play
const daysUntilReturn = computed(() => {
  if (!daysSinceInjury.value) return null
  return Math.max(0, 21 - daysSinceInjury.value)
})

// Progress percentage for the timeline bar (0-100)
const progressPct = computed(() => {
  if (!daysSinceInjury.value) return 0
  return Math.min((daysSinceInjury.value / 21) * 100, 100)
})

// True if any symptom check answer was yes
const hasSymptoms = computed(() => symptomAnswers.value.some(a => a === true))

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SECTION 14 — CORE METHODS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Calculate how many days since the injury date and save to localStorage
function calculateDays(dateStr: string) {
  const injury   = new Date(dateStr)
  const now      = new Date()
  const diffDays = Math.ceil(Math.abs(now.getTime() - injury.getTime()) / (1000 * 60 * 60 * 24))
  daysSinceInjury.value    = diffDays
  selectedDay.value        = null        // reset to today view
  symptomStep.value        = 0           // reset symptom check
  symptomAnswers.value     = [null, null, null]
  showSymptomSection.value = false
  localStorage.setItem('concovery_injury_date', dateStr)
}

// Re-run calculateDays whenever the injury date changes
watch(injuryDate, (val) => { if (val) calculateDays(val) })

// Get status of a day node on the 21-day timeline
function getDayStatus(day: number): 'past' | 'today' | 'future' {
  if (!daysSinceInjury.value) return 'future'
  if (day < daysSinceInjury.value)                    return 'past'
  if (day === Math.min(daysSinceInjury.value, 21))    return 'today'
  return 'future'
}

// Get status of a stage card (complete / current / upcoming)
function getStageStatus(stageId: number): 'complete' | 'current' | 'upcoming' {
  if (!currentStage.value)             return 'upcoming'
  if (stageId < currentStage.value)    return 'complete'
  if (stageId === currentStage.value)  return 'current'
  return 'upcoming'
}
</script>

<template>
  <div class="bg-white min-h-screen">

    <!-- ══ HERO ══════════════════════════════════════════════════════════════ -->
    <section style="background:#0A1628;" class="text-white">
      <div class="max-w-[1200px] mx-auto px-6 py-20">
        <div class="inline-flex items-center border border-white/20 rounded-full px-4 py-1.5 mb-6">
          <span class="text-white/50 text-xs font-medium tracking-widest uppercase">Your Recovery Journey</span>
        </div>
        <h1 class="font-black text-white leading-none mb-6" style="font-size:clamp(40px,8vw,96px);letter-spacing:-0.03em;">
          Let's find out<br>where you are.
        </h1>
        <p class="text-white/60 text-xl font-light max-w-lg leading-relaxed">
          Tell us when it happened and we will guide you through every day of your recovery.
        </p>
      </div>
    </section>

    <!-- ══ DATE INPUT ════════════════════════════════════════════════════════ -->
    <section class="bg-white py-20">
      <div class="max-w-[1200px] mx-auto px-6">
        <div class="max-w-2xl mx-auto text-center">
          <h2 class="text-3xl font-bold text-[#1A1A1A] mb-8">When did you get your concussion?</h2>

          <div class="relative inline-block mb-10">
            <button @click="showCalendar = !showCalendar" class="inline-flex items-center gap-3 border-2 border-[#1A4FAB] rounded-xl px-6 py-4 bg-white hover:bg-[#F5F8FF] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A4FAB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              <span class="text-xl font-semibold text-[#1A1A1A]">{{ injuryDate ? formatDisplayDate(injuryDate) : 'Select a date' }}</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1A4FAB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </button>

            <div v-if="showCalendar" class="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white rounded-2xl shadow-2xl border border-[#EBEBEB] p-4 z-50 w-80">
              <div class="flex items-center justify-between mb-4">
                <button @click="prevMonth" class="p-2 hover:bg-[#F5F8FF] rounded-lg transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                </button>
                <span class="font-bold text-[#1A1A1A]">{{ monthNames[calendarMonth] }} {{ calendarYear }}</span>
                <button @click="nextMonth" :disabled="isNextMonthDisabled" class="p-2 hover:bg-[#F5F8FF] rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                </button>
              </div>
              <div class="grid grid-cols-7 mb-2">
                <div v-for="d in ['Su','Mo','Tu','We','Th','Fr','Sa']" :key="d" class="text-center text-xs font-semibold text-[#5A7A9B] py-1">{{ d }}</div>
              </div>
              <div class="grid grid-cols-7 gap-1">
                <div v-for="blank in calendarStartDay" :key="'b'+blank" />
                <button
                  v-for="day in calendarDaysInMonth" :key="day"
                  @click="selectCalendarDate(day)"
                  :disabled="isFutureDay(day)"
                  class="aspect-square rounded-lg text-sm font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  :class="isSelectedCalDay(day) ? 'bg-[#1A4FAB] text-white shadow-md' : isToday(day) ? 'border-2 border-[#1A4FAB] text-[#1A4FAB]' : 'hover:bg-[#F5F8FF] text-[#1A1A1A]'"
                >{{ day }}</button>
              </div>
            </div>
          </div>

          <Transition name="fade-scale">
            <div v-if="daysSinceInjury !== null" class="bg-white rounded-2xl border border-[#EBEBEB] shadow-lg p-8">
              <div class="text-6xl font-black text-[#1A4FAB] mb-2" style="letter-spacing:-0.03em;">You are on Day {{ daysSinceInjury }}</div>
              <p class="text-lg text-[#5A7A9B] mb-6">of your 21-day recovery</p>

              <!-- 21-day interactive timeline -->
              <div class="mb-6">
                <div class="flex justify-between text-xs text-[#5A7A9B] mb-3 px-1">
                  <span>Day 1</span><span>Day 7</span><span>Day 14</span><span>Day 21</span>
                </div>
                <div class="flex gap-0.5 justify-between mb-3">
                  <button
                    v-for="day in 21" :key="day"
                    @click="selectedDay = day"
                    class="flex-1 flex flex-col items-center gap-1 group"
                    :title="`Day ${day} — ${dayData[day]?.stageName}`"
                  >
                    <div
                      class="w-full rounded-full transition-all duration-200"
                      :style="{
                        height: selectedDay === day ? '12px' : '6px',
                        background: getDayStatus(day) === 'past' ? '#1B7C3D' : getDayStatus(day) === 'today' ? '#1A4FAB' : '#EBEBEB',
                        outline: selectedDay === day ? '2px solid #1A4FAB' : 'none',
                        outlineOffset: '2px'
                      }"
                    />
                    <span
                      class="text-xs font-bold transition-all"
                      :class="selectedDay === day || getDayStatus(day) === 'today' ? 'text-[#1A4FAB]' : 'text-transparent group-hover:text-[#5A7A9B]'"
                    >{{ day }}</span>
                  </button>
                </div>
                <div class="flex gap-4 justify-center">
                  <div class="flex items-center gap-1.5"><div class="w-3 h-1.5 rounded-full bg-[#1B7C3D]"/><span class="text-xs text-[#5A7A9B]">Past</span></div>
                  <div class="flex items-center gap-1.5"><div class="w-3 h-1.5 rounded-full bg-[#1A4FAB]"/><span class="text-xs text-[#5A7A9B]">Today</span></div>
                  <div class="flex items-center gap-1.5"><div class="w-3 h-1.5 rounded-full bg-[#EBEBEB]"/><span class="text-xs text-[#5A7A9B]">Upcoming</span></div>
                </div>
              </div>

              <p v-if="daysUntilReturn && daysUntilReturn > 0" class="text-[#5A7A9B] mb-4 text-sm">{{ daysUntilReturn }} days until you can return to play</p>
              <p v-else-if="daysUntilReturn === 0" class="text-[#1B7C3D] font-semibold mb-4 text-sm">You have reached Day 21 — seek medical clearance before returning</p>
              <span v-if="currentStage" class="inline-block bg-[#1A4FAB] text-white text-sm font-semibold px-5 py-2 rounded-full">
                Stage {{ currentStage }} — {{ stages[currentStage - 1].name }}
              </span>
            </div>
          </Transition>
        </div>
      </div>
    </section>

    <!-- ══ BRAIN STATUS + ACTIVITIES ════════════════════════════════════════ -->
    <section v-if="viewingDay && viewingDayData" class="bg-[#F7F9FC] py-20">
      <div class="max-w-[1200px] mx-auto px-6">

        <!-- Preview banner -->
        <div v-if="!isViewingToday" class="bg-[#1A4FAB]/10 border border-[#1A4FAB]/30 rounded-xl px-5 py-3 mb-6 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1A4FAB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            <span class="text-[#1A4FAB] text-sm font-semibold">Previewing Day {{ viewingDay }} — {{ viewingDayData.stageName }}</span>
            <span class="text-[#5A7A9B] text-xs">(You are on Day {{ daysSinceInjury }})</span>
          </div>
          <button @click="selectedDay = null" class="text-xs text-[#1A4FAB] font-semibold hover:underline">Back to today</button>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">

          <!-- Brain status card -->
          <div class="bg-white rounded-2xl p-8 border border-[#EBEBEB] shadow-sm">
            <span class="inline-block bg-[#1A4FAB]/10 text-[#1A4FAB] text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
              Day {{ viewingDay }} — {{ viewingDayData.stageName }}
            </span>
            <div class="mb-6">
              <div class="flex justify-between text-xs text-[#5A7A9B] mb-1">
                <span>Brain recovery</span>
                <span class="font-bold text-[#1A4FAB]">{{ viewingDayData.brainRecoveryPct }}%</span>
              </div>
              <div class="h-3 bg-[#EBEBEB] rounded-full overflow-hidden">
                <div class="h-full rounded-full transition-all duration-700"
                  :style="{ width: `${viewingDayData.brainRecoveryPct}%`, background: viewingDayData.brainRecoveryPct < 40 ? '#C62828' : viewingDayData.brainRecoveryPct < 70 ? '#E65100' : '#1B7C3D' }" />
              </div>
            </div>
            <h3 class="text-base font-bold text-[#1A1A1A] mb-1">Today's goal</h3>
            <p class="text-[#1A4FAB] font-semibold text-sm mb-5">{{ viewingDayData.dailyGoal }}</p>
            <h3 class="text-base font-bold text-[#1A1A1A] mb-2">What's happening in your brain</h3>
            <p class="text-[#1A1A1A] text-sm leading-relaxed mb-5">{{ viewingDayData.cellularProcess }}</p>
            <div class="bg-[#C62828]/10 border border-[#C62828] rounded-xl p-3 flex gap-2 mb-4">
              <svg class="flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C62828" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              <p class="text-xs text-[#1A1A1A] font-semibold">{{ viewingDayData.warningSign }}</p>
            </div>
            <div class="bg-[#1A4FAB]/5 border border-[#1A4FAB]/20 rounded-xl p-3 flex gap-2">
              <svg class="flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1A4FAB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <p class="text-xs text-[#1A1A1A] italic leading-relaxed">{{ viewingDayData.insight }}</p>
            </div>
            <p class="text-xs text-[#5A7A9B] italic mt-4">Source: Giza & Hovda, 2014 — Neurometabolic Cascade · AIS 2024</p>
          </div>

          <!-- Activities card -->
          <div class="bg-white rounded-2xl p-8 border border-[#EBEBEB] shadow-sm">
            <h3 class="text-2xl font-bold text-[#1A1A1A] mb-6">What you can do today</h3>

            <!-- Allowed activities -->
            <div class="mb-6">
              <div class="flex items-center gap-2 text-[#1B7C3D] font-bold mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1B7C3D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                Allowed Today
              </div>
              <div class="space-y-3">
                <div
                  v-for="a in viewingDayData.allowed" :key="a.activity"
                  class="bg-[#F5FFF7] border border-[#1B7C3D]/20 rounded-xl p-3"
                  :class="isActivityChecked(`${viewingDay}-${a.activity}`) && !a.interactive ? 'opacity-60' : ''"
                >
                  <div class="flex items-start gap-3">
                    <button
                      v-if="!a.interactive"
                      @click="toggleActivity(`${viewingDay}-${a.activity}`)"
                      class="flex-shrink-0 mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center transition-all"
                      :class="isActivityChecked(`${viewingDay}-${a.activity}`) ? 'bg-[#1B7C3D] border-[#1B7C3D]' : 'border-[#1B7C3D]'"
                    >
                      <svg v-if="isActivityChecked(`${viewingDay}-${a.activity}`)" xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                    </button>
                    <svg v-else class="flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1A4FAB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>

                    <div class="flex-1">
                      <div class="font-semibold text-[#1A1A1A] text-sm mb-1" :class="isActivityChecked(`${viewingDay}-${a.activity}`) && !a.interactive ? 'line-through text-[#5A7A9B]' : ''">{{ a.activity }}</div>
                      <p class="text-xs text-[#5A7A9B] leading-relaxed mb-2">{{ a.detail }}</p>

                      <!-- Breathing widget -->
                      <div v-if="a.interactive === 'breathing' && isViewingToday" class="mt-2">
                        <div v-if="!breathingActive && breathingPhase === 'idle'">
                          <button @click="startBreathing" class="text-xs bg-[#1A4FAB] text-white px-4 py-2 rounded-full font-semibold hover:bg-[#1440A0] transition-colors">Start breathing exercise</button>
                        </div>
                        <div v-else class="bg-[#F5F8FF] rounded-xl p-4 text-center">
                          <div class="relative w-16 h-16 mx-auto mb-2">
                            <svg class="w-16 h-16 -rotate-90" viewBox="0 0 80 80">
                              <circle cx="40" cy="40" r="34" stroke="#EBEBEB" stroke-width="6" fill="none"/>
                              <circle cx="40" cy="40" r="34" stroke="#1A4FAB" stroke-width="6" fill="none" :stroke-dasharray="`${(breathingProgress / 100) * 213.6} 213.6`" class="transition-all duration-1000"/>
                            </svg>
                            <div class="absolute inset-0 flex flex-col items-center justify-center">
                              <span class="text-xs font-bold text-[#1A4FAB] uppercase">{{ breathingPhase }}</span>
                              <span class="text-base font-black text-[#1A1A1A]">{{ breathingCount }}</span>
                            </div>
                          </div>
                          <p class="text-xs text-[#5A7A9B] mb-2">Cycle {{ breathingCycles + 1 }} of 3</p>
                          <button @click="stopBreathing" class="text-xs text-[#C62828] hover:underline">Stop</button>
                        </div>
                      </div>

                      <!-- Cognitive load test widget -->
                      <div v-if="a.interactive === 'cognitive' && isViewingToday" class="mt-2">
                        <div v-if="cognitivePhase === 'idle'">
                          <button @click="startCognitiveTest" class="text-xs bg-[#1A4FAB] text-white px-4 py-2 rounded-full font-semibold hover:bg-[#1440A0] transition-colors">Start digit span test</button>
                          <span v-if="cognitiveHistory.length > 0" class="text-xs text-[#5A7A9B] ml-2">
                            Last: {{ cognitiveHistory[cognitiveHistory.length - 1].correct ? 'Correct' : 'Incorrect' }} — {{ cognitiveHistory[cognitiveHistory.length - 1].length }} digits
                          </span>
                        </div>
                        <div v-else-if="cognitivePhase === 'showing'" class="bg-[#F5F8FF] border border-[#1A4FAB]/20 rounded-xl p-4 text-center">
                          <p class="text-xs text-[#5A7A9B] mb-3">Watch the digits carefully</p>
                          <div class="h-16 flex items-center justify-center">
                            <Transition name="fade-scale" mode="out-in">
                              <span v-if="cognitiveShowDigit !== null" :key="cognitiveShowDigit" class="text-5xl font-black text-[#1A4FAB]">{{ cognitiveShowDigit }}</span>
                              <span v-else class="text-5xl font-black text-[#EBEBEB]">—</span>
                            </Transition>
                          </div>
                          <p class="text-xs text-[#5A7A9B] mt-2">{{ cognitiveCurrentIndex }} of {{ cognitiveSequence.length }} shown</p>
                        </div>
                        <div v-else-if="cognitivePhase === 'input'" class="bg-[#F5F8FF] border border-[#1A4FAB]/20 rounded-xl p-4">
                          <p class="text-xs text-[#5A7A9B] mb-3 text-center">Enter the digits in order</p>
                          <div class="flex gap-1 justify-center mb-3 min-h-[36px] flex-wrap">
                            <div v-for="(digit, i) in cognitiveInput" :key="i" class="w-8 h-8 bg-[#1A4FAB] text-white rounded-lg flex items-center justify-center font-bold text-sm">{{ digit }}</div>
                            <div v-for="i in (cognitiveSequence.length - cognitiveInput.length)" :key="'e'+i" class="w-8 h-8 bg-white border-2 border-[#EBEBEB] rounded-lg"/>
                          </div>
                          <div class="grid grid-cols-3 gap-1 mb-2">
                            <button v-for="n in [1,2,3,4,5,6,7,8,9]" :key="n" @click="tapCognitiveDigit(n)" class="py-2 bg-white border border-[#EBEBEB] rounded-lg text-sm font-bold text-[#1A1A1A] hover:bg-[#1A4FAB] hover:text-white transition-colors">{{ n }}</button>
                          </div>
                          <div class="grid grid-cols-3 gap-1">
                            <button @click="deleteCognitiveInput" class="py-2 bg-white border border-[#EBEBEB] rounded-lg text-xs font-bold text-[#C62828] hover:bg-[#FFF5F5] transition-colors">Del</button>
                            <button @click="tapCognitiveDigit(0)" class="py-2 bg-white border border-[#EBEBEB] rounded-lg text-sm font-bold text-[#1A1A1A] hover:bg-[#1A4FAB] hover:text-white transition-colors">0</button>
                            <div/>
                          </div>
                        </div>
                        <div v-else-if="cognitivePhase === 'result'" class="rounded-xl p-4 text-center" :class="cognitiveResult === 'correct' ? 'bg-[#1B7C3D]/10 border border-[#1B7C3D]' : 'bg-[#C62828]/10 border border-[#C62828]'">
                          <p class="font-bold text-sm mb-1" :class="cognitiveResult === 'correct' ? 'text-[#1B7C3D]' : 'text-[#C62828]'">{{ cognitiveResult === 'correct' ? 'Correct sequence' : 'Incorrect sequence' }}</p>
                          <p class="text-xs text-[#5A7A9B] mb-1">Sequence: {{ cognitiveSequence.join(' — ') }}</p>
                          <p class="text-xs text-[#5A7A9B] mb-3">Your input: {{ cognitiveInput.join(' — ') }}</p>
                          <button @click="resetCognitive" class="text-xs text-[#1A4FAB] hover:underline">Try again</button>
                        </div>
                      </div>

                      <!-- Reaction time widget -->
                      <div v-if="a.interactive === 'reaction' && isViewingToday" class="mt-2">
                        <div v-if="reactionPhase === 'idle'">
                          <button @click="startReactionTest" class="text-xs bg-[#1A4FAB] text-white px-4 py-2 rounded-full font-semibold hover:bg-[#1440A0] transition-colors">Start reaction test</button>
                        </div>
                        <div v-else-if="reactionPhase === 'waiting'" @click="tapReaction" class="bg-[#F5F8FF] border-2 border-[#1A4FAB] rounded-xl p-3 text-center cursor-pointer hover:bg-[#EEF3FF] transition-colors">
                          <p class="text-xs font-semibold text-[#1A1A1A] mb-1">Round {{ reactionRound }} of 5</p>
                          <p class="text-xs text-[#5A7A9B]">Wait for the green circle...</p>
                          <div class="w-10 h-10 rounded-full bg-[#EBEBEB] mx-auto mt-2"/>
                        </div>
                        <div v-else-if="reactionPhase === 'ready'" @click="tapReaction" class="bg-[#1B7C3D]/10 border-2 border-[#1B7C3D] rounded-xl p-3 text-center cursor-pointer hover:bg-[#1B7C3D]/20 transition-colors">
                          <p class="text-xs font-semibold text-[#1A1A1A] mb-2">Tap now</p>
                          <div class="w-10 h-10 rounded-full bg-[#1B7C3D] mx-auto animate-pulse"/>
                        </div>
                        <div v-else-if="reactionPhase === 'result'" class="bg-[#F5F8FF] rounded-xl p-3 text-center">
                          <p class="text-base font-black text-[#1A4FAB]">{{ reactionResult }}ms</p>
                          <p class="text-xs font-semibold mb-2" :style="{ color: getReactionLabel(reactionResult).color }">{{ getReactionLabel(reactionResult).label }}</p>
                          <button @click="resetReaction" class="text-xs text-[#5A7A9B] hover:underline">Test again</button>
                        </div>
                      </div>

                      <!-- Preview note for interactive activities -->
                      <div v-if="a.interactive && !isViewingToday" class="mt-2">
                        <span class="text-xs text-[#5A7A9B] italic">Available on Day {{ viewingDay }} when you reach it</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Restricted activities -->
            <div class="mb-6">
              <div class="flex items-center gap-2 text-[#C62828] font-bold mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C62828" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                Not Today
              </div>
              <div class="space-y-2">
                <div v-for="r in viewingDayData.restricted" :key="r" class="flex items-start gap-3 bg-[#FFF5F5] border border-[#C62828]/20 rounded-xl p-3">
                  <span class="text-[#C62828] font-bold flex-shrink-0 text-sm">✗</span>
                  <span class="text-[#1A1A1A] text-sm">{{ r }}</span>
                </div>
              </div>
            </div>

            <div class="bg-[#E65100]/10 border border-[#E65100] rounded-xl p-4 flex gap-3">
              <svg class="flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E65100" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              <p class="text-sm text-[#1A1A1A] font-semibold">If any symptoms return — stop immediately and go back to Stage 1</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ SLEEP CHECK-IN ════════════════════════════════════════════════════ -->
    <section v-if="daysSinceInjury && isViewingToday" class="bg-white py-16">
      <div class="max-w-[1200px] mx-auto px-6">
        <div class="max-w-2xl mx-auto">
          <div class="mb-3">
            <span class="text-[#1A4FAB] text-xs font-semibold tracking-widest uppercase">Daily Check-In</span>
          </div>
          <h2 class="text-2xl font-bold text-[#1A1A1A] mb-2">How did you sleep last night?</h2>
          <p class="text-[#5A7A9B] text-sm mb-6">Sleep quality is one of the strongest predictors of concussion recovery speed.</p>

          <div v-if="!sleepSubmitted" class="flex gap-3">
            <button @click="submitSleep('well')" class="flex-1 py-4 rounded-xl border-2 font-semibold text-sm transition-all border-[#1B7C3D] text-[#1B7C3D] hover:bg-[#1B7C3D] hover:text-white">Well</button>
            <button @click="submitSleep('okay')" class="flex-1 py-4 rounded-xl border-2 font-semibold text-sm transition-all border-[#E65100] text-[#E65100] hover:bg-[#E65100] hover:text-white">Okay</button>
            <button @click="submitSleep('poorly')" class="flex-1 py-4 rounded-xl border-2 font-semibold text-sm transition-all border-[#C62828] text-[#C62828] hover:bg-[#C62828] hover:text-white">Poorly</button>
          </div>

          <div v-else class="bg-[#F7F9FC] border border-[#EBEBEB] rounded-xl p-4 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-3 h-3 rounded-full" :style="{ background: sleepQuality === 'well' ? '#1B7C3D' : sleepQuality === 'okay' ? '#E65100' : '#C62828' }"/>
              <span class="text-sm font-semibold text-[#1A1A1A] capitalize">Slept {{ sleepQuality }} last night</span>
            </div>
            <button @click="sleepSubmitted = false; sleepQuality = null" class="text-xs text-[#5A7A9B] hover:underline">Change</button>
          </div>

          <div v-if="consecutivePoorSleep" class="mt-4 bg-[#C62828]/10 border border-[#C62828] rounded-xl p-4 flex gap-3">
            <svg class="flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C62828" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            <div>
              <p class="text-sm font-bold text-[#C62828] mb-1">Three consecutive nights of poor sleep</p>
              <p class="text-xs text-[#1A1A1A]">Sleep disruption significantly slows concussion recovery. Mention this to your GP at your next appointment.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ DAILY SYMPTOM CHECK ════════════════════════════════════════════════ -->
    <section v-if="daysSinceInjury && isViewingToday" class="bg-[#F7F9FC] py-20">
      <div class="max-w-[1200px] mx-auto px-6">
        <div class="text-center mb-10">
          <h2 class="text-3xl font-bold text-[#1A1A1A] mb-3">How are you feeling today?</h2>
          <p class="text-[#5A7A9B]">Answer honestly — this affects your recovery timeline</p>
        </div>

        <div v-if="!showSymptomSection" class="text-center">
          <button @click="startSymptomCheck" class="bg-[#1A4FAB] text-white px-10 py-4 rounded-full font-semibold text-base hover:bg-[#1440A0] transition-colors">Start daily check-in</button>
        </div>

        <div v-else-if="symptomStep >= 1 && symptomStep <= 3" class="max-w-lg mx-auto text-center">
          <div class="text-xs font-semibold text-[#5A7A9B] uppercase tracking-widest mb-4">Question {{ symptomStep }} of 3</div>
          <Transition name="slide-up" mode="out-in">
            <div :key="symptomStep">
              <div class="bg-white border-2 border-[#EBEBEB] rounded-2xl p-10 shadow-sm mb-6">
                <h3 class="text-2xl font-bold text-[#1A1A1A] mb-8">{{ symptomQuestions[symptomStep - 1] }}</h3>
                <div class="flex gap-4 justify-center">
                  <button @click="answerSymptom(false)" class="flex-1 max-w-[140px] py-4 rounded-full font-bold text-lg border-2 border-[#1B7C3D] text-[#1B7C3D] hover:bg-[#1B7C3D] hover:text-white transition-all">No</button>
                  <button @click="answerSymptom(true)" class="flex-1 max-w-[140px] py-4 rounded-full font-bold text-lg border-2 border-[#C62828] text-[#C62828] hover:bg-[#C62828] hover:text-white transition-all">Yes</button>
                </div>
              </div>
              <div class="flex justify-center gap-2">
                <div v-for="i in 3" :key="i" class="w-2 h-2 rounded-full transition-all" :class="i <= symptomStep ? 'bg-[#1A4FAB]' : 'bg-[#EBEBEB]'" />
              </div>
            </div>
          </Transition>
        </div>

        <div v-else-if="symptomStep === 4" class="max-w-2xl mx-auto">
          <Transition name="fade-scale">
            <div v-if="!hasSymptoms" class="bg-[#1B7C3D]/10 border-2 border-[#1B7C3D] rounded-2xl p-10 text-center">
              <svg class="mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#1B7C3D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              <p class="text-2xl font-bold text-[#1A1A1A] mb-2">You are clear for today.</p>
              <p class="text-[#5A7A9B] mb-6">Continue with Stage {{ currentStage }} activities as planned.</p>
              <button @click="resetSymptoms" class="text-sm text-[#5A7A9B] underline">Check again</button>
            </div>
            <div v-else class="bg-[#C62828]/10 border-2 border-[#C62828] rounded-2xl p-10 text-center">
              <svg class="mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#C62828" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              <p class="text-2xl font-bold text-[#1A1A1A] mb-3">Stop all activity today.</p>
              <p class="text-[#5A7A9B] mb-6">See a GP or sports doctor before continuing your recovery.</p>
              <router-link to="/locatesupport">
                <button class="bg-[#C62828] text-white px-8 py-4 rounded-full font-semibold mb-4 hover:bg-[#B71C1C] transition-colors flex items-center gap-2 mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                  Find a clinic near me
                </button>
              </router-link>
              <button @click="resetSymptoms" class="text-sm text-[#5A7A9B] underline">Check again</button>
            </div>
          </Transition>
        </div>
      </div>
    </section>

    <!-- ══ NECK EXERCISES + CAMERA ════════════════════════════════════════════ -->
    <section v-if="daysSinceInjury && currentStage && currentStage >= 2 && isViewingToday" class="bg-white py-20">
      <div class="max-w-[1200px] mx-auto px-6">

        <div class="text-center mb-10">
          <span class="inline-block bg-[#1A4FAB]/10 text-[#1A4FAB] text-xs font-semibold px-4 py-1.5 rounded-full mb-4">Stage 2 onwards — Neck Strengthening</span>
          <h2 class="text-3xl font-bold text-[#1A1A1A] mb-3">Guided neck exercises</h2>
          <p class="text-[#5A7A9B] text-sm mb-1">Reduces future concussion severity. Uses your front camera to check your position in real time.</p>
          <p class="text-xs text-[#5A7A9B] italic">Referenced from SCHN clinical guidance.</p>
        </div>

        <!-- Streak + weekly grid -->
        <div class="max-w-lg mx-auto mb-10">
          <div class="bg-[#F7F9FC] border border-[#EBEBEB] rounded-2xl p-5 flex items-center justify-between">
            <div>
              <p class="text-sm font-bold text-[#1A1A1A]">{{ exerciseStreak > 0 ? `${exerciseStreak} day streak` : 'Start your streak today' }}</p>
              <p class="text-xs text-[#5A7A9B] mt-0.5">Complete all 3 exercises daily to maintain your streak</p>
            </div>
            <div class="flex gap-1.5">
              <div
                v-for="(done, i) in weeklyCompletion" :key="i"
                class="w-6 h-6 rounded-md transition-colors"
                :class="done ? 'bg-[#1B7C3D]' : 'bg-[#EBEBEB]'"
                :title="done ? 'Completed' : 'Not completed'"
              />
            </div>
          </div>
        </div>

        <!-- All done banner -->
        <Transition name="fade-scale">
          <div v-if="allExercisesDone" class="bg-[#1B7C3D]/10 border-2 border-[#1B7C3D] rounded-2xl p-8 text-center mb-8">
            <svg class="mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#1B7C3D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            <p class="text-xl font-bold text-[#1A1A1A]">All 3 exercises complete for today</p>
            <p class="text-[#5A7A9B] text-sm mt-2">Come back tomorrow to continue your streak.</p>
          </div>
        </Transition>

        <!-- Exercise cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            v-for="(def, idx) in exerciseDefinitions" :key="idx"
            class="bg-white rounded-2xl border shadow-sm transition-all duration-300"
            :class="exerciseState[idx].phase === 'complete' ? 'border-[#1B7C3D]' : 'border-[#EBEBEB]'"
          >
            <!-- Card header -->
            <div class="p-6 border-b border-[#EBEBEB]">
              <div class="flex items-start justify-between mb-3">
                <div>
                  <h3 class="text-lg font-bold text-[#1A1A1A] mb-1">{{ def.name }}</h3>
                  <span class="text-xs font-semibold bg-[#1A4FAB]/10 text-[#1A4FAB] px-3 py-1 rounded-full">{{ def.sets }} sets × {{ def.reps }} reps</span>
                </div>
                <div class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" :class="exerciseState[idx].phase === 'complete' ? 'bg-[#1B7C3D]' : 'bg-[#F7F9FC] border border-[#EBEBEB]'">
                  <svg v-if="exerciseState[idx].phase === 'complete'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                  <span v-else class="text-xs font-bold text-[#5A7A9B]">{{ idx + 1 }}</span>
                </div>
              </div>
              <p class="text-sm text-[#1A1A1A] leading-relaxed">{{ def.instructions }}</p>
            </div>

            <!-- Exercise diagram -->
            <div class="px-6 pt-5 pb-3">
              <p class="text-xs font-semibold text-[#5A7A9B] uppercase tracking-wider mb-3">Correct position</p>

              <!-- Chin tuck diagram -->
              <svg v-if="def.diagram === 'chin-tuck'" viewBox="0 0 200 120" class="w-full h-24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="80" cy="45" rx="28" ry="32" stroke="#1A1A1A" stroke-width="2" fill="#F7F9FC"/>
                <rect x="65" y="74" width="22" height="30" rx="4" fill="#F7F9FC" stroke="#1A1A1A" stroke-width="2"/>
                <circle cx="68" cy="40" r="3" fill="#1A1A1A"/>
                <path d="M 90 68 L 130 68" stroke="#1A4FAB" stroke-width="2.5" stroke-dasharray="4 2"/>
                <path d="M 90 68 L 98 63 M 90 68 L 98 73" stroke="#1A4FAB" stroke-width="2.5" stroke-linecap="round"/>
                <text x="132" y="72" font-size="11" fill="#1A4FAB" font-family="sans-serif">Pull back</text>
                <text x="60" y="115" font-size="10" fill="#1B7C3D" font-family="sans-serif" font-weight="600">Not down — straight back</text>
              </svg>

              <!-- Neck rotation diagram -->
              <svg v-else-if="def.diagram === 'neck-rotation'" viewBox="0 0 200 120" class="w-full h-24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="100" cy="55" rx="35" ry="40" stroke="#1A1A1A" stroke-width="2" fill="#F7F9FC"/>
                <path d="M100 25 L100 35" stroke="#1A1A1A" stroke-width="2" stroke-linecap="round"/>
                <path d="M65 55 Q50 30 75 20" stroke="#1A4FAB" stroke-width="2.5" stroke-dasharray="4 2"/>
                <path d="M 75 20 L 68 28 M 75 20 L 83 22" stroke="#1A4FAB" stroke-width="2" stroke-linecap="round"/>
                <path d="M135 55 Q150 30 125 20" stroke="#1A4FAB" stroke-width="2.5" stroke-dasharray="4 2"/>
                <path d="M 125 20 L 132 28 M 125 20 L 117 22" stroke="#1A4FAB" stroke-width="2" stroke-linecap="round"/>
                <text x="55" y="100" font-size="10" fill="#1B7C3D" font-family="sans-serif" font-weight="600">Slow — stop before pain</text>
              </svg>

              <!-- Isometric diagram -->
              <svg v-else-if="def.diagram === 'isometric'" viewBox="0 0 200 120" class="w-full h-24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="100" cy="45" rx="30" ry="35" stroke="#1A1A1A" stroke-width="2" fill="#F7F9FC"/>
                <circle cx="88" cy="40" r="3" fill="#1A1A1A"/>
                <circle cx="112" cy="40" r="3" fill="#1A1A1A"/>
                <rect x="88" y="77" width="24" height="25" rx="4" fill="#F7F9FC" stroke="#1A1A1A" stroke-width="2"/>
                <rect x="55" y="20" width="32" height="18" rx="6" fill="#E65100" fill-opacity="0.15" stroke="#E65100" stroke-width="2"/>
                <text x="58" y="32" font-size="9" fill="#E65100" font-family="sans-serif" font-weight="600">Palm</text>
                <path d="M 87 29 L 73 29" stroke="#E65100" stroke-width="2.5"/>
                <path d="M 87 29 L 80 24 M 87 29 L 80 34" stroke="#E65100" stroke-width="2" stroke-linecap="round"/>
                <text x="53" y="110" font-size="10" fill="#1B7C3D" font-family="sans-serif" font-weight="600">Head must not move at all</text>
              </svg>
            </div>

            <!-- Position tip -->
            <div class="px-6 pb-4">
              <div class="bg-[#F7F9FC] rounded-lg px-3 py-2 flex gap-2">
                <svg class="flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#5A7A9B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <span class="text-xs text-[#5A7A9B] italic">{{ def.cue }}</span>
              </div>
            </div>

            <!-- Camera feed -->
            <div class="px-6">
              <div class="bg-[#0A1628] rounded-xl overflow-hidden relative" style="aspect-ratio:4/3;">
                <video
                  :ref="(el) => { videoRefs[idx] = el as HTMLVideoElement }"
                  autoplay playsinline muted
                  class="w-full h-full object-cover"
                  :class="cameraActive[idx] ? 'opacity-100' : 'opacity-0'"
                />
                <div v-if="!cameraActive[idx]" class="absolute inset-0 flex flex-col items-center justify-center text-white/40">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="mb-2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                  <p class="text-xs">Camera inactive</p>
                </div>
                <div v-if="cameraActive[idx] && positionFeedback[idx]" class="absolute bottom-0 left-0 right-0 bg-black/70 px-3 py-2 text-center">
                  <p class="text-white text-xs font-semibold">{{ positionFeedback[idx] }}</p>
                </div>
                <div v-if="cameraActive[idx]" class="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <svg viewBox="0 0 120 160" class="w-20 opacity-25" fill="none">
                    <ellipse cx="60" cy="45" rx="30" ry="36" stroke="#1A4FAB" stroke-width="2" stroke-dasharray="4 2"/>
                    <line x1="60" y1="81" x2="60" y2="130" stroke="#1A4FAB" stroke-width="2" stroke-dasharray="4 2"/>
                    <line x1="30" y1="100" x2="90" y2="100" stroke="#1A4FAB" stroke-width="2" stroke-dasharray="4 2"/>
                  </svg>
                </div>
              </div>
              <p class="text-xs text-[#5A7A9B] text-center mt-2 mb-4">Live feed only — nothing recorded or stored</p>
            </div>

            <!-- Set and rep tracker -->
            <div class="px-6 pb-4">
              <div class="flex items-center justify-between mb-4">
                <div class="flex gap-1.5">
                  <div
                    v-for="s in def.sets" :key="s"
                    class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                    :class="s < exerciseState[idx].currentSet ? 'bg-[#1B7C3D] text-white' : s === exerciseState[idx].currentSet ? 'bg-[#1A4FAB] text-white' : 'bg-[#EBEBEB] text-[#5A7A9B]'"
                  >{{ s }}</div>
                </div>
                <span class="text-xs text-[#5A7A9B]">
                  <span v-if="exerciseState[idx].phase !== 'complete'">Set {{ exerciseState[idx].currentSet }} of {{ def.sets }} — Rep {{ exerciseState[idx].currentRep }} of {{ def.reps }}</span>
                  <span v-else class="text-[#1B7C3D] font-semibold">All sets complete</span>
                </span>
              </div>

              <div v-if="exerciseState[idx].phase !== 'complete'" class="mb-4">
                <div class="flex justify-between text-xs text-[#5A7A9B] mb-1">
                  <span>Reps this set</span>
                  <span>{{ exerciseState[idx].currentRep }} / {{ def.reps }}</span>
                </div>
                <div class="h-2 bg-[#EBEBEB] rounded-full overflow-hidden">
                  <div class="h-full rounded-full bg-[#1A4FAB] transition-all duration-300" :style="{ width: `${(exerciseState[idx].currentRep / def.reps) * 100}%` }" />
                </div>
              </div>

              <!-- Hold / rest timer ring -->
              <div v-if="exerciseState[idx].phase === 'holding' || exerciseState[idx].phase === 'resting'" class="flex flex-col items-center mb-4">
                <div class="relative w-20 h-20 mb-2">
                  <svg class="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="34" stroke="#EBEBEB" stroke-width="6" fill="none"/>
                    <circle cx="40" cy="40" r="34" :stroke="getRepRingColor(idx)" stroke-width="6" fill="none" :stroke-dasharray="getRepRingDasharray(idx)" class="transition-all duration-1000"/>
                  </svg>
                  <div class="absolute inset-0 flex flex-col items-center justify-center">
                    <span class="text-xs font-semibold uppercase" :style="{ color: getRepRingColor(idx) }">{{ exerciseState[idx].phase === 'resting' ? 'Rest' : 'Hold' }}</span>
                    <span class="text-xl font-black text-[#1A1A1A]">{{ exerciseState[idx].timer }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Action buttons -->
            <div class="px-6 pb-6 space-y-2">
              <!-- Step 1: Enable camera -->
              <button
                v-if="!cameraActive[idx]"
                @click="startCamera(idx)"
                class="w-full py-3 rounded-full font-bold text-sm bg-[#F7F9FC] text-[#1A4FAB] border-2 border-[#1A4FAB] hover:bg-[#1A4FAB] hover:text-white transition-all"
              >Enable camera</button>

              <!-- Step 2: Start / continue rep -->
              <button
                v-else-if="exerciseState[idx].phase === 'idle'"
                @click="startRep(idx)"
                class="w-full py-3 rounded-full font-bold text-sm bg-[#1A4FAB] text-white hover:bg-[#1440A0] transition-colors"
              >{{ exerciseState[idx].currentRep === 0 && exerciseState[idx].currentSet === 1 ? 'Start exercise' : 'Start rep' }}</button>

              <!-- Holding state display -->
              <div v-else-if="exerciseState[idx].phase === 'holding'" class="w-full py-3 rounded-full font-bold text-sm bg-[#E65100] text-white text-center">
                Hold — {{ exerciseState[idx].timer }}s remaining
              </div>

              <!-- Resting state display -->
              <div v-else-if="exerciseState[idx].phase === 'resting'" class="w-full py-3 rounded-full font-bold text-sm bg-[#F7F9FC] text-[#E65100] border-2 border-[#E65100] text-center">
                Rest — next set in {{ exerciseState[idx].timer }}s
              </div>

              <!-- Complete state -->
              <div v-else-if="exerciseState[idx].phase === 'complete'" class="w-full py-3 rounded-full font-bold text-sm bg-[#1B7C3D] text-white text-center">
                Done for today
              </div>

              <!-- Secondary buttons -->
              <div v-if="cameraActive[idx]" class="flex gap-2">
                <button @click="stopCamera(idx)" class="flex-1 py-2 text-xs text-[#5A7A9B] hover:text-[#C62828] transition-colors">Stop camera</button>
                <button
                  v-if="exerciseState[idx].phase !== 'idle' && exerciseState[idx].phase !== 'complete'"
                  @click="resetExercise(idx)"
                  class="flex-1 py-2 text-xs text-[#5A7A9B] hover:text-[#1A4FAB] transition-colors"
                >Reset</button>
              </div>
            </div>
          </div>
        </div>

        <div class="text-center mt-6 space-y-1">
          <p class="text-[#5A7A9B] text-sm">Complete all 3 exercises daily from Stage 2 onwards</p>
          <p class="text-xs text-[#5A7A9B]">Camera feed is live only. Nothing is recorded or uploaded.</p>
        </div>
      </div>
    </section>

    <!-- Stage 1 explanation — neck exercises not yet available -->
    <section v-if="daysSinceInjury && currentStage && currentStage < 2 && isViewingToday" class="bg-white py-12">
      <div class="max-w-[1200px] mx-auto px-6">
        <div class="bg-[#F7F9FC] border border-[#EBEBEB] rounded-2xl p-6 flex items-start gap-4">
          <svg class="flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5A7A9B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <div>
            <p class="font-semibold text-[#1A1A1A] text-sm mb-1">Neck exercises begin on Day 4</p>
            <p class="text-xs text-[#5A7A9B] leading-relaxed">Your brain needs complete rest right now. Neck strengthening exercises are introduced at Stage 2 (Day 4) when your brain is stable enough to support light physical activity.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ RECOVERY JOURNAL ════════════════════════════════════════════════════ -->
    <section v-if="daysSinceInjury && isViewingToday" class="bg-[#F7F9FC] py-20">
      <div class="max-w-[1200px] mx-auto px-6">
        <div class="max-w-2xl mx-auto">
          <div class="mb-3">
            <span class="text-[#1A4FAB] text-xs font-semibold tracking-widest uppercase">Recovery Journal</span>
          </div>
          <h2 class="text-2xl font-bold text-[#1A1A1A] mb-2">Write about your day</h2>
          <p class="text-[#5A7A9B] text-sm mb-6">Your entries are saved privately on this device. Share them with your GP at your clearance appointment.</p>

          <div class="bg-white rounded-2xl border border-[#EBEBEB] shadow-sm p-6 mb-4">
            <div class="flex items-center justify-between mb-3">
              <span class="text-xs font-semibold text-[#1A4FAB]">Day {{ daysSinceInjury }}</span>
              <span class="text-xs text-[#5A7A9B]">{{ new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' }) }}</span>
            </div>
            <textarea
              v-model="journalEntry"
              :placeholder="todayJournalEntry ? todayJournalEntry.text : 'How are you feeling today? What did you manage to do? Any symptoms?'"
              rows="3"
              class="w-full text-sm text-[#1A1A1A] resize-none focus:outline-none leading-relaxed"
            />
            <div class="flex items-center justify-between mt-3 pt-3 border-t border-[#EBEBEB]">
              <span class="text-xs text-[#5A7A9B]">Saved privately on this device only</span>
              <button
                @click="saveJournalEntry"
                :disabled="!journalEntry.trim()"
                class="bg-[#1A4FAB] text-white px-5 py-2 rounded-full text-xs font-semibold hover:bg-[#1440A0] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <svg v-if="journalSaved" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                {{ journalSaved ? 'Saved' : 'Save entry' }}
              </button>
            </div>
          </div>

          <div v-if="journalEntries.length > 0">
            <button @click="showJournalHistory = !showJournalHistory" class="flex items-center gap-2 text-sm text-[#5A7A9B] hover:text-[#1A4FAB] transition-colors mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" :class="showJournalHistory ? 'rotate-180' : ''" class="transition-transform"><path d="m6 9 6 6 6-6"/></svg>
              {{ showJournalHistory ? 'Hide' : 'Show' }} past entries ({{ journalEntries.length }})
            </button>
            <Transition name="slide-up">
              <div v-if="showJournalHistory" class="space-y-3">
                <div v-for="entry in [...journalEntries].reverse()" :key="entry.date" class="bg-white rounded-xl border border-[#EBEBEB] p-4">
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-xs font-bold text-[#1A4FAB]">Day {{ entry.day }}</span>
                    <span class="text-xs text-[#5A7A9B]">{{ entry.date }}</span>
                  </div>
                  <p class="text-sm text-[#1A1A1A] leading-relaxed">{{ entry.text }}</p>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ 6 STAGE TIMELINE — EXPANDABLE ══════════════════════════════════════ -->
    <section v-if="daysSinceInjury && currentStage" class="bg-white py-20">
      <div class="max-w-[1200px] mx-auto px-6">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-[#1A1A1A] mb-3">Your full recovery journey</h2>
          <p class="text-[#5A7A9B]">Australian Institute of Sport 2024 mandatory protocol — select any stage to explore</p>
        </div>

        <div class="space-y-3">
          <div
            v-for="stage in stages" :key="stage.id"
            class="rounded-2xl border-2 overflow-hidden transition-all duration-300"
            :class="{ 'border-[#1A4FAB]': getStageStatus(stage.id) === 'current', 'border-[#1B7C3D]': getStageStatus(stage.id) === 'complete', 'border-[#EBEBEB]': getStageStatus(stage.id) === 'upcoming' }"
          >
            <button
              @click="toggleStage(stage.id)"
              class="w-full flex items-center justify-between p-5 transition-colors text-left"
              :class="{ 'bg-[#1A4FAB] text-white': getStageStatus(stage.id) === 'current', 'bg-[#1B7C3D]/10 text-[#1B7C3D]': getStageStatus(stage.id) === 'complete', 'bg-[#F7F9FC] text-[#5A7A9B]': getStageStatus(stage.id) === 'upcoming' }"
            >
              <div class="flex items-center gap-4">
                <div
                  class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  :class="{ 'bg-white/20': getStageStatus(stage.id) === 'current', 'bg-[#1B7C3D]': getStageStatus(stage.id) === 'complete', 'bg-[#EBEBEB]': getStageStatus(stage.id) === 'upcoming' }"
                >
                  <svg v-if="getStageStatus(stage.id) === 'complete'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                  <span v-else class="text-sm font-black" :class="{ 'text-white': getStageStatus(stage.id) === 'current', 'text-[#5A7A9B]': getStageStatus(stage.id) === 'upcoming' }">{{ stage.id }}</span>
                </div>
                <div>
                  <div class="font-bold text-sm">{{ stage.name }}</div>
                  <div class="text-xs opacity-70 mt-0.5">Days {{ stage.days }}</div>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <span
                  class="text-xs font-bold px-3 py-1 rounded-full"
                  :class="{ 'bg-white/20 text-white': getStageStatus(stage.id) === 'current', 'bg-[#1B7C3D] text-white': getStageStatus(stage.id) === 'complete', 'bg-[#5A7A9B]/20 text-[#5A7A9B]': getStageStatus(stage.id) === 'upcoming' }"
                >{{ getStageStatus(stage.id).toUpperCase() }}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-transform duration-200" :class="expandedStage === stage.id ? 'rotate-180' : ''"><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </button>

            <Transition name="slide-up">
              <div v-if="expandedStage === stage.id" class="border-t border-[#EBEBEB]">
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-4">
                  <button
                    v-for="dayEntry in getDaysForStage(stage.id)" :key="dayEntry.day"
                    @click="jumpToDay(dayEntry.day)"
                    class="text-left bg-white border rounded-xl p-4 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
                    :class="dayEntry.day === daysSinceInjury ? 'border-[#1A4FAB] bg-[#F5F8FF]' : 'border-[#EBEBEB]'"
                  >
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-xs font-bold text-[#1A4FAB]">Day {{ dayEntry.day }}</span>
                      <span
                        class="text-xs font-bold px-2 py-0.5 rounded-full"
                        :class="dayEntry.day < (daysSinceInjury || 0) ? 'bg-[#1B7C3D]/10 text-[#1B7C3D]' : dayEntry.day === daysSinceInjury ? 'bg-[#1A4FAB] text-white' : 'bg-[#EBEBEB] text-[#5A7A9B]'"
                      >{{ dayEntry.day < (daysSinceInjury || 0) ? 'Done' : dayEntry.day === daysSinceInjury ? 'Today' : 'Upcoming' }}</span>
                    </div>
                    <div class="flex items-center gap-2 mb-2">
                      <div class="h-1.5 flex-1 bg-[#EBEBEB] rounded-full overflow-hidden">
                        <div class="h-full rounded-full" :style="{ width: `${dayEntry.brainRecoveryPct}%`, background: dayEntry.brainRecoveryPct < 40 ? '#C62828' : dayEntry.brainRecoveryPct < 70 ? '#E65100' : '#1B7C3D' }"/>
                      </div>
                      <span class="text-xs font-bold text-[#5A7A9B]">{{ dayEntry.brainRecoveryPct }}%</span>
                    </div>
                    <p class="text-xs text-[#5A7A9B] leading-relaxed line-clamp-2">{{ dayEntry.dailyGoal }}</p>
                    <p class="text-xs text-[#1A4FAB] font-semibold mt-2">View this day</p>
                  </button>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ FIND SUPPORT CTA ════════════════════════════════════════════════════ -->
    <section style="background:#0A1628;" class="py-20 text-center">
      <div class="max-w-[1200px] mx-auto px-6">
        <h2 class="text-3xl font-bold text-white mb-4">Not sure if you are ready?</h2>
        <p class="text-white/60 mb-8 max-w-lg mx-auto leading-relaxed">Find the nearest GP, sports medicine clinic, or hospital for a professional assessment.</p>
        <router-link to="/locatesupport">
          <button class="bg-[#1A4FAB] text-white px-10 py-4 rounded-full font-semibold hover:bg-[#1440A0] transition-colors flex items-center gap-2 mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            Find a clinic near me
          </button>
        </router-link>
        <p class="text-white/30 text-sm">Medical clearance is required before returning to full contact sport</p>
      </div>
    </section>

  </div>
</template>

<style scoped>
.fade-scale-enter-active, .fade-scale-leave-active { transition: opacity 0.4s ease, transform 0.4s ease; }
.fade-scale-enter-from, .fade-scale-leave-to { opacity: 0; transform: scale(0.97); }
.slide-up-enter-active, .slide-up-leave-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.slide-up-enter-from { opacity: 0; transform: translateY(16px); }
.slide-up-leave-to { opacity: 0; transform: translateY(-16px); }
.line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
</style>
