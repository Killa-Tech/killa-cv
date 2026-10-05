import { generateId } from '@/core/lib/id'
import type {
  CVData,
  ContactoItem,
  EntradaItem,
  GrupoItem,
  SeccionAgrupado,
  SeccionCV,
  SeccionEntradas,
  SeccionLista,
  SeccionTexto,
  TipoSeccion,
} from './types'

export const CONTACTO_PRESETS = [
  { tipo: 'email', label: 'Correo Electrónico', placeholder: 'ejemplo@dominio.com' },
  { tipo: 'telefono', label: 'Teléfono', placeholder: '+54 9 388 123-4567' },
  { tipo: 'ubicacion', label: 'Ubicación', placeholder: 'San Francisco, CA' },
  { tipo: 'linkedin', label: 'LinkedIn', placeholder: 'linkedin.com/in/usuario' },
  { tipo: 'github', label: 'GitHub', placeholder: 'github.com/usuario' },
  { tipo: 'portfolio', label: 'Portafolio Web', placeholder: 'https://miweb.dev' },
  { tipo: 'blog', label: 'Blog Personal', placeholder: 'https://blog.dev' },
] as const

export const SECTION_PRESETS = [
  {
    titulo: 'EXPERIENCIA LABORAL',
    tipo: 'entradas' as const,
    descripcion: 'Historial cronológico con empresa, cargo, período y viñetas de logros.',
  },
  {
    titulo: 'FORMACIÓN ACADÉMICA',
    tipo: 'entradas' as const,
    descripcion: 'Títulos universitarios, cursos destacados o carreras con honores.',
  },
  {
    titulo: 'PROYECTOS DESTACADOS',
    tipo: 'entradas' as const,
    descripcion: 'Proyectos clave desarrollados, tecnologías y métricas de impacto.',
  },
  {
    titulo: 'HABILIDADES TÉCNICAS',
    tipo: 'agrupado' as const,
    descripcion: 'Agrupaciones temáticas como Lenguajes, Frameworks o Herramientas.',
  },
  {
    titulo: 'IDIOMAS',
    tipo: 'agrupado' as const,
    descripcion: 'Idiomas con su nivel de dominio (Nativo, Profesional, Intermedio).',
  },
  {
    titulo: 'CERTIFICACIONES',
    tipo: 'lista' as const,
    descripcion: 'Lista directa de certificaciones y licencias profesionales.',
  },
  {
    titulo: 'PERFIL PROFESIONAL',
    tipo: 'texto' as const,
    descripcion: 'Resumen narrativo o carta de objetivos en párrafo continuo.',
  },
  {
    titulo: 'PUBLICACIONES Y CONFERENCIAS',
    tipo: 'entradas' as const,
    descripcion: 'Artículos científicos, ponencias o charlas dictadas.',
  },
  {
    titulo: 'PASATIEMPOS E INTERESES',
    tipo: 'lista' as const,
    descripcion: 'Lista simple de intereses personales o comunitarios.',
  },
] as const

export function createContacto(tipo = 'email', valor = '', url = ''): ContactoItem {
  return { id: generateId(), tipo, valor, url }
}

export function createEntradaItem(): EntradaItem {
  return {
    id: generateId(),
    primario_izq: '',
    primario_der: '',
    secundario_izq: '',
    secundario_der: '',
    descripcion: '',
    vinetas: [''],
  }
}

export function createGrupoItem(categoria = 'General'): GrupoItem {
  return {
    id: generateId(),
    categoria,
    elementos: [''],
  }
}

export function createSection(tipo: TipoSeccion, titulo = ''): SeccionCV {
  const id = generateId()
  const defaultTitle = titulo || (tipo === 'entradas' ? 'NUEVA SECCIÓN' : tipo.toUpperCase())

  switch (tipo) {
    case 'texto':
      return {
        id,
        titulo: defaultTitle,
        tipo: 'texto',
        contenido: '',
      } as SeccionTexto

    case 'entradas':
      return {
        id,
        titulo: defaultTitle,
        tipo: 'entradas',
        items: [createEntradaItem()],
      } as SeccionEntradas

    case 'agrupado':
      return {
        id,
        titulo: defaultTitle,
        tipo: 'agrupado',
        grupos: [createGrupoItem('Principal')],
      } as SeccionAgrupado

    case 'lista':
      return {
        id,
        titulo: defaultTitle,
        tipo: 'lista',
        elementos: [''],
      } as SeccionLista
  }
}

