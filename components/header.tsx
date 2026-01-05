"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Shield, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createBrowserClient } from "@supabase/ssr"
import type { User as SupabaseUser } from "@supabase/supabase-js"

export default function Header() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    checkUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null)
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  const handleGetStarted = () => {
    const scannerSection = document.getElementById("scanner")
    if (scannerSection) {
      scannerSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-7xl">
        <div className="flex items-center gap-2">
          <Shield className="w-7 h-7 text-primary" />
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            ScamRay
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <a href="#scanner" className="text-sm text-foreground/70 hover:text-foreground transition">
            Scanner
          </a>
          <a href="#features" className="text-sm text-foreground/70 hover:text-foreground transition">
            Features
          </a>
          <a href="#how-it-works" className="text-sm text-foreground/70 hover:text-foreground transition">
            How It Works
          </a>
        </nav>

        <div className="flex items-center gap-3">
          {!loading && !user ? (
            <>
              <Link href="/auth/login">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="sm" className="bg-primary hover:bg-primary/90">
                  Sign Up
                </Button>
              </Link>
            </>
          ) : loading ? (
            <Button size="sm" disabled>
              Loading...
            </Button>
          ) : (
            <>
              <Button size="sm" variant="ghost" onClick={handleGetStarted}>
                Get Started
              </Button>
              <div className="flex items-center gap-2 pl-3 border-l border-border">
                <User className="w-4 h-4 text-foreground/60" />
                <span className="text-xs text-foreground/70 max-w-[100px] truncate">{user?.email}</span>
                <Button size="sm" variant="ghost" onClick={handleLogout} className="p-1 h-auto">
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
