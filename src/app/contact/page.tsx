import type { Metadata } from "next";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { SectionHeading } from "@/components/section-heading";
import { site } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact"
};

const contactCards = [
  { label: "Phone", value: site.phone, icon: Phone },
  { label: "WhatsApp", value: site.whatsapp, icon: MessageCircle },
  { label: "Email", value: site.email, icon: Mail },
  { label: "Timing", value: site.timing, icon: Clock }
];

export default function ContactPage() {
  return (
    <>
      <section className="bg-gradient-to-b from-blue-50 to-white py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-600">Contact</p>
          <h1 className="mx-auto mt-4 max-w-4xl text-4xl font-black tracking-tight text-slate-950 sm:text-6xl">
            Send an inquiry and start the conversation.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            No login is needed. Parents or students can contact directly from this page.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_420px] lg:px-8">
        <div>
          <SectionHeading
            eyebrow="Inquiry Form"
            title="Tell us what you want to learn"
            description="This form is connected to the contact API and can save inquiries in the database."
          />
          <div className="mt-10">
            <ContactForm />
          </div>
        </div>

        <aside className="space-y-5">
          {contactCards.map((card) => (
            <div key={card.label} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-600 text-white">
                <card.icon className="h-6 w-6" />
              </span>
              <p className="mt-5 text-sm font-black uppercase tracking-wide text-slate-400">{card.label}</p>
              <p className="mt-1 text-lg font-black text-slate-950">{card.value}</p>
            </div>
          ))}

          <div className="rounded-[2rem] bg-slate-950 p-6 text-white shadow-xl">
            <MapPin className="h-7 w-7 text-blue-300" />
            <p className="mt-5 text-sm font-black uppercase tracking-wide text-slate-400">Address</p>
            <p className="mt-1 text-lg font-black">{site.address}</p>
            <div className="mt-6 rounded-3xl bg-white/10 p-8 text-center text-sm font-bold text-slate-300">
              Map placeholder for Figma or Google Maps embed.
            </div>
          </div>
        </aside>
      </section>
    </>
  );
}
