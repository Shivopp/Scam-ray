"use client"

import { Card } from "@/components/ui/card"
import { Zap, Brain, Shield, Lock, AlertTriangle, TrendingUp, Smartphone, ImageIcon } from "lucide-react"

const features = [
  {
    icon: Brain,
    title: "AI Semantic Analysis",
    description: "Uses Google Gemini to analyze intent and manipulation patterns in phishing content",
  },
  {
    icon: Shield,
    title: "Domain Spoofing Detection",
    description: "Identifies fake domains that closely resemble trusted brands with reputation scoring",
  },
  {
    icon: ImageIcon,
    title: "Image & QR Scanning",
    description: "OCR technology extracts text from images and decodes QR codes for threat analysis",
  },
  {
    icon: Zap,
    title: "Real-time Protection",
    description: "Browser-level detection that protects before you click on malicious content",
  },
  {
    icon: TrendingUp,
    title: "Risk-Score Mechanism",
    description: "Composite risk scoring system instead of binary blocking for nuanced decisions",
  },
  {
    icon: Lock,
    title: "Explainable Alerts",
    description: "Understand exactly why content is unsafe with detailed reasoning and evidence",
  },
  {
    icon: AlertTriangle,
    title: "Mobile Number Verification",
    description: "Check against fraud databases and Indian telecom fraud registries",
  },
  {
    icon: Smartphone,
    title: "Multi-Channel Detection",
    description: "Scan emails, links, images, QR codes, and phone numbers across platforms",
  },
]

export default function Features() {
  return (
    <section id="features" className="py-20 px-4">
      <div className="container max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
          <p className="text-muted-foreground text-lg">Comprehensive protection against modern phishing threats</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon
            return (
              <Card key={i} className="p-6 hover:shadow-lg transition">
                <Icon className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-bold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
