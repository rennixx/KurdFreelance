"use client";

import { useParams } from "next/navigation";
import { FreelancerProfileContent } from "@/components/freelancers/freelancer-profile-content";

export default function FreelancerProfilePage() {
  const params = useParams();
  const id = params.id as string;

  return <FreelancerProfileContent freelancerId={id} />;
}
