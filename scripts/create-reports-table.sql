-- Create reported_numbers table for tracking user-reported fraudulent/spam numbers
CREATE TABLE IF NOT EXISTS reported_numbers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number VARCHAR(20) NOT NULL,
  report_type VARCHAR(50) NOT NULL, -- 'fraud', 'spam', 'harassment', 'scam', 'other'
  description TEXT,
  reported_by VARCHAR(100), -- optional user identifier
  report_count INT DEFAULT 1,
  last_reported TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(phone_number, report_type)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_reported_numbers_phone ON reported_numbers(phone_number);
CREATE INDEX IF NOT EXISTS idx_reported_numbers_type ON reported_numbers(report_type);
