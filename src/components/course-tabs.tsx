"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import type { Course } from "@/lib/content";
import { cn } from "@/lib/utils";

type CourseTabsProps = {
  course: Course;
};

const tabs = ["Overview", "Syllabus", "Benefits"];

export function CourseTabs({ course }: CourseTabsProps) {
  const [active, setActive] = useState("Overview");

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-xl shadow-blue-950/5">
      <div className="grid gap-3 rounded-3xl bg-slate-50 p-2 sm:grid-cols-3">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActive(tab)}
            className={cn(
              "rounded-2xl px-4 py-3 text-sm font-black transition",
              active === tab ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-slate-600 hover:bg-white hover:text-blue-700"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="p-3 pt-8 sm:p-8">
        {active === "Overview" ? (
          <div>
            <h2 className="text-2xl font-black text-slate-950">Course Overview</h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">{course.description}</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {["Personal guidance", "Simple examples", "Weekly revision", "Exam practice"].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl bg-blue-50 p-4 font-bold text-blue-900">
                  <CheckCircle2 className="h-5 w-5 text-blue-600" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {active === "Syllabus" ? (
          <div>
            <h2 className="text-2xl font-black text-slate-950">Syllabus Topics</h2>
            <div className="mt-6 grid gap-3">
              {course.syllabus.map((topic, index) => (
                <div key={topic} className="flex items-center justify-between rounded-2xl border border-slate-200 p-4">
                  <span className="font-bold text-slate-800">{topic}</span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-500">
                    Module {index + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {active === "Benefits" ? (
          <div>
            <h2 className="text-2xl font-black text-slate-950">What Students Will Learn</h2>
            <div className="mt-6 grid gap-4">
              {course.outcomes.map((outcome) => (
                <div key={outcome} className="flex gap-3 rounded-2xl bg-slate-50 p-4">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                  <p className="font-semibold leading-6 text-slate-700">{outcome}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
