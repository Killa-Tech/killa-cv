import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  DEFAULT_CV,
  EMPTY_CV,
  createContacto,
  createEntradaItem,
  createGrupoItem,
  createSection,
  parseAndValidateCVData,
  type CVData,
  type ContactoItem,
  type DatosPersonales,
  type EntradaItem,
  type FormatoPapel,
  type GrupoItem,
  type PlantillaTipo,
  type SeccionCV,
  type TipoSeccion,
} from '@/domain/cv'

export interface CVStoreState {
  cvData: CVData
  formatoPapel: FormatoPapel

  // Acciones: Datos Personales & Contacto
  updatePersonalInfo: (patch: Partial<Omit<DatosPersonales, 'contacto'>>) => void
  addContactItem: (tipo?: string, valor?: string, url?: string) => string
  updateContactItem: (id: string, patch: Partial<Omit<ContactoItem, 'id'>>) => void
  removeContactItem: (id: string) => void

  // Acciones: Secciones
  addSection: (tipo: TipoSeccion, titulo?: string) => string
  updateSection: (sectionId: string, patch: Partial<SeccionCV>) => void
  removeSection: (sectionId: string) => void
  reorderSections: (startIndex: number, endIndex: number) => void

  // Acciones: Sub-ítems de Entradas (Experiencia, Educación)
  addEntryItem: (sectionId: string) => string
  updateEntryItem: (sectionId: string, entryId: string, patch: Partial<Omit<EntradaItem, 'id'>>) => void
  removeEntryItem: (sectionId: string, entryId: string) => void

  // Acciones: Sub-ítems de Grupos (Habilidades, Idiomas)
  addGroupItem: (sectionId: string, categoria?: string) => string
  updateGroupItem: (sectionId: string, groupId: string, patch: Partial<Omit<GrupoItem, 'id'>>) => void
  removeGroupItem: (sectionId: string, groupId: string) => void

  // Acciones: Sub-ítems de Texto y Listas
  updateTextSectionContent: (sectionId: string, contenido: string) => void
  updateListSectionItems: (sectionId: string, elementos: string[]) => void

  // Acciones: Plantilla y Formato de Papel
  setPlantilla: (plantilla: PlantillaTipo) => void
  setFormatoPapel: (formato: FormatoPapel) => void

  // Acciones Globales
  resetToDefault: () => void
  clearData: () => void
  loadCVData: (data: unknown) => { success: boolean; error?: string }
}

const STORAGE_KEY = 'killa-cv-storage-v3'

