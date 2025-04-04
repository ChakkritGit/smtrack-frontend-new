import { useEffect, useRef } from 'react'
import imageUrl from '../../assets/images/app-logo.png'

const OpenGraphCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      console.error('❌ Canvas context is null')
      return
    }

    const width = 1200
    const height = 630
    const padding = 50
    const gap = 40
    const imageWidth = 400
    const imageHeight = 400
    const bottomBarHeight = 45

    canvas.width = width
    canvas.height = height

    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, width, height)

    const loadFonts = async () => {
      try {
        await document.fonts.load('bold 60px Anuphan')
        await document.fonts.load('28px Anuphan')

        drawContent()
      } catch (error) {
        console.error('Error loading Anuphan font:', error)
        drawContent('sans-serif')
      }
    }

    const drawContent = (fallbackFont = 'Anuphan') => {
      const img = new Image()
      img.src = imageUrl
      img.crossOrigin = 'anonymous'

      img.onload = () => {
        ctx.fillStyle = '#6ebfe3'
        ctx.fillRect(0, height - bottomBarHeight, width, bottomBarHeight)

        const imageY = Math.max(
          (height - bottomBarHeight - imageHeight) / 2,
          padding
        )

        ctx.drawImage(img, padding, imageY, imageWidth, imageHeight)

        const textX = padding + imageWidth + gap
        const textAreaWidth = width - textX - padding
        let textY = imageY + 120

        ctx.fillStyle = '#111827'
        ctx.font = `bold 60px ${fallbackFont}`
        const title = 'SMTrack+'
        ctx.fillText(title, textX, textY)

        textY += 70

        ctx.fillStyle = '#374151'
        ctx.font = `28px ${fallbackFont}`

        const description =
          'โปรแกรมสำหรับดูค่าอุณหภูมิ/ความชื้นปัจจุบัน ของตู้แช่ แบบ Real-Time รวมถึงแจ้งเตือนหากเกินค่า Min/Max ที่กำหนด ใช้ร่วมกับเครื่องติดตามอุณหภูมิตู้แช่ รุ่น smtrack/i-TEMS'

        const lines = wrapText(ctx, description, textAreaWidth)

        const totalTextHeight = lines.length * 40
        const availableHeight = height - bottomBarHeight - textY - padding

        if (totalTextHeight > availableHeight) {
          textY = Math.max(
            imageY,
            (height - bottomBarHeight - totalTextHeight) / 2
          )
        }

        for (const line of lines) {
          ctx.fillText(line, textX, textY)
          textY += 40
        }

        console.log(
          '🖼️ Canvas image generated with',
          fallbackFont,
          'font and bottom bar'
        )

        const dataUrl = canvas.toDataURL('image/png')
        downloadImage(dataUrl)
      }
    }

    const downloadImage = (dataUrl: string) => {
      const link = document.createElement('a')
      link.href = dataUrl
      link.download = 'smtrack-og-image.png'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      console.log('✅ PNG image downloaded automatically')
    }

    loadFonts()
  }, [imageUrl])

  function wrapText (
    ctx: CanvasRenderingContext2D,
    text: string,
    maxWidth: number
  ) {
    const words = text.split(' ')
    let line = ''
    const lines = []

    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + ' '
      const metrics = ctx.measureText(testLine)
      if (metrics.width > maxWidth && i > 0) {
        lines.push(line)
        line = words[i] + ' '
      } else {
        line = testLine
      }
    }
    lines.push(line)
    return lines
  }

  return <canvas ref={canvasRef} />
}

export default OpenGraphCanvas
