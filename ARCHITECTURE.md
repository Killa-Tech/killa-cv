# Killa CV — Arquitectura del Sistema y Guía de Referencia

Este documento consolida la arquitectura integral, el flujo de datos, el protocolo de compilación y la estructura de componentes de **Killa CV v2.0**. Su propósito es servir como **fuente única de verdad** para que desarrolladores y mantenedores comprendan de forma inmediata el funcionamiento del proyecto, su diseño por capas, patrones de extensibilidad y lineamientos para garantizar futura escalabilidad y robustez.

---

## 1. Misión y Principios Arquitecturales

**Killa CV** es una plataforma de maquetación y generación de currículums de alta precisión tipográfica, **100% local, privada y sin dependencias de servidores externos**:

1. **Privacidad Absoluta (Zero-Server Architecture):**
   - Todo el procesamiento de datos, compilación tipográfica a SVG y generación binaria de documentos PDF ocurre estrictamente dentro del navegador del usuario.
   - Ningún dato personal o imagen es transmitido a APIs de terceros.
2. **Motor Typst WebAssembly Nativo:**
   - La maquetación documental está gobernada por [Typst v0.15+](https://typst.app/), ejecutado mediante WebAssembly (`@myriaddreamin/typst.ts`) directamente en el cliente.
3. **Domain-Driven Design (DDD) & Vertical Slices:**
   - El código se estructura en torno a módulos de dominio (`src/domain/cv/`), features verticales independientes (`src/features/`) y un núcleo de diseño reutilizable (`src/core/`).
4. **Mutabilidad Inmutable y Normalizada:**
   - Cero mutaciones basadas en índices de array. Cada entidad (sección, contacto, entrada, grupo) posee un identificador único estable UUID v4 (`_id`) que previene bugs de reordenamiento y pérdida de foco en React.
5. **Estrategia Polimórfica (Strategy Pattern):**
   - Las secciones del CV son polimórficas (texto, entradas cronológicas, agrupadas por categorías, listas simples). Los editores se resuelven dinámicamente mediante un registro declarativo sin condicionales monolíticos.
6. **Estética Aeroespacial Cyber Lunar:**
   - Interfaz construida con Tailwind CSS v4, espacio de color OKLCH, tokens semánticos de elevación, resplandores cian/morado y tipografías variables (*Space Grotesk* para titulares e *Inter* para lectura).

---

## 2. Diagrama de Arquitectura Global

```mermaid
graph TD
    subgraph UI_Layer ["Capa de Presentación & Orquestación"]
        App["src/App.tsx (Workbench Responsivo)"]
        Header["src/features/app-header (AppHeader, StatusBadge, ThemeToggle)"]
        Editor["src/features/cv-editor (CVEditor, SectionManager, PersonalInfo)"]
        Preview["src/features/cv-preview (CVPreview, PreviewToolbar, PreviewCanvas)"]
        DocStorage["src/features/document-storage (ImportJsonDialog, ExportJSON)"]
        
        App --> Header
        App --> Editor
        App --> Preview
        Header --> DocStorage
    end

    subgraph State_Layer ["Capa de Estado Central (Zustand)"]
        CVStore["src/store/cv-store.ts (Mutaciones Atómicas por UUID)"]
        LocalStorage[("localStorage: killa-cv-storage-v3")]
        CVStore <--> LocalStorage
    end

    subgraph Domain_Layer ["Capa de Dominio & Validación (Zod)"]
        Schema["src/domain/cv/schema.ts (Validación Runtime)"]
        Types["src/domain/cv/types.ts (Discriminated Unions)"]
        Defaults["src/domain/cv/defaults.ts (DEFAULT_CV John Doe, EMPTY_CV)"]
        Sanitizer["src/domain/cv/sanitizer.ts (sanitizeCVData, parseAndValidateCVData)"]
        JsonSchema["src/assets/cv.schema.json (Contrato Formal JSON)"]
    end

    subgraph Compiler_Layer ["Motor Typst WebAssembly (src/features/typst-compiler)"]
        UseCompiler["useTypstCompiler Hook (Debounce 350ms, AbortController)"]
        WasmEngine["wasmTypstEngine Singleton (WasmTypstEngine)"]
        VirtualFS["Typst Virtual FS ($typst.mapShadow)"]
        TypstSource["/cv-engine.typ (Template Typst)"]
        JsonVirtual["/cv.json (Datos Saneados)"]
        AvatarVirtual["/avatar.png (Uint8Array Decodificado)"]
        WasmCompiler["typst_ts_web_compiler.wasm"]
        WasmRenderer["typst_ts_renderer.wasm"]
    end

    App --> CVStore
    App --> UseCompiler
    CVStore --> Sanitizer
    Sanitizer --> UseCompiler
    UseCompiler --> WasmEngine
    WasmEngine --> VirtualFS
    VirtualFS --> TypstSource
    VirtualFS --> JsonVirtual
    VirtualFS --> AvatarVirtual
    VirtualFS --> WasmCompiler
    WasmCompiler --> WasmRenderer
    WasmRenderer -->|Páginas SVG vectoriales| Preview
    WasmCompiler -->|Binario PDF (Uint8Array)| Preview
    DocStorage --> Sanitizer
    DocStorage --> CVStore
```

---

## 3. Estructura de Directorios

La estructura del proyecto sigue una clara separación de responsabilidades:

```text
killa-cv/
├── src/
│   ├── app/
│   │   └── providers/
│   │       └── theme-provider.tsx          # Proveedor de tema Cyber Lunar (oscuro/claro)
│   ├── assets/
│   │   ├── cv-engine.typ                   # Motor de maquetación Typst (Harvard y Modern)
│   │   └── cv.schema.json                  # Especificación JSON Schema formal (v2020-12)
│   ├── core/                               # Core Design System y Utilidades Reutilizables
│   │   ├── hooks/
│   │   │   ├── use-debounce.ts             # Hook debounce genérico tipado
│   │   │   └── use-media-query.ts          # Hook reactivo de media queries con useSyncExternalStore
│   │   ├── lib/
│   │   │   ├── download.ts                 # Helper para descarga de Blobs en el navegador
│   │   │   ├── id.ts                       # Generador centralizado de UUIDs estables
│   │   │   └── utils.ts                    # Función cn() (clsx + tailwind-merge)
│   │   └── ui/                             # 10 Primitivas atómicas shadcn/ui
│   │       ├── avatar.tsx, badge.tsx, button.tsx, card.tsx, dialog.tsx,
│   │       ├── dropdown-menu.tsx, input.tsx, label.tsx, separator.tsx, textarea.tsx
│   │       └── index.ts
│   ├── domain/                             # Capa de Dominio Pura (Independiente de React)
│   │   └── cv/
│   │       ├── schema.ts                   # Schemas Zod con validación y auto-generación de UUIDs
│   │       ├── types.ts                    # Tipos TypeScript inferidos y Discriminated Unions
│   │       ├── defaults.ts                 # Preset inicial (John Doe), EMPTY_CV y factories
│   │       ├── sanitizer.ts                # Saneamiento de datos para Typst y parseador con Zod
│   │       └── index.ts                    # Barrel export del dominio
│   ├── features/                           # Vertical Slices / Módulos de Funcionalidad
│   │   ├── app-header/                     # Encabezado Global
│   │   │   ├── components/
│   │   │   │   ├── app-header.tsx          # Barra principal con branding, estado y acciones
│   │   │   │   ├── compiler-status-badge.tsx # Indicador reactivo Online / WASM Ready
│   │   │   │   └── theme-toggle.tsx        # Alternador de modo oscuro / claro
│   │   │   └── index.ts
│   │   ├── cv-editor/                      # Feature de Edición de Contenidos
│   │   │   ├── components/
│   │   │   │   ├── cv-editor.tsx           # Vista principal del editor
│   │   │   │   ├── personal-info/          # Formulario de datos personales, avatar y contactos
│   │   │   │   └── section-manager/        # Gestor de secciones, reordenamiento, diálogos
│   │   │   ├── registry/
│   │   │   │   └── section-registry.ts     # Strategy Pattern: registro de editores por tipo
│   │   │   ├── sections/                   # Editores especializados por tipo de sección
│   │   │   │   ├── text-section/           # Editor de texto narrativo expandible
│   │   │   │   ├── entries-section/        # Editor de experiencias/educación (timeline doble)
│   │   │   │   ├── grouped-section/        # Editor de categorías con chips interactivos
│   │   │   │   └── list-section/           # Editor de viñetas simples con atajo Enter
│   │   │   └── index.ts
│   │   ├── cv-preview/                     # Feature de Vista Previa y Exportación
│   │   │   ├── components/
│   │   │   │   ├── cv-preview.tsx          # Ensamblador de toolbar y canvas
│   │   │   │   ├── preview-toolbar.tsx     # Selector de plantilla, papel, zoom y descarga PDF
│   │   │   │   ├── preview-canvas.tsx      # Renderizador de páginas SVG con sombra de papel
│   │   │   │   └── preview-error.tsx       # Tarjeta de diagnóstico de errores Typst
│   │   │   ├── hooks/
│   │   │   │   └── use-preview-zoom.ts     # Manejador de escala de zoom (0.5x - 2.0x, fit)
│   │   │   └── index.ts
│   │   ├── document-storage/               # Feature de Importación y Exportación de Archivos
│   │   │   ├── export-json.ts              # Generador y descargador de archivo JSON limpio
│   │   │   ├── import-json-dialog.tsx      # Diálogo con Drag & Drop y validación estricta Zod
│   │   │   └── index.ts
│   │   └── typst-compiler/                 # Feature del Motor WebAssembly Typst
│   │       ├── engine/
│   │       │   ├── types.ts                # Interfaces de compilación y resultados
│   │       │   └── wasm-engine.ts          # Singleton WasmTypstEngine con Virtual FS
│   │       ├── hooks/
│   │       │   └── use-typst-compiler.ts   # Hook reactivo de compilación con debounce y cancelación
│   │       └── index.ts
│   ├── store/                              # Estado Global Centralizado
│   │   ├── cv-store.ts                     # Store Zustand con persistencia y mutaciones UUID
│   │   └── index.ts
│   ├── App.tsx                             # Orquestador Principal (< 80 líneas)
│   ├── index.css                           # Tokens @theme inline, paleta OKLCH y tipografía
│   └── main.tsx                            # Punto de entrada de la aplicación
├── index.html                              # Documento HTML con fuentes precargadas
├── components.json                         # Configuración de shadcn/ui hacia @/core/ui
├── vite.config.ts                          # Configuración de Vite 8 + Tailwind v4 + WASM
└── package.json
```

---

## 4. Capa de Dominio y Modelado de Datos (`src/domain/cv/`)

La capa de dominio es el cimiento del sistema. Modela los datos de acuerdo con el contrato estricto de [`src/assets/cv.schema.json`](file:///home/cachambi/Code/killa-cv/src/assets/cv.schema.json) y proporciona validaciones en tiempo de ejecución.

### 4.1. Schemas Zod (`schema.ts`)
Define validadores Zod para cada entidad del currículum. Si un objeto carece de `_id` (por ejemplo, al importar un JSON externo conforme al estándar oficial), Zod le asigna automáticamente un UUID generado con `generateId()`:

```typescript
export const seccionTextoSchema = z.object({
  _id: z.string().default(() => generateId()),
  titulo: z.string().min(1, 'El título de la sección es obligatorio'),
  tipo: z.literal('texto'),
  contenido: z.string().default(''),
})
```

### 4.2. Discriminated Unions Polimórficas (`types.ts`)
Las secciones se definen como una unión discriminada sobre la propiedad `tipo`:

```typescript
export type SeccionCV =
  | SeccionTexto
  | SeccionEntradas
  | SeccionAgrupada
  | SeccionLista
```

| Tipo | Propiedades Clave | Modelado en Typst |
| :--- | :--- | :--- |
| **`texto`** | `contenido: string` | Párrafo narrativo justificado (Perfil profesional, Objetivos). |
| **`entradas`** | `items: EntradaItem[]` (`institucion`, `titulo`, `subtitulo`, `fecha_inicio`, `fecha_fin`, `ubicacion`, `detalles[]`) | Doble nivel cronológico estilo Harvard (Experiencia laboral, Educación, Proyectos). |
| **`agrupado`** | `grupos: GrupoItem[]` (`categoria`, `elementos[]`) | Categorías en negrita con etiquetas o chips separados por comas (Habilidades técnicas, Idiomas). |
| **`lista`** | `elementos: string[]` | Lista directa de viñetas (Certificaciones, Publicaciones, Logros). |

### 4.3. Saneamiento Puro (`sanitizer.ts`)
Cumple dos propósitos vitales:
1. **`sanitizeCVData(data: CVData)`**: Transforma el estado reactivo enriquecido (con `_id` auxiliares y campos en blanco) en un payload JSON puro que satisface estrictamente `cv.schema.json` (`additionalProperties: false`). Elimina strings vacíos, formatea URLs y omite secciones desprovistas de contenido para que Typst no genere espacios en blanco espurios.
2. **`parseAndValidateCVData(raw: unknown)`**: Ejecuta `cvDataSchema.safeParse(raw)` y retorna un `ParseCVResult` con mensajes de error legibles y estructurados si la validación falla.

---

## 5. Gestión de Estado Global (`src/store/cv-store.ts`)

La aplicación utiliza **Zustand** con el middleware `persist` (`killa-cv-storage-v3` en `localStorage`). Todas las mutaciones son atómicas e inmutables, operando exclusivamente mediante identificadores estables UUID:

### Métodos Principales del Store:
- **Datos Personales:**
  - `updatePersonalInfo(patch)`: Actualiza campos básicos (`nombre_completo`, `titulo`, `foto`, `fecha_nacimiento`).
  - `addContactItem(tipo?, valor?, url?)`: Agrega un nuevo medio de contacto con UUID único.
  - `updateContactItem(contactId, patch)`: Actualiza contacto por `_id`.
  - `removeContactItem(contactId)`: Elimina contacto por `_id`.
- **Secciones:**
  - `addSection(tipo, titulo?)`: Crea y añade una sección polimórfica inicializada según su tipo.
  - `updateSection(sectionId, patch)`: Modifica título o propiedades de una sección.
  - `removeSection(sectionId)`: Elimina una sección completa.
  - `reorderSections(startIndex, endIndex)`: Reordena el arreglo de secciones de forma inmutable.
  - `duplicateSection(sectionId)`: Clona una sección generando nuevos UUIDs para todos sus elementos hijos.
- **Sub-elementos de Sección:**
  - `addEntryItem(sectionId)` / `updateEntryItem(sectionId, entryId, patch)` / `removeEntryItem(sectionId, entryId)`
  - `addGroupItem(sectionId)` / `updateGroupItem(sectionId, groupId, patch)` / `removeGroupItem(sectionId, groupId)`
- **Configuración Documental y Ciclo de Vida:**
  - `setPlantilla(tipo)`: Alterna entre `'harvard'` y `'modern'`.
  - `setFormatoPapel(formato)`: Alterna entre `'a4'` y `'us-letter'`.
  - `loadCVData(data)`: Carga un documento completo garantizando integridad de IDs.
  - `resetToDefault()`: Restablece el currículum de ejemplo de John Doe.
  - `clearData()`: Vacía todos los campos para comenzar desde cero.

---

## 6. Motor Typst WebAssembly (`src/features/typst-compiler/`)

El motor de maquetación Typst está completamente desacoplado del árbol de componentes de React.

### 6.1. Singleton `WasmTypstEngine`
Encapsula la instancia global de `@myriaddreamin/typst.ts`:
- **Carga Perezosa de WASM:** Carga asíncronamente `typst_ts_web_compiler_bg.wasm` y `typst_ts_renderer_bg.wasm` utilizando URLs estáticas de Vite.
- **Virtual File System (`$typst.mapShadow`):**
  - Mapea el código fuente de [`src/assets/cv-engine.typ`](file:///home/cachambi/Code/killa-cv/src/assets/cv-engine.typ) en `/cv-engine.typ`.
  - Mapea el JSON saneado en `/cv.json`.
  - Decodifica la foto del avatar en Base64 a `Uint8Array` y la mapea en `/avatar.png`, permitiendo que Typst la cargue instantáneamente mediante `image("/avatar.png")`.
- **Compilación de Vectores SVG:** Invoca `$typst.renderSvgPage` por cada página del documento y retorna un array `string[]` con el contenido SVG listo para ser inyectado en el DOM.
- **Compilación Binaria PDF:** Invoca `$typst.pdf` y retorna un `Uint8Array` que puede descargarse directamente como archivo `.pdf`.

### 6.2. Hook `useTypstCompiler`
Conecta el motor WASM con el ciclo de renderizado de React:
- **Debounce de 350ms:** Agrupa las pulsaciones de teclado durante la edición para evitar compilaciones innecesarias del motor WASM.
- **Cancelación Preventiva (`AbortController`):** Si el usuario sigue escribiendo, cualquier compilación en curso se cancela inmediatamente mediante la señal `signal.aborted`.
- **Manejo No Destructivo de Errores:** Si Typst arroja un error de sintaxis o maquetación, el visor conserva las últimas páginas válidas visibles y despliega una alerta amigable sin bloquear la interfaz.
- **Descarga Directa de PDF:** Función asíncrona `downloadPDF(customFilename?)` con indicador de progreso.

---

## 7. Módulos de Funcionalidad (Feature Modules)

### 7.1. Editor de CV (`src/features/cv-editor/`)
- **`PersonalInfoForm`**: Formulario con subida y recorte visual de avatar (`AvatarUpload`) y gestión de lista dinámica de redes y canales (`ContactListEditor`).
- **`SectionManager`**: Contenedor principal de secciones con:
  - Botones globales para colapsar y expandir todas las secciones.
  - Controles de ordenamiento (flechas arriba/abajo), duplicación y borrado por sección.
  - Modal `AddSectionDialog` que permite agregar secciones preconfiguradas (Experiencia, Educación, Proyectos, Habilidades, Idiomas, etc.) o crear secciones personalizadas.
- **Strategy Pattern (`SECTION_REGISTRY`):**
  En lugar de switches condicionales gigantes, cada tipo de sección tiene su editor dedicado registrado en [`section-registry.ts`](file:///home/cachambi/Code/killa-cv/src/features/cv-editor/registry/section-registry.ts):
  ```typescript
  export const SECTION_REGISTRY = {
    texto: TextSectionEditor,
    entradas: EntriesSectionEditor,
    agrupado: GroupedSectionEditor,
    lista: ListSectionEditor,
  }
  ```

### 7.2. Visor y Vista Previa (`src/features/cv-preview/`)
- **`PreviewToolbar`**: Controles de plantilla (`Harvard` / `Modern`), selector de tamaño de papel (`A4` / `US-Letter`), controles de zoom (`+`, `-`, `100%`, `Ajustar`), botón de forzar recompilación y botón de descarga de PDF de alta resolución.
- **`PreviewCanvas`**: Renderizador de páginas SVG vectoriales con sombras de hoja física, efecto de elevación y paginación clara (`Página 1 de N`).
- **`PreviewError`**: Caja de diagnóstico en tipografía monoespaciada para inspeccionar advertencias de compilación de Typst.

### 7.3. Almacenamiento y Documentos (`src/features/document-storage/`)
- **`exportDocumentJSON(cvData)`**: Sanitiza el estado del store y desencadena la descarga inmediata de un archivo `.json` limpio con sangría de 2 espacios.
- **`ImportJsonDialog`**: Modal interactivo que permite arrastrar y soltar archivos `.json`. Ejecuta validación estricta en runtime con Zod y notifica el resultado antes de confirmar la importación en el store.

### 7.4. Encabezado Global (`src/features/app-header/`)
- **Logo Killa CV con Badge de Versión:** Isotipo lunar estilizado con resplandor `shadow-cyan-glow` y etiqueta `v2.0`.
- **`CompilerStatusBadge`**: Telemetría visual en tiempo real del motor Typst (`Online / WASM Ready` con pulso esmeralda, `Compilando...` con spinner o `Typst Error`).
- **`ThemeToggle`**: Conmutador fluido entre el modo oscuro *Cyber Lunar* y el modo claro.
- **Acciones Rápidas:** Botones para Importar JSON, Exportar JSON, Reiniciar ejemplo y Limpiar.

---

## 8. Orquestador Principal (`src/App.tsx`)

[`src/App.tsx`](file:///home/cachambi/Code/killa-cv/src/App.tsx) se diseñó bajo una filosofía estricta de **código limpio y declarativo (< 80 líneas)**. Su única responsabilidad es componer las features y gestionar la adaptabilidad responsive:

- **Escritorio (`lg+`):** Layout Workbench en dos columnas lado a lado:
  - Columna Izquierda (`lg:col-span-5`): `<CVEditor />` con scroll independiente.
  - Columna Derecha (`lg:col-span-7`): `<CVPreview />` con visor interactivo.
- **Móvil (`< lg`):** Barra de navegación táctil por pestañas que permite conmutar rápidamente entre **Editor de CV** y **Vista Previa**.
- **Instancia Centralizada del Compilador:** Alimenta simultáneamente a `<AppHeader />` (para la telemetría del badge) y a `<CVPreview />` (para el renderizado de páginas), garantizando que solo exista un ciclo de compilación WASM activo.

---

## 9. Guía de Extensibilidad para Desarrolladores

### 9.1. ¿Cómo agregar un nuevo tipo de sección?
Para incorporar un nuevo tipo de sección (ej. `tabla`):
1. **Dominio:**
   - Define el schema en `src/domain/cv/schema.ts` (`seccionTablaSchema`).
   - Agrégalo a la unión discriminada `SeccionCV` en `src/domain/cv/types.ts`.
   - Modifica `sanitizeCVData` en `src/domain/cv/sanitizer.ts` para serializar la sección a JSON limpio.
   - Agrega la fábrica en `src/domain/cv/defaults.ts` (`createSection('tabla')`).
2. **Editor:**
   - Crea el componente editor en `src/features/cv-editor/sections/table-section/table-section-editor.tsx`.
   - Regístralo en `src/features/cv-editor/registry/section-registry.ts`:
     ```typescript
     export const SECTION_REGISTRY = {
       ...,
       tabla: TableSectionEditor,
     }
     ```
   - Añade el tipo y preset visual en `src/features/cv-editor/components/section-manager/add-section-dialog.tsx`.
3. **Motor Typst:**
   - En `src/assets/cv-engine.typ`, añade la rama condicional en la función que itera las secciones:
     ```typst
     #if sec.tipo == "tabla" [
       // Renderizado de tabla personalizada
     ]
     ```

### 9.2. ¿Cómo agregar una nueva plantilla de Typst?
1. Añade el identificador de plantilla al tipo `PlantillaTipo` en `src/domain/cv/types.ts` (ej. `'minimal'`).
2. En `src/features/cv-preview/components/preview-toolbar.tsx`, agrega la opción en el selector de plantillas.
3. En `src/assets/cv-engine.typ`, implementa las funciones de estilo y maquetación condicionales basadas en `sys.inputs.plantilla`.

---

## 10. Comandos de Desarrollo y Verificación

```bash
# Iniciar servidor de desarrollo local con recarga en caliente (HMR)
pnpm run dev

# Ejecutar verificación estricta de tipos de TypeScript y empaquetado de producción
pnpm run build

# Ejecutar el linter ultrarrápido (oxlint) para validar reglas de código
pnpm run lint
```

---

## 11. Resumen de Tecnologías y Versiones

| Herramienta | Versión | Propósito |
| :--- | :--- | :--- |
| **React** | `19.x` | Biblioteca de interfaz de usuario con transiciones nativas |
| **TypeScript** | `5.x` | Tipado estricto en modo `strict: true` |
| **Vite** | `8.x` | Empaquetador y entorno de desarrollo ultra rápido |
| **Typst.ts** | `@myriaddreamin/typst.ts` | Motor de maquetación Typst compilado a WebAssembly |
| **Tailwind CSS** | `v4.x` | Estilos atómicos basados en CSS-first y espacio OKLCH |
| **Zustand** | `5.x` | Gestor de estado reactivo global con middleware `persist` |
| **Zod** | `4.x` | Validación de esquemas en tiempo de ejecución |
| **Oxlint** | `1.x` | Linter de alto rendimiento en Rust |
| **Lucide React** | `1.x` | Iconografía aeroespacial y moderna |
