"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FileUpload } from "@/components/ui/file-upload";
import {
  Save,
  X,
  Plus,
  Trash2,
  ArrowLeft,
  Loader2,
  User,
  Briefcase,
  GraduationCap,
  Award,
  Globe,
  ImagePlus,
} from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/stores";
import { profileSchema, type ProfileFormData } from "@/lib/validations";

const skills = [
  "JavaScript", "TypeScript", "React", "Next.js", "Node.js", "Python",
  "Java", "C#", "PHP", "Ruby", "Go", "Rust", "Swift", "Kotlin",
  "HTML/CSS", "Tailwind CSS", "UI/UX Design", "Figma", "Adobe XD",
  "Photoshop", "Illustrator", "WordPress", "Shopify", "AWS", "Azure",
  "Docker", "Kubernetes", "PostgreSQL", "MongoDB", "MySQL", "Redis",
  "GraphQL", "REST API", "Mobile Development", "iOS", "Android",
  "Flutter", "React Native", "Data Analysis", "Machine Learning",
  "SEO", "Digital Marketing", "Content Writing", "Video Editing",
];

const experienceLevels = [
  { value: "entry", label: "Entry Level (0-2 years)" },
  { value: "intermediate", label: "Intermediate (2-5 years)" },
  { value: "expert", label: "Expert (5-10 years)" },
  { value: "senior", label: "Senior (10+ years)" },
];

const availabilityOptions = [
  { value: "full-time", label: "Full-time (40+ hrs/week)" },
  { value: "part-time", label: "Part-time (20-30 hrs/week)" },
  { value: "hourly", label: "Hourly (Less than 20 hrs/week)" },
  { value: "not-available", label: "Not Available" },
];

const languageProficiencies = [
  "Native",
  "Fluent",
  "Conversational",
  "Basic",
];

