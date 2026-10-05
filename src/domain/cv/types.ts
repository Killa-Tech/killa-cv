export type PlantillaTipo = 'harvard' | 'modern'
export type FormatoPapel = 'a4' | 'us-letter'

export interface ContactoItem {
  id?: string
  tipo: string
  valor: string
  url?: string
}

export interface DatosPersonales {
  nombre_completo: string
  titulo?: string
  foto?: string
  fecha_nacimiento?: string
  contacto: ContactoItem[]
}

export interface EntradaItem {
  id?: string
  primario_izq?: string
  primario_der?: string
  secundario_izq?: string
  secundario_der?: string
  descripcion?: string
  vinetas?: string[]
}

export interface GrupoItem {
  id?: string
  categoria: string
  elementos: string[]
}

export interface SeccionTexto {
  id?: string
  titulo: string
  tipo: 'texto'
  contenido: string
}

export interface SeccionEntradas {
  id?: string
  titulo: string
  tipo: 'entradas'
  items: EntradaItem[]
}

export interface SeccionAgrupado {
  id?: string
  titulo: string
  tipo: 'agrupado'
  grupos: GrupoItem[]
}

export interface SeccionLista {
  id?: string
  titulo: string
  tipo: 'lista'
  elementos: string[]
}

export type SeccionCV = SeccionTexto | SeccionEntradas | SeccionAgrupado | SeccionLista

export interface CVData {
  $schema?: string
  plantilla?: PlantillaTipo
  datos_personales: DatosPersonales
  secciones: SeccionCV[]
}
