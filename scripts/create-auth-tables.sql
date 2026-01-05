-- Create tables for URL, QR Code, and Mobile Number reports with user tracking
-- Table for URL reports
CREATE TABLE IF NOT EXISTS reported_urls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL,
  report_type VARCHAR(50) NOT NULL CHECK (report_type IN ('phishing', 'malware', 'spam', 'scam', 'other')),
  description TEXT,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add unique constraint to prevent duplicate reports from same user for same URL
ALTER TABLE reported_urls ADD CONSTRAINT unique_user_url_report UNIQUE (user_id, url, report_type);

-- Create index for faster queries
CREATE INDEX idx_reported_urls_url ON reported_urls(url);
CREATE INDEX idx_reported_urls_user ON reported_urls(user_id);

-- Table for QR Code reports
CREATE TABLE IF NOT EXISTS reported_qr_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  qr_hash TEXT NOT NULL,
  qr_decoded_url TEXT NOT NULL,
  report_type VARCHAR(50) NOT NULL CHECK (report_type IN ('phishing', 'malware', 'spam', 'scam', 'other')),
  description TEXT,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE reported_qr_codes ADD CONSTRAINT unique_user_qr_report UNIQUE (user_id, qr_hash, report_type);

CREATE INDEX idx_reported_qr_codes_hash ON reported_qr_codes(qr_hash);
CREATE INDEX idx_reported_qr_codes_user ON reported_qr_codes(user_id);

-- Update reported_numbers table to include user_id
ALTER TABLE reported_numbers ADD COLUMN IF NOT EXISTS user_id UUID;
ALTER TABLE reported_numbers ADD CONSTRAINT unique_user_number_report UNIQUE (user_id, phone_number, report_type);

CREATE INDEX idx_reported_numbers_user ON reported_numbers(user_id);
