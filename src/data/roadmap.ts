export type Phase = {
  id: string;
  title: string;
  weeks: string;
  goal: string;
  outputs: string[];
  checkpoints: string[];
};

export const fourMonthRoadmap: Phase[] = [
  {
    id: "p1",
    title: "Phase 1 — Foundation",
    weeks: "Weeks 1-4",
    goal: "Core vocabulary, financial literacy, strategic framing, baseline speed.",
    outputs: [
      "Finish Strategic Management core sections",
      "Build 250 foundational flashcards",
      "Complete 120 prelim questions",
      "Learn primary frameworks (SWOT, 4Ps, Porter, STP)"
    ],
    checkpoints: ["CP1: Vocabulary + Framework Alignment", "CP2: Finance Interpretation Drill"]
  },
  {
    id: "p2",
    title: "Phase 2 — Systems & Application",
    weeks: "Weeks 5-8",
    goal: "Integration across chapters, rising complexity, first serious case work.",
    outputs: [
      "Finish Marketing, Entrepreneurship, Admin/Operations modules",
      "First objective-case sprint",
      "Weak-area queue activated with spaced reviews"
    ],
    checkpoints: ["CP3: Objective Case Reasoning Sync", "CP4: Open Case Framework Rehearsal"]
  },
  {
    id: "p3",
    title: "Phase 3 — Advanced Synthesis",
    weeks: "Weeks 9-12",
    goal: "Faster inference, global strategy depth, communication precision.",
    outputs: [
      "Complete Global Business + Strategy + Ethics modules",
      "Run mixed timed sets 3x per week",
      "Deliver two board-style case presentations each"
    ],
    checkpoints: ["CP5: Market Entry Debate", "CP6: Verbal Defense Pressure Test"]
  },
  {
    id: "p4",
    title: "Phase 4 — Mastery & Simulation",
    weeks: "Weeks 13-16",
    goal: "Competition conditions, elimination of residual weak points, peak confidence.",
    outputs: [
      "Full mixed mocks with strict timing",
      "Objective + open case simulation weekends",
      "Final refinement and retrieval acceleration"
    ],
    checkpoints: ["CP7: Mock Finals #1", "CP8: Final Synchronization & Tactical Plan"]
  }
];

export const canonicalBooks = [
  "Strategic Management — Thompson & Strickland",
  "The McKinsey Way — Ethan Rasiel",
  "Case In Point — Marc Cosentino",
  "The Pyramid Principle — Barbara Minto",
  "Crack the Case — David Ohrvall",
  "BCG on Strategy — Stern & Deimler",
  "Say it with Charts — Gene Zelazny",
  "Slide:ology — Nancy Duarte",
  "Unfolding the Napkin — Dan Roam",
  "Visualizing This — Nathan Yau",
  "The Trusted Advisor — David Maister"
];
