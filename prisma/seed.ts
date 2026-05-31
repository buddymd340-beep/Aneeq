import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@prisma/client";
import { courses, faqs, site, testimonials } from "../src/lib/content";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db"
});

const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.course.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.fAQ.deleteMany();
  await prisma.siteSetting.deleteMany();

  await prisma.siteSetting.create({
    data: {
      siteName: site.name,
      tagline: site.tagline,
      phone: site.phone,
      email: site.email,
      address: site.address,
      whatsappNumber: site.whatsapp,
      heroTitle: "Learn better with simple personal teaching.",
      heroSubtitle: "Browse courses, understand the teaching style, and send a contact inquiry without login."
    }
  });

  await prisma.course.createMany({
    data: courses.map((course) => ({
      title: course.title,
      slug: course.slug,
      category: course.category,
      shortDescription: course.shortDescription,
      description: course.description,
      level: course.level,
      duration: course.duration,
      mode: course.mode,
      fee: course.fee,
      color: course.color,
      isFeatured: course.isFeatured,
      isActive: true
    }))
  });

  await prisma.testimonial.createMany({
    data: testimonials.map((testimonial) => ({
      studentName: testimonial.name,
      studentClass: testimonial.className,
      message: testimonial.quote,
      rating: testimonial.rating,
      isActive: true
    }))
  });

  await prisma.fAQ.createMany({
    data: faqs.map((faq) => ({
      question: faq.question,
      answer: faq.answer,
      isActive: true
    }))
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
