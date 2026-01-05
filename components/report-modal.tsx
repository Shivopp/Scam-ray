"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createBrowserClient } from "@supabase/ssr"
import type { User } from "@supabase/supabase-js"

interface ReportModalProps {
  isOpen: boolean
  onClose: () => void
  phoneNumber?: string
  url?: string
  qrHash?: string
  qrUrl?: string
  reportFor: "phone" | "url" | "qr"
  onReportSuccess?: (data: any) => void
}

export default function ReportModal({
  isOpen,
  onClose,
  phoneNumber,
  url,
  qrHash,
  qrUrl,
  reportFor,
  onReportSuccess,
}: ReportModalProps) {
  const [reportType, setReportType] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")
  const [user, setUser] = useState<User | null>(null)
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
    }
    checkUser()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!user) {
      setError("You must be logged in to report")
      setTimeout(() => {
        router.push("/auth/login")
      }, 1000)
      return
    }

    if (!reportType) {
      setError("Please select a report type")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber,
          url,
          qrHash,
          qrUrl,
          reportType,
          description: description || null,
          reportFor,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || "Failed to submit report")
        return
      }

      setSubmitted(true)
      onReportSuccess?.(result.data)

      setTimeout(() => {
        resetForm()
        onClose()
      }, 2000)
    } catch (err) {
      setError("An error occurred. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setReportType("")
    setDescription("")
    setSubmitted(false)
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetForm()
      onClose()
    }
  }

  const getTitle = () => {
    if (reportFor === "phone") return "Report This Number"
    if (reportFor === "url") return "Report This URL"
    return "Report This QR Code"
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
          <DialogDescription>Help protect others by reporting suspicious content</DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
            <div className="text-center">
              <h3 className="font-semibold text-lg">Report Submitted</h3>
              <p className="text-sm text-foreground/70">Thank you for helping protect others</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex gap-3 p-3 rounded-lg bg-red-50 border border-red-200">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {reportFor === "phone" && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone Number</label>
                <Input value={phoneNumber || ""} disabled className="bg-muted" />
              </div>
            )}

            {reportFor === "url" && (
              <div className="space-y-2">
                <label className="text-sm font-medium">URL</label>
                <Input value={url || ""} disabled className="bg-muted text-xs" />
              </div>
            )}

            {reportFor === "qr" && (
              <div className="space-y-2">
                <label className="text-sm font-medium">QR Code URL</label>
                <Input value={qrUrl || ""} disabled className="bg-muted text-xs" />
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">Report Type *</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="phishing">Phishing</SelectItem>
                  <SelectItem value="malware">Malware</SelectItem>
                  <SelectItem value="spam">Spam</SelectItem>
                  <SelectItem value="scam">Scam</SelectItem>
                  <SelectItem value="fraud">Fraud</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description (Optional)</label>
              <Textarea
                placeholder="Describe what happened..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="resize-none"
                rows={3}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
                className="flex-1 bg-transparent"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="flex-1">
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {loading ? "Submitting..." : "Submit Report"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
