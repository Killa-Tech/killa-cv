import * as React from 'react'
import { DEFAULT_CV, EMPTY_CV } from '@/lib/cv-defaults'
import { sanitizeCVData } from '@/lib/cv-sanitizer'
import type { CVData, DatosPersonales, FormatoPapel, PlantillaTipo, SeccionCV } from '@/types/cv'

const STORAGE_KEY = 'killa-cv-data-v2'

export function useCVData() {
  const [cvData, setCvData] = React.useState<CVData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) return JSON.parse(saved)
    } catch (e) {
      console.warn('Error al leer de localStorage:', e)
    }
    return DEFAULT_CV
  })

  const [plantilla, setPlantillaState] = React.useState<PlantillaTipo>(
    cvData.plantilla || 'harvard'
  )
  const [paper, setPaper] = React.useState<FormatoPapel>('a4')

  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cvData))
    } catch (e) {
      console.warn('Error al guardar en localStorage:', e)
    }
  }, [cvData])

  const setPersonalInfo = React.useCallback((dp: DatosPersonales) => {
    setCvData((prev) => ({ ...prev, datos_personales: dp }))
  }, [])

  const setSections = React.useCallback((sections: SeccionCV[]) => {
    setCvData((prev) => ({ ...prev, secciones: sections }))
  }, [])

  const setPlantilla = React.useCallback((newPlantilla: PlantillaTipo) => {
    setPlantillaState(newPlantilla)
    setCvData((prev) => ({ ...prev, plantilla: newPlantilla }))
  }, [])

  const resetDefault = React.useCallback(() => {
    if (window.confirm('¿Deseas restablecer el CV con el perfil de ejemplo (John Doe)?')) {
      setCvData(DEFAULT_CV)
      setPlantillaState('harvard')
    }
  }, [])

  const clearData = React.useCallback(() => {
    if (window.confirm('¿Deseas vaciar todos los campos del CV para comenzar desde cero?')) {
      setCvData(EMPTY_CV)
    }
  }, [])

  const exportJSON = React.useCallback(() => {
    const clean = sanitizeCVData(cvData)
    const blob = new Blob([JSON.stringify(clean, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    const filename = `${cvData.datos_personales.nombre_completo.trim().replace(/\s+/g, '_') || 'cv'}.json`
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [cvData])

  const importJSON = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string
        const parsed = JSON.parse(content)
        if (!parsed.datos_personales || !Array.isArray(parsed.secciones)) {
          throw new Error('El archivo no cumple con la estructura mínima de cv.schema.json')
        }
        setCvData(parsed)
        if (parsed.plantilla) {
          setPlantillaState(parsed.plantilla)
        }
      } catch (err) {
        alert(`Error al importar JSON: ${(err as Error)?.message}`)
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }, [])

  return {
    cvData,
    setCvData,
    plantilla,
    setPlantilla,
    paper,
    setPaper,
    setPersonalInfo,
    setSections,
    resetDefault,
    clearData,
    exportJSON,
    importJSON,
  }
}
