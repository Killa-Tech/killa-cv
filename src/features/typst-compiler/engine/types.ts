import type { CVData, FormatoPapel, PlantillaTipo } from '@/domain/cv/types'

export interface TypstStatusResult {
  ok: boolean
  version?: string
  error?: string
}

export interface TypstCompileSVGResult {
  ok: boolean
  pages: string[]
  totalPages: number
  error?: string
}

export interface TypstCompilePDFResult {
  ok: boolean
  pdfData?: Uint8Array
  error?: string
}

export interface TypstCompilerEngine {
  init(): Promise<void>
  checkStatus(): Promise<TypstStatusResult>
  compileSVG(
    cvData: CVData,
    plantilla: PlantillaTipo,
    paper: FormatoPapel,
    signal?: AbortSignal
  ): Promise<TypstCompileSVGResult>
  compilePDF(
    cvData: CVData,
    plantilla: PlantillaTipo,
    paper: FormatoPapel
  ): Promise<Uint8Array>
}
