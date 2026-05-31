"use client";

import { FormEvent, useState } from "react";
import { Send } from "lucide-react";
import { courses } from "@/lib/content";

type FormState = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      courseInterest: String(formData.get("courseInterest") ?? ""),
      message: String(formData.get("message") ?? "")
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(result.message ?? "Unable to submit your message.");
      }

      form.reset();
      setState("success");
      setMessage("Thank you. Your inquiry has been sent successfully.");
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "Something went wrong.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl shadow-blue-950/10 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-black text-slate-700">
          Full name
          <input
            name="name"
            required
            className="rounded-2xl border border-slate-200 px-4 py-3 font-semibold outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            placeholder="Your name"
          />
        </label>

        <label className="grid gap-2 text-sm font-black text-slate-700">
          Phone number
          <input
            name="phone"
            required
            className="rounded-2xl border border-slate-200 px-4 py-3 font-semibold outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            placeholder="+1 555 0199"
          />
        </label>

        <label className="grid gap-2 text-sm font-black text-slate-700">
          Email optional
          <input
            name="email"
            type="email"
            className="rounded-2xl border border-slate-200 px-4 py-3 font-semibold outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            placeholder="you@example.com"
          />
        </label>

        <label className="grid gap-2 text-sm font-black text-slate-700">
          Interested course
          <select
            name="courseInterest"
            className="rounded-2xl border border-slate-200 px-4 py-3 font-semibold outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            defaultValue=""
          >
            <option value="" disabled>
              Select a course
            </option>
            {courses.map((course) => (
              <option key={course.slug} value={course.title}>
                {course.title}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="mt-5 grid gap-2 text-sm font-black text-slate-700">
        Message
        <textarea
          name="message"
          required
          rows={5}
          className="resize-none rounded-2xl border border-slate-200 px-4 py-3 font-semibold outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          placeholder="Tell us about class level, preferred timing, and learning goals."
        />
      </label>

      {message ? (
        <p className={`mt-5 rounded-2xl px-4 py-3 text-sm font-bold ${state === "success" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
          {message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={state === "submitting"}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 font-black text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {state === "submitting" ? "Sending..." : "Send Inquiry"}
        <Send className="h-4 w-4" />
      </button>
    </form>
  );
}
