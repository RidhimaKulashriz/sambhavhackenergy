-- Create user roles system with proper security

-- 1. Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'participant', 'judge');

-- 2. Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE (user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 3. Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- 4. RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own role on signup"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- 5. Update profiles table to store avatar
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- 6. Create teams table updates for invite codes
ALTER TABLE public.teams
ADD COLUMN IF NOT EXISTS max_members INTEGER DEFAULT 6;

-- 7. Create submissions files table for file uploads
CREATE TABLE IF NOT EXISTS public.submission_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID REFERENCES public.submissions(id) ON DELETE CASCADE,
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

ALTER TABLE public.submission_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Team members can view their files"
ON public.submission_files
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.team_members
    WHERE team_members.team_id = submission_files.team_id
      AND team_members.user_id = auth.uid()
  )
);

CREATE POLICY "Team members can upload files"
ON public.submission_files
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.team_members
    WHERE team_members.team_id = submission_files.team_id
      AND team_members.user_id = auth.uid()
  )
);

-- 8. Create judge_scores table for evaluation
CREATE TABLE IF NOT EXISTS public.judge_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  judge_id UUID REFERENCES auth.users(id) NOT NULL,
  submission_id UUID REFERENCES public.submissions(id) ON DELETE CASCADE NOT NULL,
  innovation_score INTEGER CHECK (innovation_score >= 0 AND innovation_score <= 10),
  functionality_score INTEGER CHECK (functionality_score >= 0 AND functionality_score <= 10),
  ui_ux_score INTEGER CHECK (ui_ux_score >= 0 AND ui_ux_score <= 10),
  impact_score INTEGER CHECK (impact_score >= 0 AND impact_score <= 10),
  total_score INTEGER GENERATED ALWAYS AS (innovation_score + functionality_score + ui_ux_score + impact_score) STORED,
  comments TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE (judge_id, submission_id)
);

ALTER TABLE public.judge_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Judges can create their own scores"
ON public.judge_scores
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = judge_id AND
  public.has_role(auth.uid(), 'judge')
);

CREATE POLICY "Judges can view and update their own scores"
ON public.judge_scores
FOR ALL
TO authenticated
USING (auth.uid() = judge_id);

CREATE POLICY "Admins can view all scores"
ON public.judge_scores
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 9. Add trigger for updated_at
CREATE TRIGGER update_judge_scores_updated_at
BEFORE UPDATE ON public.judge_scores
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();