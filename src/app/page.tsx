import { ArrowRight, CheckCircle2 } from "lucide-react";
import { CourseCard } from "@/components/course-card";
import { CtaSection } from "@/components/cta-section";
import { FaqAccordion } from "@/components/faq-accordion";
import { FeatureGrid } from "@/components/feature-grid";
import { HeroVisual } from "@/components/hero-visual";
import { ProcessSteps } from "@/components/process-steps";
import { SectionHeading } from "@/components/section-heading";
import { StatsSection } from "@/components/stats-section";
import { Testimonials } from "@/components/testimonials";
import { ButtonLink } from "@/components/ui/button-link";
import { courses, site } from "@/lib/content";

export default function HomePage() {
  const featuredCourses = courses.filter((course) => course.isFeatured);

  return (
    <>
      <section className="overflow-hidden bg-gradient-to-b from-blue-50 via-white to-slate-50">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 pb-24 pt-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:pb-32 lg:pt-24">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-black text-blue-700 shadow-sm">
              <CheckCircle2 className="h-4 w-4" />
              Online and offline personal classes
            </div>
            <h1 className="mt-6 max-w-2xl text-5xl font-black tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
              Learn better with simple personal teaching.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              {site.tagline} Browse courses, understand the teaching style, and send a contact inquiry without login.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <ButtonLink href="/courses" className="gap-2">
                View Courses
                <ArrowRight className="h-4 w-4" />
              </ButtonLink>
              <ButtonLink href="/contact" variant="secondary">
                Contact Us
              </ButtonLink>
            </div>
          </div>

          <HeroVisual />
        </div>
      </section>

      <StatsSection />

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Featured Courses"
          title="Popular subjects for focused learning"
          description="Simple course cards show the level, duration, class mode, and details before a student contacts you."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredCourses.map((course) => (
            <CourseCard key={course.slug} course={course} />
          ))}
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Why Choose Us"
            title="A teaching style that keeps learning clear"
            description="The UI is designed to communicate trust, clarity, and easy contact for parents and students."
          />
          <div className="mt-12">
            <FeatureGrid />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Teaching Process"
          title="From course selection to first class"
          description="A simple four-step journey that makes the website easy to understand."
        />
        <div className="mt-12">
          <ProcessSteps />
        </div>
      </section>

      <section className="bg-blue-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Testimonials"
            title="What students say"
            description="A simple interactive review slider for social proof."
          />
          <div className="mt-12">
            <Testimonials />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="FAQ"
          title="Common questions before joining"
          description="Interactive accordion answers the most important questions quickly."
        />
        <div className="mt-12">
          <FaqAccordion />
        </div>
      </section>

      <CtaSection />
    </>
  );
}