export function ProfileEditContent() {
  const router = useRouter();
  const { user, freelancerProfile, clientProfile } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [languages, setLanguages] = useState<{ language: string; proficiency: string }[]>([
    { language: "Kurdish (Sorani)", proficiency: "Native" },
  ]);
  const [education, setEducation] = useState<{ degree: string; institution: string; year: string }[]>([]);
  const [certifications, setCertifications] = useState<{ name: string; issuer: string; year: string }[]>([]);
  const [portfolioItems, setPortfolioItems] = useState<{ title: string; description: string; imageUrl: string; link: string }[]>([]);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: "",
      title: "",
      bio: "",
      location: "",
      hourly_rate: 25,
      experience_level: "intermediate",
      availability: "full-time",
      website: "",
      linkedin: "",
      github: "",
      twitter: "",
    },
  });

  useEffect(() => {
    // Load existing profile data
    if (freelancerProfile) {
      form.setValue("title", freelancerProfile.professional_title || "");
      form.setValue("bio", freelancerProfile.bio || "");
      form.setValue("hourly_rate", freelancerProfile.hourly_rate || 25);
      // Load other fields from profile
    }
    if (user) {
      form.setValue("full_name", user.full_name || "");
      setAvatarUrl(user.avatar_url || "");
    }
  }, [freelancerProfile, user, form]);

  const addSkill = (skill: string) => {
    if (skill && !selectedSkills.includes(skill)) {
      setSelectedSkills([...selectedSkills, skill]);
    }
    setSkillInput("");
  };

  const removeSkill = (skill: string) => {
    setSelectedSkills(selectedSkills.filter((s) => s !== skill));
  };

  const addLanguage = () => {
    setLanguages([...languages, { language: "", proficiency: "Conversational" }]);
  };

  const removeLanguage = (index: number) => {
    setLanguages(languages.filter((_, i) => i !== index));
  };

  const updateLanguage = (index: number, field: "language" | "proficiency", value: string) => {
    const updated = [...languages];
    updated[index][field] = value;
    setLanguages(updated);
  };

  const addEducation = () => {
    setEducation([...education, { degree: "", institution: "", year: "" }]);
  };

  const removeEducation = (index: number) => {
    setEducation(education.filter((_, i) => i !== index));
  };

  const addCertification = () => {
    setCertifications([...certifications, { name: "", issuer: "", year: "" }]);
  };

  const removeCertification = (index: number) => {
    setCertifications(certifications.filter((_, i) => i !== index));
  };

  const addPortfolioItem = () => {
    setPortfolioItems([...portfolioItems, { title: "", description: "", imageUrl: "", link: "" }]);
  };

  const removePortfolioItem = (index: number) => {
    setPortfolioItems(portfolioItems.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      console.log("Profile data:", {
        ...data,
        avatar_url: avatarUrl,
        skills: selectedSkills,
        languages,
        education,
        certifications,
        portfolio_items: portfolioItems,
      });

      toast.success("Profile updated successfully!");
      router.push("/dashboard");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Edit Profile</h1>
          <p className="text-gray-500">Update your profile information</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Basic Information
              </CardTitle>
              <CardDescription>
                This information will be displayed on your public profile
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Upload */}
              <div className="flex items-center gap-6">
                <FileUpload
                  bucket="avatars"
                  path={user?.id}
                  accept="image/*"
                  maxSize={5}
                  variant="avatar"
                  onUploadComplete={(urls) => setAvatarUrl(urls[0])}
                />
                <div>
                  <h3 className="font-medium">Profile Photo</h3>
                  <p className="text-sm text-gray-500">
                    Upload a professional photo. Max 5MB, JPG or PNG.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Erbil, Kurdistan" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Professional Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Full Stack Developer" {...field} />
                    </FormControl>
                    <FormDescription>
                      A short title that describes what you do
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell clients about yourself, your experience, and what makes you unique..."
                        className="min-h-[150px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {(field.value?.length || 0)}/1000 characters
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Professional Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Professional Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="hourly_rate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hourly Rate ($)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="experience_level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Experience Level</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {experienceLevels.map((level) => (
                            <SelectItem key={level.value} value={level.value}>
                              {level.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="availability"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Availability</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availabilityOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Skills */}
              <div className="space-y-3">
                <Label>Skills</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {selectedSkills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="px-3 py-1">
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="ml-2 hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
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
                  />
                  <Button type="button" variant="outline" onClick={() => addSkill(skillInput)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {skills
                    .filter((s) => !selectedSkills.includes(s))
                    .slice(0, 10)
                    .map((skill) => (
                      <Badge
                        key={skill}
                        variant="outline"
                        className="cursor-pointer hover:bg-gray-100"
                        onClick={() => addSkill(skill)}
                      >
                        + {skill}
                      </Badge>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Languages */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Languages
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {languages.map((lang, index) => (
                <div key={index} className="flex gap-4 items-start">
                  <div className="flex-1">
                    <Input
                      placeholder="Language"
                      value={lang.language}
                      onChange={(e) => updateLanguage(index, "language", e.target.value)}
                    />
                  </div>
                  <div className="w-40">
                    <Select
                      value={lang.proficiency}
                      onValueChange={(value) => updateLanguage(index, "proficiency", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {languageProficiencies.map((prof) => (
                          <SelectItem key={prof} value={prof}>
                            {prof}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeLanguage(index)}
                    disabled={languages.length === 1}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addLanguage}>
                <Plus className="h-4 w-4 mr-2" />
                Add Language
              </Button>
            </CardContent>
          </Card>

          {/* Education */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Education
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {education.map((edu, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-3">
                  <div className="flex justify-between">
                    <h4 className="font-medium">Education #{index + 1}</h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeEducation(index)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      placeholder="Degree"
                      value={edu.degree}
                      onChange={(e) => {
                        const updated = [...education];
                        updated[index].degree = e.target.value;
                        setEducation(updated);
                      }}
                    />
                    <Input
                      placeholder="Institution"
                      value={edu.institution}
                      onChange={(e) => {
                        const updated = [...education];
                        updated[index].institution = e.target.value;
                        setEducation(updated);
                      }}
                    />
                    <Input
                      placeholder="Year"
                      type="number"
                      value={edu.year}
                      onChange={(e) => {
                        const updated = [...education];
                        updated[index].year = e.target.value;
                        setEducation(updated);
                      }}
                    />
                  </div>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addEducation}>
                <Plus className="h-4 w-4 mr-2" />
                Add Education
              </Button>
            </CardContent>
          </Card>

          {/* Certifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Certifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {certifications.map((cert, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-3">
                  <div className="flex justify-between">
                    <h4 className="font-medium">Certification #{index + 1}</h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeCertification(index)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      placeholder="Certification Name"
                      value={cert.name}
                      onChange={(e) => {
                        const updated = [...certifications];
                        updated[index].name = e.target.value;
                        setCertifications(updated);
                      }}
                    />
                    <Input
                      placeholder="Issuing Organization"
                      value={cert.issuer}
                      onChange={(e) => {
                        const updated = [...certifications];
                        updated[index].issuer = e.target.value;
                        setCertifications(updated);
                      }}
                    />
                    <Input
                      placeholder="Year"
                      type="number"
                      value={cert.year}
                      onChange={(e) => {
                        const updated = [...certifications];
                        updated[index].year = e.target.value;
                        setCertifications(updated);
                      }}
                    />
                  </div>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addCertification}>
                <Plus className="h-4 w-4 mr-2" />
                Add Certification
              </Button>
            </CardContent>
          </Card>

          {/* Portfolio */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImagePlus className="h-5 w-5" />
                Portfolio
              </CardTitle>
              <CardDescription>
                Showcase your best work to attract clients
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {portfolioItems.map((item, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-4">
                  <div className="flex justify-between">
                    <h4 className="font-medium">Portfolio Item #{index + 1}</h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removePortfolioItem(index)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      placeholder="Project Title"
                      value={item.title}
                      onChange={(e) => {
                        const updated = [...portfolioItems];
                        updated[index].title = e.target.value;
                        setPortfolioItems(updated);
                      }}
                    />
                    <Input
                      placeholder="Project URL (optional)"
                      value={item.link}
                      onChange={(e) => {
                        const updated = [...portfolioItems];
                        updated[index].link = e.target.value;
                        setPortfolioItems(updated);
                      }}
                    />
                  </div>
                  <Textarea
                    placeholder="Project Description"
                    value={item.description}
                    onChange={(e) => {
                      const updated = [...portfolioItems];
                      updated[index].description = e.target.value;
                      setPortfolioItems(updated);
                    }}
                  />
                  <FileUpload
                    bucket="portfolios"
                    path={`${user?.id}/${index}`}
                    accept="image/*"
                    maxSize={10}
                    variant="compact"
                    onUploadComplete={(urls) => {
                      const updated = [...portfolioItems];
                      updated[index].imageUrl = urls[0];
                      setPortfolioItems(updated);
                    }}
                  />
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addPortfolioItem}>
                <Plus className="h-4 w-4 mr-2" />
                Add Portfolio Item
              </Button>
            </CardContent>
          </Card>

          {/* Social Links */}
          <Card>
            <CardHeader>
              <CardTitle>Social Links</CardTitle>
              <CardDescription>
                Add links to your professional profiles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website</FormLabel>
                      <FormControl>
                        <Input placeholder="https://yourwebsite.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="linkedin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>LinkedIn</FormLabel>
                      <FormControl>
                        <Input placeholder="https://linkedin.com/in/username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="github"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>GitHub</FormLabel>
                      <FormControl>
                        <Input placeholder="https://github.com/username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="twitter"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Twitter/X</FormLabel>
                      <FormControl>
                        <Input placeholder="https://twitter.com/username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-green-600 hover:bg-green-700">
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Profile
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
