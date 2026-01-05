"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertCircle, CheckCircle2, Check, X, Upload } from "lucide-react"
import { scanNumber } from "@/utils/mobile-scanner"
import { analyzeUrl } from "@/utils/url-analyzer"
import { analyzeEmail } from "@/utils/email-analyzer"
import { decodeQRCode } from "@/utils/qr-scanner"
import ReportModal from "@/components/report-modal"
import crypto from "crypto"

interface ScanResult {
  status: "safe" | "warning" | "dangerous" | null
  riskScore: number
  message: string
  details: string[]
  checks?: Array<{
    check: string
    passed: boolean
    message: string
    riskAdded: number
  }>
  decodedUrl?: string
  scannedValue?: string
}

interface UserReport {
  id: string
  phone_number: string
  report_type: string
  description: string | null
  report_count: number
  last_reported: string
}

export default function Scanner() {
  const [scanResults, setScanResults] = useState<ScanResult>({ status: null, riskScore: 0, message: "", details: [] })
  const [loading, setLoading] = useState(false)
  const [userReports, setUserReports] = useState<UserReport[]>([])
  const [fetchingReports, setFetchingReports] = useState(false)
  const mobileFormRef = useRef<HTMLFormElement>(null)
  const urlFormRef = useRef<HTMLFormElement>(null)
  const emailFormRef = useRef<HTMLFormElement>(null)
  const qrFileInputRef = useRef<HTMLInputElement>(null)
  const [qrFileName, setQrFileName] = useState("")
  const [reportModalOpen, setReportModalOpen] = useState(false)
  const [reportType, setReportType] = useState<"phone" | "url" | "qr">("phone")
  const [qrHash, setQrHash] = useState("")
  const [communityReportCounts, setCommunityReportCounts] = useState<{
    phone?: number
    url?: number
    qr?: number
  }>({})

  function getRiskColor(status: "safe" | "warning" | "dangerous") {
    return status === "safe" ? "text-green-600" : status === "warning" ? "text-yellow-600" : "text-red-600"
  }

  function getRiskBgColor(status: "safe" | "warning" | "dangerous") {
    return status === "safe"
      ? "bg-green-50 border-green-200"
      : status === "warning"
        ? "bg-yellow-50 border-yellow-200"
        : "bg-red-50 border-red-200"
  }

  const fetchUserReports = async (mobile: string) => {
    setFetchingReports(true)
    try {
      const response = await fetch(`/api/reports?phone=${encodeURIComponent(mobile)}`)
      if (response.ok) {
        const data = await response.json()
        setUserReports(data.reports || data.data || [])
        setCommunityReportCounts((prev) => ({ ...prev, phone: data.count || 0 }))
        console.log("[v0] Mobile reports fetched:", data)
      }
    } catch (error) {
      console.error("Error fetching reports:", error)
    }
    setFetchingReports(false)
  }

  const fetchUrlReports = async (url: string) => {
    setFetchingReports(true)
    try {
      const response = await fetch(`/api/reports?type=url&value=${encodeURIComponent(url)}`)
      if (response.ok) {
        const data = await response.json()
        setUserReports(data.reports || [])
        setCommunityReportCounts((prev) => ({ ...prev, url: data.count || 0 }))
      }
    } catch (error) {
      console.error("Error fetching reports:", error)
    }
    setFetchingReports(false)
  }

  const fetchQrReports = async (hash: string) => {
    setFetchingReports(true)
    try {
      const response = await fetch(`/api/reports?type=qr&value=${encodeURIComponent(hash)}`)
      if (response.ok) {
        const data = await response.json()
        setUserReports(data.reports || [])
        setCommunityReportCounts((prev) => ({ ...prev, qr: data.count || 0 }))
      }
    } catch (error) {
      console.error("Error fetching reports:", error)
    }
    setFetchingReports(false)
  }

  const handleUrlScan = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const url = formData.get("url") as string

    try {
      const result = analyzeUrl(url)

      setScanResults({
        status: result.status,
        riskScore: result.riskScore,
        message: result.message,
        details: result.details,
        scannedValue: url,
      })

      fetchUrlReports(url)
      setReportType("url")

      if (urlFormRef.current) {
        urlFormRef.current.reset()
      }
    } catch (error) {
      console.error("URL scan error:", error)
      setScanResults({
        status: "dangerous",
        riskScore: 0,
        message: "Error analyzing URL",
        details: ["Failed to process URL"],
        scannedValue: url,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEmailScan = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string

    try {
      const result = analyzeEmail(email)

      setScanResults({
        status: result.status,
        riskScore: result.riskScore,
        message: result.message,
        details: result.details,
        scannedValue: email,
      })

      if (emailFormRef.current) {
        emailFormRef.current.reset()
      }
    } catch (error) {
      console.error("Email scan error:", error)
      setScanResults({
        status: "dangerous",
        riskScore: 0,
        message: "Error analyzing email",
        details: ["Failed to process email"],
        scannedValue: email,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleMobileScan = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const mobile = formData.get("mobile") as string

    try {
      const response = await fetch(`/api/reports?phone=${encodeURIComponent(mobile)}`)
      let reportCount = 0

      if (response.ok) {
        const data = await response.json()
        reportCount = data.count || 0
        setUserReports(data.reports || data.data || [])
        setCommunityReportCounts((prev) => ({ ...prev, phone: reportCount }))
        console.log("[v0] Mobile reports fetched, count:", reportCount)
      }

      const { verdict, reasons, risk, checks } = scanNumber(mobile)
      let status: "safe" | "warning" | "dangerous" = "safe"
      let message = ""
      let adjustedRisk = risk

      if (reportCount >= 10) {
        status = "dangerous"
        message = "🚨 Mobile Number Seems Risky - High number of community reports"
        adjustedRisk = Math.min(risk + 30, 100)
      } else if (reportCount >= 5) {
        status = "warning"
        message = "⚠️ Mobile Number May Be Fraud or Spam - Multiple community reports"
        adjustedRisk = Math.min(risk + 15, 100)
      } else if (verdict === "High Risk") {
        status = "dangerous"
        message = "Dangerous - High Risk Number"
      } else if (verdict === "Suspicious") {
        status = "warning"
        message = "Warning - Suspicious Number Pattern"
      } else {
        status = "safe"
        message = "Safe - Valid Mobile Number"
      }

      const details = [...reasons, "Format verification complete", "Pattern analysis completed"]

      setScanResults({
        status,
        riskScore: adjustedRisk,
        message,
        details,
        checks,
        scannedValue: mobile,
      })

      setReportType("phone")
    } catch (error) {
      console.error("Error fetching reports:", error)
      // Still show results even if report fetch fails
      const { verdict, reasons, risk, checks } = scanNumber(mobile)
      setScanResults({
        status: verdict === "High Risk" ? "dangerous" : verdict === "Suspicious" ? "warning" : "safe",
        riskScore: risk,
        message:
          verdict === "High Risk"
            ? "Dangerous - High Risk Number"
            : verdict === "Suspicious"
              ? "Warning - Suspicious Number Pattern"
              : "Safe - Valid Mobile Number",
        details: [...reasons, "Format verification complete", "Pattern analysis completed"],
        checks,
        scannedValue: mobile,
      })
      setReportType("phone")
    }

    setLoading(false)
  }

  const handleQrFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setQrFileName(file.name)
    }
  }

  const handleQrScan = async () => {
    if (!qrFileInputRef.current?.files?.[0]) {
      alert("Please upload a QR code image first")
      return
    }

    setLoading(true)

    try {
      const file = qrFileInputRef.current.files[0]
      const reader = new FileReader()

      reader.onload = async (event) => {
        const imageData = event.target?.result as string

        try {
          const decodedUrl = await decodeQRCode(imageData)

          if (!decodedUrl) {
            setScanResults({
              status: "dangerous",
              riskScore: 0,
              message: "Unable to Decode QR Code",
              details: ["No valid URL found in QR code", "Try a different QR code image"],
              decodedUrl: undefined,
            })
            setLoading(false)
            return
          }

          const hash = crypto.createHash("sha256").update(decodedUrl).digest("hex").substring(0, 20)
          setQrHash(hash)

          const result = analyzeUrl(decodedUrl)

          setScanResults({
            status: result.status,
            riskScore: result.riskScore,
            message: result.message,
            details: result.details,
            decodedUrl: decodedUrl,
          })

          fetchQrReports(hash)
          setReportType("qr")

          if (qrFileInputRef.current) {
            qrFileInputRef.current.value = ""
          }
          setQrFileName("")
        } catch (error) {
          console.error("QR decode error:", error)
          setScanResults({
            status: "dangerous",
            riskScore: 0,
            message: "Error Processing QR Code",
            details: ["Unable to process the image", "Ensure it's a valid QR code"],
          })
        }

        setLoading(false)
      }

      reader.readAsDataURL(file)
    } catch (error) {
      console.error("QR scan error:", error)
      setLoading(false)
    }
  }

  return (
    <section id="scanner" className="py-16 px-4 bg-secondary/30">
      <div className="container max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Threat Scanner</h2>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            Analyse URLs, emails, QR codes, and mobile numbers to identify potential threats. Our AI predicts risk based
            on suspicious patterns and known indicators.
          </p>
        </div>

        <Card className="border-2">
          <Tabs defaultValue="url" className="w-full">
            <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
              <TabsTrigger
                value="url"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
              >
                URL Scanner
              </TabsTrigger>
              <TabsTrigger
                value="email"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
              >
                Email Analyzer
              </TabsTrigger>
              <TabsTrigger
                value="qr"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
              >
                QR Code Scanner
              </TabsTrigger>
              <TabsTrigger
                value="mobile"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
              >
                Mobile Number Check
              </TabsTrigger>
            </TabsList>

            <div className="p-6">
              {/* URL Tab */}
              <TabsContent value="url" className="space-y-6">
                <form ref={urlFormRef} onSubmit={handleUrlScan} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Enter URL</label>
                    <Input name="url" type="url" placeholder="https://example.com" className="w-full" required />
                  </div>
                  <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90">
                    {loading ? "Analysing..." : "Scan URL"}
                  </Button>
                </form>
              </TabsContent>

              {/* Email Tab */}
              <TabsContent value="email" className="space-y-6">
                <form ref={emailFormRef} onSubmit={handleEmailScan} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Enter Email Content</label>
                    <textarea
                      name="email"
                      placeholder="Paste email text here..."
                      className="w-full px-3 py-2 border border-input rounded-md bg-background"
                      rows={4}
                      required
                    />
                  </div>
                  <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90">
                    {loading ? "Analysing..." : "Analyse Email"}
                  </Button>
                </form>
              </TabsContent>

              {/* QR Code Tab */}
              <TabsContent value="qr" className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Upload QR Code Image</label>
                    <input
                      ref={qrFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleQrFileChange}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => qrFileInputRef.current?.click()}
                      className={`w-full ${qrFileName ? "bg-primary/10 border-primary" : ""}`}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {qrFileName ? `Change QR Code (${qrFileName})` : "Upload QR Code"}
                    </Button>
                  </div>
                  <Button
                    type="button"
                    onClick={handleQrScan}
                    disabled={!qrFileName || loading}
                    className="w-full bg-primary hover:bg-primary/90"
                  >
                    {loading ? "Scanning..." : "Scan QR Code"}
                  </Button>
                </div>
              </TabsContent>

              {/* Mobile Tab */}
              <TabsContent value="mobile" className="space-y-6">
                <form ref={mobileFormRef} onSubmit={handleMobileScan} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Mobile Number</label>
                    <Input name="mobile" type="tel" placeholder="+91 XXXXX XXXXX" className="w-full" required />
                  </div>
                  <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90">
                    {loading ? "Checking..." : "Check Number"}
                  </Button>
                </form>
              </TabsContent>
            </div>
          </Tabs>
        </Card>

        {/* Results */}
        {scanResults.status && (
          <Card className={`mt-8 p-6 border-2 ${getRiskBgColor(scanResults.status)}`}>
            <div className="flex items-start gap-4">
              <div>
                {scanResults.status === "safe" && (
                  <CheckCircle2 className="w-8 h-8 text-green-600 flex-shrink-0 mt-1" />
                )}
                {scanResults.status === "warning" && (
                  <AlertCircle className="w-8 h-8 text-yellow-600 flex-shrink-0 mt-1" />
                )}
                {scanResults.status === "dangerous" && (
                  <AlertCircle className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
                )}
              </div>
              <div className="flex-1">
                <h3 className={`text-lg font-bold mb-2 ${getRiskColor(scanResults.status)}`}>{scanResults.message}</h3>

                {reportType === "phone" && communityReportCounts.phone !== undefined && (
                  <div className="mb-4 p-3 rounded-lg bg-orange-50 border border-orange-200">
                    <p className="text-sm font-medium text-orange-900 mb-2">Community Safety Data</p>
                    <p className="text-sm text-orange-800">
                      <strong>{communityReportCounts.phone} community reports</strong> on this number
                    </p>
                    {communityReportCounts.phone >= 10 && (
                      <p className="text-sm font-semibold text-red-700 mt-1">
                        🚨 Number seems risky - High number of reports
                      </p>
                    )}
                    {communityReportCounts.phone >= 5 && communityReportCounts.phone < 10 && (
                      <p className="text-sm font-semibold text-yellow-700 mt-1">
                        ⚠️ Number may be risky - Multiple reports
                      </p>
                    )}
                  </div>
                )}

                {reportType === "url" && communityReportCounts.url !== undefined && (
                  <div className="mb-4 p-3 rounded-lg bg-orange-50 border border-orange-200">
                    <p className="text-sm font-medium text-orange-900 mb-2">Community Safety Data</p>
                    <p className="text-sm text-orange-800">
                      <strong>{communityReportCounts.url} community reports</strong> on this URL
                    </p>
                    {communityReportCounts.url >= 10 && (
                      <p className="text-sm font-semibold text-red-700 mt-1">
                        🚨 URL seems risky - High number of reports
                      </p>
                    )}
                    {communityReportCounts.url >= 5 && communityReportCounts.url < 10 && (
                      <p className="text-sm font-semibold text-yellow-700 mt-1">
                        ⚠️ URL may be risky - Multiple reports
                      </p>
                    )}
                  </div>
                )}

                {reportType === "qr" && communityReportCounts.qr !== undefined && (
                  <div className="mb-4 p-3 rounded-lg bg-orange-50 border border-orange-200">
                    <p className="text-sm font-medium text-orange-900 mb-2">Community Safety Data</p>
                    <p className="text-sm text-orange-800">
                      <strong>{communityReportCounts.qr} community reports</strong> on this QR code
                    </p>
                    {communityReportCounts.qr >= 10 && (
                      <p className="text-sm font-semibold text-red-700 mt-1">
                        🚨 QR Code seems risky - High number of reports
                      </p>
                    )}
                    {communityReportCounts.qr >= 5 && communityReportCounts.qr < 10 && (
                      <p className="text-sm font-semibold text-yellow-700 mt-1">
                        ⚠️ QR Code may be risky - Multiple reports
                      </p>
                    )}
                  </div>
                )}

                {scanResults.decodedUrl && (
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-xs font-medium text-blue-900 mb-1">Decoded QR Code URL:</p>
                    <p className="text-xs font-mono text-blue-800 break-all">{scanResults.decodedUrl}</p>
                  </div>
                )}

                <div className="mb-4">
                  <p className="text-sm font-medium mb-2">Risk Score: {scanResults.riskScore}/100</p>
                  <div className="w-full bg-slate-300 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        scanResults.riskScore < 30
                          ? "bg-green-600"
                          : scanResults.riskScore < 70
                            ? "bg-yellow-600"
                            : "bg-red-600"
                      }`}
                      style={{ width: `${scanResults.riskScore}%` }}
                    />
                  </div>
                </div>

                {scanResults.checks && scanResults.checks.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium mb-3">Checking Standards - Security Analysis:</p>
                    <div className="space-y-2">
                      {scanResults.checks.map((check, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-3 p-3 rounded-lg bg-white/50 border border-foreground/10"
                        >
                          {check.passed ? (
                            <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                          ) : (
                            <X className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                          )}
                          <div className="flex-1">
                            <p className="text-xs font-semibold">{check.check}</p>
                            <p className="text-xs text-foreground/70">{check.message}</p>
                          </div>
                          {!check.passed && (
                            <span className="text-xs font-medium text-red-600 flex-shrink-0">
                              +{check.riskAdded} risk
                            </span>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 p-3 rounded-lg bg-blue-50 border border-blue-200">
                      <p className="text-xs text-blue-900">
                        ⓘ <strong>Important:</strong> This check is based on patterns and format validation, not
                        official telecom database data. Use this as guidance only. For definitive verification, contact
                        your telecom provider directly.
                      </p>
                    </div>
                  </div>
                )}

                {scanResults.details && scanResults.details.length > 0 && (
                  <div className="space-y-2 mb-4">
                    <p className="text-sm font-medium">Analysis Details:</p>
                    <ul className="space-y-1">
                      {scanResults.details.map((detail, i) => (
                        <li key={i} className="text-sm text-foreground/80 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-foreground/40" />
                          {detail}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-4 p-3 rounded-lg bg-blue-50 border border-blue-200">
                      <p className="text-xs text-blue-900">
                        ⓘ <strong>Disclaimer:</strong> This analysis is AI-generated and based on language patterns, not
                        official verification. Use this as guidance only. For definitive verification, perform manual
                        checks or contact official sources.
                      </p>
                    </div>
                  </div>
                )}

                {userReports.length > 0 && (
                  <div className="mb-4 p-4 rounded-lg bg-orange-50 border-2 border-orange-300">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertCircle className="w-5 h-5 text-orange-600" />
                      <p className="font-semibold text-orange-900">
                        Community Reports:{" "}
                        {reportType === "phone"
                          ? userReports.reduce((sum, r) => sum + r.report_count, 0)
                          : userReports.reduce((sum, r) => sum + r.count, 0)}{" "}
                        reports
                      </p>
                    </div>

                    <div className="space-y-3">
                      {reportType === "phone"
                        ? userReports.map((report: any) => (
                            <div key={report.id} className="p-3 bg-white rounded-lg border border-orange-200">
                              <div className="flex items-start justify-between mb-2">
                                <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-orange-100 text-orange-800">
                                  {report.report_type.charAt(0).toUpperCase() + report.report_type.slice(1)}
                                </span>
                                <span className="text-xs text-foreground/60">
                                  {report.report_count} {report.report_count === 1 ? "report" : "reports"}
                                </span>
                              </div>
                              {report.description && (
                                <p className="text-xs text-foreground/80 mb-2">"{report.description}"</p>
                              )}
                              <p className="text-xs text-foreground/60">
                                Last reported: {new Date(report.last_reported).toLocaleDateString()}
                              </p>
                            </div>
                          ))
                        : userReports.map((group: any) => (
                            <div key={group.report_type} className="p-3 bg-white rounded-lg border border-orange-200">
                              <div className="flex items-start justify-between mb-2">
                                <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-orange-100 text-orange-800">
                                  {group.report_type.charAt(0).toUpperCase() + group.report_type.slice(1)}
                                </span>
                                <span className="text-xs text-foreground/60">
                                  {group.count} {group.count === 1 ? "report" : "reports"}
                                </span>
                              </div>
                              <div className="space-y-2 mt-2">
                                {group.reports.map((report: any) => (
                                  <div key={report.id} className="text-xs bg-orange-50 p-2 rounded">
                                    {report.description && <p className="text-foreground/80">"{report.description}"</p>}
                                    <p className="text-foreground/60 text-[11px]">
                                      {new Date(report.created_at).toLocaleDateString()}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                    </div>
                  </div>
                )}

                {scanResults.scannedValue && (
                  <div className="flex gap-2 pt-2 border-t border-foreground/10 w-full">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setReportModalOpen(true)}
                      className="mt-4 flex-1"
                    >
                      Report{" "}
                      {reportType === "phone" ? "This Number" : reportType === "url" ? "This URL" : "This QR Code"}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </Card>
        )}
      </div>

      <ReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        phoneNumber={reportType === "phone" ? scanResults.scannedValue || "" : undefined}
        url={reportType === "url" ? scanResults.scannedValue || "" : undefined}
        qrHash={reportType === "qr" ? qrHash : undefined}
        qrUrl={reportType === "qr" ? scanResults.decodedUrl || "" : undefined}
        reportFor={reportType}
        onReportSuccess={() => {
          if (reportType === "phone") {
            fetchUserReports(scanResults.scannedValue || "")
          } else if (reportType === "url") {
            fetchUrlReports(scanResults.scannedValue || "")
          } else {
            fetchQrReports(qrHash)
          }
        }}
      />
    </section>
  )
}
