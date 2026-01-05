import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookieStore.getAll().forEach((cookie) => {
            cookieStore.delete(cookie.name)
          })
          cookiesToSet.forEach(({ name, value }) => {
            cookieStore.set(name, value)
          })
        },
      },
    })

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "You must be logged in to report" }, { status: 401 })
    }

    const body = await request.json()
    const { phoneNumber, url, qrHash, qrUrl, reportType, description, reportFor } = body

    if (!reportType) {
      return NextResponse.json({ error: "Report type is required" }, { status: 400 })
    }

    let table = ""
    let checkData: any = {}

    if (reportFor === "phone" && phoneNumber) {
      table = "reported_numbers"
      checkData = { phone_number: phoneNumber, report_type: reportType, user_id: user.id }
    } else if (reportFor === "url" && url) {
      table = "reported_urls"
      checkData = { url, report_type: reportType, user_id: user.id }
    } else if (reportFor === "qr" && qrHash) {
      table = "reported_qr_codes"
      checkData = { qr_hash: qrHash, report_type: reportType, user_id: user.id }
    } else {
      return NextResponse.json({ error: "Invalid report data" }, { status: 400 })
    }

    // Check if user already reported this item with this type
    const { data: existingReport, error: checkError } = await supabase
      .from(table)
      .select("*")
      .match(checkData)
      .maybeSingle()

    if (checkError && checkError.code !== "PGRST116") {
      throw checkError
    }

    if (existingReport) {
      return NextResponse.json({ error: "You have already reported this item with this type" }, { status: 409 })
    }

    // Create new report
    const insertData: any = {
      report_type: reportType,
      description: description || null,
      user_id: user.id,
    }

    if (reportFor === "phone") {
      insertData.phone_number = phoneNumber
      insertData.report_count = 1
      insertData.last_reported = new Date().toISOString()
    } else if (reportFor === "url") {
      insertData.url = url
    } else if (reportFor === "qr") {
      insertData.qr_hash = qrHash
      insertData.qr_decoded_url = qrUrl
    }

    const { data, error } = await supabase.from(table).insert([insertData]).select().single()

    if (error) throw error

    return NextResponse.json({ data, isNewReport: true })
  } catch (error) {
    console.error("Report submission error:", error)
    return NextResponse.json({ error: "Failed to submit report" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookieStore.getAll().forEach((cookie) => {
            cookieStore.delete(cookie.name)
          })
          cookiesToSet.forEach(({ name, value }) => {
            cookieStore.set(name, value)
          })
        },
      },
    })

    const phone = request.nextUrl.searchParams.get("phone")
    const url = request.nextUrl.searchParams.get("url")
    const qrHash = request.nextUrl.searchParams.get("qr_hash")

    if (phone) {
      const { data, error } = await supabase
        .from("reported_numbers")
        .select("*")
        .eq("phone_number", phone)
        .order("created_at", { ascending: false })

      if (error) throw error

      const totalCount = data?.reduce((sum: number, report: any) => sum + (report.report_count || 1), 0) || 0

      return NextResponse.json({
        data: data || [],
        count: totalCount,
        reports: data || [],
      })
    }

    if (url) {
      const { data, error } = await supabase
        .from("reported_urls")
        .select("*")
        .eq("url", url)
        .order("created_at", { ascending: false })

      if (error) throw error

      const totalCount = data?.length || 0
      const grouped = data?.reduce((acc: any, report: any) => {
        const existing = acc.find((r: any) => r.report_type === report.report_type)
        if (existing) {
          existing.count += 1
          existing.reports.push(report)
        } else {
          acc.push({
            report_type: report.report_type,
            count: 1,
            reports: [report],
          })
        }
        return acc
      }, [])

      return NextResponse.json({
        data: grouped,
        count: totalCount,
        reports: data || [],
      })
    }

    if (qrHash) {
      const { data, error } = await supabase
        .from("reported_qr_codes")
        .select("*")
        .eq("qr_hash", qrHash)
        .order("created_at", { ascending: false })

      if (error) throw error

      const totalCount = data?.length || 0
      const grouped = data?.reduce((acc: any, report: any) => {
        const existing = acc.find((r: any) => r.report_type === report.report_type)
        if (existing) {
          existing.count += 1
          existing.reports.push(report)
        } else {
          acc.push({
            report_type: report.report_type,
            count: 1,
            reports: [report],
          })
        }
        return acc
      }, [])

      return NextResponse.json({
        data: grouped,
        count: totalCount,
        reports: data || [],
      })
    }

    return NextResponse.json({ error: "Query parameter required" }, { status: 400 })
  } catch (error) {
    console.error("Fetch reports error:", error)
    return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 })
  }
}
