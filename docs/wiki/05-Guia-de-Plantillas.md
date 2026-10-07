# 🎨 Guía de Plantillas Typst

Killa CV combina la reactividad de una aplicación web moderna con la excelencia tipográfica de [Typst](https://typst.app/). Todas las plantillas están compiladas y gobernadas por el motor maestro [`src/assets/cv-engine.typ`](https://github.com/Killa-Tech/killa-cv/blob/main/src/assets/cv-engine.typ).

---

## 1. Comparativa de Plantillas Oficiales

| Atributo | Plantilla **Harvard** | Plantilla **Modern** |
| :--- | :--- | :--- |
| **Enfoque** | Académico, ejecutivo tradicional, ATS-first | Contemporáneo, tecnológico, visual |
| **Familia Tipográfica** | Serif (`Libertinus Serif`, `Times New Roman`) | Sans-Serif (`Liberation Sans`, `Nimbus Sans`) |
| **Paleta de Color** | Monocromática formal (Negro `#000000`, carbón) | Azul marino (`#1d3557`), acero (`#457b9d`) y carbón |
| **Foto / Avatar** | Sin fotografía (estándar anglosajón / ATS estricto) | Soporte integrado de avatar circular con borde |
| **Márgenes de Página** | 1.8 cm simétricos | 1.4 cm superior/inferior, 1.5 cm laterales |
| **Separadores de Sección** | Líneas horizontales continuas finas (0.6pt) | Barras de acento de color azul acero (1pt) |
| **Casos de Uso Ideales** | Finanzas, consultoría, banca, academia, leyes | Startups, diseño, ingeniería de software, IT |

---

## 2. Anatomía de una Plantilla Typst en Killa CV

Cada plantilla está estructurada como un módulo encapsulado en Typst que expone una función orquestadora principal `[nombre]_cv(cv-data, paper: "a4")`:

```
Plantilla Typst ([nombre])
├── theme.typ          # Variables de diseño (fuentes, paleta rgb, márgenes, interlineado)
├── header.typ         # Renderizador de cabecera (nombre, título, avatar, contactos dinámicos)
├── section_title.typ  # Títulos de sección con líneas o acentos visuales
└── renderers/
    ├── text.typ       # Renderiza secciones tipo "texto"
    ├── entries.typ    # Renderiza secciones tipo "entradas" (institución, fechas, viñetas)
    ├── grouped.typ    # Renderiza secciones tipo "agrupado" (categorías y chips)
    └── list.typ       # Renderiza secciones tipo "lista" (bullets simples)
```

---

## 3. Cómo Extender o Crear una Nueva Plantilla

Para incorporar un nuevo diseño (por ejemplo, `minimalist` o `creative`), sigue este procedimiento de cuatro pasos:

### Paso 1: Diseñar el Módulo Typst en `src/assets/cv-engine.typ`
Agrega el bloque con el tema y los renderizadores de la nueva plantilla:

```typst
// =============================================================================
// Template: MINIMALIST
// =============================================================================
#let minimalist = {
  // 1. Tema y variables
  let font-family = ("Inter", "Helvetica", "Arial")
  let color-primary = rgb("#111827")
  let color-muted = rgb("#6b7280")
  let page-margin = (x: 1.6cm, y: 1.5cm)

  // 2. Renderizador de sección de texto
  let render_text(title, content) = [
    #text(weight: "bold", size: 11pt, title)
    #v(3pt)
    #text(size: 9.5pt, fill: color-primary, content)
  ]

  // ... (implementar render_entries, render_grouped, render_list)

  // 3. Orquestador de la plantilla
  let minimalist_cv(cv-data, paper: "a4") = {
    set page(paper: paper, margin: page-margin)
    set text(font: font-family, lang: "es")

    // Dibujar cabecera y recorrer secciones dinámicamente
    for seccion in cv-data.at("secciones", default: ()) {
      let tipo = seccion.at("tipo")
      if tipo == "texto" [
        #render_text(seccion.titulo, seccion.contenido)
      ]
      // Despachar el resto de tipos polimórficos...
    }
  }

  (cv: minimalist_cv)
}
```

### Paso 2: Registrar la Plantilla en el Router Universal de Typst
Al final de `src/assets/cv-engine.typ`, añade tu plantilla al diccionario `available_templates`:

```typst
#let available_templates = (
  "harvard": harvard.cv,
  "modern": modern.cv,
  "minimalist": minimalist.cv, // <- Nueva plantilla
)
```

### Paso 3: Actualizar los Tipos en TypeScript y Zod
En [`src/domain/cv/types.ts`](https://github.com/Killa-Tech/killa-cv/blob/main/src/domain/cv/types.ts) y [`src/domain/cv/schema.ts`](https://github.com/Killa-Tech/killa-cv/blob/main/src/domain/cv/schema.ts):

```typescript
export type PlantillaTipo = 'harvard' | 'modern' | 'minimalist'

export const plantillaTipoSchema = z.enum(['harvard', 'modern', 'minimalist'])
```

Y en el contrato formal [`src/assets/cv.schema.json`](https://github.com/Killa-Tech/killa-cv/blob/main/src/assets/cv.schema.json):
```json
"plantilla": {
  "type": "string",
  "enum": ["harvard", "modern", "minimalist"],
  "default": "harvard"
}
```

### Paso 4: Añadir el Botón en la Barra de Herramientas
En [`src/features/cv-preview/components/preview-toolbar.tsx`](https://github.com/Killa-Tech/killa-cv/blob/main/src/features/cv-preview/components/preview-toolbar.tsx), añade la opción para que los usuarios puedan seleccionarla en la interfaz.

---

## 4. Pruebas y Validación Tipográfica

El subproyecto [`typst-cv-template/`](https://github.com/Killa-Tech/killa-cv/tree/main/typst-cv-template) incluye un `Makefile` y scripts en Python (`scripts/bundle.py`) para compilar y validar plantillas localmente con el CLI nativo de Typst antes de empaquetarlas en la aplicación web:

```bash
cd typst-cv-template
typst compile main.typ output.pdf
```

Para comprender los tokens visuales y la identidad de la interfaz de usuario, continúa en [[Diseño Cyber Lunar y UI|06-Sistema-de-Diseno-Cyber-Lunar]].
