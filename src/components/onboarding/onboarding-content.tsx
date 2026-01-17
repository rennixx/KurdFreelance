"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, ArrowRight, ArrowLeft, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";

const skillOptions = [
  "JavaScript", "TypeScript", "React", "Next.js", "Node.js", "Python",
  "UI/UX Design", "Figma", "Adobe XD", "Graphic Design", "Logo Design",
  "Content Writing", "SEO", "Copywriting", "Translation", "Arabic",
  "WordPress", "Shopify", "E-commerce", "Mobile Development", "Flutter",
  "Data Analysis", "Machine Learning", "Video Editing", "Photography",
  "Social Media Marketing", "Google Ads", "Facebook Ads", "Email Marketing",
];

interface OnboardingContentProps {
  user: {
    id: string;
    role: "freelancer" | "client" | "admin";
  };
}

export function OnboardingContent({ user }: OnboardingContentProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Freelancer fields
    title: "",
    bio: "",
    hourlyRate: "",
    skills: [] as string[],
    location: "",
    // Client fields
    companyName: "",
    companyDescription: "",
    industry: "",
  });

  const isFreelancer = user.role === "freelancer";
  const totalSteps = isFreelancer ? 3 : 2;

  const handleSkillToggle = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const supabase = createClient();

    try {
      if (isFreelancer) {
        // Create freelancer profile
        const { error: profileError } = await supabase
          .from("freelancer_profiles")
          .insert({
            user_id: user.id,
            title: formData.title,
            bio: formData.bio,
            hourly_rate: parseFloat(formData.hourlyRate) || 0,
            skills: formData.skills,
            location: formData.location,
          });

        if (profileError) throw profileError;
      } else {
        // Create client profile
        const { error: profileError } = await supabase
          .from("client_profiles")
          .insert({
            user_id: user.id,
            company_name: formData.companyName,
            company_description: formData.companyDescription,
            industry: formData.industry,
            location: formData.location,
          });

        if (profileError) throw profileError;
      }

      // Update user onboarding status
      const { error: updateError } = await supabase
        .from("users")
        .update({ onboarding_completed: true })
        .eq("id", user.id);

      if (updateError) throw updateError;

      toast.success("Profile setup complete!");
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-2xl">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div key={i} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                    i + 1 < step
                      ? "bg-primary text-primary-foreground"
                      : i + 1 === step
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {i + 1 < step ? <Check className="h-5 w-5" /> : i + 1}
                </div>
                {i < totalSteps - 1 && (
                  <div
                    className={`w-full h-1 mx-2 ${
                      i + 1 < step ? "bg-primary" : "bg-muted"
                    }`}
                    style={{ minWidth: "100px" }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <Card>
          {isFreelancer ? (
            <>
              {step === 1 && (
                <>
                  <CardHeader>
                    <CardTitle>Tell us about yourself</CardTitle>
                    <CardDescription>
                      Create a compelling profile that attracts clients
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Professional Title</Label>
                      <Input
                        id="title"
                        placeholder="e.g., Full Stack Developer, UI/UX Designer"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        placeholder="Describe your experience, skills, and what makes you unique..."
                        rows={5}
                        value={formData.bio}
                        onChange={(e) =>
                          setFormData({ ...formData, bio: e.target.value })
                        }
                      />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="hourlyRate">Hourly Rate (USD)</Label>
                        <Input
                          id="hourlyRate"
                          type="number"
                          placeholder="e.g., 25"
                          value={formData.hourlyRate}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              hourlyRate: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          placeholder="e.g., Erbil, Kurdistan"
                          value={formData.location}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              location: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  </CardContent>
                </>
              )}

              {step === 2 && (
                <>
                  <CardHeader>
                    <CardTitle>Select your skills</CardTitle>
                    <CardDescription>
                      Choose skills that best represent your expertise
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {skillOptions.map((skill) => (
                        <Badge
                          key={skill}
                          variant={
                            formData.skills.includes(skill)
                              ? "default"
                              : "outline"
                          }
                          className="cursor-pointer hover:bg-primary/80 transition-colors"
                          onClick={() => handleSkillToggle(skill)}
                        >
                          {skill}
                          {formData.skills.includes(skill) && (
                            <Check className="ml-1 h-3 w-3" />
                          )}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground mt-4">
                      Selected: {formData.skills.length} skills
                    </p>
                  </CardContent>
                </>
              )}

              {step === 3 && (
                <>
                  <CardHeader>
                    <CardTitle>You&apos;re all set!</CardTitle>
                    <CardDescription>
                      Review your profile and start finding work
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                      <div>
                        <span className="text-sm text-muted-foreground">Title:</span>
                        <p className="font-medium">{formData.title || "Not set"}</p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Hourly Rate:</span>
                        <p className="font-medium">
                          ${formData.hourlyRate || "0"}/hr
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Location:</span>
                        <p className="font-medium">{formData.location || "Not set"}</p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Skills:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {formData.skills.map((skill) => (
                            <Badge key={skill} variant="secondary">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      You can always update your profile later from settings.
                    </p>
                  </CardContent>
                </>
              )}
            </>
          ) : (
            <>
              {step === 1 && (
                <>
                  <CardHeader>
                    <CardTitle>Tell us about your business</CardTitle>
                    <CardDescription>
                      Help freelancers understand your company
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name (Optional)</Label>
                      <Input
                        id="companyName"
                        placeholder="e.g., Acme Corporation"
                        value={formData.companyName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            companyName: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="companyDescription">
                        Company Description (Optional)
                      </Label>
                      <Textarea
                        id="companyDescription"
                        placeholder="Tell freelancers about your business..."
                        rows={4}
                        value={formData.companyDescription}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            companyDescription: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="industry">Industry</Label>
                        <Input
                          id="industry"
                          placeholder="e.g., Technology, Healthcare"
                          value={formData.industry}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              industry: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          placeholder="e.g., Erbil, Kurdistan"
                          value={formData.location}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              location: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  </CardContent>
                </>
              )}

              {step === 2 && (
                <>
                  <CardHeader>
                    <CardTitle>You&apos;re all set!</CardTitle>
                    <CardDescription>
                      Start posting jobs and finding talent
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                      <div>
                        <span className="text-sm text-muted-foreground">Company:</span>
                        <p className="font-medium">
                          {formData.companyName || "Individual Client"}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Industry:</span>
                        <p className="font-medium">
                          {formData.industry || "Not set"}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Location:</span>
                        <p className="font-medium">
                          {formData.location || "Not set"}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      You can always update your profile later from settings.
                    </p>
                  </CardContent>
                </>
              )}
            </>
          )}

          {/* Navigation */}
          <div className="flex justify-between p-6 pt-0">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 1}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            {step < totalSteps ? (
              <Button onClick={handleNext}>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Complete Setup
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
