"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { CircleNotch, X, Plus } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";
import { jobPostSchema } from "@/lib/validations";

type JobFormData = z.infer<typeof jobPostSchema>;

const categories = [
  { id: 1, name: "Development" },
  { id: 2, name: "Design" },
  { id: 3, name: "Writing" },
  { id: 4, name: "Marketing" },
  { id: 5, name: "Video & Animation" },
  { id: 6, name: "Music & Audio" },
  { id: 7, name: "Data" },
  { id: 8, name: "Admin Support" },
];

const durations = [
  "Less than 1 week",
  "1-2 weeks",
  "2-4 weeks",
  "1-3 months",
  "3-6 months",
  "More than 6 months",
];

const suggestedSkills = [
  "JavaScript", "TypeScript", "React", "Next.js", "Node.js", "Python",
  "UI/UX Design", "Figma", "Adobe XD", "Graphic Design", "Logo Design",
  "Content Writing", "SEO", "Copywriting", "WordPress", "PHP",
];

interface PostJobFormProps {
  userId: string;
}

export function PostJobForm({ userId }: PostJobFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<JobFormData>({
    resolver: zodResolver(jobPostSchema),
    defaultValues: {
      budgetType: "fixed",
      experienceLevel: "intermediate",
      categoryId: undefined,
      estimatedDuration: undefined,
      budgetMin: 0,
      budgetMax: 0,
    },
  });

  const budgetType = watch("budgetType");

  const addSkill = (skill: string) => {
    const trimmedSkill = skill.trim();
    if (trimmedSkill && !skills.includes(trimmedSkill) && skills.length < 10) {
      setSkills([...skills, trimmedSkill]);
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const onSubmit = async (data: JobFormData) => {
    console.log("Form submitted with data:", data);
    console.log("Form errors:", errors);
    
    // Validate skills
    if (skills.length === 0) {
      toast.error("Please add at least one skill");
      return;
    }

    // Validate budget
    if (data.budgetMin && data.budgetMax && data.budgetMin > data.budgetMax) {
      toast.error("Minimum budget cannot be greater than maximum budget");
      return;
    }

    setIsLoading(true);
    const supabase = createClient();

    try {
      console.log("Submitting job data:", {
        ...data,
        skills,
        client_id: userId,
      });

      const { data: job, error } = await supabase
        .from("jobs")
        .insert({
          client_id: userId,
          title: data.title,
          description: data.description,
          category: data.categoryId,
          budget_type: data.budgetType,
          budget_min: data.budgetMin,
          budget_max: data.budgetMax,
          duration: data.estimatedDuration,
          experience_level: data.experienceLevel,
          skills: skills,
          status: "open",
        })
        .select()
        .single();

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      console.log("Job created successfully:", job);
      toast.success("Job posted successfully!");
      router.push(`/my-jobs`);
      router.refresh();
    } catch (error: any) {
      console.error("Job post error:", error);
      toast.error(error.message || "Failed to post job. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Job Details</CardTitle>
          <CardDescription>
            Describe your project to attract the right freelancers
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Job Title</Label>
            <Input
              id="title"
              placeholder="e.g., Build a React E-commerce Website"
              {...register("title")}
              disabled={isLoading}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your project in detail. What do you need done? What are the requirements?"
              rows={8}
              {...register("description")}
              disabled={isLoading}
            />
            {errors.description && (
              <p className="text-sm text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="categoryId">Category</Label>
              <Select
                onValueChange={(value) => setValue("categoryId", parseInt(value))}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.categoryId && (
                <p className="text-sm text-destructive">
                  {errors.categoryId.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimatedDuration">Expected Duration</Label>
              <Select
                onValueChange={(value) => setValue("estimatedDuration", value)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  {durations.map((duration) => (
                    <SelectItem key={duration} value={duration}>
                      {duration}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.estimatedDuration && (
                <p className="text-sm text-destructive">
                  {errors.estimatedDuration.message}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Budget</CardTitle>
          <CardDescription>Set your budget for this project</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Budget Type</Label>
            <div className="grid grid-cols-2 gap-4">
              <Button
                type="button"
                variant={budgetType === "fixed" ? "default" : "outline"}
                className="h-auto py-4"
                onClick={() => setValue("budgetType", "fixed")}
              >
                <div className="text-center">
                  <div className="font-medium">Fixed Price</div>
                  <div className="text-xs opacity-80">
                    Pay a set price for the project
                  </div>
                </div>
              </Button>
              <Button
                type="button"
                variant={budgetType === "hourly" ? "default" : "outline"}
                className="h-auto py-4"
                onClick={() => setValue("budgetType", "hourly")}
              >
                <div className="text-center">
                  <div className="font-medium">Hourly Rate</div>
                  <div className="text-xs opacity-80">
                    Pay by the hour
                  </div>
                </div>
              </Button>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budgetMin">
                {budgetType === "hourly" ? "Min Rate ($/hr)" : "Min Budget ($)"}
              </Label>
              <Input
                id="budgetMin"
                type="number"
                placeholder="e.g., 100"
                {...register("budgetMin", { valueAsNumber: true })}
                disabled={isLoading}
              />
              {errors.budgetMin && (
                <p className="text-sm text-destructive">
                  {errors.budgetMin.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="budgetMax">
                {budgetType === "hourly" ? "Max Rate ($/hr)" : "Max Budget ($)"}
              </Label>
              <Input
                id="budgetMax"
                type="number"
                placeholder="e.g., 500"
                {...register("budgetMax", { valueAsNumber: true })}
                disabled={isLoading}
              />
              {errors.budgetMax && (
                <p className="text-sm text-destructive">
                  {errors.budgetMax.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Experience Level</Label>
            <Select
              defaultValue="intermediate"
              onValueChange={(value) =>
                setValue(
                  "experienceLevel",
                  value as "entry" | "intermediate" | "expert"
                )
              }
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="entry">
                  Entry Level - New freelancers welcome
                </SelectItem>
                <SelectItem value="intermediate">
                  Intermediate - Some experience required
                </SelectItem>
                <SelectItem value="expert">
                  Expert - Extensive experience required
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Skills Required</CardTitle>
          <CardDescription>
            Add skills that freelancers should have
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Add a skill..."
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addSkill(skillInput);
                }
              }}
              disabled={isLoading || skills.length >= 10}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => addSkill(skillInput)}
              disabled={isLoading || skills.length >= 10}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {skills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="pl-2 pr-1">
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="ml-1 rounded-full p-0.5 hover:bg-muted-foreground/20"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          <div>
            <p className="text-sm text-muted-foreground mb-2">
              Suggested skills:
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestedSkills
                .filter((skill) => !skills.includes(skill))
                .slice(0, 8)
                .map((skill) => (
                  <Badge
                    key={skill}
                    variant="outline"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                    onClick={() => addSkill(skill)}
                  >
                    + {skill}
                  </Badge>
                ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <CircleNotch className="mr-2 h-4 w-4 animate-spin" />}
          Post Job
        </Button>
      </div>
      
      {/* Show validation errors for debugging */}
      {Object.keys(errors).length > 0 && (
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
          <p className="font-medium text-destructive mb-2">Please fix the following errors:</p>
          <ul className="list-disc list-inside space-y-1 text-sm text-destructive">
            {Object.entries(errors).map(([key, error]) => (
              <li key={key}>
                {key}: {error?.message?.toString()}
              </li>
            ))}
          </ul>
        </div>
      )}
    </form>
  );
}
