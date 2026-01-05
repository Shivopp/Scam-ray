"use client"

import { AlertCircle, Mail, Lock, Phone, Shield, Eye, AlertTriangle } from "lucide-react"
import { Card } from "@/components/ui/card"

export default function Blog() {
  const articles = [
    {
      id: 1,
      title: "How Phishing Scammers Work: Tactics & Warning Signs",
      category: "Phishing Attacks",
      icon: Mail,
      content: `Phishing is the most common scam tactic used by criminals. Here's how they operate:

Common Phishing Methods:
• Fake email addresses that closely resemble legitimate companies (e.g., "secure-paypa1.com")
• Urgent messages creating fear (account suspension, unusual activity alerts)
• Requests to click links and enter personal information
• Fake login pages that steal credentials

How to Identify Phishing Emails:
1. Check sender email address carefully - scammers use similar-looking domains
2. Look for spelling and grammar mistakes
3. Suspicious links - hover over links to see real URL before clicking
4. Unexpected attachments or downloads
5. Pressure for immediate action

Protection Tips:
• Never click links in unsolicited emails
• Always verify URLs are correct (https:// and proper domain)
• Use multi-factor authentication (2FA) on important accounts
• Enable email filters and spam protection
• Report suspicious emails to the company's official email`,
      color: "bg-blue-50 border-blue-200",
    },
    {
      id: 2,
      title: "Mobile Number & OTP Scams in India",
      category: "Phone Scams",
      icon: Phone,
      content: `Mobile number scams are increasingly targeting Indian users. Here's what you need to know:

Common Mobile Scam Tactics:
• Unsolicited SMS/WhatsApp messages claiming you've won prizes
• Messages asking for OTP (One-Time Password) verification
• Fake bank alerts about unusual transactions
• Links in messages redirecting to fake banking apps

OTP Security Breaches:
1. Never share your OTP with anyone, even if they claim to be from your bank
2. Banks will NEVER ask for OTP via phone or email
3. Scammers may call pretending to be support staff
4. Verify caller identity by calling official bank numbers

Fraudulent SMS Patterns:
• "Congratulations! You've won Rs. 10 Lakhs. Claim now: [link]"
• "Your bank account is locked. Verify here: [link]"
• Messages from unknown numbers with urgent tone
• Requests to download apps or share personal details

Protection Measures:
• Block unsolicited numbers and spam
• Enable OTP notifications on your bank app
• Verify messages by contacting your bank directly
• Never download apps from links in messages
• Keep your phone's OS and apps updated`,
      color: "bg-yellow-50 border-yellow-200",
    },
    {
      id: 3,
      title: "QR Code & URL Spoofing: Advanced Phishing",
      category: "Advanced Threats",
      icon: Eye,
      content: `QR codes and URL spoofing are sophisticated methods scammers use to trick users:

QR Code Scam Tactics:
• Malicious QR codes placed on public surfaces (posters, stickers)
• QR codes in fake invoices or documents
• QR codes redirecting to phishing pages disguised as legitimate sites
• Payment QR codes that transfer money to scammers' accounts

URL Spoofing Techniques:
1. Similar domain names (goggle.com instead of google.com)
2. URL shorteners hiding actual destination
3. Subdomains that look legitimate (secure.paypal.verify-account.com)
4. Using numbers instead of letters (0 instead of O, 1 instead of l)

Identifying Malicious URLs:
• Check full URL before clicking (not just the visible text)
• Verify SSL certificate - look for padlock icon
• Be cautious of "http://" instead of "https://"
• Hover over links to see actual destination
• Check domain carefully for misspellings

Safe QR Code Practices:
• Only scan QR codes from trusted sources
• Verify the website after scanning before entering any data
• Check that the URL looks correct after scanning
• Use QR code scanning apps with safety warnings
• Be especially cautious on public surfaces`,
      color: "bg-purple-50 border-purple-200",
    },
    {
      id: 4,
      title: "Email Spoofing & Business Email Compromise (BEC)",
      category: "Business Scams",
      icon: AlertCircle,
      content: `Email spoofing is used in sophisticated business scams affecting companies:

Email Spoofing Methods:
• Creating email addresses similar to executives (ceo@compny.com)
• Compromise of actual business email accounts
• Requesting urgent fund transfers or sensitive information
• Fake invoices or payment requests

Business Email Compromise (BEC) Scams:
1. Attacker researches company structure and key personnel
2. Sends email impersonating CEO or senior manager
3. Requests urgent wire transfer or sensitive employee data
4. Pressure and urgency prevent verification
5. Money transferred before fraud is detected

Common BEC Scenarios:
• "Urgent: Need you to process wire transfer immediately"
• "Can you send employee tax records to HR?"
• "Please update our vendor payment details"
• Requests to change banking information

Defense Strategies:
• Verify requests through alternative communication channels
• Implement email authentication (SPF, DKIM, DMARC)
• Train employees to recognize phishing emails
• Require approval from multiple people for transfers
• Be suspicious of urgent requests with unusual tone
• Implement email filters and domain spoofing detection`,
      color: "bg-red-50 border-red-200",
    },
    {
      id: 5,
      title: "Online Shopping & Payment Fraud Protection",
      category: "Payment Security",
      icon: Lock,
      content: `Online payment fraud is widespread. Learn how to protect your financial information:

Common Online Payment Scams:
• Fake shopping websites copying legitimate retailers
• Credential stealing during checkout
• Payment gateway spoofing
• Unencrypted payment forms

Safe Online Shopping Practices:
1. Use official website URLs (not shortened links)
2. Check for HTTPS and padlock icon in address bar
3. Use strong, unique passwords for each account
4. Enable 2FA on shopping accounts
5. Avoid public WiFi for payments
6. Use credit cards with fraud protection (not debit)
7. Check bank statements regularly

Warning Signs of Fake Shops:
• Suspiciously low prices
• Spelling and grammar errors on website
• No contact information or address
• Limited payment options
• No customer reviews or reviews that seem fake
• Poor website design or quality

Card Security Tips:
• Never share full card details via email or phone
• Use Virtual Card Numbers (VCN) when available
• Monitor transactions regularly
• Set up transaction alerts with your bank
• Report unauthorized charges immediately
• Use card controls to limit online/international payments`,
      color: "bg-green-50 border-green-200",
    },
    {
      id: 6,
      title: "Social Engineering: The Human Factor in Scams",
      category: "General Safety",
      icon: Shield,
      content: `Social engineering exploits human psychology. Here's how to recognize and prevent it:

Social Engineering Tactics:
• Building false trust and relationships
• Creating urgency and panic
• Authority impersonation (police, bank officials)
• Invoking fear (account closure, legal action)
• Requesting "verification" of personal details

Common Social Engineering Scenarios:
1. "Tech support" calling about virus on your computer
2. Pretending to be from tax authorities demanding immediate payment
3. Lottery or prize scams
4. Romance scams and catfishing
5. Job offer scams

How to Defend Against Social Engineering:
• Don't share personal information with unverified callers
• Hang up and call official numbers to verify
• Legitimate companies won't ask for passwords via phone/email
• Be cautious of unsolicited contact
• Verify identities independently
• Trust your instincts - if it feels wrong, it probably is
• Take time to decide - don't rush

General Safety Rules:
• Your bank will NEVER ask for your PIN or password
• Government agencies don't demand immediate payment
• Too good to be true offers usually are
• Legitimate organizations respect privacy
• When in doubt, contact official sources directly`,
      color: "bg-indigo-50 border-indigo-200",
    },
  ]

  return (
    <section id="blog" className="py-16 px-4 bg-muted/30">
      <div className="container max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Scam Awareness Hub</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Learn how scammers operate and practical steps to protect yourself from various types of fraud
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => {
            const IconComponent = article.icon
            return (
              <Card
                key={article.id}
                className={`${article.color} border-2 p-6 hover:shadow-lg transition-shadow cursor-pointer group`}
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-white/50 group-hover:bg-white transition">
                    <IconComponent className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-primary uppercase tracking-wide">{article.category}</p>
                    <h3 className="text-lg font-bold mt-1">{article.title}</h3>
                  </div>
                </div>

                <div className="text-sm text-foreground whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                  {article.content}
                </div>

                <div className="mt-4 pt-4 border-t border-current/20">
                  <p className="text-xs text-muted-foreground">Click to read more</p>
                </div>
              </Card>
            )
          })}
        </div>

        <div className="mt-12 p-6 bg-accent/10 border-2 border-accent rounded-lg">
          <div className="flex gap-3 items-start">
            <AlertTriangle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold mb-2">Report Scams & Help Others</h3>
              <p className="text-sm text-muted-foreground mb-3">
                If you've encountered a scam, report it to authorities and help protect others:
              </p>
              <div className="flex flex-col sm:flex-row gap-3 text-sm">
                <span>National Cybercrime Portal: cybercrime.gov.in</span>
                <span>Cyber Helpline: 1930 (24/7)</span>
                <span>Bank Fraud Department</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
