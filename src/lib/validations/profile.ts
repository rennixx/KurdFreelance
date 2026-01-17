import { z } from "zod";

export const freelancerProfileSchema = z.object({
  professionalTitle: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title is too long"),
  bio: z
    .string()
    .min(50, "Bio must be at least 50 characters")
    .max(2000, "Bio is too long"),
  hourlyRate: z
    .number()
    .min(5, "Minimum rate is $5/hour")
    .max(500, "Maximum rate is $500/hour"),
  availability: z.enum(["available", "limited", "unavailable"]),
  hoursPerWeek: z.number().min(1).max(60),
  experienceLevel: z.enum(["entry", "intermediate", "expert"]),
  location: z.string().min(2, "Please enter your location"),
});

export const clientProfileSchema = z.object({
  companyName: z.string().optional(),
  companyDescription: z.string().max(1000).optional(),
  companySize: z.enum(["solo", "2-10", "11-50", "51-200", "200+"]).optional(),
  industry: z.string().optional(),
  websiteUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
});

export const portfolioItemSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title is too long"),
  description: z.string().max(500, "Description is too long").optional(),
  category: z.string().optional(),
  projectUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
});

// Profile edit form schema - comprehensive
export const profileSchema = z.object({
  full_name: z.string().min(2, "Name is required").max(100),
  title: z.string().max(100).optional(),
  bio: z.string().max(1000).optional(),
  location: z.string().max(100).optional(),
  hourly_rate: z.number().min(1).max(1000).optional(),
  experience_level: z.enum(["entry", "intermediate", "expert", "senior"]).optional(),
  availability: z.enum(["full-time", "part-time", "hourly", "not-available"]).optional(),
  website: z.string().url().optional().or(z.literal("")),
  linkedin: z.string().url().optional().or(z.literal("")),
  github: z.string().url().optional().or(z.literal("")),
  twitter: z.string().url().optional().or(z.literal("")),
});

export type FreelancerProfileInput = z.infer<typeof freelancerProfileSchema>;
export type ClientProfileInput = z.infer<typeof clientProfileSchema>;
export type PortfolioItemInput = z.infer<typeof portfolioItemSchema>;
export type ProfileFormData = z.infer<typeof profileSchema>;
