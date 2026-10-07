# 🚀 Guía de Inicio Rápido

Esta guía está dividida en dos secciones: la primera para **usuarios finales** que desean crear y gestionar su currículum, y la segunda para **desarrolladores** que desean configurar el entorno local y contribuir al proyecto.

---

## 👤 Sección I: Guía para Usuarios Finales

Killa CV está diseñado bajo un modelo **Zero-Server** (100% en el navegador). No requiere registro, creación de cuenta ni configuración de servidores.

### 1. Ingreso de Datos Personales y Avatar
1. En el panel izquierdo del editor, despliega la sección **Información Personal**.
2. Completa los campos básicos: **Nombre completo**, **Titular profesional** y **Ubicación**.
3. **Fotografía de Perfil / Avatar:**
   - Haz clic en el círculo de carga de imagen.
   - Selecciona un archivo de imagen (`.png`, `.jpg`, `.webp`).
   - La aplicación convertirá internamente la imagen a un *Data URI* en Base64 seguro para Typst.
4. **Información de Contacto:**
   - Pulsa en **Añadir Contacto**.
   - Selecciona el canal correspondiente: Correo Electrónico, Teléfono, LinkedIn, GitHub, Portafolio o Enlace Web.
   - Ingresa el valor y el enlace de destino.

### 2. Gestión de Secciones Polimórficas
Killa CV soporta cuatro tipos especializados de secciones para adaptarse a cualquier perfil profesional:

- **Texto Narrativo (`texto`):** Ideal para un resumen ejecutivo, perfil profesional o sección "Sobre Mí".
- **Entradas Cronológicas (`entradas`):** Para experiencia laboral, educación o proyectos destacados. Permite indicar título de cargo, empresa o institución, ubicación, rango de fechas y lista de viñetas con logros cuantificables.
- **Secciones Agrupadas (`agrupado`):** Para habilidades técnicas, idiomas o competencias categorizadas. Permite crear grupos (ej. *Frontend*, *Bases de Datos*) con etiquetas interactivas (*chips*).
- **Listas de Viñetas (`lista`):** Para certificaciones, premios, publicaciones o intereses adicionales. Admite inserción rápida presionando `Enter`.

> [!TIP]
> Puedes reordenar las secciones con los botones de flecha arriba/abajo y ocultar temporalmente aquellas que no desees mostrar en un envío específico.

### 3. Selección de Plantillas y Formato de Papel
En la barra superior del visor derecho (**PreviewToolbar**):
- **Plantilla Harvard:** Estilo clásico, sobrio y monocromático. Máxima compatibilidad con sistemas automatizados de filtrado (ATS).
- **Plantilla Modern:** Estilo contemporáneo y estilizado con acentos de color marino y soporte visual de foto de perfil.
- **Formato de Papel:** Alterna al instante entre **A4** (estándar internacional) y **US-Letter** (estándar norteamericano).

### 4. Persistencia Local y Respaldo JSON
- **Guardado Automático:** Cada tecla pulsada se persiste en tiempo real en el `localStorage` de tu navegador (`killa-cv-storage-v3`). Si cierras la pestaña o recargas, tus datos permanecerán intactos.
- **Exportar Respaldo:** En la barra superior, haz clic en **Exportar JSON** para descargar un archivo con tus datos estructurados limpios conforme a [`cv.schema.json`](https://github.com/Killa-Tech/killa-cv/blob/main/src/assets/cv.schema.json).
- **Importar Respaldo:** Usa **Importar JSON** (con soporte Drag & Drop) para restaurar un respaldo previo o migrar entre navegadores.

### 5. Compilación y Descarga del PDF
- La previsualización de tu documento se actualiza automáticamente con un retardo imperceptible (350 ms).
- Cuando estés satisfecho con el resultado, haz clic en el botón **Descargar PDF** en la barra de herramientas. El motor WebAssembly compilará el documento en memoria y descargará el archivo binario PDF vectorial de máxima resolución tipográfica.

---

## 💻 Sección II: Guía para Desarrolladores

### 1. Requisitos del Sistema
- **Node.js:** v20.0.0 o superior
- **Gestor de Paquetes:** `pnpm` (recomendado v9+), `npm` o `yarn`
- **Navegador:** Cualquier navegador moderno compatible con WebAssembly y CSS Color 4 (Chrome 111+, Firefox 113+, Safari 16.4+).

### 2. Clonación e Instalación

Clona el repositorio principal e instala las dependencias:

```bash
# Clonar el repositorio
git clone https://github.com/Killa-Tech/killa-cv.git

# Ingresar al directorio del proyecto
cd killa-cv

# Instalar dependencias con pnpm
pnpm install
```

### 3. Scripts Disponibles

El proyecto define los siguientes comandos en su `package.json`:

| Comando | Descripción |
| :--- | :--- |
| `pnpm dev` | Inicia el servidor de desarrollo de Vite con Hot Module Replacement (HMR). |
| `pnpm build` | Ejecuta el análisis de tipos con `tsc -b` y compila el bundle de producción en `dist/`. |
| `pnpm lint` | Ejecuta el análisis estático ultra-rápido de código mediante [Oxlint](https://oxc.rs). |
| `pnpm preview` | Levanta un servidor estático local para inspeccionar la compilación de producción. |

### 4. Arquitectura de Desarrollo en un Vistazo

```bash
src/
├── app/providers/          # Context providers (tema Cyber Lunar)
├── assets/                 # cv-engine.typ (template Typst) y cv.schema.json
├── core/                   # UI primitives (@base-ui/shadcn) y hooks utilitarios
├── domain/cv/              # Entidades, validación Zod, fábrica de defaults y sanitizer
├── features/               # Vertical slices: cv-editor, cv-preview, typst-compiler, etc.
└── store/                  # cv-store.ts con Zustand + persist
```

¡Listo! Para profundizar en cómo interactúan los módulos, consulta la [[Arquitectura del Sistema|02-Arquitectura-del-Sistema]].
