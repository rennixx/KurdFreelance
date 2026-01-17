export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          phone: string | null;
          user_type: "freelancer" | "client" | "both";
          avatar_url: string | null;
          location: string | null;
          timezone: string;
          language: string;
          email_verified: boolean;
          phone_verified: boolean;
          id_verified: boolean;
          is_active: boolean;
          last_seen_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          phone?: string | null;
          user_type?: "freelancer" | "client" | "both";
          avatar_url?: string | null;
          location?: string | null;
          timezone?: string;
          language?: string;
          email_verified?: boolean;
          phone_verified?: boolean;
          id_verified?: boolean;
          is_active?: boolean;
          last_seen_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          phone?: string | null;
          user_type?: "freelancer" | "client" | "both";
          avatar_url?: string | null;
          location?: string | null;
          timezone?: string;
          language?: string;
          email_verified?: boolean;
          phone_verified?: boolean;
          id_verified?: boolean;
          is_active?: boolean;
          last_seen_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      freelancer_profiles: {
        Row: {
          id: string;
          user_id: string;
          professional_title: string | null;
          bio: string | null;
          hourly_rate: number | null;
          currency: string;
          availability: string;
          hours_per_week: number;
          experience_level: string;
          total_earnings: number;
          total_jobs_completed: number;
          total_hours_worked: number;
          rating: number;
          reviews_count: number;
          profile_completeness: number;
          featured: boolean;
          search_visible: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          professional_title?: string | null;
          bio?: string | null;
          hourly_rate?: number | null;
          currency?: string;
          availability?: string;
          hours_per_week?: number;
          experience_level?: string;
          total_earnings?: number;
          total_jobs_completed?: number;
          total_hours_worked?: number;
          rating?: number;
          reviews_count?: number;
          profile_completeness?: number;
          featured?: boolean;
          search_visible?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          professional_title?: string | null;
          bio?: string | null;
          hourly_rate?: number | null;
          currency?: string;
          availability?: string;
          hours_per_week?: number;
          experience_level?: string;
          total_earnings?: number;
          total_jobs_completed?: number;
          total_hours_worked?: number;
          rating?: number;
          reviews_count?: number;
          profile_completeness?: number;
          featured?: boolean;
          search_visible?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      client_profiles: {
        Row: {
          id: string;
          user_id: string;
          company_name: string | null;
          company_description: string | null;
          company_size: string | null;
          industry: string | null;
          website_url: string | null;
          total_spent: number;
          total_jobs_posted: number;
          total_jobs_completed: number;
          rating: number;
          reviews_count: number;
          payment_verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          company_name?: string | null;
          company_description?: string | null;
          company_size?: string | null;
          industry?: string | null;
          website_url?: string | null;
          total_spent?: number;
          total_jobs_posted?: number;
          total_jobs_completed?: number;
          rating?: number;
          reviews_count?: number;
          payment_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          company_name?: string | null;
          company_description?: string | null;
          company_size?: string | null;
          industry?: string | null;
          website_url?: string | null;
          total_spent?: number;
          total_jobs_posted?: number;
          total_jobs_completed?: number;
          rating?: number;
          reviews_count?: number;
          payment_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      skills: {
        Row: {
          id: number;
          name: string;
          slug: string;
          category_id: number | null;
          description: string | null;
          is_popular: boolean;
          jobs_count: number;
          freelancers_count: number;
          created_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          slug: string;
          category_id?: number | null;
          description?: string | null;
          is_popular?: boolean;
          jobs_count?: number;
          freelancers_count?: number;
          created_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          slug?: string;
          category_id?: number | null;
          description?: string | null;
          is_popular?: boolean;
          jobs_count?: number;
          freelancers_count?: number;
          created_at?: string;
        };
      };
      skill_categories: {
        Row: {
          id: number;
          name: string;
          slug: string;
          icon: string | null;
          description: string | null;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          slug: string;
          icon?: string | null;
          description?: string | null;
          display_order?: number;
          created_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          slug?: string;
          icon?: string | null;
          description?: string | null;
          display_order?: number;
          created_at?: string;
        };
      };
      jobs: {
        Row: {
          id: string;
          client_id: string;
          title: string;
          slug: string | null;
          description: string;
          category_id: number | null;
          budget_type: "fixed" | "hourly";
          budget_min: number | null;
          budget_max: number | null;
          hourly_rate_min: number | null;
          hourly_rate_max: number | null;
          estimated_hours: number | null;
          estimated_duration: string | null;
          experience_level: string;
          project_type: string;
          status: string;
          visibility: string;
          proposals_count: number;
          views_count: number;
          hired_count: number;
          attachments: Json;
          questions: Json;
          featured: boolean;
          featured_until: string | null;
          expires_at: string | null;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          client_id: string;
          title: string;
          slug?: string | null;
          description: string;
          category_id?: number | null;
          budget_type: "fixed" | "hourly";
          budget_min?: number | null;
          budget_max?: number | null;
          hourly_rate_min?: number | null;
          hourly_rate_max?: number | null;
          estimated_hours?: number | null;
          estimated_duration?: string | null;
          experience_level?: string;
          project_type?: string;
          status?: string;
          visibility?: string;
          proposals_count?: number;
          views_count?: number;
          hired_count?: number;
          attachments?: Json;
          questions?: Json;
          featured?: boolean;
          featured_until?: string | null;
          expires_at?: string | null;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          client_id?: string;
          title?: string;
          slug?: string | null;
          description?: string;
          category_id?: number | null;
          budget_type?: "fixed" | "hourly";
          budget_min?: number | null;
          budget_max?: number | null;
          hourly_rate_min?: number | null;
          hourly_rate_max?: number | null;
          estimated_hours?: number | null;
          estimated_duration?: string | null;
          experience_level?: string;
          project_type?: string;
          status?: string;
          visibility?: string;
          proposals_count?: number;
          views_count?: number;
          hired_count?: number;
          attachments?: Json;
          questions?: Json;
          featured?: boolean;
          featured_until?: string | null;
          expires_at?: string | null;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      proposals: {
        Row: {
          id: string;
          job_id: string;
          freelancer_id: string;
          cover_letter: string;
          proposed_rate: number | null;
          proposed_budget: number | null;
          proposed_duration: string | null;
          milestones: Json;
          attachments: Json;
          answers: Json;
          status: string;
          client_notes: string | null;
          rejection_reason: string | null;
          viewed_at: string | null;
          shortlisted_at: string | null;
          responded_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          job_id: string;
          freelancer_id: string;
          cover_letter: string;
          proposed_rate?: number | null;
          proposed_budget?: number | null;
          proposed_duration?: string | null;
          milestones?: Json;
          attachments?: Json;
          answers?: Json;
          status?: string;
          client_notes?: string | null;
          rejection_reason?: string | null;
          viewed_at?: string | null;
          shortlisted_at?: string | null;
          responded_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          job_id?: string;
          freelancer_id?: string;
          cover_letter?: string;
          proposed_rate?: number | null;
          proposed_budget?: number | null;
          proposed_duration?: string | null;
          milestones?: Json;
          attachments?: Json;
          answers?: Json;
          status?: string;
          client_notes?: string | null;
          rejection_reason?: string | null;
          viewed_at?: string | null;
          shortlisted_at?: string | null;
          responded_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      contracts: {
        Row: {
          id: string;
          job_id: string | null;
          proposal_id: string | null;
          freelancer_id: string | null;
          client_id: string | null;
          title: string;
          description: string | null;
          contract_type: "fixed" | "hourly";
          total_budget: number;
          hourly_rate: number | null;
          weekly_limit: number | null;
          status: string;
          start_date: string;
          end_date: string | null;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          job_id?: string | null;
          proposal_id?: string | null;
          freelancer_id?: string | null;
          client_id?: string | null;
          title: string;
          description?: string | null;
          contract_type: "fixed" | "hourly";
          total_budget: number;
          hourly_rate?: number | null;
          weekly_limit?: number | null;
          status?: string;
          start_date?: string;
          end_date?: string | null;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          job_id?: string | null;
          proposal_id?: string | null;
          freelancer_id?: string | null;
          client_id?: string | null;
          title?: string;
          description?: string | null;
          contract_type?: "fixed" | "hourly";
          total_budget?: number;
          hourly_rate?: number | null;
          weekly_limit?: number | null;
          status?: string;
          start_date?: string;
          end_date?: string | null;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          sender_id: string;
          message_type: string;
          content: string;
          attachments: Json;
          is_read: boolean;
          read_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          sender_id: string;
          message_type?: string;
          content: string;
          attachments?: Json;
          is_read?: boolean;
          read_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          conversation_id?: string;
          sender_id?: string;
          message_type?: string;
          content?: string;
          attachments?: Json;
          is_read?: boolean;
          read_at?: string | null;
          created_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          title: string;
          body: string | null;
          link: string | null;
          metadata: Json;
          is_read: boolean;
          read_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          title: string;
          body?: string | null;
          link?: string | null;
          metadata?: Json;
          is_read?: boolean;
          read_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: string;
          title?: string;
          body?: string | null;
          link?: string | null;
          metadata?: Json;
          is_read?: boolean;
          read_at?: string | null;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type InsertTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
export type UpdateTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];
