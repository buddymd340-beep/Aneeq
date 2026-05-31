import { processSteps } from "@/lib/content";

export function ProcessSteps() {
  return (
    <div className="grid gap-5 md:grid-cols-4">
      {processSteps.map((step, index) => (
        <div key={step.title} className="relative rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-4xl font-black text-blue-100">0{index + 1}</span>
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-600 text-white">
              <step.icon className="h-6 w-6" />
            </span>
          </div>
          <h3 className="mt-6 text-lg font-black text-slate-950">{step.title}</h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">{step.description}</p>
        </div>
      ))}
    </div>
  );
}
