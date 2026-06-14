-- Add status column to mess_bills table if it doesn't exist
ALTER TABLE mess_bills 
ADD COLUMN IF NOT EXISTS status ENUM('paid', 'unpaid') DEFAULT 'unpaid' AFTER remarks;
