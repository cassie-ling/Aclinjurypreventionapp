# prd_update: what changed and what did not

This folder is a copy of the app with the new PRD applied. Nothing outside `prd_update/` was modified.
Run it with `cd prd_update && npm i && npm run dev` (same `.env` Firebase keys as the original).

## Before it will work against Firebase
1. Firebase console > Authentication > Sign-in method: enable **Anonymous** (for "continue without an account").
2. Publish `prd_update/firestore.rules` (new rules for teams, activity, leaderboard).

## Implemented
| PRD item | Where |
|---|---|
| Weekly goal ring, no streaks, neutral copy, can be turned off | `weekly-ring.tsx`, `home-page.tsx`, `progress-page.tsx`, `settings-page.tsx` |
| Permanent milestones (50/100/250/500 min, first routine, goal week, every length, knee explorer, team routine) | `app-context.tsx` (`MILESTONES`, `evaluateMilestones`; union only, never removed) |
| Personal stats: total, this week, sessions, most done, week vs last week (descriptive) | `progress-page.tsx`, `lib/week.ts` |
| Teams: create, join code, team goal ring, participation rate | `team-page.tsx`, `team-context.tsx`, `lib/team.ts` |
| Coach dashboard (aggregate only), set team goal, share "Today's warm-up" | `team-page.tsx` (`CoachView`) |
| Kudos (positive only, no comments), mute in settings | `team-page.tsx`, `settings-page.tsx` |
| Opt-in leaderboard: off by default, athlete opt-in AND coach allow, ranked by minutes | `team-page.tsx`, `firestore.rules` |
| Leave team: removes shared data, personal history stays | `lib/team.ts` (`leaveTeam`) |
| Skippable questionnaire, stored on device only, "Here's where to start" | `questionnaire-page.tsx`, `lib/questionnaire.ts` |
| Gender optional and inclusive; age bands; under-13 team lock | `lib/questionnaire.ts`, `team-page.tsx` |
| No-account solo use | anonymous sign-in in `auth-page.tsx` |
| Tabs: Home, Exercises, Progress, Team, Learn | `App.tsx` |
| Tappable knee diagram, female anatomy section | `knee-model.tsx`, `research-page.tsx` |

Placeholders the PRD marks TBD live in `src/lib/config.ts`: weekly goal (30 min) and team goal (200 min).

## Not implemented (and why)
- **Home screen widget**: not possible in a web app. Needs the native iOS/Android wrapper.
- **Routine videos**: the repo has no video assets. Text instructions and the timer work.
- **True offline**: routines are bundled in the JS, but there is no service worker, so a cold start offline will not load.
- **3D knee model**: replaced by a 2D tappable diagram. The Swift `ACLSimulator` is untouched.
- **Server-side team aggregates**: totals are written by athletes' devices and read by the client. A malicious member could write wrong numbers. Cloud Functions are the real fix.
- **Parental consent / COPPA flow**: only a self-reported "Under 13" lock on Team. Needs legal review before launch.
- **Analytics tracking plan, guardrail metrics, difficulty sort, form feedback video**: not started.
- **Notifications**: the old "allow notifications" toggle was removed because nothing sends them.

## Deviations from the PRD to decide on
- PRD says solo progress is stored **locally**. Progress still syncs to Firestore (as in the original) so it survives a phone change. Questionnaire answers are local only.
- PRD says a leaderboard opt-out is counted in team totals "only if they agree". Currently every athlete who joined counts, anonymously.
- A coach who signs out of an anonymous account loses access to their team and join code. Coaches should use a real account.
- The "Did You Know?" statistics (2-8x, 70%, 88%, 1 yr) and the FIFA 11+ "50%" routine blurb have **no citations**. The PRD requires sourced, clinician-reviewed numbers.
