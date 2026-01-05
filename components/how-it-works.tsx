"use client"

import { Card } from "@/components/ui/card"

const steps = [
  {
    step: "01",
    title: "You Interact",
    description: "Open an email, click a link, or scan a QR code",
  },
  {
    step: "02",
    title: "We Extract",
    description: "ScamRay extracts text, URLs, images, and QR codes from content",
  },
  {
    step: "03",
    title: "Analysis Begins",
    description: "Data sent securely to backend for Gemini AI processing",
  },
  {
    step: "04",
    title: "AI Evaluates",
    description: "Gemini analyzes intent, manipulation patterns, and semantic meaning",
  },
  {
    step: "05",
    title: "Domain Check",
    description: "Reputation scoring and spoofing detection runs in parallel",
  },
  {
    step: "06",
    title: "Risk Calculated",
    description: "Composite risk score generated from all signals",
  },
  {
    step: "07",
    title: "You're Protected",
    description: "Warning shown or access blocked with explainable reasoning",
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 px-4 bg-muted/30">
      <div className="container max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">How ScamRay Works</h2>
          <p className="text-muted-foreground text-lg">7-step process to keep you safe</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item, i) => (
            <Card key={i} className="p-6 relative">
              <div className="text-4xl font-bold text-primary/20 mb-2">{item.step}</div>
              <h3 className="font-bold text-lg mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.description}</p>
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-6 h-0.5 bg-primary/20" />
                </div>
              )}
            </Card>
          ))}
        </div>

        <Card className="mt-12 p-8 bg-primary/5 border-primary/20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <p className="text-sm font-medium text-primary mb-2">Processing Speed</p>
              <p className="text-2xl font-bold">Near Real-time</p>
              <p className="text-sm text-muted-foreground mt-1">Response within 100ms</p>
            </div>
            <div>
              <p className="text-sm font-medium text-primary mb-2">Detection Coverage</p>
              <p className="text-2xl font-bold">4 Types</p>
              <p className="text-sm text-muted-foreground mt-1">URLs, Emails, QR, Mobile</p>
            </div>
            <div>
              <p className="text-sm font-medium text-primary mb-2">False Positives</p>
              <p className="text-2xl font-bold">{"<"}0.1%</p>
              <p className="text-sm text-muted-foreground mt-1">Minimal disruption</p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}
