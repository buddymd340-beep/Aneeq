import { z } from "zod";

export const contactInquirySchema = z.object({
  name: z.string().trim().min(2, "Please enter your name."),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email.")
    .optional()
    .or(z.literal("")),
  phone: z.string().trim().min(7, "Please enter a valid phone number."),
  courseInterest: z.string().trim().optional(),
  message: z.string().trim().min(10, "Please write at least 10 characters.")
});

export type ContactInquiryInput = z.infer<typeof contactInquirySchema>;
