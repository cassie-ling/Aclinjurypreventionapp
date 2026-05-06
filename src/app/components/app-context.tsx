import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export interface Exercise {
  id: string;
  name: string;
  duration: number; // seconds
  description: string;
  instructions: string[];
  // Optional workout structure for multi-set exercises.
  sets?: number; // number of work sets
  restBetweenSets?: number; // seconds rest between sets (not shown as a separate exercise)
  restAfterExercise?: number; // seconds rest after completing the exercise (before next exercise)
  // Optional per-set labels (e.g. Right/Left) used by the player UI.
  setLabels?: string[]; // length should be `sets` if provided
}

export interface Routine {
  id: string;
  title: string;
  description: string;
  duration: number; // minutes
  category: string;
  image: string;
  exercises: Exercise[];
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  minutesRequired: number;
  icon: string;
  earned: boolean;
}

interface AppState {
  favorites: string[];
  totalMinutes: number;
  completedRoutines: string[];
  badges: Badge[];
}

interface AppContextType extends AppState {
  toggleFavorite: (routineId: string) => void;
  isFavorite: (routineId: string) => boolean;
  addMinutes: (minutes: number) => void;
  markRoutineCompleted: (routineId: string) => void;
  routines: Routine[];
}

const defaultBadges: Badge[] = [
  { id: "b1", title: "First Steps", description: "Complete your first routine", minutesRequired: 0, icon: "🌱", earned: false },
  { id: "b2", title: "Getting Started", description: "Exercise for 10 total minutes", minutesRequired: 10, icon: "⭐", earned: false },
  { id: "b3", title: "Building Habits", description: "Exercise for 30 total minutes", minutesRequired: 30, icon: "💪", earned: false },
  { id: "b4", title: "Knee Guardian", description: "Exercise for 50 total minutes", minutesRequired: 50, icon: "🛡️", earned: false },
  { id: "b5", title: "Century Club", description: "Exercise for 100 total minutes", minutesRequired: 100, icon: "💯", earned: false },
  { id: "b6", title: "ACL Warrior", description: "Exercise for 250 total minutes", minutesRequired: 250, icon: "🏆", earned: false },
  { id: "b7", title: "Prevention Pro", description: "Exercise for 500 total minutes", minutesRequired: 500, icon: "👑", earned: false },
];

