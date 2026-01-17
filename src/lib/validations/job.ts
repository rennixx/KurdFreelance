import { z } from "zod";

export const jobPostSchema = z.object({
  title: z
    .string()
    .min(10, "Title must be at least 10 characters")
    .max(80, "Title is too long (max 80 characters)"),
  description: z
    .string()
    .min(100, "Description must be at least 100 characters")
    .max(5000, "Description is too long"),
  categoryId: z.number().min(1, "Please select a category"),
  budgetType: z.enum(["fixed", "hourly"]),
  budgetMin: z.number().min(10, "Minimum budget is $10"),
  budgetMax: z.number().min(10, "Maximum budget is required"),
  estimatedDuration: z.string().min(1, "Please select a duration"),
  experienceLevel: z.enum(["entry", "intermediate", "expert"]),
});

export const proposalSchema = z.object({
  coverLetter: z
    .string()
    .min(100, "Cover letter must be at least 100 characters")
    .max(2000, "Cover letter is too long"),
  proposedBudget: z.number().min(10, "Minimum budget is $10").optional(),
  proposedRate: z.number().min(5, "Minimum rate is $5/hour").optional(),
  proposedDuration: z.string().optional(),
});

export type JobPostInput = z.infer<typeof jobPostSchema>;
export type ProposalInput = z.infer<typeof proposalSchema>;
