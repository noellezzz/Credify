-- Organization Management System Database Migration
-- Run this in your Supabase SQL editor to create the required tables

-- Create organizations table (replacing schools table)
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  website VARCHAR(255),
  address TEXT,
  phone VARCHAR(20),
  organization_type VARCHAR(50) DEFAULT 'university' CHECK (organization_type IN ('university', 'college', 'training_center', 'certification_body', 'corporate', 'government', 'nonprofit')),
  description TEXT,
  logo_url TEXT,
  verification_status VARCHAR(20) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  verification_documents TEXT[], -- Array of document URLs
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create events table (updated to reference organizations)
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  event_type VARCHAR(50) NOT NULL CHECK (event_type IN ('graduation', 'certification', 'award', 'workshop', 'course', 'training', 'conference')),
  requires_verification BOOLEAN DEFAULT false,
  event_date DATE,
  application_deadline DATE,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create verification_requests table (updated fields)
CREATE TABLE IF NOT EXISTS verification_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID, -- This would reference users(id) in a real implementation
  certificate_file_url TEXT,
  participant_name VARCHAR(255) NOT NULL,
  participant_id VARCHAR(100) NOT NULL,
  participation_year INTEGER,
  completion_date DATE,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by UUID REFERENCES organizations(id),
  review_notes TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_events_organization_id ON events(organization_id);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_event_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_organizations_verification_status ON organizations(verification_status);
CREATE INDEX IF NOT EXISTS idx_organizations_type ON organizations(organization_type);
CREATE INDEX IF NOT EXISTS idx_verification_requests_event_id ON verification_requests(event_id);
CREATE INDEX IF NOT EXISTS idx_verification_requests_status ON verification_requests(status);
CREATE INDEX IF NOT EXISTS idx_verification_requests_submitted_at ON verification_requests(submitted_at);

-- Insert sample data
INSERT INTO organizations (id, name, email, website, address, phone, organization_type, description, verification_status, verified_at) VALUES 
('00000000-0000-0000-0000-000000000000', 'Tech University', 'contact@techuniversity.edu', 'https://techuniversity.edu', '123 University Ave, Tech City', '+1-555-0123', 'university', 'Leading technology education institution', 'verified', NOW()),
('11111111-1111-1111-1111-111111111111', 'Professional Training Institute', 'info@pti.org', 'https://pti.org', '456 Training Blvd, Skills City', '+1-555-0456', 'training_center', 'Professional development and certification training', 'verified', NOW()),
('22222222-2222-2222-2222-222222222222', 'Corporate Learning Solutions', 'hello@corplearn.com', 'https://corplearn.com', '789 Business Park, Corporate City', '+1-555-0789', 'corporate', 'Enterprise training and certification programs', 'pending', NULL)
ON CONFLICT (id) DO NOTHING;

-- Insert sample events
INSERT INTO events (organization_id, title, description, event_type, requires_verification, event_date, application_deadline, status) VALUES 
(
  '00000000-0000-0000-0000-000000000000',
  'Computer Science Graduation Ceremony 2025',
  'Join us for the graduation ceremony of Computer Science students. This ceremony celebrates the achievements of our graduating class.',
  'graduation',
  true,
  '2025-12-15',
  '2025-11-30',
  'published'
),
(
  '11111111-1111-1111-1111-111111111111',
  'Digital Marketing Certification Program',
  'A comprehensive certification program covering modern digital marketing strategies and tools.',
  'certification',
  true,
  '2025-09-01',
  '2025-08-15',
  'published'
),
(
  '00000000-0000-0000-0000-000000000000',
  'Excellence in Research Award',
  'Annual award ceremony recognizing outstanding research contributions by our faculty and students.',
  'award',
  false,
  '2025-10-20',
  NULL,
  'published'
),
(
  '22222222-2222-2222-2222-222222222222',
  'Corporate Leadership Training',
  'Intensive leadership development program for corporate executives.',
  'training',
  true,
  '2025-08-10',
  '2025-07-25',
  'draft'
);

-- Enable Row Level Security (RLS) for better security
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_requests ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access to published events from verified organizations
CREATE POLICY "Public events from verified organizations are viewable by everyone" ON events
FOR SELECT USING (status = 'published' AND EXISTS (
  SELECT 1 FROM organizations 
  WHERE organizations.id = events.organization_id 
  AND organizations.verification_status = 'verified'
));

-- Create policies for public read access to verified organizations
CREATE POLICY "Verified organizations are viewable by everyone" ON organizations
FOR SELECT USING (verification_status = 'verified');

-- Create policies for organizations to manage their own data (in a real app, you'd use auth.uid())
CREATE POLICY "Organizations can view their own data" ON organizations
FOR ALL USING (true); -- Replace with proper auth check in production

CREATE POLICY "Organizations can manage their own events" ON events
FOR ALL USING (true); -- Replace with proper auth check in production

CREATE POLICY "Organizations can manage verification requests" ON verification_requests
FOR ALL USING (true); -- Replace with proper auth check in production

-- Grant necessary permissions to authenticated users
GRANT SELECT ON events TO anon;
GRANT SELECT ON organizations TO anon;
GRANT ALL ON organizations, events, verification_requests TO authenticated;

-- Migration for existing databases: Add participation_year column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'verification_requests' 
                   AND column_name = 'participation_year') THEN
        ALTER TABLE verification_requests ADD COLUMN participation_year INTEGER;
    END IF;
END $$;