export const DEFAULT_CV: CVData = {
  $schema: 'assets/cv.schema.json',
  plantilla: 'harvard',
  datos_personales: {
    nombre_completo: 'John Doe',
    titulo: 'Senior Software Engineer & Solutions Architect',
    fecha_nacimiento: '1995-01-01',
    contacto: [
      {
        id: generateId(),
        tipo: 'ubicacion',
        valor: 'San Francisco, CA',
        url: '',
      },
      {
        id: generateId(),
        tipo: 'email',
        valor: 'john.doe@example.com',
        url: 'mailto:john.doe@example.com',
      },
      {
        id: generateId(),
        tipo: 'telefono',
        valor: '+1 (555) 019-2834',
        url: 'tel:+15550192834',
      },
      {
        id: generateId(),
        tipo: 'linkedin',
        valor: 'linkedin.com/in/johndoe',
        url: 'https://linkedin.com',
      },
      {
        id: generateId(),
        tipo: 'github',
        valor: 'github.com/johndoe',
        url: 'https://github.com',
      },
    ],
  },
  secciones: [
    {
      id: generateId(),
      titulo: 'PERFIL PROFESIONAL',
      tipo: 'texto',
      contenido:
        'Ingeniero de Software senior con más de 8 años de experiencia en diseño de arquitecturas distribuidas, desarrollo full-stack y optimización de rendimiento. Enfocado en construir productos escalables con código limpio, alta mantenibilidad y estándares modernos de accesibilidad y tipografía.',
    },
    {
      id: generateId(),
      titulo: 'EXPERIENCIA LABORAL',
      tipo: 'entradas',
      items: [
        {
          id: generateId(),
          primario_izq: 'Tech Innovations Inc.',
          primario_der: '2022 – Presente',
          secundario_izq: 'Lead Software Engineer',
          secundario_der: 'San Francisco, CA',
          descripcion:
            'Liderazgo técnico en la arquitectura de aplicaciones web modernas y pipelines de datos en tiempo real.',
          vinetas: [
            'Diseño e implementación de sistemas de alta disponibilidad atendiendo a más de 500k usuarios activos.',
            'Optimización de tiempos de carga en un 40% mediante arquitecturas modulares y compilación nativa.',
          ],
        },
        {
          id: generateId(),
          primario_izq: 'Global Solutions Corp.',
          primario_der: '2019 – 2022',
          secundario_izq: 'Full Stack Developer',
          secundario_der: 'Remoto',
          descripcion:
            'Desarrollo de servicios frontend y backend para plataformas empresariales en la nube.',
          vinetas: [
            'Construcción de interfaces de usuario reactivas y diseño de APIs RESTful escalables.',
            'Automatización de pruebas unitarias y de integración alcanzando un 90% de cobertura de código.',
          ],
        },
      ],
    },
    {
      id: generateId(),
      titulo: 'FORMACIÓN ACADÉMICA',
      tipo: 'entradas',
      items: [
        {
          id: generateId(),
          primario_izq: 'State University',
          primario_der: '2015 – 2019',
          secundario_izq: 'Licenciatura en Ciencias de la Computación',
          secundario_der: 'San Francisco, CA',
          descripcion:
            'Graduado con honores académicos. Especialización en sistemas distribuidos y compiladores.',
          vinetas: [],
        },
      ],
    },
    {
      id: generateId(),
      titulo: 'HABILIDADES TÉCNICAS',
      tipo: 'agrupado',
      grupos: [
        {
          id: generateId(),
          categoria: 'Lenguajes de Programación',
          elementos: ['TypeScript', 'JavaScript', 'Python', 'Go', 'SQL', 'Rust'],
        },
        {
          id: generateId(),
          categoria: 'Frontend & Frameworks',
          elementos: ['React 19', 'Next.js', 'Vite', 'Tailwind CSS v4', 'shadcn/ui', 'Base UI'],
        },
        {
          id: generateId(),
          categoria: 'Cloud & Herramientas',
          elementos: ['Docker', 'Kubernetes', 'AWS', 'Git', 'Linux', 'CI/CD'],
        },
      ],
    },
    {
      id: generateId(),
      titulo: 'IDIOMAS',
      tipo: 'agrupado',
      grupos: [
        {
          id: generateId(),
          categoria: 'Inglés',
          elementos: ['Nativo / Bilingüe'],
        },
        {
          id: generateId(),
          categoria: 'Español',
          elementos: ['Profesional C1'],
        },
      ],
    },
  ],
}

export const EMPTY_CV: CVData = {
  $schema: 'assets/cv.schema.json',
  plantilla: 'harvard',
  datos_personales: {
    nombre_completo: '',
    titulo: '',
    contacto: [
      {
        id: generateId(),
        tipo: 'email',
        valor: '',
        url: '',
      },
    ],
  },
  secciones: [],
}
