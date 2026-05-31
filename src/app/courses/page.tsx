import type { Metadata } from "next";
import { CourseBrowser } from "@/components/course-browser";
import { CtaSection } from "@/components/cta-section";
import { SectionHeading } from "@/components/section-heading";

export const metadata: Metadata = {
  title: "Courses"
};

export default function CoursesPage() {
  return (
    <>
      <section className="bg-gradient-to-b from-blue-50 to-white py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-600">Courses</p>
          <h1 className="mx-auto mt-4 max-w-4xl text-4xl font-black tracking-tight text-slate-950 sm:text-6xl">
            Search and explore available teaching courses.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Use the interactive search and filters to preview the course listing UI before finalizing the design.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Find a Course"
          title="Filter by subject or search by name"
          description="This page is public, so anyone can browse courses without signing in."
        />
        <div className="mt-12">
          <CourseBrowser />
        </div>
      </section>

      <CtaSection />
    </>
  );
}
