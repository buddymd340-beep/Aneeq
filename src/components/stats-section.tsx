import { stats } from "@/lib/content";

export function StatsSection() {
  return (
    <section className="mx-auto -mt-10 max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid gap-4 rounded-[2rem] border border-slate-200 bg-white p-4 shadow-xl shadow-blue-950/5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-3xl bg-slate-50 p-6 text-center">
            <stat.icon className="mx-auto h-7 w-7 text-blue-600" />
            <p className="mt-3 text-3xl font-black text-slate-950">{stat.value}</p>
            <p className="mt-1 text-sm font-semibold text-slate-500">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
