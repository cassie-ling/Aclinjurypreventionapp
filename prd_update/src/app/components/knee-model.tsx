import { useRef, useState } from "react";
import { useApp } from "./app-context";

// Lightweight tappable knee diagram (front view). The full 3D model lives in the iOS ACLSimulator app;
// this is the mobile-web stand-in with the same anatomy text.
const PARTS: Record<string, { name: string; short: string; full: string }> = {
  femur: {
    name: "Femur (thigh bone)",
    short: "The longest, strongest bone in the body.",
    full: "The bottom of the femur forms the top of the knee joint. The two rounded ends, called condyles, sit on the shin bone. The notch between them is where the cruciate ligaments pass through.",
  },
  tibia: {
    name: "Tibia (shin bone)",
    short: "The main weight-bearing bone of the lower leg.",
    full: "The top of the tibia is a flat surface called the plateau. The ACL and PCL both attach to a ridge in its center.",
  },
  acl: {
    name: "ACL (anterior cruciate ligament)",
    short: "Keeps the shin bone from sliding forward and helps control twisting.",
    full: "The ACL runs diagonally through the middle of the knee. It is most often hurt during sudden stops, pivots, cuts, or awkward landings from a jump. Strength, balance and landing practice can lower the chance of a tear, which is what the routines in this app train.",
  },
  pcl: {
    name: "PCL (posterior cruciate ligament)",
    short: "Keeps the shin bone from sliding backward.",
    full: "The PCL crosses behind the ACL and is very strong. It is injured much less often, usually from a hard direct hit to the front of the shin.",
  },
  meniscus: {
    name: "Meniscus",
    short: "Cartilage cushions that absorb shock.",
    full: "Each knee has two C-shaped discs of cartilage. They spread out the load and help keep the joint stable. Meniscus tears often happen together with ACL tears.",
  },
};

export function KneeModel() {
  const { markKneeExplored, kneeExplored } = useApp();
  const [selected, setSelected] = useState<string>("acl");
  const seen = useRef(new Set<string>(["acl"]));

  const pick = (id: string) => {
    setSelected(id);
    seen.current.add(id);
    if (seen.current.size >= 3) markKneeExplored();
  };

  const fill = (id: string, base: string) => (selected === id ? "var(--primary)" : base);
  const part = PARTS[selected];

  return (
    <div className="bg-card rounded-2xl border border-border p-4">
      <svg viewBox="0 0 200 260" className="w-40 h-52 mx-auto block" role="group" aria-label="Interactive knee diagram">
        {/* femur */}
        <g onClick={() => pick("femur")} className="cursor-pointer" tabIndex={0} role="button" aria-label="Femur" onKeyDown={(e) => e.key === "Enter" && pick("femur")}>
          <path d="M70 10 H130 L135 90 Q135 115 118 118 Q100 112 100 112 Q100 112 82 118 Q65 115 65 90 Z" fill={fill("femur", "#e9dcc8")} stroke="#8a7a62" strokeWidth="2" />
        </g>
        {/* menisci */}
        <g onClick={() => pick("meniscus")} className="cursor-pointer" tabIndex={0} role="button" aria-label="Meniscus" onKeyDown={(e) => e.key === "Enter" && pick("meniscus")}>
          <ellipse cx="80" cy="124" rx="20" ry="6" fill={fill("meniscus", "#7aa7d9")} stroke="#3a6ea5" strokeWidth="1.5" />
          <ellipse cx="120" cy="124" rx="20" ry="6" fill={fill("meniscus", "#7aa7d9")} stroke="#3a6ea5" strokeWidth="1.5" />
        </g>
        {/* tibia */}
        <g onClick={() => pick("tibia")} className="cursor-pointer" tabIndex={0} role="button" aria-label="Tibia" onKeyDown={(e) => e.key === "Enter" && pick("tibia")}>
          <path d="M62 132 H138 L128 250 H72 Z" fill={fill("tibia", "#dccbb0")} stroke="#8a7a62" strokeWidth="2" />
        </g>
        {/* PCL (drawn first so ACL sits on top) */}
        <g onClick={() => pick("pcl")} className="cursor-pointer" tabIndex={0} role="button" aria-label="PCL" onKeyDown={(e) => e.key === "Enter" && pick("pcl")}>
          <line x1="88" y1="122" x2="108" y2="92" stroke={fill("pcl", "#e08a2e")} strokeWidth="9" strokeLinecap="round" />
        </g>
        <g onClick={() => pick("acl")} className="cursor-pointer" tabIndex={0} role="button" aria-label="ACL" onKeyDown={(e) => e.key === "Enter" && pick("acl")}>
          <line x1="112" y1="122" x2="90" y2="92" stroke={fill("acl", "#f2b53a")} strokeWidth="9" strokeLinecap="round" />
        </g>
      </svg>
      <p className="text-center text-[12px] text-muted-foreground mt-1">Tap a part to learn about it</p>
      <div className="mt-3 rounded-xl bg-muted/60 p-3">
        <p style={{ fontWeight: 600 }}>{part.name}</p>
        <p className="text-[13px] text-muted-foreground mt-0.5">{part.short}</p>
        <p className="text-[14px] mt-2">{part.full}</p>
      </div>
      {kneeExplored && <p className="text-[12px] text-primary mt-2">You earned the Knee Explorer milestone.</p>}
    </div>
  );
}
