"use client"
import Header from "@/components/header"
import Hero from "@/components/hero"
import Scanner from "@/components/scanner"
import Features from "@/components/features"
import HowItWorks from "@/components/how-it-works"
import Blog from "@/components/blog"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Scanner />
      <Features />
      <HowItWorks />
      <Blog />
      <Footer />
    </div>
  )
}
