"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { categories, courses } from "@/lib/content";
import { CourseCard } from "@/components/course-card";
import { cn } from "@/lib/utils";

export function CourseBrowser() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesCategory = category === "All" || course.category === category;
      const searchable = `${course.title} ${course.category} ${course.shortDescription}`.toLowerCase();
      const matchesQuery = searchable.includes(query.toLowerCase());

      return matchesCategory && matchesQuery;
    });
  }, [category, query]);

  return (
    <div>
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-slate-200 bg-white p-4 shadow-xl shadow-blue-950/5">
        <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
          <Search className="h-5 w-5 text-slate-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search Mathematics, English, Physics..."
            className="w-full bg-transparent text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-400"
          />
        </div>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {categories.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setCategory(item)}
            className={cn(
              "rounded-full border px-5 py-2.5 text-sm font-black transition",
              category === item
                ? "border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                : "border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:text-blue-700"
            )}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredCourses.map((course) => (
          <CourseCard key={course.slug} course={course} />
        ))}
      </div>

      {filteredCourses.length === 0 ? (
        <div className="mt-12 rounded-[2rem] border border-dashed border-slate-300 bg-white p-10 text-center">
          <h3 className="text-xl font-black text-slate-950">No courses found</h3>
          <p className="mt-2 text-slate-600">Try a different search word or category.</p>
        </div>
      ) : null}
    </div>
  );
}