//exercise routines
export const routines: Routine[] = [
  {
    id: "r1",
    title: "Before Practice - Short",
    description: "Activate knee stabilizers before training when short you're on time.",
    duration: 5,
    category: "Warm-Up",
    image: "https://img.freepik.com/free-photo/pastel-pink-vignette-concrete-textured-background_53876-129734.jpg?semt=ais_hybrid&w=740&q=80",
    exercises: [
      { id: "e1", name: "Jog", duration: 30, description: "Increases circulation, heart rate, and neurological stimulation.", instructions: ["Jog in place or small area", "Maintain upright posture with a light stride", "Land softly mid-foot"] },
      { id: "e2", name: "Side Shuffle", duration: 30, description: "Engages inner and outer thigh and improves lateral quickness.", instructions: ["Start in a partial squat", "Step wide with the lead foot", "Push off the trailing leg", "Avoid touching heels together"] },
      { id: "e3", name: "Forward Lunge", duration: 30, description: "Strengtens knee and hip extensor/flexor muscles.", instructions: ["Step forward with a long stride", "Keep front knee over the ankle", "Lower back knee toward the floor", "Maintain an upright, neutral torso", "Push back to starting position, alternate sides"] },
      { id: "e4", name: "Backward Lunge", duration: 30, description: "Strengtens knee and hip extensor/flexor muscles.", instructions: ["Step back with a long stride", "Keep front knee over the ankle", "Lower back knee toward the floor", "Maintain an upright, neutral torso", "Push forward to starting position, alternate sides"] },
      { id: "e5", name: "Heel Raise (R)", duration: 20, description: "Strengthens the ankle plantar flexors (calf muscle) and improves balance.", instructions: ["Balance on right foot with knee straight", "Rise up onto the ball of your foot", "Pause briefly at the top", "Lower your heel slowly with control"] },
      { id: "e6", name: "Heel Raise (L)", duration: 20, description: "Strengthens the ankle plantar flexors (calf muscle) and improves balance.", instructions: ["Balance on left foot with knee straight", "Rise up onto the ball of your foot", "Pause briefly at the top", "Lower your heel slowly with control"] },
      { id: "e7", name: "Lateral Pogo Jump", duration: 20, description: "A plyometric exercise to practice landing technique and lateral movement.", instructions: ["Stand with feet shoulder-width apart", "Keep knees slightly bent", "Hop laterally over a line or imaginary mark", "Land sofly on the balls of your feet", "Stay bouncy, minimize ground contact time for each jump"] },
      { id: "e8", name: "Forward/Backward Pogo Jump", duration: 20, description: "A plyometric exercise to practice landing technique.", instructions: ["Stand with feet shoulder-width apart", "Keep knees slightly bent", "Hop back and forth over a line or imaginary mark", "Land sofly on the balls of your feet", "Stay bouncy, minimize ground contact time for each jump"] },
      { id: "e9", name: "Single Leg Pogo Hop (R)", duration: 20, description: "A plyometric exercise to practice landing technique.", instructions: ["Balance on one leg with a slightly bent knee", "Hop forward and backward over a line", "Land softly on the ball of your foot", "Avoid snapping the knee into a straight position"] },
      { id: "e10", name: "Single Leg Pogo Hop (L)", duration: 20, description: "A plyometric exercise to practice landing technique.", instructions: ["Balance on one leg with a slightly bent knee", "Hop forward and backward over a line", "Land softly on the ball of your foot", "Avoid snapping the knee into a straight position"] },
      { id: "e11", name: "Squat Jump", duration: 20, description: "A plyometric exercise to practice landing technique.", instructions: ["Do not allow knees to cave in on landing", "Keep knees over ankles", "Stand with feet hip-width apart", "Bend knees and lower hips down into a squat", "Jump straight up as high as you can", "Land softly while bending knees"] },
      { id: "e12", name: "Jump Lunge", duration: 20, description: "A plyometric exercise to practice landing technique.", instructions: ["Keep knees over ankles", "Lunge forward with one leg, Push off front leg to jump", "Switch front leg while in the air", "Land in lunge position", "Repeat and alternate front leg"] },
      { id: "e13", name: "Lateral Skater Jump", duration: 20, description: "A plyometric exercise to engage hip abductors/adductors, practice landing technique, and lateral movement.", instructions: ["Start on right leg", "Bring left leg behind the right", "Push off and jump to the left", "Land of left foot", "Hold for two seconds and repeat on the left side"] },
    ],
  },
  {
    id: "r2",
    title: "Before Practice - Standard",
    description:
      "SportsMetrics WIPP - Medium intensity",
    duration: 10,
    category: "Warm-Up",
    image: "https://images.unsplash.com/photo-1615912265840-0207813af92e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    exercises: [
      { id: "r2e1", name: "Heel Walk", duration: 20, description: "Warms up the front of your ankles and shins.", instructions: ["Stand tall, toes lifted off the ground", "Take small steps forward on your heels", "Keep legs mostly straight", "Walk about 10–15 feet and turn if space is tight"] },
      { id: "r2e2", name: "Toe Walk", duration: 20, description: "Strengthens calves and steadies your ankles.", instructions: ["Rise onto the balls of both feet", "Walk forward with small quick steps", "Stay tall; avoid leaning too far forward"] },
      { id: "r2e3", name: "Leg Swing", duration: 30, description: "Loosens the hips and gets them ready to run.", instructions: ["Hold a wall or post for balance", "Swing one leg forward and back in a comfortable range", "Keep torso quiet; motion comes from the hip", "Switch legs halfway through"] },
      { id: "r2e4", name: "Backward Lunge", duration: 30, description: "Strengtens knee and hip extensor/flexor muscles.", instructions: ["Step back with a long stride", "Keep front knee over the ankle", "Lower back knee toward the floor", "Maintain an upright, neutral torso", "Push forward to starting position, alternate sides"] },
      { id: "r2e5", name: "Crossbody Knee Hug", duration: 30, description: "Opens the hips and glutes for side-to-side movement.", instructions: ["Stand on one leg", "Pull opposite knee toward chest", "Guide the knee slightly across the body", "Hold briefly, release, alternate"] },
      { id: "r2e6", name: "High Knees", duration: 20, description: "Drive knees up quickly while jogging in place.", instructions: ["Stand tall", "Drive right knee up to hip height", "Quickly switch to left knee", "Pump arms with each step", "Stay on balls of feet"] },
      { id: "r2e7", name: "Butt Kicks", duration: 20, description: "Kick heels toward your glutes while jogging.", instructions: ["Jog in place", "Kick heels toward glutes", "Keep torso upright", "Quick, light foot contacts", "Maintain steady rhythm"] },
      { id: "r2e8", name: "T Jumping", duration: 30, description: "Practices quick feet and soft landings in different directions.", instructions: ["Imagine a small T on the floor", "Jump forward, then lateral, then back to center", "Land softly with knees slightly bent", "Stay controlled; small hops are fine"] },
      { id: "r2e9", name: "Jump Lunge", duration: 30, description: "A plyometric exercise to practice landing technique.", instructions: ["Keep knees over ankles", "Lunge forward with one leg, Push off front leg to jump", "Switch front leg while in the air", "Land in lunge position", "Repeat and alternate front leg"] },
      { id: "r2e10", name: "Single Leg Lateral Pogo (R)", duration: 20, description: "A plyometric exercise to practice landing technique and lateral movement.", instructions: ["Balance on your right leg with a slightly bent knee", "Keep your hips and core steady", "Hop side to side over a line or imaginary mark", "Land softly on the ball of your foot", "Stay bouncy, minimize ground contact time for each jump"] },
      { id: "r2e11", name: "Single Leg Lateral Pogo (L)", duration: 20, description: "A plyometric exercise to practice landing technique and lateral movement.", instructions: ["Balance on your left leg with a slightly bent knee", "Keep your hips and core steady", "Hop side to side over a line or imaginary mark", "Land softly on the ball of your foot", "Stay bouncy, minimize ground contact time for each jump"] },
      { id: "r2e12", name: "Broad Jumps", duration: 30, description: "Jump forward for maximum distance.", instructions: ["Start in athletic stance", "Swing arms and jump forward", "Land softly on both feet", "Absorb with bent knees", "Walk back and repeat"] },
      { id: "r2e13", name: "Lateral Skater Jump", duration: 30, description: "A plyometric exercise to engage hip abductors/adductors, practice landing technique, and lateral movement.", instructions: ["Start on right leg", "Bring left leg behind the right", "Push off and jump to the left", "Land of left foot", "Hold for two seconds and repeat on the left side"] },
      { id: "r2e14", name: "Heel Raise (R)", duration: 20, description: "Strengthens the ankle plantar flexors (calf muscle) and improves balance.", instructions: ["Balance on right foot with knee straight", "Rise up onto the ball of your foot", "Pause briefly at the top", "Lower your heel slowly with control"] },
      { id: "r2e15", name: "Heel Raise (L)", duration: 20, description: "Strengthens the ankle plantar flexors (calf muscle) and improves balance.", instructions: ["Balance on left foot with knee straight", "Rise up onto the ball of your foot", "Pause briefly at the top", "Lower your heel slowly with control"] },
      { id: "r2e16", name: "Bird Dips (R)", duration: 20, description: "Builds balance and knee control on one leg.", instructions: ["Stand on your right leg, soft knee", "Hinge slightly at the hip with a controlled dip", "Return to tall posture", "Use a fingertip touch on a wall if needed"] },
      { id: "r2e17", name: "Bird Dips (L)", duration: 20, description: "Builds balance and knee control on one leg.", instructions: ["Stand on your left leg, soft knee", "Hinge slightly at the hip with a controlled dip", "Return to tall posture", "Use a fingertip touch on a wall if needed"] },
      { id: "r2e18", name: "Squat Hold", duration: 30, description: "Builds leg strength while you hold a squat.", instructions: ["Feet shoulder-width, toes slightly out", "Lower into a squat you can hold", "Keep chest up and knees over toes", "Breathe steadily"] },
      { id: "r2e19", name: "Push Up", duration: 30, description: "Strengthens chest, arms, and core.", instructions: ["Hands under shoulders, body straight", "Lower chest toward the floor", "Press back up", "Modify on knees if needed"] },
      { id: "r2e20", name: "Side Plank (R)", duration: 20, description: "Lateral core stability.", instructions: ["Lie on right side", "Prop up on right forearm", "Lift hips off ground", "Keep body in line", "Hold steady"] },
      { id: "r2e21", name: "Side Plank (L)", duration: 20, description: "Lateral core stability.", instructions: ["Lie on left side", "Prop up on left forearm", "Lift hips off ground", "Keep body in line", "Hold steady"] },
      { id: "r2e22", name: "Quick Feet Forward/Backward", duration: 30, description: "Trains quick feet for changing direction.", instructions: ["Stand straddling a line or crack", "Rapidly tap feet front and back over the line", "Stay low in an athletic stance", "Light, quick feet"] },
      { id: "r2e23", name: "Lateral Shuffle", duration: 30, description: "Shuffle quickly side to side in an athletic stance.", instructions: ["Start in athletic stance", "Shuffle quickly to the right", "Stay low with bent knees", "Shuffle back to the left", "Keep hips low throughout"] },
    ],
  },
  {
    id: "r3",
    title: "FIFA 11+ (Adapted)",
    description: "Proven to reduce ACL injuries by 50%. Adapted for solo training",
    duration: 20,
    category: "Warm up + Strength",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRP459TeUFcB-o3pvpkLB4_q2Fit5WAkHV9kQ&s",
    exercises: [
      { id: "r3e1", name: "Jog", duration: 30, description: "Easy jog to warm up.", instructions: ["Jog lightly in place or forward", "Stay tall with relaxed shoulders", "Land softly with quick, light steps"] },
      { id: "r3rest01", name: "Rest", duration: 15, description: "", instructions: ["Open the Gates"] },
      { id: "r3e2", name: "Open the Gates", duration: 30, description: "Hip mobility (open).", instructions: ["Step forward and lift knee to hip height", "Rotate knee outward to 'open' the hip", "Step down and repeat on the other side", "Stay tall; avoid leaning"] },
      { id: "r3rest02", name: "Rest", duration: 15, description: "", instructions: ["Close the Gates"] },
      { id: "r3e3", name: "Close the Gates", duration: 30, description: "Hip mobility (close).", instructions: ["Step forward with knee lifted to hip height", "Rotate knee inward across the body to 'close' the hip", "Step down and alternate sides", "Keep pelvis level and controlled"] },
      { id: "r3rest03", name: "Rest", duration: 15, description: "", instructions: ["Side Shuffle"] },
      { id: "r3e4", name: "Side Shuffle", duration: 30, description: "Lateral warm-up for hips/glutes.", instructions: ["Start in an athletic stance", "Shuffle side to side with quick steps", "Keep hips low and chest up", "Avoid crossing feet"] },
      { id: "r3rest04", name: "Rest", duration: 15, description: "", instructions: ["Forwards and Backwards Jog"] },
      { id: "r3e5", name: "Forwards and Backwards Jog", duration: 30, description: "Light change-of-direction jog.", instructions: ["Jog forward a few steps, then jog backward", "Stay light on your feet", "Keep knees soft and core engaged", "Maintain control—no sprinting"] },
      { id: "r3rest05", name: "Rest", duration: 15, description: "", instructions: ["Plank Progression (The Bench) — Set 1 of 3"] },

      {
        id: "r3e6s1",
        name: "Plank Progression (The Bench)",
        duration: 40,
        description: "The Bench: 3 sets (hold 20–30s). Straight line; keep back straight as a board.",
        instructions: [
          "Start on forearms with elbows under shoulders; body in a straight line",
          "Level 1: Static hold for 20–30 seconds",
          "Level 2: Alternate leg lifts, holding each lift for a count of 2",
          "Level 3: Single-leg lift/hold; keep hips level (no swaying)",
        ],
      },
      { id: "r3rest06", name: "Rest", duration: 10, description: "", instructions: ["Plank Progression (The Bench) — Set 2 of 3"] },
      {
        id: "r3e6s2",
        name: "Plank Progression (The Bench)",
        duration: 40,
        description: "The Bench: 3 sets (hold 20–30s). Straight line; keep back straight as a board.",
        instructions: [
          "Start on forearms with elbows under shoulders; body in a straight line",
          "Level 1: Static hold for 20–30 seconds",
          "Level 2: Alternate leg lifts, holding each lift for a count of 2",
          "Level 3: Single-leg lift/hold; keep hips level (no swaying)",
        ],
      },
      { id: "r3rest07", name: "Rest", duration: 10, description: "", instructions: ["Plank Progression (The Bench) — Set 3 of 3"] },
      {
        id: "r3e6s3",
        name: "Plank Progression (The Bench)",
        duration: 40,
        description: "The Bench: 3 sets (hold 20–30s). Straight line; don’t arch.",
        instructions: [
          "Start on forearms with elbows under shoulders; body in a straight line",
          "Level 1: Static hold for 20–30 seconds",
          "Level 2: Alternate leg lifts, holding each lift for a count of 2",
          "Level 3: Single-leg lift/hold; keep hips level (no swaying)",
        ],
      },
      { id: "r3rest08", name: "Rest", duration: 15, description: "", instructions: ["Side Plank Progression (Right) — Set 1 of 3"] },

      {
        id: "r3e7r1",
        name: "Side Plank Progression (Right)",
        duration: 30,
        description: "Sideways Bench: 3 sets/side (hold 20–30s). Keep hips steady.",
        instructions: [
          "Elbow under shoulder; body in a straight line",
          "Level 1: Static hold",
          "Level 2: Hip dips (lower and raise)",
          "Level 3: Top leg lift (slow up/down)",
        ],
      },
      { id: "r3rest09", name: "Rest", duration: 15, description: "", instructions: ["Side Plank Progression (Left) — Set 1 of 3"] },
      {
        id: "r3e7l1",
        name: "Side Plank Progression (Left)",
        duration: 30,
        description: "Sideways Bench: 3 sets/side (hold 20–30s). Keep hips steady.",
        instructions: [
          "Elbow under shoulder; body in a straight line",
          "Level 1: Static hold",
          "Level 2: Hip dips (lower and raise)",
          "Level 3: Top leg lift (slow up/down)",
        ],
      },
      { id: "r3rest10", name: "Rest", duration: 15, description: "", instructions: ["Side Plank Progression (Right) — Set 2 of 3"] },
      {
        id: "r3e7r2",
        name: "Side Plank Progression (Right)",
        duration: 30,
        description: "Sideways Bench: 3 sets/side (hold 20–30s). Keep hips steady.",
        instructions: [
          "Elbow under shoulder; body in a straight line",
          "Level 1: Static hold",
          "Level 2: Hip dips (lower and raise)",
          "Level 3: Top leg lift (slow up/down)",
        ],
      },
      { id: "r3rest11", name: "Rest", duration: 15, description: "", instructions: ["Side Plank Progression (Left) — Set 2 of 3"] },
      {
        id: "r3e7l2",
        name: "Side Plank Progression (Left)",
        duration: 30,
        description: "Sideways Bench: 3 sets/side (hold 20–30s). Keep hips steady.",
        instructions: [
          "Elbow under shoulder; body in a straight line",
          "Level 1: Static hold",
          "Level 2: Hip dips (lower and raise)",
          "Level 3: Top leg lift (slow up/down)",
        ],
      },
      { id: "r3rest12", name: "Rest", duration: 15, description: "", instructions: ["Side Plank Progression (Right) — Set 3 of 3"] },
      {
        id: "r3e7r3",
        name: "Side Plank Progression (Right)",
        duration: 30,
        description: "Sideways Bench: 3 sets/side (hold 20–30s). Keep hips steady; straight line.",
        instructions: [
          "Elbow under shoulder; body in a straight line",
          "Level 1: Static hold",
          "Level 2: Hip dips (lower and raise)",
          "Level 3: Top leg lift (slow up/down)",
        ],
      },
      { id: "r3rest13", name: "Rest", duration: 15, description: "", instructions: ["Side Plank Progression (Left) — Set 3 of 3"] },
      {
        id: "r3e7l3",
        name: "Side Plank Progression (Left)",
        duration: 30,
        description: "Sideways Bench: 3 sets/side (hold 20–30s). Keep hips steady; straight line.",
        instructions: [
          "Elbow under shoulder; body in a straight line",
          "Level 1: Static hold",
          "Level 2: Hip dips (lower and raise)",
          "Level 3: Top leg lift (slow up/down)",
        ],
      },
      { id: "r3rest14", name: "Rest", duration: 15, description: "", instructions: ["Nordic Curls / Hamstring Sliders"] },

      {
        id: "r3e8",
        name: "Nordic Curls / Hamstring Sliders",
        duration: 60,
        description: "Hamstrings: 1 set (60s). Slow forward lean; return with control.",
        instructions: [
          "Nordic: Kneel with ankles secured; body straight from shoulders to knees",
          "Lean forward under control; catch yourself with hands when needed",
          "Slider alternative: Bridge with heels on towels/sliders, slide out + pull in while keeping hips up",
          "Keep core braced; avoid arching your low back",
        ],
      },
      { id: "r3rest15", name: "Rest", duration: 15, description: "", instructions: ["Single-Leg Balance with Ball (Right)"] },

      {
        id: "r3e9r",
        name: "Single-Leg Balance While Holding Ball (Right)",
        duration: 30,
        description: "Hold the ball: 2 sets (30s/leg). Knee slightly flexed; avoid buckling inward.",
        instructions: [
          "Balance on the ball of your foot with knee slightly flexed",
          "Level 1: Hold the ball steady",
          "Level 2: Pass ball around your waist",
          "Level 3: Pass ball under your lifted knee",
        ],
      },
      { id: "r3rest16", name: "Rest", duration: 10, description: "", instructions: ["Single-Leg Balance with Ball (Left)"] },
      {
        id: "r3e9l",
        name: "Single-Leg Balance While Holding Ball (Left)",
        duration: 30,
        description: "Hold the ball: 2 sets (30s/leg). Knee slightly flexed; avoid buckling inward.",
        instructions: [
          "Balance on the ball of your foot with knee slightly flexed",
          "Level 1: Hold the ball steady",
          "Level 2: Pass ball around your waist",
          "Level 3: Pass ball under your lifted knee",
        ],
      },
      { id: "r3rest17", name: "Rest", duration: 15, description: "", instructions: ["Squat / Lunge / Single-Leg Squat Progression — Set 1 of 2"] },

      {
        id: "r3e10s1",
        name: "Squat / Lunge / Single-Leg Squat Progression",
        duration: 45,
        description: "2 sets. Squat-to-toe raise + walking lunges + supported one-leg squat; keep knees aligned over toes.",
        instructions: [
          "Level 1: Squat + toe raise at the top (control down; faster up)",
          "Level 2: Walking lunges (aim for ~90° hip/knee; torso upright)",
          "Level 3: Single-leg squat (lightly hold a wall/chair; keep knee from buckling inward)",
        ],
      },
      { id: "r3rest18", name: "Rest", duration: 10, description: "", instructions: ["Squat / Lunge / Single-Leg Squat Progression — Set 2 of 2"] },
      {
        id: "r3e10s2",
        name: "Squat / Lunge / Single-Leg Squat Progression",
        duration: 45,
        description: "2 sets. Squat-to-toe raise + walking lunges + supported one-leg squat; keep knees aligned over toes.",
        instructions: [
          "Level 1: Squat + toe raise at the top (control down; faster up)",
          "Level 2: Walking lunges (aim for ~90° hip/knee; torso upright)",
          "Level 3: Single-leg squat (lightly hold a wall/chair; keep knee from buckling inward)",
        ],
      },
      { id: "r3rest19", name: "Rest", duration: 15, description: "", instructions: ["Jump Progression — Set 1 of 2"] },

      {
        id: "r3e11s1",
        name: "Jump Progression (Vertical / Lateral / Box Jumps)",
        duration: 30,
        description: "Explosive jumps: 2 sets. Land on the balls of your feet; don’t let knees buckle inward.",
        instructions: [
          "Level 1: Vertical jumps (from a squat; jump up; land softly)",
          "Level 2: Lateral jumps (1 m side-to-side; control and balance)",
          "Level 3: Box/cross jumps (jump forward/back/side/diagonal; stay quick and controlled)",
        ],
      },
      { id: "r3rest20", name: "Rest", duration: 15, description: "", instructions: ["Jump Progression — Set 2 of 2"] },
      {
        id: "r3e11s2",
        name: "Jump Progression (Vertical / Lateral / Box Jumps)",
        duration: 30,
        description: "Explosive jumps: 2 sets. Land on the balls of your feet; don’t let knees buckle inward.",
        instructions: [
          "Level 1: Vertical jumps (from a squat; jump up; land softly)",
          "Level 2: Lateral jumps (1 m side-to-side; control and balance)",
          "Level 3: Box/cross jumps (jump forward/back/side/diagonal; stay quick and controlled)",
        ],
      },
      { id: "r3rest21", name: "Rest", duration: 15, description: "", instructions: ["Running Across the Pitch"] },

      {
        id: "r3e12",
        name: "Running Across the Pitch",
        duration: 30,
        description: "Run across at 75–80% pace. Jog back to recover.",
        instructions: [
          "Run across your space at a moderate pace",
          "Keep hips and knees slightly bent",
          "Jog back to recover",
        ],
      },
      { id: "r3rest22", name: "Rest", duration: 15, description: "", instructions: ["Bounding"] },
      {
        id: "r3e13",
        name: "Bounding",
        duration: 30,
        description: "Bounding: high knee lift; land on the balls of your feet; keep knees aligned.",
        instructions: [
          "High bounding steps with high knee lift",
          "Land gently on the balls of your feet",
          "Use exaggerated opposite arm/leg swing",
        ],
      },
      { id: "r3rest23", name: "Rest", duration: 15, description: "", instructions: ["Running with Sharp Cut"] },
      {
        id: "r3e14",
        name: "Running with Sharp Cut",
        duration: 30,
        description: "Plant & cut: outside leg plant + sharp change; knee doesn’t buckle inward.",
        instructions: [
          "Jog 4–5 steps, then plant on the outside leg and cut",
          "Accelerate 5–7 steps (80–90% pace), then decelerate",
          "Stay controlled on the plant leg",
        ],
      },
    ],
  }
];

