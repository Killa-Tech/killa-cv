import { sanitizeCVData } from '@/lib/cv-sanitizer'
import type { CVData, FormatoPapel, PlantillaTipo } from '@/types/cv'

export interface TypstStatusResult {
  ok: boolean
  version?: string
  error?: string
}

export interface TypstCompileResult {
  ok: boolean
  pages: string[]
  totalPages: number
  error?: string
}

export async function checkTypstStatus(): Promise<TypstStatusResult> {
  try {
    const res = await fetch('/api/typst/status')
    if (!res.ok) {
      throw new Error(`Error HTTP ${res.status}`)
    }
    return await res.json()
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'No se pudo conectar con el servidor local',
    }
  }
}

export async function compileTypstSVG(
  cvData: CVData,
  plantilla: PlantillaTipo = 'harvard',
  paper: FormatoPapel = 'a4',
  signal?: AbortSignal
): Promise<TypstCompileResult> {
  try {
    const cleanData = sanitizeCVData(cvData)
    const res = await fetch('/api/typst/compile-svg', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: cleanData,
        plantilla,
        paper,
      }),
      signal,
    })

    const result = await res.json()
    if (!res.ok || !result.ok) {
      return {
        ok: false,
        pages: [],
        totalPages: 0,
        error: result.error || `Error ${res.status} al compilar Typst`,
      }
    }

    return {
      ok: true,
      pages: result.pages || [],
      totalPages: result.totalPages || 0,
    }
  } catch (err) {
    if (signal?.aborted) {
      throw err
    }
    return {
      ok: false,
      pages: [],
      totalPages: 0,
      error: err instanceof Error ? err.message : 'Error al compilar documento',
    }
  }
}

export async function downloadTypstPDF(
  cvData: CVData,
  plantilla: PlantillaTipo = 'harvard',
  paper: FormatoPapel = 'a4',
  filename = 'curriculum-vitae.pdf'
): Promise<void> {
  const cleanData = sanitizeCVData(cvData)
  const res = await fetch('/api/typst/compile-pdf', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      data: cleanData,
      plantilla,
      paper,
    }),
  })

  if (!res.ok) {
    const errorJson = await res.json().catch(() => null)
    throw new Error(errorJson?.error || `Error ${res.status} al generar el PDF`)
  }

  const blob = await res.blob()
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

export function getTypstCLICommand(
  plantilla: PlantillaTipo = 'harvard',
  paper: FormatoPapel = 'a4'
): string {
  return `typst compile --root . --input data=cv.json --input plantilla=${plantilla} --input paper=${paper} src/assets/cv-engine.typ cv.pdf`
}
