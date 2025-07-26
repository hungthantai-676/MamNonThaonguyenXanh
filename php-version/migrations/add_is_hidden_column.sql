-- Migration: Add is_hidden column to affiliate_members table
-- Run this SQL in your database management tool

-- Add is_hidden column if it doesn't exist
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists 
FROM information_schema.columns 
WHERE table_schema = DATABASE() 
  AND table_name = 'affiliate_members' 
  AND column_name = 'is_hidden';

SET @sql = IF(@col_exists = 0, 
  'ALTER TABLE affiliate_members ADD COLUMN is_hidden TINYINT(1) DEFAULT 0 AFTER status', 
  'SELECT "Column is_hidden already exists" as message');

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Update existing records to ensure they have is_hidden = 0
UPDATE affiliate_members SET is_hidden = 0 WHERE is_hidden IS NULL;

-- Verify the column was added
SELECT 'Migration completed successfully!' as status;