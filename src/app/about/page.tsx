import type { Metadata } from "next";
import { Award, BookOpen, CheckCircle2, GraduationCap, HeartHandshake } from "lucide-react";
import { CtaSection } from "@/components/cta-section";
import { SectionHeading } from "@/components/section-heading";
import { teachingValues } from "@/lib/content";

export const metadata: Metadata = {
  title: "About"
};

export default function AboutPage() {
  return (
    <>
      <section className="bg-gradient-to-b from-blue-50 to-white py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-600">About the teacher</p>
            <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-6xl">
              Teaching with patience, clarity, and regular practice.
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              This website is designed for students and parents who want to understand available subjects, teaching method, class mode, and contact directly.
            </p>
          </div>

          <div className="rounded-[2.5rem] bg-slate-950 p-8 text-white shadow-2xl shadow-blue-950/20">
            <div className="grid h-24 w-24 place-items-center rounded-[2rem] bg-blue-600">
              <GraduationCap className="h-12 w-12" />
            </div>
            <h2 className="mt-8 text-3xl font-black">Hi, I am your teacher.</h2>
            <p className="mt-4 leading-8 text-slate-300">
              I help students understand difficult subjects through simple examples, guided practice, and weekly feedback.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {["5+ years experience", "500+ students guided", "Online support", "Exam preparation"].map((item) => (
                <div key={item} className="rounded-2xl bg-white/10 p-4 text-sm font-bold">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Teaching Method"
          title="A simple method for better understanding"
          description="The design highlights the teaching flow parents and students care about before contacting."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-4">
          {[
            { title: "Know Level", icon: BookOpen, text: "Understand the student's class level and weak topics." },
            { title: "Explain Simply", icon: HeartHandshake, text: "Use examples and clear steps before heavy practice." },
            { title: "Practice Weekly", icon: CheckCircle2, text: "Give worksheets, revision, and small tests." },
            { title: "Track Progress", icon: Award, text: "Share feedback and improve study habits." }
          ].map((item) => (
            <div key={item.title} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <item.icon className="h-8 w-8 text-blue-600" />
              <h3 className="mt-5 text-lg font-black text-slate-950">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Values"
            title="What the website communicates"
            description="These value chips can be used in Figma and code to make the design feel complete."
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {teachingValues.map((value) => (
              <div key={value.title} className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-600 text-white">
                  <value.icon className="h-5 w-5" />
                </span>
                <span className="font-black text-slate-800">{value.title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
