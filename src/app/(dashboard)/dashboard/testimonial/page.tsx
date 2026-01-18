"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Star, Check, Clock, ArrowLeft } from "@phosphor-icons/react";
import Link from "next/link";

interface ExistingTestimonial {
  id: string;
  content: string;
  rating: number;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
}

export default function TestimonialPage() {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [existingTestimonial, setExistingTestimonial] = useState<ExistingTestimonial | null>(null);
  const [fetchingExisting, setFetchingExisting] = useState(true);

  useEffect(() => {
    async function fetchExisting() {
      try {
        const response = await fetch("/api/testimonials");
        if (response.ok) {
          const data = await response.json();
          if (data.testimonial) {
            setExistingTestimonial(data.testimonial);
            setContent(data.testimonial.content);
            setRating(data.testimonial.rating);
          }
        }
      } catch (err) {
        console.error("Error fetching existing testimonial:", err);
      } finally {
        setFetchingExisting(false);
      }
    }

    fetchExisting();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/testimonials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content, rating }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit testimonial");
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetchingExisting) {
    return (
      <div className="container max-w-2xl py-10">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  // Show success message
  if (success) {
    return (
      <div className="container max-w-2xl py-10">
        <Card>
          <CardContent className="pt-10 pb-10 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" weight="bold" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
            <p className="text-muted-foreground mb-6">
              Your testimonial has been submitted and is pending review. 
              We&apos;ll notify you once it&apos;s approved.
            </p>
            <Button onClick={() => router.push("/dashboard")}>
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show already approved message
  if (existingTestimonial?.is_approved) {
    return (
      <div className="container max-w-2xl py-10">
        <Link 
          href="/dashboard" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-600" />
              Your Testimonial is Live!
            </CardTitle>
            <CardDescription>
              Your testimonial has been approved and is now displayed on our platform.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/50 rounded-lg p-4 mb-4">
              <div className="flex gap-0.5 mb-2">
                {Array(existingTestimonial.rating).fill(0).map((_, i) => (
                  <Star 
                    key={i} 
                    className="w-4 h-4 fill-yellow-400 text-yellow-400" 
                    weight="fill"
                  />
                ))}
              </div>
              <p className="text-sm">&ldquo;{existingTestimonial.content}&rdquo;</p>
            </div>
            <p className="text-xs text-muted-foreground">
              Approved testimonials cannot be edited. Contact support if you need to make changes.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl py-10">
      <Link 
        href="/dashboard" 
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>
            {existingTestimonial ? "Update Your Testimonial" : "Share Your Experience"}
          </CardTitle>
          <CardDescription>
            {existingTestimonial ? (
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-yellow-600" />
                Your testimonial is pending review. You can update it until it&apos;s approved.
              </span>
            ) : (
              "Tell us about your experience with KurdFreelance. Your feedback helps others discover our platform!"
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Rating */}
            <div className="space-y-2">
              <Label>How would you rate your experience?</Label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="p-1 transition-transform hover:scale-110"
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(null)}
                    onClick={() => setRating(star)}
                  >
                    <Star
                      className={`w-8 h-8 transition-colors ${
                        star <= (hoveredRating ?? rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground/30"
                      }`}
                      weight={star <= (hoveredRating ?? rating) ? "fill" : "regular"}
                    />
                  </button>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                {rating === 5 && "Excellent!"}
                {rating === 4 && "Very Good"}
                {rating === 3 && "Good"}
                {rating === 2 && "Fair"}
                {rating === 1 && "Poor"}
              </p>
            </div>

            {/* Content */}
            <div className="space-y-2">
              <Label htmlFor="content">Your Testimonial</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share your experience with KurdFreelance. What made it special? How has it helped you? (minimum 20 characters)"
                rows={5}
                className="resize-none"
                required
                minLength={20}
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground text-right">
                {content.length}/500 characters
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-lg p-3 text-sm">
                {error}
              </div>
            )}

            {/* Guidelines */}
            <div className="bg-muted/50 rounded-lg p-4 text-sm">
              <p className="font-medium mb-2">Guidelines:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Be honest and specific about your experience</li>
                <li>Mention what made KurdFreelance helpful for you</li>
                <li>Keep it professional and respectful</li>
                <li>Your testimonial will be reviewed before publishing</li>
              </ul>
            </div>

            {/* Submit */}
            <Button type="submit" disabled={loading || content.length < 20} className="w-full">
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                  Submitting...
                </span>
              ) : existingTestimonial ? (
                "Update Testimonial"
              ) : (
                "Submit Testimonial"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
