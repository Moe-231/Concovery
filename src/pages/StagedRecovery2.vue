<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'

// ── Router is needed to navigate to the exercise page ──────────────────────
const router = useRouter()

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TYPE DEFINITIONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface Stage {
  id: number
  name: string
  shortName: string
  days: string
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// STATIC DATA — 6 AIS RECOVERY STAGES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const stages: Stage[] = [
  { id: 1, name: 'Complete Rest',           shortName: 'Rest',           days: '1-3'   },
  { id: 2, name: 'Light Aerobic',           shortName: 'Light Aerobic',  days: '4-6'   },
  { id: 3, name: 'Sport Specific Exercise', shortName: 'Sport Specific', days: '7-9'   },
  { id: 4, name: 'Non-Contact Training',    shortName: 'Non-Contact',    days: '10-14' },
  { id: 5, name: 'Full Contact',            shortName: 'Full Contact',   days: '15-20' },
  { id: 6, name: 'Return to Play',          shortName: 'Return to Play', days: '21+'   },
]

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// EXERCISE DEFINITIONS — used for the modal Step 3 preview list only.
// Full guided exercise logic lives in ExercisePage.vue.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const exerciseDefinitions = [
  { name: 'Chin Tucks',      sets: 3, reps: 10 },
  { name: 'Neck Rotations',  sets: 1, reps: 10 },
  { name: 'Neck Isometrics', sets: 3, reps: 8  },
]

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 21-DAY DATA
// Each day (1–21) has:
//   stage / stageName       → which AIS stage this day belongs to
//   brainRecoveryPct        → % neurometabolic recovery (from research literature)
//   cellularProcess         → what is happening in the brain at cellular level
//   dailyGoal               → plain English goal for today
//   allowed                 → list of allowed activities
//                             interactive: 'breathing' | 'cognitive' | 'reaction'
//   restricted              → list of things NOT to do
//   warningSign             → when to stop and see a doctor
//   insight                 → motivational fact for the day
//
// SOURCE: Giza & Hovda 2014 (Neurometabolic Cascade), AIS 2024 Return-to-Play
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const dayData: Record<number, {
  stage: number; stageName: string; brainRecoveryPct: number
  cellularProcess: string; dailyGoal: string
  allowed: { activity: string; detail: string; interactive?: string }[]
  restricted: string[]; warningSign: string; insight: string
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
// SECTION 1 — DATE & DAY TRACKING
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const injuryDate      = ref('')
const daysSinceInjury = ref<number | null>(null)
const selectedDay     = ref<number | null>(null)

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SECTION 2 — CALENDAR STATE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const showCalendar  = ref(false)
const today         = new Date()
const calendarMonth = ref(today.getMonth())
const calendarYear  = ref(today.getFullYear())
const monthNames    = ['January','February','March','April','May','June','July','August','September','October','November','December']

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
function isFutureDay(day: number) { return new Date(calendarYear.value, calendarMonth.value, day) > today }
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
// SECTION 3 — DAILY CHECK-IN MODAL
//
// HOW IT WORKS:
//   1. User clicks "Start today's check-in"
//   2. Modal opens at Step 1 (Sleep)
//   3. User answers sleep, then symptoms
//   4. On Stage 2+: Step 3 shows the exercise list + "Start exercises" button
//      - That button navigates to /exercises (ExercisePage.vue)
//      - ExercisePage saves 'concovery_return_modal' = 'true' when done
//      - When user returns, onMounted detects that flag and reopens modal at Step 4
//   5. Step 4 (or 3 on Stage 1): Recovery Journal
//
// totalCheckInSteps: 4 on Stage 2+ (includes exercises), 3 on Stage 1
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const showCheckInModal = ref(false)
const checkInStep      = ref(1)

const totalCheckInSteps = computed(() => {
  return currentStage.value && currentStage.value >= 2 ? 4 : 3
})

function openCheckIn() {
  showCheckInModal.value   = true
  checkInStep.value        = 1
  symptomStep.value        = 0
  symptomAnswers.value     = [null, null, null]
  showSymptomSection.value = false
}

function closeCheckIn() {
  showCheckInModal.value = false
}

function nextCheckInStep() {
  if (checkInStep.value < totalCheckInSteps.value) { checkInStep.value++ }
  else { closeCheckIn() }
}

function prevCheckInStep() {
  if (checkInStep.value > 1) checkInStep.value--
}

// Called from modal Step 3 — saves a flag so we know to reopen the modal
// when the user returns from ExercisePage
function goToExercises() {
  localStorage.setItem('concovery_return_modal', 'true')
  closeCheckIn()
  router.push('/exercises')
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SECTION 4 — SLEEP CHECK-IN
// User reports sleep quality. 3 consecutive poor nights triggers a GP warning.
// Saved to localStorage under key 'concovery_sleep'
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const sleepQuality   = ref<'well' | 'okay' | 'poorly' | null>(null)
const sleepHistory   = ref<{ date: string; quality: string; day: number }[]>([])
const sleepSubmitted = ref(false)

const consecutivePoorSleep = computed(() => {
  if (sleepHistory.value.length < 3) return false
  return sleepHistory.value.slice(-3).every(s => s.quality === 'poorly')
})

function submitSleep(quality: 'well' | 'okay' | 'poorly') {
  sleepQuality.value   = quality
  sleepSubmitted.value = true
  const entry  = { date: new Date().toISOString().split('T')[0], quality, day: daysSinceInjury.value || 1 }
  const existing = sleepHistory.value.findIndex(s => s.date === entry.date)
  if (existing >= 0) sleepHistory.value[existing] = entry
  else               sleepHistory.value.push(entry)
  localStorage.setItem('concovery_sleep', JSON.stringify(sleepHistory.value))
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SECTION 5 — SYMPTOM CHECK (one question at a time)
// symptomStep: 0=not started | 1/2/3=question | 4=result shown
// If user answers YES to any question → skips to result immediately
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const symptomStep        = ref(0)
const symptomAnswers     = ref<(boolean | null)[]>([null, null, null])
const symptomQuestions   = ['Do you have a headache?', 'Any dizziness or balance issues?', 'Difficulty concentrating?']
const showSymptomSection = ref(false)

function startSymptomCheck() {
  showSymptomSection.value = true
  symptomStep.value        = 1
}
function answerSymptom(answer: boolean) {
  const idx = symptomStep.value - 1
  symptomAnswers.value[idx] = answer
  if (answer === true)            symptomStep.value = 4   // yes answer — jump to result
  else if (symptomStep.value < 3) symptomStep.value++     // next question
  else                            symptomStep.value = 4   // all 3 answered no
}
function resetSymptoms() {
  symptomStep.value    = 1
  symptomAnswers.value = [null, null, null]
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SECTION 6 — ACTIVITY CHECKLIST
// Non-interactive allowed activities can be ticked off.
// Key format: "${dayNumber}-${activityName}" e.g. "7-Light jogging"
// Saved to localStorage under key 'concovery_activities'
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const checkedActivities = ref<Record<string, boolean>>({})

function toggleActivity(key: string) {
  checkedActivities.value[key] = !checkedActivities.value[key]
  localStorage.setItem('concovery_activities', JSON.stringify(checkedActivities.value))
}
function isActivityChecked(key: string) { return checkedActivities.value[key] || false }

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SECTION 7 — BREATHING EXERCISE (4-7-8 technique)
// 3 cycles of: inhale 4s → hold 7s → exhale 8s
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
      breathingPhase.value = 'hold'; breathingCount.value = 7; breathingProgress.value = 0; elapsed = 0
      breathingInterval = setInterval(() => {
        elapsed++
        breathingProgress.value = (elapsed / 7) * 100
        breathingCount.value    = 7 - elapsed
        if (elapsed >= 7) {
          clearInterval(breathingInterval!)
          breathingPhase.value = 'exhale'; breathingCount.value = 8; breathingProgress.value = 0; elapsed = 0
          breathingInterval = setInterval(() => {
            elapsed++
            breathingProgress.value = (elapsed / 8) * 100
            breathingCount.value    = 8 - elapsed
            if (elapsed >= 8) {
              clearInterval(breathingInterval!)
              breathingCycles.value++
              if (breathingCycles.value < 3) runBreathingCycle()
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
// SECTION 8 — COGNITIVE LOAD TEST (Digit Span)
// Digits flash one at a time. User recalls them in order.
// Sequence length grows with recovery progress (3 on Day 4 → 7 on Day 21)
// Saved to localStorage under key 'concovery_cognitive'
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const cognitivePhase        = ref<'idle' | 'showing' | 'input' | 'result'>('idle')
const cognitiveSequence     = ref<number[]>([])
const cognitiveCurrentIndex = ref(0)
const cognitiveInput        = ref<number[]>([])
const cognitiveResult       = ref<'correct' | 'incorrect' | null>(null)
const cognitiveHistory      = ref<{ day: number; date: string; length: number; correct: boolean }[]>([])
const cognitiveShowDigit    = ref<number | null>(null)
let cognitiveTimeout: ReturnType<typeof setTimeout> | null = null

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
    const correct         = cognitiveInput.value.every((d, i) => d === cognitiveSequence.value[i])
    cognitiveResult.value = correct ? 'correct' : 'incorrect'
    cognitivePhase.value  = 'result'
    const entry = { day: daysSinceInjury.value || 1, date: new Date().toISOString().split('T')[0], length: cognitiveSequence.value.length, correct }
    cognitiveHistory.value.push(entry)
    localStorage.setItem('concovery_cognitive', JSON.stringify(cognitiveHistory.value))
  }
}

function deleteCognitiveInput() { cognitiveInput.value.pop() }
function resetCognitive() {
  cognitivePhase.value     = 'idle'
  cognitiveSequence.value  = []
  cognitiveInput.value     = []
  cognitiveResult.value    = null
  cognitiveShowDigit.value = null
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SECTION 9 — REACTION TIME TEST
// 5 rounds. Green circle appears after 1.5–3.5s random delay.
// Saved to localStorage under key 'concovery_reaction'
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
  const delay = 1500 + Math.random() * 2000
  reactionTimeout = setTimeout(() => {
    reactionPhase.value     = 'ready'
    reactionStartTime.value = Date.now()
  }, delay)
}
function tapReaction() {
  if (reactionPhase.value === 'waiting') {
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
      reactionResult.value = Math.round(reactionTimes.value.reduce((a, b) => a + b, 0) / reactionTimes.value.length)
      reactionPhase.value  = 'result'
      const saved = JSON.parse(localStorage.getItem('concovery_reaction') || '[]')
      saved.push({ day: daysSinceInjury.value, avg: reactionResult.value, date: new Date().toISOString() })
      localStorage.setItem('concovery_reaction', JSON.stringify(saved))
    }
  }
}
function resetReaction() { reactionPhase.value = 'idle'; reactionTimes.value = []; reactionRound.value = 0 }
function getReactionLabel(ms: number) {
  if (ms < 250) return { label: 'Excellent — brain speed fully recovered',         color: '#1B7C3D' }
  if (ms < 350) return { label: 'Good — cognitive recovery progressing well',      color: '#1A4FAB' }
  if (ms < 450) return { label: 'Fair — continue recovery protocol',               color: '#E65100' }
  return             { label: 'Slow — brain still recovering, do not rush return', color: '#C62828' }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SECTION 10 — RECOVERY JOURNAL
// Daily free-text entry saved to localStorage under key 'concovery_journal'
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
  if (existing >= 0) journalEntries.value[existing] = entry
  else               journalEntries.value.push(entry)
  localStorage.setItem('concovery_journal', JSON.stringify(journalEntries.value))
  journalSaved.value = true
  setTimeout(() => { journalSaved.value = false }, 2000)
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SECTION 11 — EXPANDABLE STAGE TIMELINE (bottom of page)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const expandedStage = ref<number | null>(null)

function toggleStage(stageId: number) {
  expandedStage.value = expandedStage.value === stageId ? null : stageId
}
function getDaysForStage(stageId: number) {
  return Object.entries(dayData)
    .filter(([, d]) => d.stage === stageId)
    .map(([day, d]) => ({ day: parseInt(day), ...d }))
}
function jumpToDay(day: number) {
  selectedDay.value = day
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SECTION 12 — LIFECYCLE HOOKS
// onMounted: restore all localStorage data + check if returning from ExercisePage
// onUnmounted: clear all timers to prevent memory leaks
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

onMounted(() => {
  // Restore injury date
  const savedDate = localStorage.getItem('concovery_injury_date')
  if (savedDate) { injuryDate.value = savedDate; calculateDays(savedDate) }

  // Restore activity checklist
  const savedActivities = localStorage.getItem('concovery_activities')
  if (savedActivities) checkedActivities.value = JSON.parse(savedActivities)

  // Restore sleep history and mark today as already submitted if applicable
  const savedSleep = localStorage.getItem('concovery_sleep')
  if (savedSleep) {
    sleepHistory.value = JSON.parse(savedSleep)
    const todayStr     = new Date().toISOString().split('T')[0]
    const todaySleep   = sleepHistory.value.find(s => s.date === todayStr)
    if (todaySleep) { sleepQuality.value = todaySleep.quality as any; sleepSubmitted.value = true }
  }

  // Restore journal
  const savedJournal = localStorage.getItem('concovery_journal')
  if (savedJournal) journalEntries.value = JSON.parse(savedJournal)

  // Restore cognitive test history
  const savedCognitive = localStorage.getItem('concovery_cognitive')
  if (savedCognitive) cognitiveHistory.value = JSON.parse(savedCognitive)

  // ── Check if returning from ExercisePage ──────────────────────────────
  // ExercisePage sets this flag when exercises are complete or skipped.
  // We reopen the check-in modal at the journal step automatically.
  const returnFlag = localStorage.getItem('concovery_return_modal')
  if (returnFlag === 'true') {
    localStorage.removeItem('concovery_return_modal')
    showCheckInModal.value = true
    // Jump to journal step (last step — 4 on Stage 2+, 3 on Stage 1)
    checkInStep.value = currentStage.value && currentStage.value >= 2 ? 4 : 3
  }
})

onUnmounted(() => {
  if (breathingInterval) clearInterval(breathingInterval)
  if (reactionTimeout)   clearTimeout(reactionTimeout)
  if (cognitiveTimeout)  clearTimeout(cognitiveTimeout)
})

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SECTION 13 — COMPUTED PROPERTIES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Which AIS stage the user is currently in (1–6)
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

// Which day is shown in the brain status section
// selectedDay = user clicked a day on timeline (preview mode)
// null = show their actual current day
const viewingDay = computed(() => {
  if (selectedDay.value !== null) return selectedDay.value
  if (daysSinceInjury.value)      return Math.min(daysSinceInjury.value, 21)
  return null
})

// Data for the currently viewed day
const viewingDayData = computed(() => {
  if (!viewingDay.value) return null
  return dayData[viewingDay.value]
})

// True when the user is viewing their actual current day (not a preview)
const isViewingToday = computed(() => {
  if (!daysSinceInjury.value || selectedDay.value === null) return true
  return selectedDay.value === Math.min(daysSinceInjury.value, 21)
})

// Days remaining until return-to-play eligibility
const daysUntilReturn = computed(() => {
  if (!daysSinceInjury.value) return null
  return Math.max(0, 21 - daysSinceInjury.value)
})

// True if user answered YES to any symptom question
const hasSymptoms = computed(() => symptomAnswers.value.some(a => a === true))

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SECTION 14 — CORE METHODS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function calculateDays(dateStr: string) {
  const injury   = new Date(dateStr)
  const now      = new Date()
  const diffDays = Math.ceil(Math.abs(now.getTime() - injury.getTime()) / (1000 * 60 * 60 * 24))
  daysSinceInjury.value    = diffDays
  selectedDay.value        = null
  symptomStep.value        = 0
  symptomAnswers.value     = [null, null, null]
  showSymptomSection.value = false
  localStorage.setItem('concovery_injury_date', dateStr)
}

watch(injuryDate, (val) => { if (val) calculateDays(val) })

function getDayStatus(day: number): 'past' | 'today' | 'future' {
  if (!daysSinceInjury.value) return 'future'
  if (day < daysSinceInjury.value)                 return 'past'
  if (day === Math.min(daysSinceInjury.value, 21)) return 'today'
  return 'future'
}

function getStageStatus(stageId: number): 'complete' | 'current' | 'upcoming' {
  if (!currentStage.value)            return 'upcoming'
  if (stageId < currentStage.value)   return 'complete'
  if (stageId === currentStage.value) return 'current'
  return 'upcoming'
}
</script>

<template>
  <div class="bg-white min-h-screen">

    <!-- ══ HERO ══════════════════════════════════════════════════════════════ -->
    <section style="background:#0A1628;" class="text-white">
      <div class="max-w-[1200px] mx-auto px-10 py-20">
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
    <section class="bg-white py-28">
      <div class="max-w-[1200px] mx-auto px-10">
        <div class="max-w-2xl mx-auto text-center">
          <h2 class="text-3xl font-bold text-[#1A1A1A] mb-8">When did you get your concussion?</h2>

          <div class="relative inline-block mb-10">
            <button @click="showCalendar = !showCalendar" class="inline-flex items-center gap-3 border-2 border-[#1A4FAB] rounded-xl px-6 py-4 bg-white hover:bg-[#F5F8FF] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A4FAB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              <span class="text-xl font-semibold text-[#1A1A1A]">{{ injuryDate ? formatDisplayDate(injuryDate) : 'Select a date' }}</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1A4FAB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </button>

            <!-- Calendar dropdown -->
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

          <!-- Day counter card -->
          <Transition name="fade-scale">
            <div v-if="daysSinceInjury !== null" class="bg-white rounded-2xl border border-[#EBEBEB] shadow-lg p-8">
              <div class="text-6xl font-black text-[#1A4FAB] mb-2" style="letter-spacing:-0.03em;">You are on Day {{ daysSinceInjury }}</div>
              <p class="text-lg text-[#5A7A9B] mb-6">of your 21-day recovery</p>

              <!-- 21-day interactive timeline — click any day to preview it -->
              <div class="mb-6">
                <div class="flex justify-between text-sm text-[#5A7A9B] mb-3 px-1">
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
                      class="text-sm font-bold transition-all"
                      :class="selectedDay === day || getDayStatus(day) === 'today' ? 'text-[#1A4FAB]' : 'text-transparent group-hover:text-[#5A7A9B]'"
                    >{{ day }}</span>
                  </button>
                </div>
                <div class="flex gap-4 justify-center">
                  <div class="flex items-center gap-1.5"><div class="w-3 h-1.5 rounded-full bg-[#1B7C3D]"/><span class="text-sm text-[#5A7A9B]">Past</span></div>
                  <div class="flex items-center gap-1.5"><div class="w-3 h-1.5 rounded-full bg-[#1A4FAB]"/><span class="text-sm text-[#5A7A9B]">Today</span></div>
                  <div class="flex items-center gap-1.5"><div class="w-3 h-1.5 rounded-full bg-[#EBEBEB]"/><span class="text-sm text-[#5A7A9B]">Upcoming</span></div>
                </div>
              </div>

              <p v-if="daysUntilReturn && daysUntilReturn > 0" class="text-[#5A7A9B] mb-4 text-sm">{{ daysUntilReturn }} days until you can return to play</p>
              <p v-else-if="daysUntilReturn === 0" class="text-[#1B7C3D] font-semibold mb-4 text-sm">You have reached Day 21 — seek medical clearance before returning</p>
              <span v-if="currentStage" class="inline-block bg-[#1A4FAB] text-white text-base font-semibold px-5 py-2 rounded-full">
                Stage {{ currentStage }} — {{ stages[currentStage - 1].name }}
              </span>
            </div>
          </Transition>
        </div>
      </div>
    </section>

    <!-- ══ BRAIN STATUS + ACTIVITIES ════════════════════════════════════════ -->
    <section v-if="viewingDay && viewingDayData" class="bg-[#F7F9FC] py-28">
      <div class="max-w-[1200px] mx-auto px-10">

        <!-- Preview banner — only visible when user is browsing a past/future day -->
        <div v-if="!isViewingToday" class="bg-[#1A4FAB]/10 border border-[#1A4FAB]/30 rounded-xl px-5 py-3 mb-6 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1A4FAB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            <span class="text-[#1A4FAB] text-base font-semibold">Previewing Day {{ viewingDay }} — {{ viewingDayData.stageName }}</span>
            <span class="text-[#5A7A9B] text-xs">(You are on Day {{ daysSinceInjury }})</span>
          </div>
          <button @click="selectedDay = null" class="text-xs text-[#1A4FAB] font-semibold hover:underline">Back to today</button>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">

          <!-- LEFT: Brain status -->
          <div class="bg-white rounded-2xl p-10 border border-[#EBEBEB] shadow-sm">
            <span class="inline-block bg-[#1A4FAB]/10 text-[#1A4FAB] text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
              Day {{ viewingDay }} — {{ viewingDayData.stageName }}
            </span>

            <!-- Brain recovery bar -->
            <div class="mb-6">
              <div class="flex justify-between text-sm text-[#5A7A9B] mb-1">
                <span>Brain recovery</span>
                <span class="font-bold text-[#1A4FAB]">{{ viewingDayData.brainRecoveryPct }}%</span>
              </div>
              <div class="h-5 bg-[#EBEBEB] rounded-full overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-700"
                  :style="{ width: `${viewingDayData.brainRecoveryPct}%`, background: viewingDayData.brainRecoveryPct < 40 ? '#C62828' : viewingDayData.brainRecoveryPct < 70 ? '#E65100' : '#1B7C3D' }"
                />
              </div>
            </div>

            <h3 class="text-base font-bold text-[#1A1A1A] mb-1">Today's goal</h3>
            <p class="text-[#1A4FAB] font-semibold text-sm mb-5">{{ viewingDayData.dailyGoal }}</p>
            <h3 class="text-base font-bold text-[#1A1A1A] mb-2">What's happening in your brain</h3>
            <p class="text-[#1A1A1A] text-base leading-relaxed mb-5">{{ viewingDayData.cellularProcess }}</p>

            <!-- Warning -->
            <div class="bg-[#C62828]/10 border border-[#C62828] rounded-xl p-5 flex gap-2 mb-4">
              <svg class="flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C62828" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              <p class="text-sm text-[#1A1A1A] font-semibold">{{ viewingDayData.warningSign }}</p>
            </div>

            <!-- Insight -->
            <div class="bg-[#1A4FAB]/5 border border-[#1A4FAB]/20 rounded-xl p-5 flex gap-2">
              <svg class="flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1A4FAB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <p class="text-sm text-[#1A1A1A] italic leading-relaxed">{{ viewingDayData.insight }}</p>
            </div>
            <p class="text-sm text-[#5A7A9B] italic mt-4">Source: Giza & Hovda, 2014 — Neurometabolic Cascade · AIS 2024</p>
          </div>

          <!-- RIGHT: Activities -->
          <div class="bg-white rounded-2xl p-10 border border-[#EBEBEB] shadow-sm">
            <h3 class="text-3xl font-bold text-[#1A1A1A] mb-8">What you can do today</h3>

            <!-- Allowed -->
            <div class="mb-6">
              <div class="flex items-center gap-2 text-[#1B7C3D] font-bold mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1B7C3D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                Allowed Today
              </div>
              <div class="space-y-3">
                <div
                  v-for="a in viewingDayData.allowed" :key="a.activity"
                  class="bg-[#F5FFF7] border border-[#1B7C3D]/20 rounded-xl p-5"
                  :class="isActivityChecked(`${viewingDay}-${a.activity}`) && !a.interactive ? 'opacity-60' : ''"
                >
                  <div class="flex items-start gap-3">
                    <!-- Checkbox for physical activities -->
                    <button
                      v-if="!a.interactive"
                      @click="toggleActivity(`${viewingDay}-${a.activity}`)"
                      class="flex-shrink-0 mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center transition-all"
                      :class="isActivityChecked(`${viewingDay}-${a.activity}`) ? 'bg-[#1B7C3D] border-[#1B7C3D]' : 'border-[#1B7C3D]'"
                    >
                      <svg v-if="isActivityChecked(`${viewingDay}-${a.activity}`)" xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                    </button>
                    <!-- Play icon for interactive widgets -->
                    <svg v-else class="flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1A4FAB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>

                    <div class="flex-1">
                      <div class="font-semibold text-[#1A1A1A] text-sm mb-1" :class="isActivityChecked(`${viewingDay}-${a.activity}`) && !a.interactive ? 'line-through text-[#5A7A9B]' : ''">{{ a.activity }}</div>
                      <p class="text-sm text-[#5A7A9B] leading-relaxed mb-2">{{ a.detail }}</p>

                      <!-- ── BREATHING WIDGET ─────────────────────────── -->
                      <div v-if="a.interactive === 'breathing' && isViewingToday" class="mt-2">
                        <div v-if="!breathingActive && breathingPhase === 'idle'">
                          <button @click="startBreathing" class="text-xs bg-[#1A4FAB] text-white px-4 py-2 rounded-full font-semibold hover:bg-[#1440A0] transition-colors">Start breathing exercise</button>
                        </div>
                        <div v-else class="bg-[#F5F8FF] rounded-xl p-6 text-center">
                          <div class="relative w-16 h-16 mx-auto mb-2">
                            <svg class="w-16 h-16 -rotate-90" viewBox="0 0 80 80">
                              <circle cx="40" cy="40" r="34" stroke="#EBEBEB" stroke-width="6" fill="none"/>
                              <circle cx="40" cy="40" r="34" stroke="#1A4FAB" stroke-width="6" fill="none" :stroke-dasharray="`${(breathingProgress / 100) * 213.6} 213.6`" class="transition-all duration-1000"/>
                            </svg>
                            <div class="absolute inset-0 flex flex-col items-center justify-center">
                              <span class="text-sm font-bold text-[#1A4FAB] uppercase">{{ breathingPhase }}</span>
                              <span class="text-base font-black text-[#1A1A1A]">{{ breathingCount }}</span>
                            </div>
                          </div>
                          <p class="text-sm text-[#5A7A9B] mb-2">Cycle {{ breathingCycles + 1 }} of 3</p>
                          <button @click="stopBreathing" class="text-xs text-[#C62828] hover:underline">Stop</button>
                        </div>
                      </div>

                      <!-- ── COGNITIVE WIDGET ─────────────────────────── -->
                      <div v-if="a.interactive === 'cognitive' && isViewingToday" class="mt-2">
                        <div v-if="cognitivePhase === 'idle'">
                          <button @click="startCognitiveTest" class="text-xs bg-[#1A4FAB] text-white px-4 py-2 rounded-full font-semibold hover:bg-[#1440A0] transition-colors">Start digit span test</button>
                          <span v-if="cognitiveHistory.length > 0" class="text-sm text-[#5A7A9B] ml-2">
                            Last: {{ cognitiveHistory[cognitiveHistory.length - 1].correct ? 'Correct' : 'Incorrect' }} — {{ cognitiveHistory[cognitiveHistory.length - 1].length }} digits
                          </span>
                        </div>
                        <div v-else-if="cognitivePhase === 'showing'" class="bg-[#F5F8FF] border border-[#1A4FAB]/20 rounded-xl p-6 text-center">
                          <p class="text-sm text-[#5A7A9B] mb-3">Watch the digits carefully</p>
                          <div class="h-16 flex items-center justify-center">
                            <Transition name="fade-scale" mode="out-in">
                              <span v-if="cognitiveShowDigit !== null" :key="cognitiveShowDigit" class="text-5xl font-black text-[#1A4FAB]">{{ cognitiveShowDigit }}</span>
                              <span v-else class="text-5xl font-black text-[#EBEBEB]">—</span>
                            </Transition>
                          </div>
                          <p class="text-sm text-[#5A7A9B] mt-2">{{ cognitiveCurrentIndex }} of {{ cognitiveSequence.length }} shown</p>
                        </div>
                        <div v-else-if="cognitivePhase === 'input'" class="bg-[#F5F8FF] border border-[#1A4FAB]/20 rounded-xl p-6">
                          <p class="text-sm text-[#5A7A9B] mb-3 text-center">Enter the digits in order</p>
                          <div class="flex gap-1 justify-center mb-3 min-h-[36px] flex-wrap">
                            <div v-for="(digit, i) in cognitiveInput" :key="i" class="w-8 h-8 bg-[#1A4FAB] text-white rounded-lg flex items-center justify-center font-bold text-sm">{{ digit }}</div>
                            <div v-for="i in (cognitiveSequence.length - cognitiveInput.length)" :key="'e'+i" class="w-8 h-8 bg-white border-2 border-[#EBEBEB] rounded-lg"/>
                          </div>
                          <div class="grid grid-cols-3 gap-1 mb-2">
                            <button v-for="n in [1,2,3,4,5,6,7,8,9]" :key="n" @click="tapCognitiveDigit(n)" class="py-2 bg-white border border-[#EBEBEB] rounded-lg text-sm font-bold text-[#1A1A1A] hover:bg-[#1A4FAB] hover:text-white transition-colors">{{ n }}</button>
                          </div>
                          <div class="grid grid-cols-3 gap-1">
                            <button @click="deleteCognitiveInput" class="py-2 bg-white border border-[#EBEBEB] rounded-lg text-sm font-bold text-[#C62828] hover:bg-[#FFF5F5] transition-colors">Del</button>
                            <button @click="tapCognitiveDigit(0)" class="py-2 bg-white border border-[#EBEBEB] rounded-lg text-sm font-bold text-[#1A1A1A] hover:bg-[#1A4FAB] hover:text-white transition-colors">0</button>
                            <div/>
                          </div>
                        </div>
                        <div v-else-if="cognitivePhase === 'result'" class="rounded-xl p-6 text-center" :class="cognitiveResult === 'correct' ? 'bg-[#1B7C3D]/10 border border-[#1B7C3D]' : 'bg-[#C62828]/10 border border-[#C62828]'">
                          <p class="font-bold text-sm mb-1" :class="cognitiveResult === 'correct' ? 'text-[#1B7C3D]' : 'text-[#C62828]'">{{ cognitiveResult === 'correct' ? 'Correct sequence' : 'Incorrect sequence' }}</p>
                          <p class="text-sm text-[#5A7A9B] mb-1">Sequence: {{ cognitiveSequence.join(' — ') }}</p>
                          <p class="text-sm text-[#5A7A9B] mb-3">Your input: {{ cognitiveInput.join(' — ') }}</p>
                          <button @click="resetCognitive" class="text-xs text-[#1A4FAB] hover:underline">Try again</button>
                        </div>
                      </div>

                      <!-- ── REACTION TIME WIDGET ─────────────────────── -->
                      <div v-if="a.interactive === 'reaction' && isViewingToday" class="mt-2">
                        <div v-if="reactionPhase === 'idle'">
                          <button @click="startReactionTest" class="text-xs bg-[#1A4FAB] text-white px-4 py-2 rounded-full font-semibold hover:bg-[#1440A0] transition-colors">Start reaction test</button>
                        </div>
                        <div v-else-if="reactionPhase === 'waiting'" @click="tapReaction" class="bg-[#F5F8FF] border-2 border-[#1A4FAB] rounded-xl p-5 text-center cursor-pointer hover:bg-[#EEF3FF] transition-colors">
                          <p class="text-xs font-semibold text-[#1A1A1A] mb-1">Round {{ reactionRound }} of 5</p>
                          <p class="text-sm text-[#5A7A9B]">Wait for the green circle...</p>
                          <div class="w-10 h-10 rounded-full bg-[#EBEBEB] mx-auto mt-2"/>
                        </div>
                        <div v-else-if="reactionPhase === 'ready'" @click="tapReaction" class="bg-[#1B7C3D]/10 border-2 border-[#1B7C3D] rounded-xl p-5 text-center cursor-pointer hover:bg-[#1B7C3D]/20 transition-colors">
                          <p class="text-xs font-semibold text-[#1A1A1A] mb-2">Tap now</p>
                          <div class="w-10 h-10 rounded-full bg-[#1B7C3D] mx-auto animate-pulse"/>
                        </div>
                        <div v-else-if="reactionPhase === 'result'" class="bg-[#F5F8FF] rounded-xl p-5 text-center">
                          <p class="text-base font-black text-[#1A4FAB]">{{ reactionResult }}ms</p>
                          <p class="text-xs font-semibold mb-2" :style="{ color: getReactionLabel(reactionResult).color }">{{ getReactionLabel(reactionResult).label }}</p>
                          <button @click="resetReaction" class="text-sm text-[#5A7A9B] hover:underline">Test again</button>
                        </div>
                      </div>

                      <!-- Preview note for interactive items on non-current days -->
                      <div v-if="a.interactive && !isViewingToday" class="mt-2">
                        <span class="text-sm text-[#5A7A9B] italic">Available on Day {{ viewingDay }} when you reach it</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Restricted -->
            <div class="mb-6">
              <div class="flex items-center gap-2 text-[#C62828] font-bold mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C62828" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                Not Today
              </div>
              <div class="space-y-2">
                <div v-for="r in viewingDayData.restricted" :key="r" class="flex items-start gap-3 bg-[#FFF5F5] border border-[#C62828]/20 rounded-xl p-5">
                  <span class="text-[#C62828] font-bold flex-shrink-0 text-sm">✗</span>
                  <span class="text-[#1A1A1A] text-sm">{{ r }}</span>
                </div>
              </div>
            </div>

            <div class="bg-[#E65100]/10 border border-[#E65100] rounded-xl p-6 flex gap-3">
              <svg class="flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E65100" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              <p class="text-sm text-[#1A1A1A] font-semibold">If any symptoms return — stop immediately and go back to Stage 1</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ DAILY CHECK-IN BUTTON ══════════════════════════════════════════════ -->
    <!--
      Only shown when user is viewing their actual current day.
      Opens the modal for the 4-step check-in flow.
    -->
    <section v-if="daysSinceInjury && isViewingToday" class="bg-white py-16">
      <div class="max-w-[1200px] mx-auto px-10 text-center">
        <div class="bg-[#F5F8FF] border border-[#1A4FAB]/20 rounded-2xl p-8 max-w-xl mx-auto">
          <h2 class="text-xl font-bold text-[#1A1A1A] mb-2">Complete today's check-in</h2>
          <p class="text-[#5A7A9B] text-sm mb-6">
            Takes about 3 minutes. Track your sleep, symptoms{{ currentStage && currentStage >= 2 ? ', exercises' : '' }}, and how you feel today.
          </p>
          <!-- Step dots preview -->
          <div class="flex gap-2 justify-center mb-6">
            <div v-for="i in totalCheckInSteps" :key="i" class="w-2 h-2 rounded-full bg-[#EBEBEB]" />
          </div>
          <button
            @click="openCheckIn"
            class="bg-[#1A4FAB] text-white px-10 py-5 rounded-full font-semibold text-base hover:bg-[#1440A0] transition-colors flex items-center gap-3 mx-auto"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            Start today's check-in
          </button>
        </div>
      </div>
    </section>

    <!-- ══ DAILY CHECK-IN MODAL ════════════════════════════════════════════════
      STEP 1: Sleep quality (3 buttons)
      STEP 2: Symptom check (conversational yes/no questions)
      STEP 3: Neck exercises — shows preview list + "Start exercises" button
              which navigates to /exercises (ExercisePage.vue)
              When user returns, onMounted reopens modal at Step 4 automatically
      STEP 4: Recovery journal (free text, saves locally)
    ════════════════════════════════════════════════════════════════════════ -->
    <Transition name="modal">
      <div
        v-if="showCheckInModal"
        class="fixed inset-0 z-50 flex items-center justify-center"
        style="background: rgba(10,22,40,0.85); backdrop-filter: blur(4px);"
      >
        <div class="bg-white rounded-3xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden">

          <!-- Modal header: step counter + progress bar + close button -->
          <div class="px-10 pt-10 pb-8 border-b border-[#EBEBEB]">
            <div class="flex items-center justify-between mb-4">
              <span class="text-sm font-semibold text-[#5A7A9B] uppercase tracking-widest">
                Step {{ checkInStep }} of {{ totalCheckInSteps }}
              </span>
              <button @click="closeCheckIn" class="w-8 h-8 rounded-full bg-[#F7F9FC] flex items-center justify-center hover:bg-[#EBEBEB] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5A7A9B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
            <div class="h-1.5 bg-[#EBEBEB] rounded-full overflow-hidden">
              <div
                class="h-full bg-[#1A4FAB] rounded-full transition-all duration-500"
                :style="{ width: `${(checkInStep / totalCheckInSteps) * 100}%` }"
              />
            </div>
          </div>

          <!-- Modal body: one step at a time -->
          <div class="px-10 py-10 min-h-[440px]">
            <Transition name="slide-up" mode="out-in">

              <!-- ── STEP 1: SLEEP ─────────────────────────────────────── -->
              <div v-if="checkInStep === 1" key="sleep">
                <div class="text-[#1A4FAB] text-xs font-semibold tracking-widest uppercase mb-2">Sleep</div>
                <h3 class="text-3xl font-bold text-[#1A1A1A] mb-3">How did you sleep last night?</h3>
                <p class="text-[#5A7A9B] text-base mb-10">Sleep quality is one of the strongest predictors of concussion recovery speed.</p>

                <!-- If not yet submitted today — show 3 options -->
                <div v-if="!sleepSubmitted" class="flex flex-col gap-3">
                  <button @click="submitSleep('well'); nextCheckInStep()" class="w-full py-4 rounded-xl border-2 font-semibold text-sm transition-all border-[#1B7C3D] text-[#1B7C3D] hover:bg-[#1B7C3D] hover:text-white">Well — slept through the night</button>
                  <button @click="submitSleep('okay'); nextCheckInStep()" class="w-full py-4 rounded-xl border-2 font-semibold text-sm transition-all border-[#E65100] text-[#E65100] hover:bg-[#E65100] hover:text-white">Okay — some disruptions</button>
                  <button @click="submitSleep('poorly'); nextCheckInStep()" class="w-full py-4 rounded-xl border-2 font-semibold text-sm transition-all border-[#C62828] text-[#C62828] hover:bg-[#C62828] hover:text-white">Poorly — struggled to sleep</button>
                </div>

                <!-- Already submitted today — show summary + continue -->
                <div v-else>
                  <div class="bg-[#F7F9FC] border border-[#EBEBEB] rounded-xl p-6 flex items-center justify-between mb-6">
                    <div class="flex items-center gap-3">
                      <div class="w-3 h-3 rounded-full" :style="{ background: sleepQuality === 'well' ? '#1B7C3D' : sleepQuality === 'okay' ? '#E65100' : '#C62828' }"/>
                      <span class="text-base font-semibold text-[#1A1A1A] capitalize">Slept {{ sleepQuality }} last night</span>
                    </div>
                    <button @click="sleepSubmitted = false; sleepQuality = null" class="text-sm text-[#5A7A9B] hover:underline">Change</button>
                  </div>
                  <!-- 3 consecutive poor nights warning -->
                  <div v-if="consecutivePoorSleep" class="bg-[#C62828]/10 border border-[#C62828] rounded-xl p-6 flex gap-3 mb-6">
                    <svg class="flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C62828" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                    <p class="text-sm text-[#1A1A1A] font-semibold">Three consecutive nights of poor sleep — mention this to your GP.</p>
                  </div>
                  <button @click="nextCheckInStep" class="w-full bg-[#1A4FAB] text-white py-5 rounded-full font-semibold hover:bg-[#1440A0] transition-colors">Continue</button>
                </div>
              </div>

              <!-- ── STEP 2: SYMPTOMS ──────────────────────────────────── -->
              <div v-else-if="checkInStep === 2" key="symptoms">
                <div class="text-[#1A4FAB] text-xs font-semibold tracking-widest uppercase mb-2">Symptoms</div>
                <h3 class="text-3xl font-bold text-[#1A1A1A] mb-3">How are you feeling today?</h3>
                <p class="text-[#5A7A9B] text-base mb-10">Answer honestly — this affects your recovery timeline.</p>

                <!-- Not started yet -->
                <div v-if="symptomStep === 0" class="text-center">
                  <button @click="startSymptomCheck" class="w-full bg-[#1A4FAB] text-white py-5 rounded-full font-semibold hover:bg-[#1440A0] transition-colors">Start symptom check</button>
                </div>

                <!-- Active question -->
                <div v-else-if="symptomStep >= 1 && symptomStep <= 3">
                  <div class="text-sm font-semibold text-[#5A7A9B] uppercase tracking-widest mb-4 text-center">Question {{ symptomStep }} of 3</div>
                  <Transition name="slide-up" mode="out-in">
                    <div :key="symptomStep" class="text-center">
                      <div class="bg-[#F7F9FC] border-2 border-[#EBEBEB] rounded-2xl p-8 mb-6">
                        <h3 class="text-xl font-bold text-[#1A1A1A] mb-6">{{ symptomQuestions[symptomStep - 1] }}</h3>
                        <div class="flex gap-4 justify-center">
                          <button @click="answerSymptom(false)" class="flex-1 max-w-[130px] py-4 rounded-full font-bold border-2 border-[#1B7C3D] text-[#1B7C3D] hover:bg-[#1B7C3D] hover:text-white transition-all">No</button>
                          <button @click="answerSymptom(true)" class="flex-1 max-w-[130px] py-4 rounded-full font-bold border-2 border-[#C62828] text-[#C62828] hover:bg-[#C62828] hover:text-white transition-all">Yes</button>
                        </div>
                      </div>
                      <div class="flex justify-center gap-2">
                        <div v-for="i in 3" :key="i" class="w-2 h-2 rounded-full transition-all" :class="i <= symptomStep ? 'bg-[#1A4FAB]' : 'bg-[#EBEBEB]'" />
                      </div>
                    </div>
                  </Transition>
                </div>

                <!-- Result -->
                <div v-else-if="symptomStep === 4">
                  <!-- Symptom free -->
                  <div v-if="!hasSymptoms" class="bg-[#1B7C3D]/10 border-2 border-[#1B7C3D] rounded-2xl p-8 text-center mb-6">
                    <svg class="mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#1B7C3D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    <p class="text-lg font-bold text-[#1A1A1A] mb-1">You are clear for today.</p>
                    <p class="text-[#5A7A9B] text-sm">Continue with Stage {{ currentStage }} activities.</p>
                  </div>
                  <!-- Symptoms present -->
                  <div v-else class="bg-[#C62828]/10 border-2 border-[#C62828] rounded-2xl p-8 text-center mb-6">
                    <svg class="mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#C62828" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                    <p class="text-lg font-bold text-[#1A1A1A] mb-1">Stop all activity today.</p>
                    <p class="text-[#5A7A9B] text-sm mb-4">See a GP or sports doctor before continuing.</p>
                    <router-link to="/locatesupport" @click="closeCheckIn">
                      <button class="bg-[#C62828] text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-[#B71C1C] transition-colors flex items-center gap-2 mx-auto">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                        Find a clinic near me
                      </button>
                    </router-link>
                  </div>
                  <button @click="nextCheckInStep" class="w-full bg-[#1A4FAB] text-white py-5 rounded-full font-semibold hover:bg-[#1440A0] transition-colors">Continue</button>
                </div>
              </div>

              <!-- ── STEP 3: NECK EXERCISES (Stage 2+ only) ───────────────
                Shows a preview list of the 3 exercises.
                "Start neck exercises" navigates to /exercises (ExercisePage.vue).
                ExercisePage saves a localStorage flag on completion/skip.
                When user returns, onMounted reads that flag and reopens
                this modal automatically at the journal step.
              ─────────────────────────────────────────────────────────── -->
              <div v-else-if="checkInStep === 3 && currentStage && currentStage >= 2" key="exercises">
                <div class="text-[#1A4FAB] text-xs font-semibold tracking-widest uppercase mb-2">Neck Exercises</div>
                <h3 class="text-3xl font-bold text-[#1A1A1A] mb-3">Time for your neck exercises</h3>
                <p class="text-[#5A7A9B] text-sm mb-6">
                  You will be taken to a guided exercise page with camera support.
                  When you are done, you will return here automatically to complete the journal.
                </p>

                <!-- Exercise preview list -->
                <div class="space-y-3 mb-6">
                  <div
                    v-for="(def, idx) in exerciseDefinitions" :key="idx"
                    class="border rounded-xl p-6 flex items-center justify-between"
                    :class="'border-[#EBEBEB] bg-white'"
                  >
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-full bg-[#1A4FAB]/10 flex items-center justify-center flex-shrink-0">
                        <span class="text-sm font-bold text-[#1A4FAB]">{{ idx + 1 }}</span>
                      </div>
                      <div>
                        <p class="text-sm font-bold text-[#1A1A1A]">{{ def.name }}</p>
                        <p class="text-sm text-[#5A7A9B]">{{ def.sets }} sets × {{ def.reps }} reps</p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Navigate to ExercisePage — this closes the modal and pushes /exercises -->
                <button
                  @click="goToExercises"
                  class="w-full bg-[#1A4FAB] text-white py-5 rounded-full font-semibold hover:bg-[#1440A0] transition-colors flex items-center justify-center gap-2 mb-3"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                  Start neck exercises
                </button>

                <!-- Allow user to skip exercises and go to journal -->
                <button
                  @click="nextCheckInStep"
                  class="w-full py-3 rounded-full text-base font-semibold text-[#5A7A9B] hover:text-[#1A1A1A] transition-colors"
                >Skip for now</button>
              </div>

              <!-- ── STEP 4 (or Step 3 on Stage 1): JOURNAL ────────────── -->
              <div v-else key="journal">
                <div class="text-[#1A4FAB] text-xs font-semibold tracking-widest uppercase mb-2">Recovery Journal</div>
                <h3 class="text-3xl font-bold text-[#1A1A1A] mb-3">Write about your day</h3>
                <p class="text-[#5A7A9B] text-sm mb-6">One sentence is enough. Saves privately to this device only.</p>

                <div class="bg-[#F7F9FC] border border-[#EBEBEB] rounded-xl p-6 mb-4">
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-base font-semibold text-[#1A4FAB]">Day {{ daysSinceInjury }}</span>
                    <span class="text-sm text-[#5A7A9B]">{{ new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'long' }) }}</span>
                  </div>
                  <textarea
                    v-model="journalEntry"
                    placeholder="How are you feeling? Any symptoms? What did you manage to do today?"
                    rows="3"
                    class="w-full text-sm text-[#1A1A1A] bg-transparent resize-none focus:outline-none leading-relaxed"
                  />
                </div>

                <div class="flex gap-3">
                  <button
                    @click="saveJournalEntry(); closeCheckIn()"
                    :disabled="!journalEntry.trim()"
                    class="flex-1 bg-[#1A4FAB] text-white py-5 rounded-full font-semibold hover:bg-[#1440A0] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >{{ journalSaved ? 'Saved!' : 'Save and finish' }}</button>
                  <button @click="closeCheckIn" class="px-6 py-4 rounded-full text-base font-semibold text-[#5A7A9B] hover:text-[#1A1A1A] transition-colors">Skip</button>
                </div>
              </div>

            </Transition>
          </div>

          <!-- Modal footer: back button (hidden on step 1) -->
          <div v-if="checkInStep > 1" class="px-8 pb-8">
            <button @click="prevCheckInStep" class="text-sm text-[#5A7A9B] hover:text-[#1A1A1A] transition-colors flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              Back
            </button>
          </div>

        </div>
      </div>
    </Transition>

    <!-- ══ 6 STAGE TIMELINE — EXPANDABLE ══════════════════════════════════════ -->
    <section v-if="daysSinceInjury && currentStage" class="bg-white py-28">
      <div class="max-w-[1200px] mx-auto px-10">
        <div class="text-center mb-12">
          <h2 class="text-4xl font-bold text-[#1A1A1A] mb-4">Your full recovery journey</h2>
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
              class="w-full flex items-center justify-between p-7 transition-colors text-left"
              :class="{ 'bg-[#1A4FAB] text-white': getStageStatus(stage.id) === 'current', 'bg-[#1B7C3D]/10 text-[#1B7C3D]': getStageStatus(stage.id) === 'complete', 'bg-[#F7F9FC] text-[#5A7A9B]': getStageStatus(stage.id) === 'upcoming' }"
            >
              <div class="flex items-center gap-4">
                <div
                  class="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                  :class="{ 'bg-white/20': getStageStatus(stage.id) === 'current', 'bg-[#1B7C3D]': getStageStatus(stage.id) === 'complete', 'bg-[#EBEBEB]': getStageStatus(stage.id) === 'upcoming' }"
                >
                  <svg v-if="getStageStatus(stage.id) === 'complete'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                  <span v-else class="text-sm font-black" :class="{ 'text-white': getStageStatus(stage.id) === 'current', 'text-[#5A7A9B]': getStageStatus(stage.id) === 'upcoming' }">{{ stage.id }}</span>
                </div>
                <div>
                  <div class="font-bold text-base">{{ stage.name }}</div>
                  <div class="text-sm opacity-70 mt-1">Days {{ stage.days }}</div>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <span
                  class="text-sm font-bold px-3 py-1 rounded-full"
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
                    class="text-left bg-white border rounded-xl p-6 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
                    :class="dayEntry.day === daysSinceInjury ? 'border-[#1A4FAB] bg-[#F5F8FF]' : 'border-[#EBEBEB]'"
                  >
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-sm font-bold text-[#1A4FAB]">Day {{ dayEntry.day }}</span>
                      <span
                        class="text-sm font-bold px-2 py-0.5 rounded-full"
                        :class="dayEntry.day < (daysSinceInjury || 0) ? 'bg-[#1B7C3D]/10 text-[#1B7C3D]' : dayEntry.day === daysSinceInjury ? 'bg-[#1A4FAB] text-white' : 'bg-[#EBEBEB] text-[#5A7A9B]'"
                      >{{ dayEntry.day < (daysSinceInjury || 0) ? 'Done' : dayEntry.day === daysSinceInjury ? 'Today' : 'Upcoming' }}</span>
                    </div>
                    <div class="flex items-center gap-2 mb-2">
                      <div class="h-1.5 flex-1 bg-[#EBEBEB] rounded-full overflow-hidden">
                        <div class="h-full rounded-full" :style="{ width: `${dayEntry.brainRecoveryPct}%`, background: dayEntry.brainRecoveryPct < 40 ? '#C62828' : dayEntry.brainRecoveryPct < 70 ? '#E65100' : '#1B7C3D' }"/>
                      </div>
                      <span class="text-sm font-bold text-[#5A7A9B]">{{ dayEntry.brainRecoveryPct }}%</span>
                    </div>
                    <p class="text-sm text-[#5A7A9B] leading-relaxed line-clamp-2">{{ dayEntry.dailyGoal }}</p>
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
      <div class="max-w-[1200px] mx-auto px-10">
        <h2 class="text-3xl font-bold text-white mb-4">Not sure if you are ready?</h2>
        <p class="text-white/60 mb-8 max-w-lg mx-auto leading-relaxed">Find the nearest GP, sports medicine clinic, or hospital for a professional assessment.</p>
        <router-link to="/locatesupport">
          <button class="bg-[#1A4FAB] text-white px-10 py-5 rounded-full font-semibold hover:bg-[#1440A0] transition-colors flex items-center gap-2 mx-auto mb-4">
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
.modal-enter-active, .modal-leave-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; transform: scale(0.96); }
</style>
