"use client"

import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Hero() {
  const handleStartScanning = () => {
    const scannerSection = document.getElementById("scanner")
    if (scannerSection) {
      scannerSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  const handleLearnMore = () => {
    const blogSection = document.getElementById("blog")
    if (blogSection) {
      blogSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section className="py-20 md:py-32 px-4 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />

      <div className="container max-w-6xl mx-auto">
        <div className="text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <AlertTriangle className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Stop fraudsters before they strike</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold leading-tight text-balance">
            Protect Yourself From <span className="text-primary">Phishing & Scams</span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            Real-time AI-powered detection for URLs, emails, QR codes, and mobile numbers. Understand why content is
            unsafe with explainable alerts.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90" onClick={handleStartScanning}>
              Get Started
            </Button>
            <Button size="lg" variant="outline" onClick={handleLearnMore}>
              Learn More
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-8 text-sm">
            <div>
              <p className="text-2xl font-bold text-accent">99.9%</p>
              <p className="text-muted-foreground">Detection Accuracy</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-accent">Real-time</p>
              <p className="text-muted-foreground">Protection</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-accent">4 Types</p>
              <p className="text-muted-foreground">of Threats</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