const STORAGE_KEY = "protect-her-play-state";

function loadState(): AppState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return {
    favorites: [],
    totalMinutes: 0,
    completedRoutines: [],
    badges: defaultBadges,
  };
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(loadState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const toggleFavorite = useCallback((routineId: string) => {
    setState((prev) => ({
      ...prev,
      favorites: prev.favorites.includes(routineId)
        ? prev.favorites.filter((id) => id !== routineId)
        : [...prev.favorites, routineId],
    }));
  }, []);

  const isFavorite = useCallback(
    (routineId: string) => state.favorites.includes(routineId),
    [state.favorites]
  );

  const addMinutes = useCallback((minutes: number) => {
    setState((prev) => {
      const newTotal = prev.totalMinutes + minutes;
      const updatedBadges = prev.badges.map((badge) => ({
        ...badge,
        earned: badge.earned || newTotal >= badge.minutesRequired,
      }));
      return { ...prev, totalMinutes: newTotal, badges: updatedBadges };
    });
  }, []);

  const markRoutineCompleted = useCallback((routineId: string) => {
    setState((prev) => ({
      ...prev,
      completedRoutines: [...prev.completedRoutines, routineId],
    }));
  }, []);

  return (
    <AppContext.Provider
      value={{
        ...state,
        toggleFavorite,
        isFavorite,
        addMinutes,
        markRoutineCompleted,
        routines,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
