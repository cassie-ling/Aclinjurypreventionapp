import { useState } from "react";
import {
  AGE_BANDS,
  GENDER_OPTIONS,
  SPORTS,
  TRAINING_HOURS,
  type Questionnaire,
} from "../../lib/questionnaire";

const chip = (selected: boolean) =>
  `px-3 py-2 min-h-11 rounded-full text-[14px] border ${
    selected ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border"
  }`;

interface Props {
  initial: Questionnaire;
  onSave: (q: Questionnaire) => void;
  onSkip?: () => void;
  submitLabel?: string;
}

// Short and skippable. Used only to suggest where to start, never as a risk score.
export function QuestionnaireForm({ initial, onSave, onSkip, submitLabel = "Show me where to start" }: Props) {
  const [ageBand, setAgeBand] = useState(initial.ageBand);
  const [gender, setGender] = useState(initial.gender);
  const [sports, setSports] = useState<string[]>(initial.sports);
  const [hours, setHours] = useState(initial.hoursPerWeek);

  const toggleSport = (s: string) =>
    setSports((cur) => (cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s]));

  return (
    <div className="bg-card rounded-2xl border border-border p-4 space-y-5">
      <div>
        <p className="text-[13px] text-muted-foreground mb-2">Age</p>
        <div className="flex flex-wrap gap-2">
          {AGE_BANDS.map((a) => (
            <button key={a} type="button" onClick={() => setAgeBand(a)} className={chip(ageBand === a)}>
              {a}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-[13px] text-muted-foreground mb-2">Main sport (pick any)</p>
        <div className="flex flex-wrap gap-2">
          {SPORTS.map((s) => (
            <button key={s} type="button" onClick={() => toggleSport(s)} className={chip(sports.includes(s))}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-[13px] text-muted-foreground mb-2">Training hours in a typical week</p>
        <div className="flex flex-wrap gap-2">
          {TRAINING_HOURS.map((h) => (
            <button key={h} type="button" onClick={() => setHours(h)} className={chip(hours === h)}>
              {h}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-[13px] text-muted-foreground mb-2">How do you identify? (optional)</p>
        <div className="flex flex-wrap gap-2">
          {GENDER_OPTIONS.map((g) => (
            <button key={g} type="button" onClick={() => setGender(gender === g ? "" : g)} className={chip(gender === g)}>
              {g}
            </button>
          ))}
        </div>
      </div>

      <p className="text-[12px] text-muted-foreground">
        These answers stay on this device. They are never shared with coaches or teammates, and they are only used to
        suggest a routine.
      </p>

      <button
        type="button"
        onClick={() =>
          onSave({ completed: true, skipped: false, ageBand, gender, sports, hoursPerWeek: hours })
        }
        className="w-full py-3 min-h-11 rounded-xl bg-primary text-primary-foreground"
      >
        {submitLabel}
      </button>
      {onSkip && (
        <button type="button" onClick={onSkip} className="w-full min-h-11 text-[14px] text-muted-foreground">
          Skip for now
        </button>
      )}
    </div>
  );
}

export function QuestionnaireIntro({
  initial,
  onSave,
  onSkip,
}: {
  initial: Questionnaire;
  onSave: (q: Questionnaire) => void;
  onSkip: () => void;
}) {
  return (
    <div className="flex-1 overflow-y-auto px-5 pt-10 pb-8">
      <p className="text-muted-foreground text-[14px]">Protect Her Play</p>
      <h1>Welcome</h1>
      <p className="text-muted-foreground text-[14px] mt-1 mb-6">
        ACL injuries are common in teen sports, and short routines done regularly can help. Four quick questions help us
        suggest where to start. You can skip them.
      </p>
      <QuestionnaireForm initial={initial} onSave={onSave} onSkip={onSkip} />
    </div>
  );
}
