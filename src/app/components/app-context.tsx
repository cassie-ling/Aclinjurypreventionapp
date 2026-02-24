import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export interface Exercise {
  id: string;
  name: string;
  duration: number; // seconds
  description: string;
  instructions: string[];
}

export interface Routine {
  id: string;
  title: string;
  description: string;
  duration: number; // minutes
  difficulty: "Beginner" | "Intermediate" | "Advanced";
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

export const routines: Routine[] = [
  {
    id: "r1",
    title: "Quick Knee Shield",
    description: "A fast 5-minute routine to activate your knee stabilizers before practice. Perfect for busy days.",
    duration: 5,
    difficulty: "Beginner",
    category: "Warm-Up",
    image: "https://images.unsplash.com/photo-1675910518330-1843b4d03de1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW1hbGUlMjBhdGhsZXRlJTIwa25lZSUyMGV4ZXJjaXNlJTIwd2FybXVwfGVufDF8fHx8MTc3MTk3NjIxOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    exercises: [
      { id: "e1", name: "Bodyweight Squats", duration: 45, description: "Stand with feet shoulder-width apart, lower your hips back and down.", instructions: ["Stand tall, feet shoulder-width apart", "Push hips back and bend knees", "Keep chest up, knees tracking over toes", "Lower until thighs are parallel to floor", "Push through heels to stand"] },
      { id: "e2", name: "Standing Calf Raises", duration: 30, description: "Rise up on your toes, hold briefly, then lower.", instructions: ["Stand with feet hip-width apart", "Rise up on your toes slowly", "Hold at the top for 1 second", "Lower back down with control", "Repeat for the full duration"] },
      { id: "e3", name: "Lateral Lunges", duration: 45, description: "Step wide to one side, bending that knee while keeping the other leg straight.", instructions: ["Stand with feet together", "Take a wide step to the right", "Bend your right knee, push hips back", "Keep left leg straight", "Push back to start, alternate sides"] },
      { id: "e4", name: "Single-Leg Balance", duration: 30, description: "Stand on one leg for balance and ankle stability.", instructions: ["Stand on your right leg", "Lift left foot off the ground", "Keep hips level and core engaged", "Hold for 15 seconds", "Switch to the other leg"] },
      { id: "e5", name: "Glute Bridges", duration: 45, description: "Lie on your back, push through your heels to lift your hips.", instructions: ["Lie on your back, knees bent", "Feet flat on the floor, hip-width apart", "Push through heels to lift hips", "Squeeze glutes at the top", "Lower slowly and repeat"] },
    ],
  },
  {
    id: "r2",
    title: "ACL Power Protect",
    description: "A 10-minute comprehensive routine targeting the muscles that protect your ACL during play.",
    duration: 10,
    difficulty: "Intermediate",
    category: "Strength",
    image: "https://images.unsplash.com/photo-1615912265840-0207813af92e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWVuJTIwZ2lybCUyMHNvY2NlciUyMHBsYXllciUyMHN0cmV0Y2hpbmd8ZW58MXx8fHwxNzcxOTc2MjE5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    exercises: [
      { id: "e6", name: "Walking Lunges", duration: 60, description: "Step forward into a lunge, alternating legs as you walk.", instructions: ["Stand tall with hands on hips", "Step forward with right foot", "Lower until both knees are at 90 degrees", "Push off back foot to step forward", "Alternate legs continuously"] },
      { id: "e7", name: "Single-Leg Romanian Deadlift", duration: 60, description: "Hinge at your hip on one leg to strengthen hamstrings.", instructions: ["Stand on your left leg", "Hinge forward at the hip", "Extend right leg behind you", "Keep back flat, reach toward floor", "Return to standing, switch sides"] },
      { id: "e8", name: "Side-Lying Clamshells", duration: 45, description: "Lie on your side and open your knees like a clamshell.", instructions: ["Lie on your side, knees bent 45 degrees", "Keep feet together", "Lift top knee as high as possible", "Keep hips stacked and stable", "Lower slowly and repeat"] },
      { id: "e9", name: "Wall Sits", duration: 45, description: "Press your back against a wall and hold a seated position.", instructions: ["Stand with back against a wall", "Slide down until thighs are parallel", "Keep knees at 90 degrees", "Press back flat against wall", "Hold the position"] },
      { id: "e10", name: "Lateral Band Walks", duration: 45, description: "Walk sideways with a resistance band around your ankles.", instructions: ["Place band around ankles", "Bend slightly at knees and hips", "Step sideways with one foot", "Follow with the other foot", "Keep tension in the band"] },
      { id: "e11", name: "Nordic Hamstring Curls", duration: 45, description: "Kneel and slowly lower your body forward using hamstring control.", instructions: ["Kneel on a soft surface", "Anchor your feet (partner or object)", "Slowly lower your body forward", "Use hamstrings to control the descent", "Push back up and repeat"] },
      { id: "e12", name: "Jump Squats", duration: 45, description: "Perform a squat, then explosively jump upward.", instructions: ["Start in a squat position", "Explosively jump upward", "Land softly with bent knees", "Immediately lower into next squat", "Focus on soft, controlled landings"] },
    ],
  },
  {
    id: "r3",
    title: "Landing & Balance Focus",
    description: "Train proper landing mechanics and balance — key skills for preventing ACL injuries on the field.",
    duration: 10,
    difficulty: "Intermediate",
    category: "Balance",
    image: "https://images.unsplash.com/photo-1767611103831-d93568c9215b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGJhbGFuY2UlMjBleGVyY2lzZSUyMHNpbmdsZSUyMGxlZ3xlbnwxfHx8fDE3NzE5NzYyMjB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    exercises: [
      { id: "e13", name: "Single-Leg Hops", duration: 45, description: "Hop forward on one leg, focusing on soft landings.", instructions: ["Stand on one leg", "Hop forward gently", "Land softly on the same foot", "Stabilize before next hop", "Switch legs halfway"] },
      { id: "e14", name: "Star Balance Reach", duration: 60, description: "Stand on one leg and reach in multiple directions.", instructions: ["Stand on your right leg", "Reach left foot forward", "Then reach to the side", "Then reach behind you", "Keep standing knee slightly bent"] },
      { id: "e15", name: "Lateral Hops", duration: 45, description: "Hop side to side over a line, landing softly.", instructions: ["Stand on one side of a line", "Hop laterally over the line", "Land on the opposite foot", "Immediately hop back", "Keep knees soft on landing"] },
      { id: "e16", name: "Single-Leg Squat", duration: 60, description: "Squat down on one leg with control.", instructions: ["Stand on your right leg", "Extend left leg in front", "Slowly lower into a squat", "Keep knee tracking over toes", "Push back up, switch sides"] },
      { id: "e17", name: "Drop Jumps", duration: 45, description: "Step off a low surface and land with proper knee alignment.", instructions: ["Stand on a low step or surface", "Step off and land on both feet", "Land with knees bent and aligned", "Absorb the impact softly", "Focus on knee-over-toe alignment"] },
      { id: "e18", name: "Eyes-Closed Balance", duration: 45, description: "Challenge your balance by closing your eyes on one foot.", instructions: ["Stand on one foot", "Close your eyes gently", "Maintain balance using core", "Keep hips level", "Hold 20 seconds, switch legs"] },
    ],
  },
  {
    id: "r4",
    title: "Full Prevention Circuit",
    description: "A complete 20-minute ACL prevention circuit covering strength, balance, and plyometrics.",
    duration: 20,
    difficulty: "Advanced",
    category: "Full Circuit",
    image: "https://images.unsplash.com/photo-1576490251834-9b391b661c9c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW1hbGUlMjBhdGhsZXRlJTIwanVtcGluZyUyMHBseW9tZXRyaWMlMjB0cmFpbmluZ3xlbnwxfHx8fDE3NzE5NzYyMjF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    exercises: [
      { id: "e19", name: "Dynamic Warm-Up Jog", duration: 60, description: "Light jog in place to warm up muscles.", instructions: ["Jog in place or small area", "Gradually increase intensity", "Pump arms naturally", "Stay light on your feet", "Warm up for 1 minute"] },
      { id: "e20", name: "Walking Lunges", duration: 60, description: "Step forward into deep lunges.", instructions: ["Stand tall", "Step forward into a deep lunge", "Keep front knee behind toes", "Push through front heel", "Alternate legs"] },
      { id: "e21", name: "Lateral Shuffle", duration: 45, description: "Shuffle quickly side to side in an athletic stance.", instructions: ["Start in athletic stance", "Shuffle quickly to the right", "Stay low with bent knees", "Shuffle back to the left", "Keep hips low throughout"] },
      { id: "e22", name: "Nordic Hamstring Curls", duration: 60, description: "Eccentric hamstring strengthening.", instructions: ["Kneel with feet anchored", "Slowly lean forward", "Control descent with hamstrings", "Catch yourself with hands", "Push back up and repeat"] },
      { id: "e23", name: "Single-Leg Romanian Deadlift", duration: 60, description: "Balance and hamstring strength on one leg.", instructions: ["Stand on left leg", "Hinge at hip", "Reach right leg back", "Keep back flat", "Return and switch sides"] },
      { id: "e24", name: "Box Jumps", duration: 45, description: "Jump onto a raised surface with proper landing mechanics.", instructions: ["Stand facing a sturdy surface", "Jump up with both feet", "Land softly on the surface", "Stand fully, then step down", "Focus on soft landings"] },
      { id: "e25", name: "Clamshells", duration: 45, description: "Side-lying hip strengthening exercise.", instructions: ["Lie on side, knees bent", "Keep feet together", "Open top knee upward", "Keep pelvis stable", "Lower slowly and repeat"] },
      { id: "e26", name: "Plank Hold", duration: 60, description: "Core stabilization to support knee alignment.", instructions: ["Get into forearm plank", "Keep body in straight line", "Engage core and glutes", "Don't let hips sag", "Hold for full duration"] },
      { id: "e27", name: "Tuck Jumps", duration: 45, description: "Explosive jump bringing knees to chest.", instructions: ["Stand with feet hip-width", "Jump explosively upward", "Tuck knees toward chest", "Land softly with bent knees", "Reset and repeat"] },
      { id: "e28", name: "Cool-Down Stretch", duration: 90, description: "Gentle stretching to finish the circuit.", instructions: ["Quad stretch: 20 seconds each leg", "Hamstring stretch: 20 seconds each leg", "Calf stretch: 15 seconds each", "Deep breath and relax", "Great work!"] },
    ],
  },
  {
    id: "r5",
    title: "Pre-Game Knee Prep",
    description: "Quick activation routine designed for right before a game or scrimmage.",
    duration: 5,
    difficulty: "Beginner",
    category: "Warm-Up",
    image: "https://images.unsplash.com/photo-1771553468563-d4ee43401821?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGRvaW5nJTIwbHVuZ2VzJTIwZXhlcmNpc2UlMjBvdXRkb29yfGVufDF8fHx8MTc3MTk3NjIyMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    exercises: [
      { id: "e29", name: "High Knees", duration: 30, description: "Drive knees up quickly while jogging in place.", instructions: ["Stand tall", "Drive right knee up to hip height", "Quickly switch to left knee", "Pump arms with each step", "Stay on balls of feet"] },
      { id: "e30", name: "Butt Kicks", duration: 30, description: "Kick heels toward your glutes while jogging.", instructions: ["Jog in place", "Kick heels toward glutes", "Keep torso upright", "Quick, light foot contacts", "Maintain steady rhythm"] },
      { id: "e31", name: "Lateral Lunges", duration: 45, description: "Open up the groin and activate glutes.", instructions: ["Stand feet together", "Step wide to the right", "Bend right knee, push hips back", "Keep left leg straight", "Alternate sides"] },
      { id: "e32", name: "A-Skips", duration: 30, description: "Skipping with high knee drive for activation.", instructions: ["Skip forward", "Drive one knee up high", "Opposite arm comes forward", "Land lightly on forefoot", "Maintain rhythm"] },
      { id: "e33", name: "Bodyweight Squats", duration: 45, description: "Full range of motion squats to warm up.", instructions: ["Feet shoulder-width apart", "Lower hips back and down", "Keep chest up", "Go as deep as comfortable", "Stand tall and repeat"] },
    ],
  },
  {
    id: "r6",
    title: "Hamstring & Glute Builder",
    description: "Focus on the posterior chain — the key muscle group that protects your ACL.",
    duration: 10,
    difficulty: "Intermediate",
    category: "Strength",
    image: "https://images.unsplash.com/photo-1603503363848-6952525df449?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW1hbGUlMjBhdGhsZXRlJTIwc3F1YXQlMjBleGVyY2lzZSUyMGd5bXxlbnwxfHx8fDE3NzE5NzYyMjB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    exercises: [
      { id: "e34", name: "Glute Bridges", duration: 60, description: "Hip extension for glute activation.", instructions: ["Lie on back, knees bent", "Push through heels", "Lift hips to ceiling", "Squeeze glutes at top", "Lower with control"] },
      { id: "e35", name: "Single-Leg Glute Bridge", duration: 60, description: "One leg at a time for balanced strength.", instructions: ["Lie on back, one leg extended", "Push through planted heel", "Lift hips high", "Keep pelvis level", "Switch legs halfway"] },
      { id: "e36", name: "Romanian Deadlift", duration: 60, description: "Hip hinge to target hamstrings.", instructions: ["Stand with soft knees", "Hinge forward at hips", "Keep back flat", "Feel stretch in hamstrings", "Return to standing"] },
      { id: "e37", name: "Fire Hydrants", duration: 45, description: "On all fours, lift knee out to the side.", instructions: ["Start on hands and knees", "Lift right knee out to side", "Keep 90-degree bend in knee", "Don't shift your weight", "Lower and repeat"] },
      { id: "e38", name: "Donkey Kicks", duration: 45, description: "On all fours, push foot toward ceiling.", instructions: ["Start on hands and knees", "Keep right knee bent", "Push foot toward ceiling", "Squeeze glute at top", "Lower and switch sides"] },
      { id: "e39", name: "Good Mornings", duration: 45, description: "Standing hip hinge with hands behind head.", instructions: ["Stand feet hip-width", "Hands behind your head", "Hinge forward at hips", "Feel hamstring stretch", "Return to standing"] },
    ],
  },
  {
    id: "r7",
    title: "Core & Stability Session",
    description: "Build the core stability essential for proper knee alignment and ACL protection.",
    duration: 10,
    difficulty: "Beginner",
    category: "Core",
    image: "https://images.unsplash.com/photo-1630225760711-ac8eaa0c8947?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHdvbWFuJTIwcGxhbmslMjBjb3JlJTIwZXhlcmNpc2V8ZW58MXx8fHwxNzcxOTc2MjIxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    exercises: [
      { id: "e40", name: "Forearm Plank", duration: 45, description: "Core stabilization hold.", instructions: ["Forearms on the ground", "Body in straight line", "Engage core and glutes", "Don't let hips drop", "Breathe steadily"] },
      { id: "e41", name: "Side Plank (Right)", duration: 30, description: "Lateral core stability.", instructions: ["Lie on right side", "Prop up on right forearm", "Lift hips off ground", "Keep body in line", "Hold steady"] },
      { id: "e42", name: "Side Plank (Left)", duration: 30, description: "Lateral core stability.", instructions: ["Lie on left side", "Prop up on left forearm", "Lift hips off ground", "Keep body in line", "Hold steady"] },
      { id: "e43", name: "Dead Bugs", duration: 60, description: "Opposite arm and leg extension while lying on back.", instructions: ["Lie on back, arms up", "Knees bent at 90 degrees", "Extend right arm and left leg", "Keep lower back flat", "Return and switch sides"] },
      { id: "e44", name: "Bird Dogs", duration: 60, description: "On all fours, extend opposite arm and leg.", instructions: ["Start on hands and knees", "Extend right arm forward", "Extend left leg back", "Keep hips level", "Hold 3 seconds, switch"] },
      { id: "e45", name: "Pallof Press Hold", duration: 45, description: "Anti-rotation core exercise.", instructions: ["Stand sideways to anchor point", "Hold hands at chest", "Press arms straight out", "Resist rotation", "Hold for duration"] },
    ],
  },
  {
    id: "r8",
    title: "Plyometric Power",
    description: "Build explosive strength and train safe landing mechanics to protect your knees.",
    duration: 20,
    difficulty: "Advanced",
    category: "Plyometrics",
    image: "https://images.unsplash.com/photo-1683147779305-873538e62bea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdGhsZXRlJTIwcmVzaXN0YW5jZSUyMGJhbmQlMjBleGVyY2lzZSUyMGxlZ3N8ZW58MXx8fHwxNzcxOTc2MjIxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    exercises: [
      { id: "e46", name: "Squat Jumps", duration: 45, description: "Explosive jump from squat position.", instructions: ["Start in squat position", "Jump as high as you can", "Land softly with bent knees", "Immediately squat again", "Focus on soft landings"] },
      { id: "e47", name: "Lateral Bounds", duration: 45, description: "Leap side to side like a speed skater.", instructions: ["Stand on right foot", "Leap to the left", "Land on left foot softly", "Leap back to right", "Stay low and controlled"] },
      { id: "e48", name: "Single-Leg Hops", duration: 45, description: "Hop forward on one leg.", instructions: ["Stand on right foot", "Hop forward 3-4 times", "Land softly each time", "Switch to left foot", "Maintain balance"] },
      { id: "e49", name: "Depth Drops", duration: 45, description: "Step off surface and absorb landing.", instructions: ["Stand on low surface", "Step off (don't jump)", "Land on both feet", "Absorb with bent knees", "Stick the landing"] },
      { id: "e50", name: "180 Jumps", duration: 45, description: "Jump and rotate 180 degrees.", instructions: ["Start facing forward", "Jump and rotate 180 degrees", "Land softly facing backward", "Jump and rotate back", "Control each landing"] },
      { id: "e51", name: "Broad Jumps", duration: 45, description: "Jump forward for maximum distance.", instructions: ["Start in athletic stance", "Swing arms and jump forward", "Land softly on both feet", "Absorb with bent knees", "Walk back and repeat"] },
      { id: "e52", name: "Skater Jumps", duration: 45, description: "Explosive lateral jumps.", instructions: ["Start on right foot", "Jump to the left", "Cross right leg behind", "Jump back to right", "Stay low and athletic"] },
      { id: "e53", name: "Tuck Jumps", duration: 45, description: "Jump and bring knees to chest.", instructions: ["Stand with feet together", "Jump explosively", "Bring knees toward chest", "Land softly", "Reset between jumps"] },
      { id: "e54", name: "Split Squat Jumps", duration: 45, description: "Jump and switch legs in lunge position.", instructions: ["Start in lunge position", "Jump and switch legs", "Land softly in lunge", "Immediately jump again", "Alternate legs each jump"] },
      { id: "e55", name: "Cool-Down & Stretch", duration: 120, description: "Full body cool-down stretching.", instructions: ["Quad stretch: 30 seconds each", "Hamstring stretch: 30 seconds each", "Hip flexor stretch: 30 seconds each", "Calf stretch: 20 seconds each", "Deep breathing to finish"] },
    ],
  },
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
