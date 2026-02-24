import { BookOpen, ExternalLink } from "lucide-react";

export function ResearchPage() {
  return (
    <div className="pb-6">
      {/* Header */}
      <div className="px-5 pt-6 pb-4">
        <h1>Research & Resources</h1>
        <p className="text-muted-foreground text-[14px] mt-1">
          Learn about ACL health and injury prevention
        </p>
      </div>

      {/* Placeholder Interactive Knee */}
      <div className="px-5 mb-6">
        <div className="bg-card rounded-2xl border border-border p-6 text-center">
          <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
            <span className="text-5xl">🦵</span>
          </div>
          <h3 className="mb-1">Interactive Knee Model</h3>
          <p className="text-muted-foreground text-[14px]">
            Coming soon — tap and explore the anatomy of your knee to understand how the ACL works.
          </p>
        </div>
      </div>

      {/* Quick Facts */}
      <div className="px-5 mb-6">
        <h3 className="mb-3">Did You Know?</h3>
        <div className="space-y-3">
          {[
            {
              stat: "2-8x",
              fact: "Female athletes are 2 to 8 times more likely to tear their ACL than male athletes in the same sport.",
            },
            {
              stat: "70%",
              fact: "About 70% of ACL injuries are non-contact — they happen during landing, cutting, or pivoting.",
            },
            {
              stat: "50%",
              fact: "Prevention programs like this one can reduce ACL injury risk by up to 50% when done consistently.",
            },
            {
              stat: "6-9 mo",
              fact: "Recovery from ACL surgery typically takes 6 to 9 months — prevention is always better than rehab.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-card rounded-xl p-4 border border-border flex gap-4 items-start"
            >
              <div className="shrink-0 w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                <span className="text-primary" style={{ fontWeight: 700 }}>{item.stat}</span>
              </div>
              <p className="text-[14px] text-foreground">{item.fact}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Resources */}
      <div className="px-5">
        <h3 className="mb-3">Resources</h3>
        <div className="space-y-3">
          {[
            {
              title: "FIFA 11+ Warm-Up Program",
              source: "FIFA Medical Network",
              description: "Evidence-based warm-up program proven to reduce injuries.",
            },
            {
              title: "ACL Injury Prevention in Young Athletes",
              source: "American Academy of Pediatrics",
              description: "Guidelines for preventing ACL injuries in youth sports.",
            },
            {
              title: "Why Female Athletes Are More At Risk",
              source: "Sports Medicine Research",
              description: "Understanding the biomechanical factors behind ACL injury risk.",
            },
          ].map((resource, i) => (
            <div
              key={i}
              className="bg-card rounded-xl p-4 border border-border"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-3">
                  <BookOpen className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p style={{ fontWeight: 500 }}>{resource.title}</p>
                    <p className="text-[13px] text-muted-foreground mt-0.5">
                      {resource.source}
                    </p>
                    <p className="text-[14px] text-muted-foreground mt-1">
                      {resource.description}
                    </p>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
