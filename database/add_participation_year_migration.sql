-- Migration to add participation_year column to verification_requests table
-- Run this SQL script in your Supabase SQL editor

-- Add participation_year column if it doesn't exist
DO $$ 
BEGIN
    -- Check if the column exists
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'verification_requests' 
        AND column_name = 'participation_year'
        AND table_schema = 'public'
    ) THEN
        -- Add the column
        ALTER TABLE verification_requests 
        ADD COLUMN participation_year INTEGER;
        
        RAISE NOTICE 'Column participation_year added to verification_requests table';
    ELSE
        RAISE NOTICE 'Column participation_year already exists in verification_requests table';
    END IF;
END $$;

-- Verify the column was added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'verification_requests' 
AND table_schema = 'public'
ORDER BY ordinal_position;
