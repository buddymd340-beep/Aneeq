import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { courses, navItems, site } from "@/lib/content";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="md:col-span-2">
          <h2 className="text-2xl font-black">{site.name}</h2>
          <p className="mt-4 max-w-md text-sm leading-7 text-slate-300">
            {site.tagline} Explore subjects, understand the teaching style, and contact directly without creating an account.
          </p>
        </div>

        <div>
          <h3 className="font-bold">Pages</h3>
          <div className="mt-4 grid gap-3 text-sm text-slate-300">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-white">
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-bold">Courses</h3>
          <div className="mt-4 grid gap-3 text-sm text-slate-300">
            {courses.slice(0, 4).map((course) => (
              <Link key={course.slug} href={`/courses/${course.slug}`} className="hover:text-white">
                {course.title}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-4 border-t border-white/10 px-4 py-6 text-sm text-slate-300 sm:px-6 md:grid-cols-3 lg:px-8">
        <p className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-blue-300" />
          {site.phone}
        </p>
        <p className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-blue-300" />
          {site.email}
        </p>
        <p className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-blue-300" />
          {site.address}
        </p>
      </div>

      <div className="border-t border-white/10 py-5 text-center text-sm text-slate-400">
        Copyright {new Date().getFullYear()} {site.name}. All rights reserved.
      </div>
    </footer>
  );
}
