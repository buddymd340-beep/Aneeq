import { features } from "@/lib/content";

export function FeatureGrid() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {features.map((feature) => (
        <div
          key={feature.title}
          className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-950/10"
        >
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-blue-50 text-blue-700">
            <feature.icon className="h-7 w-7" />
          </div>
          <h3 className="mt-6 text-xl font-black text-slate-950">{feature.title}</h3>
          <p className="mt-3 leading-7 text-slate-600">{feature.description}</p>
        </div>
      ))}
    </div>
  );
}
