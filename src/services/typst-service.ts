import { wasmTypstEngine } from './typst/wasm-engine'
import type {
  TypstCompileSVGResult,
  TypstStatusResult,
} from './typst/types'
import type { CVData, FormatoPapel, PlantillaTipo } from '@/types/cv'

export type { TypstCompileSVGResult as TypstCompileResult, TypstStatusResult }

export async function checkTypstStatus(): Promise<TypstStatusResult> {
  return wasmTypstEngine.checkStatus()
}

export async function compileTypstSVG(
  cvData: CVData,
  plantilla: PlantillaTipo = 'harvard',
  paper: FormatoPapel = 'a4',
  signal?: AbortSignal
): Promise<TypstCompileSVGResult> {
  return wasmTypstEngine.compileSVG(cvData, plantilla, paper, signal)
}

export async function downloadTypstPDF(
  cvData: CVData,
  plantilla: PlantillaTipo = 'harvard',
  paper: FormatoPapel = 'a4',
  filename = 'curriculum-vitae.pdf'
): Promise<void> {
  const pdfBytes = await wasmTypstEngine.compilePDF(cvData, plantilla, paper)
  const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' })
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
