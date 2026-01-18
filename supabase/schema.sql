-- KurdFreelance Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'freelancer' CHECK (role IN ('freelancer', 'client', 'admin')),
    phone TEXT,
    onboarding_completed BOOLEAN DEFAULT false,
    email_verified BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Freelancer profiles
CREATE TABLE IF NOT EXISTS public.freelancer_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT,
    bio TEXT,
    hourly_rate DECIMAL(10, 2) DEFAULT 0,
    skills TEXT[] DEFAULT '{}',
    location TEXT,
    availability TEXT DEFAULT 'available' CHECK (availability IN ('available', 'busy', 'not_available')),
    portfolio_url TEXT,
    linkedin_url TEXT,
    github_url TEXT,
    total_earnings DECIMAL(12, 2) DEFAULT 0,
    jobs_completed INTEGER DEFAULT 0,
    rating DECIMAL(3, 2) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Client profiles
CREATE TABLE IF NOT EXISTS public.client_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
    company_name TEXT,
    company_description TEXT,
    industry TEXT,
    website TEXT,
    location TEXT,
    total_spent DECIMAL(12, 2) DEFAULT 0,
    jobs_posted INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Skills table
CREATE TABLE IF NOT EXISTS public.skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    category TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Jobs table
CREATE TABLE IF NOT EXISTS public.jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT,
    budget_type TEXT NOT NULL CHECK (budget_type IN ('fixed', 'hourly')),
    budget_min DECIMAL(10, 2) NOT NULL,
    budget_max DECIMAL(10, 2) NOT NULL,
    duration TEXT,
    experience_level TEXT CHECK (experience_level IN ('entry', 'intermediate', 'expert')),
    skills TEXT[] DEFAULT '{}',
    attachments TEXT[] DEFAULT '{}',
    status TEXT DEFAULT 'open' CHECK (status IN ('draft', 'open', 'in_progress', 'completed', 'cancelled')),
    visibility TEXT DEFAULT 'public' CHECK (visibility IN ('public', 'private', 'invite_only')),
    proposal_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Proposals table
CREATE TABLE IF NOT EXISTS public.proposals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
    freelancer_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    cover_letter TEXT NOT NULL,
    proposed_rate DECIMAL(10, 2),
    estimated_duration TEXT,
    attachments TEXT[] DEFAULT '{}',
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'viewed', 'shortlisted', 'accepted', 'rejected', 'withdrawn')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(job_id, freelancer_id)
);

-- Contracts table
CREATE TABLE IF NOT EXISTS public.contracts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID REFERENCES public.jobs(id) ON DELETE SET NULL,
    proposal_id UUID REFERENCES public.proposals(id) ON DELETE SET NULL,
    client_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    freelancer_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    contract_type TEXT NOT NULL CHECK (contract_type IN ('fixed', 'hourly')),
    rate DECIMAL(10, 2) NOT NULL,
    total_amount DECIMAL(12, 2),
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'paused', 'completed', 'cancelled', 'disputed')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Milestones table (for fixed-price contracts)
CREATE TABLE IF NOT EXISTS public.milestones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contract_id UUID REFERENCES public.contracts(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    amount DECIMAL(10, 2) NOT NULL,
    due_date TIMESTAMPTZ,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'submitted', 'approved', 'revision_requested', 'paid')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages table
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    participant_one UUID REFERENCES public.users(id) ON DELETE CASCADE,
    participant_two UUID REFERENCES public.users(id) ON DELETE CASCADE,
    job_id UUID REFERENCES public.jobs(id) ON DELETE SET NULL,
    last_message_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(participant_one, participant_two)
);

CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    attachments TEXT[] DEFAULT '{}',
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contract_id UUID REFERENCES public.contracts(id) ON DELETE CASCADE,
    reviewer_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    reviewee_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    review_type TEXT NOT NULL CHECK (review_type IN ('client_to_freelancer', 'freelancer_to_client')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    data JSONB DEFAULT '{}',
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payments table
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contract_id UUID REFERENCES public.contracts(id) ON DELETE SET NULL,
    milestone_id UUID REFERENCES public.milestones(id) ON DELETE SET NULL,
    payer_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    payee_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    amount DECIMAL(12, 2) NOT NULL,
    platform_fee DECIMAL(12, 2) DEFAULT 0,
    payment_method TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
    transaction_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Portfolio items table
CREATE TABLE IF NOT EXISTS public.portfolio_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    freelancer_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    project_url TEXT,
    skills TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Saved jobs table
CREATE TABLE IF NOT EXISTS public.saved_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, job_id)
);

-- Saved freelancers table
CREATE TABLE IF NOT EXISTS public.saved_freelancers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    freelancer_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(client_id, freelancer_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_jobs_client_id ON public.jobs(client_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON public.jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_category ON public.jobs(category);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON public.jobs(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_proposals_job_id ON public.proposals(job_id);
CREATE INDEX IF NOT EXISTS idx_proposals_freelancer_id ON public.proposals(freelancer_id);
CREATE INDEX IF NOT EXISTS idx_proposals_status ON public.proposals(status);

CREATE INDEX IF NOT EXISTS idx_contracts_client_id ON public.contracts(client_id);
CREATE INDEX IF NOT EXISTS idx_contracts_freelancer_id ON public.contracts(freelancer_id);
CREATE INDEX IF NOT EXISTS idx_contracts_status ON public.contracts(status);

CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read);

-- Row Level Security (RLS) Policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.freelancer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.users
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Freelancer profiles policies
CREATE POLICY "Freelancer profiles are viewable by everyone" ON public.freelancer_profiles
    FOR SELECT USING (true);

CREATE POLICY "Freelancers can update own profile" ON public.freelancer_profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Freelancers can insert own profile" ON public.freelancer_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Client profiles policies
CREATE POLICY "Client profiles are viewable by everyone" ON public.client_profiles
    FOR SELECT USING (true);

CREATE POLICY "Clients can update own profile" ON public.client_profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Clients can insert own profile" ON public.client_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Jobs policies
CREATE POLICY "Public jobs are viewable by everyone" ON public.jobs
    FOR SELECT USING (visibility = 'public' OR client_id = auth.uid());

CREATE POLICY "Clients can create jobs" ON public.jobs
    FOR INSERT WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Clients can update own jobs" ON public.jobs
    FOR UPDATE USING (auth.uid() = client_id);

CREATE POLICY "Clients can delete own jobs" ON public.jobs
    FOR DELETE USING (auth.uid() = client_id);

-- Proposals policies
CREATE POLICY "Proposals viewable by job owner and proposer" ON public.proposals
    FOR SELECT USING (
        auth.uid() = freelancer_id OR
        auth.uid() IN (SELECT client_id FROM public.jobs WHERE id = job_id)
    );

CREATE POLICY "Freelancers can create proposals" ON public.proposals
    FOR INSERT WITH CHECK (auth.uid() = freelancer_id);

CREATE POLICY "Users can update own proposals" ON public.proposals
    FOR UPDATE USING (
        auth.uid() = freelancer_id OR
        auth.uid() IN (SELECT client_id FROM public.jobs WHERE id = job_id)
    );

-- Contracts policies
CREATE POLICY "Contracts viewable by participants" ON public.contracts
    FOR SELECT USING (auth.uid() = client_id OR auth.uid() = freelancer_id);

CREATE POLICY "Clients can create contracts" ON public.contracts
    FOR INSERT WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Contract participants can update" ON public.contracts
    FOR UPDATE USING (auth.uid() = client_id OR auth.uid() = freelancer_id);

-- Messages policies
CREATE POLICY "Messages viewable by conversation participants" ON public.messages
    FOR SELECT USING (
        auth.uid() IN (
            SELECT participant_one FROM public.conversations WHERE id = conversation_id
            UNION
            SELECT participant_two FROM public.conversations WHERE id = conversation_id
        )
    );

CREATE POLICY "Users can send messages" ON public.messages
    FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Conversations policies
CREATE POLICY "Conversations viewable by participants" ON public.conversations
    FOR SELECT USING (auth.uid() = participant_one OR auth.uid() = participant_two);

CREATE POLICY "Users can create conversations" ON public.conversations
    FOR INSERT WITH CHECK (auth.uid() = participant_one OR auth.uid() = participant_two);

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON public.notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON public.notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- Reviews policies
CREATE POLICY "Reviews are viewable by everyone" ON public.reviews
    FOR SELECT USING (true);

CREATE POLICY "Users can create reviews for their contracts" ON public.reviews
    FOR INSERT WITH CHECK (
        auth.uid() = reviewer_id AND
        auth.uid() IN (
            SELECT client_id FROM public.contracts WHERE id = contract_id
            UNION
            SELECT freelancer_id FROM public.contracts WHERE id = contract_id
        )
    );

-- Payments policies
CREATE POLICY "Payments viewable by participants" ON public.payments
    FOR SELECT USING (auth.uid() = payer_id OR auth.uid() = payee_id);

-- Portfolio policies
CREATE POLICY "Portfolio items are viewable by everyone" ON public.portfolio_items
    FOR SELECT USING (true);

CREATE POLICY "Freelancers can manage own portfolio" ON public.portfolio_items
    FOR ALL USING (auth.uid() = freelancer_id);

-- Functions and Triggers

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_freelancer_profiles_updated_at BEFORE UPDATE ON public.freelancer_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_client_profiles_updated_at BEFORE UPDATE ON public.client_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON public.jobs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_proposals_updated_at BEFORE UPDATE ON public.proposals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contracts_updated_at BEFORE UPDATE ON public.contracts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_milestones_updated_at BEFORE UPDATE ON public.milestones
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON public.payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to increment proposal count on jobs
CREATE OR REPLACE FUNCTION increment_proposal_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.jobs SET proposal_count = proposal_count + 1 WHERE id = NEW.job_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER increment_job_proposal_count AFTER INSERT ON public.proposals
    FOR EACH ROW EXECUTE FUNCTION increment_proposal_count();

-- Function to create user profile on auth signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        COALESCE(NEW.raw_user_meta_data->>'role', 'freelancer')
    );
    RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Trigger for new user creation (optional - can be handled in application)
-- CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
--     FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Insert some default skills
INSERT INTO public.skills (name, category) VALUES
    ('JavaScript', 'Development'),
    ('TypeScript', 'Development'),
    ('React', 'Development'),
    ('Next.js', 'Development'),
    ('Node.js', 'Development'),
    ('Python', 'Development'),
    ('PHP', 'Development'),
    ('WordPress', 'Development'),
    ('Flutter', 'Development'),
    ('React Native', 'Development'),
    ('UI Design', 'Design'),
    ('UX Design', 'Design'),
    ('Figma', 'Design'),
    ('Adobe XD', 'Design'),
    ('Graphic Design', 'Design'),
    ('Logo Design', 'Design'),
    ('Illustration', 'Design'),
    ('Content Writing', 'Writing'),
    ('Copywriting', 'Writing'),
    ('Blog Writing', 'Writing'),
    ('Technical Writing', 'Writing'),
    ('Translation', 'Writing'),
    ('SEO', 'Marketing'),
    ('Social Media Marketing', 'Marketing'),
    ('Google Ads', 'Marketing'),
    ('Facebook Ads', 'Marketing'),
    ('Email Marketing', 'Marketing'),
    ('Video Editing', 'Video & Animation'),
    ('Motion Graphics', 'Video & Animation'),
    ('Animation', 'Video & Animation'),
    ('Photography', 'Photography'),
    ('Photo Editing', 'Photography'),
    ('Data Analysis', 'Data'),
    ('Machine Learning', 'Data'),
    ('Data Visualization', 'Data')
ON CONFLICT (name) DO NOTHING;
-- =====================================================
-- LANDING PAGE TABLES
-- =====================================================

-- Skill Categories table (for landing page bento grid)
CREATE TABLE IF NOT EXISTS public.skill_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    icon TEXT NOT NULL DEFAULT 'Code',
    color_hex TEXT NOT NULL DEFAULT '#3B82F6',
    illustration_key TEXT, -- Maps to frontend illustration component
    display_order INTEGER DEFAULT 0,
    size TEXT DEFAULT 'medium' CHECK (size IN ('large', 'medium', 'small', 'wide')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Platform Testimonials table (user reviews of the platform)
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    role TEXT NOT NULL CHECK (role IN ('freelancer', 'client')),
    is_featured BOOLEAN DEFAULT false,
    is_approved BOOLEAN DEFAULT false, -- Admin moderation
    admin_notes TEXT, -- Internal notes for moderation
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for landing page tables
CREATE INDEX IF NOT EXISTS idx_skill_categories_display_order ON public.skill_categories(display_order);
CREATE INDEX IF NOT EXISTS idx_skill_categories_is_active ON public.skill_categories(is_active);
CREATE INDEX IF NOT EXISTS idx_testimonials_user_id ON public.testimonials(user_id);
CREATE INDEX IF NOT EXISTS idx_testimonials_is_featured ON public.testimonials(is_featured);
CREATE INDEX IF NOT EXISTS idx_testimonials_is_approved ON public.testimonials(is_approved);

-- RLS for landing page tables
ALTER TABLE public.skill_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Skill categories policies (public read)
CREATE POLICY "Skill categories are viewable by everyone" ON public.skill_categories
    FOR SELECT USING (true);

-- Testimonials policies
CREATE POLICY "Approved testimonials are viewable by everyone" ON public.testimonials
    FOR SELECT USING (is_approved = true OR auth.uid() = user_id);

CREATE POLICY "Users can create testimonials" ON public.testimonials
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own testimonials" ON public.testimonials
    FOR UPDATE USING (auth.uid() = user_id AND is_approved = false);

CREATE POLICY "Users can delete own testimonials" ON public.testimonials
    FOR DELETE USING (auth.uid() = user_id AND is_approved = false);

-- Triggers for landing page tables
CREATE TRIGGER update_skill_categories_updated_at BEFORE UPDATE ON public.skill_categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON public.testimonials
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default skill categories
INSERT INTO public.skill_categories (name, slug, description, icon, color_hex, illustration_key, display_order, size) VALUES
    ('Web & App Development', 'development', 'Build websites, web apps, and mobile applications', 'Code', '#3B82F6', 'dev', 1, 'large'),
    ('Design & Creative', 'design', 'UI/UX design, graphic design, and creative work', 'PaintBrush', '#A855F7', 'design', 2, 'medium'),
    ('Writing & Translation', 'writing', 'Content writing, copywriting, and translation services', 'PencilLine', '#22C55E', 'writing', 3, 'medium'),
    ('Digital Marketing', 'marketing', 'SEO, social media, and digital advertising', 'Megaphone', '#F97316', 'marketing', 4, 'medium'),
    ('Video & Animation', 'video', 'Video editing, motion graphics, and animation', 'VideoCamera', '#EF4444', 'video', 5, 'medium'),
    ('Business Consulting', 'business', 'Business strategy, consulting, and professional services', 'Briefcase', '#06B6D4', 'business', 6, 'small'),
    ('AI & Data Science', 'ai-data', 'Machine learning, data analysis, and AI development', 'Brain', '#8B5CF6', 'ai', 7, 'wide')
ON CONFLICT (slug) DO NOTHING;