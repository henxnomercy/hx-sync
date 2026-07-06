import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData()

    const clothingType = typeof form.get("clothingType") === "string" ? (form.get("clothingType") as string) : undefined
    const file = form.get("file")

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "Missing file." }, { status: 400 })
    }

    if (!clothingType || (clothingType !== "shirt" && clothingType !== "pants")) {
      return NextResponse.json({ error: "Missing or invalid clothingType." }, { status: 400 })
    }

    // For now, we simply acknowledge receipt. In a real app you'd store the file
    // to cloud storage (S3, R2, etc.) and process it.

    return NextResponse.json({ success: true, filename: file.name, clothingType }, { status: 200 })
  } catch (err) {
    console.error("/api/upload-clothing error", err)
    const message = err instanceof Error ? err.message : "Unexpected server error."
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
