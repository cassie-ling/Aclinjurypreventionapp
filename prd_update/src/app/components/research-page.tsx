import { BookOpen, ExternalLink } from "lucide-react";
import { KneeModel } from "./knee-model";

export function ResearchPage() {
  return (
    <div className="pb-6">
      {/* Header */}
      <div className="pl-5 pr-16 pt-6 pb-4">
        <h1>Learn</h1>
        <p className="text-muted-foreground text-[14px] mt-1">
          Learn about ACL health and injury prevention
        </p>
      </div>

      {/* Interactive knee */}
      <div className="px-5 mb-6">
        <h3 className="mb-3">Explore the knee</h3>
        <KneeModel />
      </div>

      {/* Why female athletes are at higher risk */}
      <div className="px-5 mb-6">
        <h3 className="mb-1">Why girls and women have more ACL injuries</h3>
        <p className="text-[12px] text-muted-foreground mb-3">
          It is not about being weaker or less skilled. A few body and movement differences add up, and the good news is
          that most of them can be trained.
        </p>
        <div className="space-y-3">
          {[
            {
              title: "Landing and cutting patterns",
              body: "Many female athletes land with straighter knees that drift inward and rely more on the quads than the hamstrings and glutes. Prevention routines practice soft, bent-knee landings with knees over toes.",
            },
            {
              title: "Hip and pelvis shape",
              body: "A wider pelvis can change the angle at which the thigh meets the knee, which can add stress to the joint during sharp changes of direction.",
            },
            {
              title: "A narrower notch",
              body: "The space in the thigh bone where the ACL sits tends to be smaller on average in women, leaving less room for the ligament.",
            },
            {
              title: "Hormones and growth",
              body: "Hormones can affect how stretchy ligaments are, and growth spurts can briefly change coordination. Neither means injury is certain, only that regular training matters.",
            },
          ].map((item) => (
            <div key={item.title} className="bg-card rounded-xl p-4 border border-border">
              <p style={{ fontWeight: 500 }}>{item.title}</p>
              <p className="text-[14px] text-muted-foreground mt-1">{item.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Facts */}
      <div className="px-5 mb-6">
        <h3 className="mb-1">Did You Know?</h3>
        <p className="text-[12px] text-muted-foreground mb-3">Statistics are being reviewed by a clinical adviser.</p>
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
              stat: "88%",
              fact: "Prevention programs like these ones can reduce ACL injury risk by up to 88% when done consistently.",
            },
            {
              stat: "1 yr",
              fact: "Recovery from ACL surgery typically takes 9 to 12 months — prevention is always better than rehab.",
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
              title: "Take the Pledge: Project Play",
              source: "Aspen Institute",
              description: "Learn more about ACL injuries and commit to the #ACLPledge.",
              url: "https://projectplay.org/acl-injury-prevention/main",
            },
            {
              title: "Why Are So Many Teen Girls Still Tearing Their ACLs?",
              source: "The New York Times",
              description: "The developer of this app may or may not have cried reading this article.",
              url: "https://www.nytimes.com/2026/02/26/magazine/acl-tear-women-girl-sports.html?unlocked_article_code=1.PVA.ArRb.EtOv1Q4H5qEH&smid=nytcore-ios-share",
            },
            {
              title: "Why Female Athletes Are More At Risk",
              source: "Sports Medicine Research",
              description: "Understanding the biomechanical factors behind ACL injury risk.",
              url: "https://www.hopkinsmedicine.org/health/conditions-and-diseases/acl-injury-prevention-for-the-female-athlete",
            },
          ].map((resource, i) => (
            <a
              key={i}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-card rounded-xl p-4 border border-border block hover:bg-accent/5 transition-colors"
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
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
