"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { faqs } from "@/lib/content";
import { cn } from "@/lib/utils";

export function FaqAccordion() {
  const [active, setActive] = useState(0);

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      {faqs.map((faq, index) => {
        const isOpen = active === index;

        return (
          <div key={faq.question} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <button
              type="button"
              onClick={() => setActive(isOpen ? -1 : index)}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left font-black text-slate-950"
            >
              {faq.question}
              <ChevronDown className={cn("h-5 w-5 shrink-0 text-blue-600 transition", isOpen && "rotate-180")} />
            </button>
            {isOpen ? <p className="border-t border-slate-100 px-6 py-5 leading-7 text-slate-600">{faq.answer}</p> : null}
          </div>
        );
      })}
    </div>
  );
}
