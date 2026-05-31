import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { contactInquirySchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = contactInquirySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: parsed.error.issues[0]?.message ?? "Invalid form data."
        },
        { status: 400 }
      );
    }

    await prisma.contactInquiry.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email || null,
        phone: parsed.data.phone,
        courseInterest: parsed.data.courseInterest || null,
        message: parsed.data.message
      }
    });

    return NextResponse.json({
      message: "Inquiry saved successfully."
    });
  } catch (error) {
    console.error("Contact inquiry failed", error);

    return NextResponse.json(
      {
        message: "Unable to submit your inquiry right now."
      },
      { status: 500 }
    );
  }
}
