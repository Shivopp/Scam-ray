import jsQR from "jsqr"

export interface QRScanResult {
  success: boolean
  url: string | null
  error: string | null
}

export async function decodeQRCode(imageData: string): Promise<string | null> {
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = "anonymous"

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")

        if (!ctx) {
          resolve(null)
          return
        }

        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)

        const imageDataCanvas = ctx.getImageData(0, 0, img.width, img.height)

        const code = jsQR(imageDataCanvas.data, imageDataCanvas.width, imageDataCanvas.height)

        if (code) {
          resolve(code.data)
        } else {
          resolve(null)
        }
      } catch (error) {
        console.error("[v0] QR decode error:", error)
        resolve(null)
      }
    }

    img.onerror = () => {
      resolve(null)
    }

    img.src = imageData
  })
}
