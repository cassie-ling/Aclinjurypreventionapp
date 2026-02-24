import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { routines, type Routine } from "./app-context";
import { RoutineCard } from "./routine-card";

interface ExercisesPageProps {
  onSelectRoutine: (routine: Routine) => void;
}

const durations = ["All", "5 min", "10 min", "20 min"] as const;
const difficulties = ["All", "Beginner", "Intermediate", "Advanced"] as const;
const categories = ["All", "Warm-Up", "Strength", "Balance", "Core", "Plyometrics", "Full Circuit"] as const;

export function ExercisesPage({ onSelectRoutine }: ExercisesPageProps) {
  const [search, setSearch] = useState("");
  const [selectedDuration, setSelectedDuration] = useState<string>("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = routines.filter((r) => {
    const matchesSearch =
      search === "" ||
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase());
    const matchesDuration =
      selectedDuration === "All" ||
      `${r.duration} min` === selectedDuration;
    const matchesDifficulty =
      selectedDifficulty === "All" || r.difficulty === selectedDifficulty;
    const matchesCategory =
      selectedCategory === "All" || r.category === selectedCategory;
    return matchesSearch && matchesDuration && matchesDifficulty && matchesCategory;
  });

  return (
    <div className="pb-6">
      {/* Header */}
      <div className="px-5 pt-6 pb-4">
        <h1>Exercises</h1>
        <p className="text-muted-foreground text-[14px] mt-1">
          Find the perfect ACL prevention routine
        </p>
      </div>

      {/* Search */}
      <div className="px-5 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search routines..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-12 py-2.5 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg ${
              showFilters ? "bg-primary text-primary-foreground" : "text-muted-foreground"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="px-5 mb-4 space-y-3">
          <div>
            <p className="text-[13px] text-muted-foreground mb-1.5">Duration</p>
            <div className="flex gap-2 flex-wrap">
              {durations.map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDuration(d)}
                  className={`px-3 py-1.5 rounded-full text-[13px] border transition-colors ${
                    selectedDuration === d
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card border-border text-foreground"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[13px] text-muted-foreground mb-1.5">Difficulty</p>
            <div className="flex gap-2 flex-wrap">
              {difficulties.map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDifficulty(d)}
                  className={`px-3 py-1.5 rounded-full text-[13px] border transition-colors ${
                    selectedDifficulty === d
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card border-border text-foreground"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[13px] text-muted-foreground mb-1.5">Category</p>
            <div className="flex gap-2 flex-wrap">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedCategory(c)}
                  className={`px-3 py-1.5 rounded-full text-[13px] border transition-colors ${
                    selectedCategory === c
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card border-border text-foreground"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Duration Quick Filter Pills */}
      {!showFilters && (
        <div className="px-5 mb-4">
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {durations.map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDuration(d)}
                className={`px-4 py-1.5 rounded-full text-[13px] border whitespace-nowrap transition-colors ${
                  selectedDuration === d
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card border-border text-foreground"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      <div className="px-5">
        <p className="text-[13px] text-muted-foreground mb-3">
          {filtered.length} routine{filtered.length !== 1 ? "s" : ""} found
        </p>
        <div className="space-y-4">
          {filtered.map((routine) => (
            <RoutineCard
              key={routine.id}
              routine={routine}
              onTap={onSelectRoutine}
            />
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-muted-foreground">No routines match your filters.</p>
            <button
              onClick={() => {
                setSearch("");
                setSelectedDuration("All");
                setSelectedDifficulty("All");
                setSelectedCategory("All");
              }}
              className="text-primary mt-2 text-[14px]"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
