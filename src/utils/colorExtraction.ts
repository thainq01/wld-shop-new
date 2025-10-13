/**
 * Utility functions for extracting dominant colors from images
 * Used for creating seamless background colors that match product images
 */

export interface ColorRGB {
  r: number;
  g: number;
  b: number;
}

export interface DominantColorResult {
  primary: ColorRGB;
  secondary: ColorRGB;
  cssColor: string;
  cssGradient: string;
}

/**
 * Convert RGB values to CSS color string
 */
export function rgbToCss(color: ColorRGB): string {
  return `rgb(${Math.round(color.r)}, ${Math.round(color.g)}, ${Math.round(color.b)})`;
}

/**
 * Convert RGB to HSL for better color manipulation
 */
export function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
}

/**
 * Create a lighter/darker variant of a color for gradients
 */
export function createColorVariant(color: ColorRGB, lightnessDelta: number): ColorRGB {
  const hsl = rgbToHsl(color.r, color.g, color.b);
  const newLightness = Math.max(0, Math.min(100, hsl.l + lightnessDelta));
  
  // Convert back to RGB
  const c = (1 - Math.abs(2 * (newLightness / 100) - 1)) * (hsl.s / 100);
  const x = c * (1 - Math.abs(((hsl.h / 60) % 2) - 1));
  const m = (newLightness / 100) - c / 2;

  let r = 0, g = 0, b = 0;

  if (0 <= hsl.h && hsl.h < 60) {
    r = c; g = x; b = 0;
  } else if (60 <= hsl.h && hsl.h < 120) {
    r = x; g = c; b = 0;
  } else if (120 <= hsl.h && hsl.h < 180) {
    r = 0; g = c; b = x;
  } else if (180 <= hsl.h && hsl.h < 240) {
    r = 0; g = x; b = c;
  } else if (240 <= hsl.h && hsl.h < 300) {
    r = x; g = 0; b = c;
  } else if (300 <= hsl.h && hsl.h < 360) {
    r = c; g = 0; b = x;
  }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

/**
 * Extract dominant colors from an image using canvas
 */
export async function extractDominantColor(imageUrl: string): Promise<DominantColorResult> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          throw new Error('Could not get canvas context');
        }

        // Use smaller canvas for performance
        const size = 100;
        canvas.width = size;
        canvas.height = size;
        
        // Draw image to canvas
        ctx.drawImage(img, 0, 0, size, size);
        
        // Get image data
        const imageData = ctx.getImageData(0, 0, size, size);
        const data = imageData.data;
        
        // Color frequency map
        const colorMap = new Map<string, { count: number; color: ColorRGB }>();
        
        // Sample every 4th pixel for performance
        for (let i = 0; i < data.length; i += 16) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const alpha = data[i + 3];
          
          // Skip transparent pixels
          if (alpha < 128) continue;
          
          // Group similar colors (reduce precision)
          const groupedR = Math.floor(r / 32) * 32;
          const groupedG = Math.floor(g / 32) * 32;
          const groupedB = Math.floor(b / 32) * 32;
          
          const key = `${groupedR},${groupedG},${groupedB}`;
          
          if (colorMap.has(key)) {
            colorMap.get(key)!.count++;
          } else {
            colorMap.set(key, {
              count: 1,
              color: { r: groupedR, g: groupedG, b: groupedB }
            });
          }
        }
        
        // Sort by frequency and get top colors
        const sortedColors = Array.from(colorMap.values())
          .sort((a, b) => b.count - a.count)
          .slice(0, 2);
        
        if (sortedColors.length === 0) {
          // Fallback to neutral color
          const fallback = { r: 240, g: 240, b: 240 };
          resolve({
            primary: fallback,
            secondary: fallback,
            cssColor: rgbToCss(fallback),
            cssGradient: `linear-gradient(135deg, ${rgbToCss(fallback)}, ${rgbToCss(createColorVariant(fallback, -10))})`
          });
          return;
        }
        
        const primary = sortedColors[0].color;
        const secondary = sortedColors[1]?.color || createColorVariant(primary, 15);
        
        // Create gradient with subtle variation
        const gradientEnd = createColorVariant(primary, -8);
        
        resolve({
          primary,
          secondary,
          cssColor: rgbToCss(primary),
          cssGradient: `linear-gradient(135deg, ${rgbToCss(primary)}, ${rgbToCss(gradientEnd)})`
        });
        
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = () => {
      // Fallback to neutral color on error
      const fallback = { r: 240, g: 240, b: 240 };
      resolve({
        primary: fallback,
        secondary: fallback,
        cssColor: rgbToCss(fallback),
        cssGradient: `linear-gradient(135deg, ${rgbToCss(fallback)}, ${rgbToCss(createColorVariant(fallback, -10))})`
      });
    };
    
    img.src = imageUrl;
  });
}

/**
 * Cache for color extraction results
 */
const colorCache = new Map<string, DominantColorResult>();

/**
 * Extract dominant color with caching
 */
export async function extractDominantColorCached(imageUrl: string): Promise<DominantColorResult> {
  if (colorCache.has(imageUrl)) {
    return colorCache.get(imageUrl)!;
  }
  
  const result = await extractDominantColor(imageUrl);
  colorCache.set(imageUrl, result);
  
  // Limit cache size
  if (colorCache.size > 50) {
    const firstKey = colorCache.keys().next().value;
    colorCache.delete(firstKey);
  }
  
  return result;
}

/**
 * Get a theme-appropriate background color
 */
export function getThemeAwareBackground(dominantColor: DominantColorResult, isDark: boolean): string {
  if (isDark) {
    // For dark theme, use a darker variant
    const darkVariant = createColorVariant(dominantColor.primary, -30);
    const darkerVariant = createColorVariant(dominantColor.primary, -40);
    return `linear-gradient(135deg, ${rgbToCss(darkVariant)}, ${rgbToCss(darkerVariant)})`;
  } else {
    // For light theme, use a lighter variant
    const lightVariant = createColorVariant(dominantColor.primary, 20);
    const lighterVariant = createColorVariant(dominantColor.primary, 10);
    return `linear-gradient(135deg, ${rgbToCss(lightVariant)}, ${rgbToCss(lighterVariant)})`;
  }
}
