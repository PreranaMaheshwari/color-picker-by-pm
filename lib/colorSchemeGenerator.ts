export interface ColorScheme {
  colors: string[]
  harmony: string
}

export class ColorSchemeGenerator {
  static generateScheme(baseColor: string, harmony: string): ColorScheme {
    const hsl = this.hexToHsl(baseColor)
    
    switch (harmony) {
      case "analogous":
        return this.generateAnalogous(hsl)
      case "triad":
        return this.generateTriad(hsl)
      case "complementary":
        return this.generateComplementary(hsl)
      case "splitComplementary":
        return this.generateSplitComplementary(hsl)
      case "shades":
        return this.generateShades(hsl)
      case "monochromatic":
        return this.generateMonochromatic(hsl)
      case "custom":
        return { colors: [baseColor], harmony }
      default:
        return { colors: [baseColor], harmony }
    }
  }

  private static hexToHsl(hex: string): { h: number; s: number; l: number } {
    const r = parseInt(hex.slice(1, 3), 16) / 255
    const g = parseInt(hex.slice(3, 5), 16) / 255
    const b = parseInt(hex.slice(5, 7), 16) / 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0
    let s = 0
    const l = (max + min) / 2

    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0)
          break
        case g:
          h = (b - r) / d + 2
          break
        case b:
          h = (r - g) / d + 4
          break
      }
      h /= 6
    }

    return { h: h * 360, s: s * 100, l: l * 100 }
  }

  private static hslToHex(h: number, s: number, l: number): string {
    h /= 360
    s /= 100
    l /= 100

    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }

    let r, g, b

    if (s === 0) {
      r = g = b = l // achromatic
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s
      const p = 2 * l - q
      r = hue2rgb(p, q, h + 1 / 3)
      g = hue2rgb(p, q, h)
      b = hue2rgb(p, q, h - 1 / 3)
    }

    const toHex = (c: number) => {
      const hex = Math.round(c * 255).toString(16)
      return hex.length === 1 ? "0" + hex : hex
    }

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`
  }

  private static generateAnalogous(baseHsl: { h: number; s: number; l: number }): ColorScheme {
    const colors = [
      this.hslToHex(baseHsl.h - 30, baseHsl.s, baseHsl.l),
      this.hslToHex(baseHsl.h, baseHsl.s, baseHsl.l),
      this.hslToHex(baseHsl.h + 30, baseHsl.s, baseHsl.l),
    ]
    return { colors, harmony: "analogous" }
  }

  private static generateTriad(baseHsl: { h: number; s: number; l: number }): ColorScheme {
    const colors = [
      this.hslToHex(baseHsl.h, baseHsl.s, baseHsl.l),
      this.hslToHex(baseHsl.h + 120, baseHsl.s, baseHsl.l),
      this.hslToHex(baseHsl.h + 240, baseHsl.s, baseHsl.l),
    ]
    return { colors, harmony: "triad" }
  }

  private static generateComplementary(baseHsl: { h: number; s: number; l: number }): ColorScheme {
    const colors = [
      this.hslToHex(baseHsl.h, baseHsl.s, baseHsl.l),
      this.hslToHex(baseHsl.h + 180, baseHsl.s, baseHsl.l),
    ]
    return { colors, harmony: "complementary" }
  }

  private static generateSplitComplementary(baseHsl: { h: number; s: number; l: number }): ColorScheme {
    const colors = [
      this.hslToHex(baseHsl.h, baseHsl.s, baseHsl.l),
      this.hslToHex(baseHsl.h + 150, baseHsl.s, baseHsl.l),
      this.hslToHex(baseHsl.h + 210, baseHsl.s, baseHsl.l),
    ]
    return { colors, harmony: "splitComplementary" }
  }

  private static generateShades(baseHsl: { h: number; s: number; l: number }): ColorScheme {
    const colors = [
      this.hslToHex(baseHsl.h, baseHsl.s, Math.max(0, baseHsl.l - 20)),
      this.hslToHex(baseHsl.h, baseHsl.s, baseHsl.l),
      this.hslToHex(baseHsl.h, baseHsl.s, Math.min(100, baseHsl.l + 20)),
    ]
    return { colors, harmony: "shades" }
  }

  private static generateMonochromatic(baseHsl: { h: number; s: number; l: number }): ColorScheme {
    const colors = [
      this.hslToHex(baseHsl.h, Math.max(0, baseHsl.s - 20), baseHsl.l),
      this.hslToHex(baseHsl.h, baseHsl.s, baseHsl.l),
      this.hslToHex(baseHsl.h, Math.min(100, baseHsl.s + 20), baseHsl.l),
    ]
    return { colors, harmony: "monochromatic" }
  }

  static generateRandomGradient(colors: string[]): string {
    if (colors.length === 0) return "solid"
    
    const gradientTypes = ["solid", "linear", "radial", "random"]
    const randomType = gradientTypes[Math.floor(Math.random() * gradientTypes.length)]
    
    if (randomType === "random") {
      // Generate a random combination of the selected colors
      const shuffledColors = [...colors].sort(() => Math.random() - 0.5)
      const numColors = Math.floor(Math.random() * Math.min(colors.length, 3)) + 1
      const selectedColors = shuffledColors.slice(0, numColors)
      
      // Randomly choose between linear and radial for random type
      const finalType = Math.random() > 0.5 ? "linear" : "radial"
      return `${finalType}-${selectedColors.join(",")}`
    }
    
    return randomType
  }
}
