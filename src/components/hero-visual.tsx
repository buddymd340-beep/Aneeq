import { BookOpen, Calculator, FlaskConical, Languages, Laptop, Sparkles } from "lucide-react";

const badges = [
  { label: "Mathematics", icon: Calculator },
  { label: "Physics", icon: FlaskConical },
  { label: "English", icon: Languages },
  { label: "Computer", icon: Laptop }
];

export function HeroVisual() {
  return (
    <div className="relative mx-auto max-w-lg">
      <div className="absolute -left-5 top-8 hidden rounded-3xl bg-white p-4 shadow-xl shadow-blue-950/10 sm:block">
        <Sparkles className="h-6 w-6 text-amber-500" />
        <p className="mt-2 text-sm font-black text-slate-950">Weekly practice</p>
      </div>

      <div className="absolute -right-4 bottom-10 hidden rounded-3xl bg-white p-4 shadow-xl shadow-blue-950/10 sm:block">
        <BookOpen className="h-6 w-6 text-blue-600" />
        <p className="mt-2 text-sm font-black text-slate-950">Clear notes</p>
      </div>

      <div className="rounded-[2.5rem] bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 p-6 shadow-2xl shadow-blue-900/20">
        <div className="rounded-[2rem] bg-white/95 p-6">
          <div className="rounded-[1.5rem] bg-slate-950 p-5 text-white">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-blue-200">Live class board</p>
              <span className="rounded-full bg-emerald-400 px-3 py-1 text-xs font-black text-emerald-950">Online</span>
            </div>
            <h3 className="mt-6 text-3xl font-black">Today: Algebra Basics</h3>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Step-by-step explanation, examples, and a quick practice task.
            </p>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            {badges.map((badge) => (
              <div key={badge.label} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <badge.icon className="h-5 w-5 text-blue-600" />
                <p className="mt-2 text-sm font-black text-slate-900">{badge.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
