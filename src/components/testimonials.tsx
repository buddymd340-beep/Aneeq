"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { testimonials } from "@/lib/content";

export function Testimonials() {
  const [active, setActive] = useState(0);
  const testimonial = testimonials[active];

  const stars = useMemo(() => Array.from({ length: testimonial.rating }), [testimonial.rating]);

  return (
    <div className="mx-auto max-w-4xl rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-blue-950/5 sm:p-10">
      <div className="flex gap-1 text-amber-400">
        {stars.map((_, index) => (
          <Star key={index} className="h-5 w-5 fill-current" />
        ))}
      </div>
      <blockquote className="mt-6 text-2xl font-bold leading-10 text-slate-950">
        "{testimonial.quote}"
      </blockquote>
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-black text-slate-950">{testimonial.name}</p>
          <p className="text-sm font-semibold text-slate-500">{testimonial.className}</p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            aria-label="Previous testimonial"
            onClick={() => setActive((value) => (value === 0 ? testimonials.length - 1 : value - 1))}
            className="grid h-11 w-11 place-items-center rounded-full border border-slate-200 text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Next testimonial"
            onClick={() => setActive((value) => (value === testimonials.length - 1 ? 0 : value + 1))}
            className="grid h-11 w-11 place-items-center rounded-full border border-slate-200 text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
