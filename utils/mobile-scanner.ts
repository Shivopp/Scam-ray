export interface MobileCheckResult {
  check: string
  passed: boolean
  message: string
  riskAdded: number
}

export function scanNumber(number: string): {
  verdict: string
  reasons: string[]
  risk: number
  checks: MobileCheckResult[]
} {
  number = number.replace(/\s/g, "")

  let totalRisk = 0
  const checks: MobileCheckResult[] = []

  // Check 1: Length & Format
  const formatValid = /^(\+91)?[6-9]\d{9}$/.test(number)
  checks.push({
    check: "Length & Format",
    passed: formatValid,
    message: formatValid
      ? "Valid Indian phone number format (10 digits, starts with 6-9)"
      : "Invalid format - Must be 10 digits starting with 6-9 or +91XXXXXXXXXX",
    riskAdded: formatValid ? 0 : 50,
  })
  if (!formatValid) totalRisk += 50

  // Extract just the digits for further checks
  const digits = number.replace(/\D/g, "")

  // Check 2: Repeating Digits
  const hasRepeatingDigits = /(\d)\1{5,}/.test(digits)
  checks.push({
    check: "Repeating Digits",
    passed: !hasRepeatingDigits,
    message: hasRepeatingDigits
      ? "Alert: Numbers like 9999999999 or 8888888888 are often fake/test numbers"
      : "No excessive repeating digits detected",
    riskAdded: hasRepeatingDigits ? 35 : 0,
  })
  if (hasRepeatingDigits) totalRisk += 35

  // Check 3: Sequential Digits
  let hasSequentialDigits = false
  const sequences = ["0123456789", "9876543210", "1234567890", "1357924680", "2468013579"]
  for (const seq of sequences) {
    if (digits.includes(seq)) {
      hasSequentialDigits = true
      break
    }
  }
  checks.push({
    check: "Sequential Pattern",
    passed: !hasSequentialDigits,
    message: hasSequentialDigits
      ? "Alert: Numbers like 1234567890 or 9876543210 are not real user numbers"
      : "No sequential digit patterns detected",
    riskAdded: hasSequentialDigits ? 30 : 0,
  })
  if (hasSequentialDigits) totalRisk += 30

  // Check 4: Known Scam Prefixes
  const scamPrefixes = ["140"]
  const internationalCodes = ["+234", "+92", "+212", "+20", "+213"]
  let hasScamPrefix = false
  let scamPrefixMessage = ""

  if (scamPrefixes.some((prefix) => digits.startsWith(prefix))) {
    hasScamPrefix = true
    scamPrefixMessage = "Promotional/service number (140 prefix) - Often used for spam calls"
  } else if (internationalCodes.some((code) => number.startsWith(code))) {
    hasScamPrefix = true
    scamPrefixMessage = "International number detected - Unusual for typical Indian users"
  }

  checks.push({
    check: "Known Scam Prefixes",
    passed: !hasScamPrefix,
    message: hasScamPrefix ? `Alert: ${scamPrefixMessage}` : "No known scam prefixes detected",
    riskAdded: hasScamPrefix ? 25 : 0,
  })
  if (hasScamPrefix) totalRisk += 25

  // Overall verdict
  const verdict = totalRisk >= 70 ? "High Risk" : totalRisk >= 40 ? "Suspicious" : "Low Risk"
  const reasons = checks.filter((c) => !c.passed).map((c) => c.message)

  return {
    verdict,
    reasons: reasons.length > 0 ? reasons : ["All checks passed - Number appears valid"],
    risk: Math.min(totalRisk, 100),
    checks,
  }
}
