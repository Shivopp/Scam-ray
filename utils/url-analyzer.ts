export interface AnalysisResult {
  status: "safe" | "warning" | "dangerous"
  riskScore: number
  message: string
  details: string[]
}

export function analyzeUrl(url: string): AnalysisResult {
  let riskScore = 0
  const details: string[] = []

  try {
    // Validate URL format
    const urlObj = new URL(url)
    const domain = urlObj.hostname.toLowerCase()
    const protocol = urlObj.protocol

    // Check 1: HTTPS vs HTTP
    if (protocol !== "https:") {
      riskScore += 20
      details.push("⚠️ Not using HTTPS - Insecure connection")
    } else {
      details.push("✓ Using HTTPS - Secure connection")
    }

    // Check 2: Domain spoofing patterns
    const suspiciousPatterns = [
      /verify/i,
      /confirm/i,
      /update/i,
      /login/i,
      /secure/i,
      /urgent/i,
      /click-here/i,
      /paypal|amazon|google|facebook|apple|microsoft/i,
    ]

    const hasSuspiciousPattern = suspiciousPatterns.some((pattern) => domain.includes(pattern.source))

    if (hasSuspiciousPattern) {
      riskScore += 25
      details.push("⚠️ Domain contains verification/login keywords - Possible phishing")
    }

    // Check 3: Domain legitimacy indicators
    const legitimateTLDs = [".com", ".org", ".gov", ".edu", ".co.in", ".ac.in"]
    const tld = domain.substring(domain.lastIndexOf("."))
    const hasLegitTLD = legitimateTLDs.some((t) => tld === t)

    if (!hasLegitTLD) {
      riskScore += 15
      details.push(`⚠️ Unusual domain extension: ${tld} - May be suspicious`)
    }

    // Check 4: URL shorteners
    const shortenerPatterns = ["bit.ly", "tinyurl", "short.link", "goo.gl", "ow.ly"]
    const isShortener = shortenerPatterns.some((pattern) => domain.includes(pattern))

    if (isShortener) {
      riskScore += 30
      details.push("⚠️ URL shortener detected - Can hide true destination")
    }

    // Check 5: Special characters and encoding
    if (/%/.test(urlObj.search) || urlObj.search.length > 200) {
      riskScore += 15
      details.push("⚠️ Complex query parameters detected - May be suspicious")
    }

    // Check 6: Subdomain analysis
    const subdomainParts = domain.split(".")
    if (subdomainParts.length > 3) {
      riskScore += 10
      details.push("⚠️ Multiple subdomains - Unusual structure")
    }

    // Determine final status
    let status: "safe" | "warning" | "dangerous"
    let message: string

    if (riskScore >= 70) {
      status = "dangerous"
      message = "Dangerous - High Risk URL Detected"
    } else if (riskScore >= 40) {
      status = "warning"
      message = "Warning - Suspicious URL Pattern"
    } else {
      status = "safe"
      message = "Safe - URL Appears Legitimate"
    }

    // Add comprehensive messages
    if (riskScore === 0) {
      details.push("✓ Domain structure appears legitimate")
      details.push("✓ All security indicators passed")
    }

    return {
      status,
      riskScore: Math.min(riskScore, 100),
      message,
      details,
    }
  } catch (error) {
    return {
      status: "dangerous",
      riskScore: 100,
      message: "Invalid URL Format",
      details: [
        "The URL provided is not valid or properly formatted",
        "Please check and try again with a complete URL",
      ],
    }
  }
}