export const useCVStore = create<CVStoreState>()(
  persist(
    (set) => ({
      cvData: DEFAULT_CV,
      formatoPapel: 'a4',

      // --- Datos Personales ---
      updatePersonalInfo: (patch) => {
        set((state) => ({
          cvData: {
            ...state.cvData,
            datos_personales: {
              ...state.cvData.datos_personales,
              ...patch,
            },
          },
        }))
      },

      addContactItem: (tipo = 'email', valor = '', url = '') => {
        const newContact = createContacto(tipo, valor, url)
        set((state) => ({
          cvData: {
            ...state.cvData,
            datos_personales: {
              ...state.cvData.datos_personales,
              contacto: [...state.cvData.datos_personales.contacto, newContact],
            },
          },
        }))
        return newContact.id
      },

      updateContactItem: (id, patch) => {
        set((state) => ({
          cvData: {
            ...state.cvData,
            datos_personales: {
              ...state.cvData.datos_personales,
              contacto: state.cvData.datos_personales.contacto.map((c) =>
                c.id === id ? { ...c, ...patch } : c
              ),
            },
          },
        }))
      },

      removeContactItem: (id) => {
        set((state) => ({
          cvData: {
            ...state.cvData,
            datos_personales: {
              ...state.cvData.datos_personales,
              contacto: state.cvData.datos_personales.contacto.filter((c) => c.id !== id),
            },
          },
        }))
      },

      // --- Secciones ---
      addSection: (tipo, titulo) => {
        const newSection = createSection(tipo, titulo)
        set((state) => ({
          cvData: {
            ...state.cvData,
            secciones: [...state.cvData.secciones, newSection],
          },
        }))
        return newSection.id
      },

      updateSection: (sectionId, patch) => {
        set((state) => ({
          cvData: {
            ...state.cvData,
            secciones: state.cvData.secciones.map((sec) =>
              sec.id === sectionId ? ({ ...sec, ...patch } as SeccionCV) : sec
            ),
          },
        }))
      },

      removeSection: (sectionId) => {
        set((state) => ({
          cvData: {
            ...state.cvData,
            secciones: state.cvData.secciones.filter((sec) => sec.id !== sectionId),
          },
        }))
      },

      reorderSections: (startIndex, endIndex) => {
        set((state) => {
          const list = state.cvData.secciones
          if (
            startIndex < 0 ||
            startIndex >= list.length ||
            endIndex < 0 ||
            endIndex >= list.length ||
            startIndex === endIndex
          ) {
            return state
          }
          const next = [...list]
          const [moved] = next.splice(startIndex, 1)
          next.splice(endIndex, 0, moved)
          return {
            cvData: {
              ...state.cvData,
              secciones: next,
            },
          }
        })
      },

      // --- Sub-ítems Entradas ---
      addEntryItem: (sectionId) => {
        const newEntry = createEntradaItem()
        set((state) => ({
          cvData: {
            ...state.cvData,
            secciones: state.cvData.secciones.map((sec) => {
              if (sec.id !== sectionId || sec.tipo !== 'entradas') return sec
              return {
                ...sec,
                items: [...sec.items, newEntry],
              }
            }),
          },
        }))
        return newEntry.id
      },

      updateEntryItem: (sectionId, entryId, patch) => {
        set((state) => ({
          cvData: {
            ...state.cvData,
            secciones: state.cvData.secciones.map((sec) => {
              if (sec.id !== sectionId || sec.tipo !== 'entradas') return sec
              return {
                ...sec,
                items: sec.items.map((item) =>
                  item.id === entryId ? { ...item, ...patch } : item
                ),
              }
            }),
          },
        }))
      },

      removeEntryItem: (sectionId, entryId) => {
        set((state) => ({
          cvData: {
            ...state.cvData,
            secciones: state.cvData.secciones.map((sec) => {
              if (sec.id !== sectionId || sec.tipo !== 'entradas') return sec
              return {
                ...sec,
                items: sec.items.filter((item) => item.id !== entryId),
              }
            }),
          },
        }))
      },

      // --- Sub-ítems Grupos ---
      addGroupItem: (sectionId, categoria = 'General') => {
        const newGroup = createGrupoItem(categoria)
        set((state) => ({
          cvData: {
            ...state.cvData,
            secciones: state.cvData.secciones.map((sec) => {
              if (sec.id !== sectionId || sec.tipo !== 'agrupado') return sec
              return {
                ...sec,
                grupos: [...sec.grupos, newGroup],
              }
            }),
          },
        }))
        return newGroup.id
      },

      updateGroupItem: (sectionId, groupId, patch) => {
        set((state) => ({
          cvData: {
            ...state.cvData,
            secciones: state.cvData.secciones.map((sec) => {
              if (sec.id !== sectionId || sec.tipo !== 'agrupado') return sec
              return {
                ...sec,
                grupos: sec.grupos.map((grp) =>
                  grp.id === groupId ? { ...grp, ...patch } : grp
                ),
              }
            }),
          },
        }))
      },

      removeGroupItem: (sectionId, groupId) => {
        set((state) => ({
          cvData: {
            ...state.cvData,
            secciones: state.cvData.secciones.map((sec) => {
              if (sec.id !== sectionId || sec.tipo !== 'agrupado') return sec
              return {
                ...sec,
                grupos: sec.grupos.filter((grp) => grp.id !== groupId),
              }
            }),
          },
        }))
      },

      // --- Texto y Listas ---
      updateTextSectionContent: (sectionId, contenido) => {
        set((state) => ({
          cvData: {
            ...state.cvData,
            secciones: state.cvData.secciones.map((sec) =>
              sec.id === sectionId && sec.tipo === 'texto'
                ? { ...sec, contenido }
                : sec
            ),
          },
        }))
      },

      updateListSectionItems: (sectionId, elementos) => {
        set((state) => ({
          cvData: {
            ...state.cvData,
            secciones: state.cvData.secciones.map((sec) =>
              sec.id === sectionId && sec.tipo === 'lista'
                ? { ...sec, elementos }
                : sec
            ),
          },
        }))
      },

      // --- Plantilla y Formato ---
      setPlantilla: (plantilla) => {
        set((state) => ({
          cvData: {
            ...state.cvData,
            plantilla,
          },
        }))
      },

      setFormatoPapel: (formatoPapel) => {
        set(() => ({ formatoPapel }))
      },

      // --- Acciones Globales ---
      resetToDefault: () => {
        set(() => ({
          cvData: DEFAULT_CV,
          formatoPapel: 'a4',
        }))
      },

      clearData: () => {
        set(() => ({
          cvData: EMPTY_CV,
        }))
      },

      loadCVData: (raw) => {
        const validated = parseAndValidateCVData(raw)
        if (validated.success) {
          set(() => ({
            cvData: validated.data,
            formatoPapel: 'a4',
          }))
          return { success: true }
        }
        return { success: false, error: validated.error }
      },
    }),
    {
      name: STORAGE_KEY,
      partialize: (state) => ({
        cvData: state.cvData,
        formatoPapel: state.formatoPapel,
      }),
    }
  )
)
