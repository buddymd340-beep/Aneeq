import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight, Clock, Laptop, Users } from "lucide-react";
import { CourseCard } from "@/components/course-card";
import { CourseTabs } from "@/components/course-tabs";
import { ButtonLink } from "@/components/ui/button-link";
import { courses } from "@/lib/content";

type CourseDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return courses.map((course) => ({
    slug: course.slug
  }));
}

export async function generateMetadata({ params }: CourseDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const course = courses.find((item) => item.slug === slug);

  return {
    title: course?.title ?? "Course"
  };
}

export default async function CourseDetailPage({ params }: CourseDetailPageProps) {
  const { slug } = await params;
  const course = courses.find((item) => item.slug === slug);

  if (!course) {
    notFound();
  }

  const relatedCourses = courses.filter((item) => item.slug !== course.slug).slice(0, 3);

  return (
    <>
      <section className={`bg-gradient-to-br ${course.color} py-20 text-white`}>
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_380px] lg:px-8">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-white/75">{course.category}</p>
            <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-6xl">{course.title}</h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-white/90">{course.shortDescription}</p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <ButtonLink href="/contact" variant="light" className="gap-2">
                Contact for This Course
                <ArrowRight className="h-4 w-4" />
              </ButtonLink>
              <ButtonLink href="/courses" variant="secondary">
                Back to Courses
              </ButtonLink>
            </div>
          </div>

          <div className="rounded-[2rem] bg-white/95 p-6 text-slate-950 shadow-2xl shadow-slate-950/20">
            <h2 className="text-xl font-black">Course Information</h2>
            <div className="mt-5 grid gap-4">
              <InfoRow icon={Users} label="Level" value={course.level} />
              <InfoRow icon={Clock} label="Duration" value={course.duration} />
              <InfoRow icon={Laptop} label="Mode" value={course.mode} />
              <InfoRow icon={ArrowRight} label="Fee" value={course.fee} />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_340px] lg:px-8">
        <CourseTabs course={course} />

        <aside className="h-fit rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-blue-950/5 lg:sticky lg:top-28">
          <h2 className="text-xl font-black text-slate-950">Want to join?</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Send your name, phone number, class level, and preferred timing. The teacher will contact you directly.
          </p>
          <ButtonLink href="/contact" className="mt-6 w-full">
            Send Inquiry
          </ButtonLink>
        </aside>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-600">Related Courses</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">Explore more subjects</h2>
            </div>
            <ButtonLink href="/courses" variant="secondary">
              View All Courses
            </ButtonLink>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {relatedCourses.map((item) => (
              <CourseCard key={item.slug} course={item} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value
}: {
  icon: typeof Users;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4">
      <span className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-600 text-white">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="text-xs font-black uppercase tracking-wide text-slate-400">{label}</p>
        <p className="font-black text-slate-950">{value}</p>
      </div>
    </div>
  );
}
