import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";

export function CtaSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-blue-600 via-indigo-600 to-sky-500 px-6 py-14 text-center text-white shadow-2xl shadow-blue-900/20 sm:px-12">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-100">Ready to start?</p>
        <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-black tracking-tight sm:text-5xl">
          Contact today and discuss the best class plan.
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-blue-50">
          Share your class level, subject, and preferred timing. No account is required.
        </p>
        <ButtonLink href="/contact" variant="light" className="mt-8 gap-2">
          Send Inquiry
          <ArrowRight className="h-4 w-4" />
        </ButtonLink>
      </div>
    </section>
  );
}
