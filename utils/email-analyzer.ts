export interface AnalysisResult {
  status: "safe" | "warning" | "dangerous"
  riskScore: number
  message: string
  details: string[]
}

export function analyzeEmail(emailContent: string): AnalysisResult {
  let riskScore = 0
  const details: string[] = []
  const lowerContent = emailContent.toLowerCase()

  // Check 1: Urgency language
  const urgencyKeywords = [
    "urgent",
    "immediate action",
    "act now",
    "verify immediately",
    "confirm your account",
    "suspicious activity",
    "unusual access",
    "limited time",
    "must click",
    "expire",
  ]

  const hasUrgency = urgencyKeywords.some((keyword) => lowerContent.includes(keyword))
  if (hasUrgency) {
    riskScore += 30
    details.push("⚠️ Urgent language detected - Common phishing tactic")
  }

  // Check 2: Request for sensitive information
  const sensitiveRequests = [
    "password",
    "credit card",
    "ssn",
    "bank account",
    "confirm identity",
    "verify password",
    "update payment",
    "validate account",
    "security code",
    "otp",
  ]

  const hasSensitiveRequest = sensitiveRequests.some((keyword) => lowerContent.includes(keyword))
  if (hasSensitiveRequest) {
    riskScore += 35
    details.push("🚨 Request for sensitive information - Major phishing indicator")
  }

  // Check 3: Links and suspicious URLs
  const urlPattern = /https?:\/\/[^\s]+/gi
  const urls = emailContent.match(urlPattern) || []

  if (urls.length > 0) {
    urls.forEach((url) => {
      if (url.includes("bit.ly") || url.includes("tinyurl") || url.includes("short")) {
        riskScore += 20
        details.push(`⚠️ Shortened URL detected - May hide true destination`)
      }
      if (!url.includes("https")) {
        riskScore += 15
        details.push(`⚠️ Unencrypted link detected - Security risk`)
      }
    })
  }

  // Check 4: Poor grammar and spelling
  const grammarIssues = [/deare?\s+(user|customer|member)/i, /\$\$/, /\{\{/, /click\s+here\s+now/i]

  const hasGrammarIssues = grammarIssues.some((pattern) => pattern.test(emailContent))
  if (hasGrammarIssues) {
    riskScore += 15
    details.push("⚠️ Poor grammar/formatting - Typical of phishing emails")
  }

  // Check 5: Generic greeting
  const genericGreetings = ["dear user", "dear customer", "dear member", "dear sir", "dear madam"]
  const hasGenericGreeting = genericGreetings.some((greeting) => lowerContent.includes(greeting))

  if (hasGenericGreeting) {
    riskScore += 10
    details.push("⚠️ Generic greeting - Not personalized, suspicious")
  }

  // Check 6: Spoofed sender claims
  const spoofPatterns = [
    /from\s+(paypal|amazon|google|facebook|apple|microsoft)/i,
    /on behalf of/i,
    /account verification/i,
  ]

  const hasSpoofPattern = spoofPatterns.some((pattern) => pattern.test(emailContent))
  if (hasSpoofPattern) {
    riskScore += 25
    details.push("🚨 Potential sender spoofing detected")
  }

  // Determine final status
  let status: "safe" | "warning" | "dangerous"
  let message: string

  if (riskScore >= 70) {
    status = "dangerous"
    message = "Dangerous - Likely Phishing Email"
  } else if (riskScore >= 40) {
    status = "warning"
    message = "Warning - Suspicious Email Content"
  } else {
    status = "safe"
    message = "Safe - Email Appears Legitimate"
  }

  if (riskScore === 0) {
    details.push("✓ No suspicious patterns detected")
    details.push("✓ Email appears legitimate")
  }

  return {
    status,
    riskScore: Math.min(riskScore, 100),
    message,
    details,
  }
}
