import Link from "next/link";
import { ArrowRight, Clock, MonitorPlay, Users } from "lucide-react";
import type { Course } from "@/lib/content";

type CourseCardProps = {
  course: Course;
};

export function CourseCard({ course }: CourseCardProps) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-950/10">
      <div className={`h-3 bg-gradient-to-r ${course.color}`} />
      <div className="flex flex-1 flex-col p-6">
        <div className={`flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br ${course.color} text-white shadow-lg`}>
          <MonitorPlay className="h-8 w-8" />
        </div>

        <div className="mt-6 flex-1">
          <div className="mb-3 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
            {course.category}
          </div>
          <h3 className="text-xl font-black text-slate-950">{course.title}</h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">{course.shortDescription}</p>

          <div className="mt-5 grid gap-3 text-sm text-slate-600">
            <span className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600" />
              {course.level}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              {course.duration}
            </span>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
            {course.mode}
          </span>
          <Link
            href={`/courses/${course.slug}`}
            className="inline-flex items-center gap-2 text-sm font-black text-blue-700 transition group-hover:gap-3"
          >
            View Details
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
