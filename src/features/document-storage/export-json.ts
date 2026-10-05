import { downloadBlob } from '@/core/lib/download'
import { sanitizeCVData, type CVData } from '@/domain/cv'

/**
 * Sanitiza y exporta el currículum actual a un archivo JSON formateado y descargable,
 * eliminando identificadores efímeros y cumpliendo estrictamente cv.schema.json.
 */
export function exportDocumentJSON(cvData: CVData): void {
  const cleanData = sanitizeCVData(cvData)
  const jsonString = JSON.stringify(cleanData, null, 2)
  const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' })

  const candidateName =
    cvData.datos_personales?.nombre_completo?.trim().replace(/\s+/g, '_') || 'cv'
  const filename = `${candidateName.toLowerCase()}_killa_cv.json`

  downloadBlob(blob, filename)
}
