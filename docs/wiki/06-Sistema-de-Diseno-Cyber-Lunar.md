# 🌌 Sistema de Diseño Cyber Lunar

El lenguaje visual de Killa CV, denominado **Cyber Lunar**, está concebido como una estación de trabajo aeroespacial de alta tecnología: interfaces inmersivas, superficies profundas, elevaciones semánticas y resplandores de acento cian.

---

## 1. Filosofía Estética

- **Inmersión y Enfoque:** El editor opera dentro de un contenedor rígido de altura completa (`h-dvh flex flex-col overflow-hidden`). No existen barras de desplazamiento globales en el navegador; el usuario interactúa dentro de un *workbench* autocontenido.
- **Fidelidad y Percepción de Profundidad:** Jerarquía de capas expresada mediante una rampa de superficies (`surface-container-lowest` hasta `surface-container-highest`) en lugar de bordes contrastantes excesivos.
- **Microinteracciones Dinámicas:** Transiciones suaves, resplandores sutiles (*cyan glow*) y desenfoques de vidrio (*backdrop-blur*).

---

## 2. Tokens Semánticos de Color (Tailwind CSS v4)

Killa CV utiliza la nueva arquitectura de **Tailwind CSS v4** mediante directivas `@theme inline` y definiciones en espacio de color de alta gama **OKLCH**:

### 2.1. Superficies y Contenedores (Dark Mode Predeterminado)
```css
/* Tokens del tema Cyber Lunar en index.css */
:root.dark {
  --background: oklch(0.12 0.02 260);          /* #0b1323 Espacio profundo */
  --surface-container-lowest: oklch(0.08 0.02 260);
  --surface-container-low: oklch(0.15 0.02 260);
  --surface-container: oklch(0.18 0.02 260);
  --surface-container-high: oklch(0.22 0.02 260);
  --surface-container-highest: oklch(0.26 0.02 260);

  /* Acentos y Resplandores Ciberespaciales */
  --surface-tint: #00ded2;                     /* Cian lunar */
  --primary: #47fbef;                          /* Resplandor primario */
  --shadow-cyan-glow: 0 0 24px rgba(78, 255, 243, 0.35);
}
```

### 2.2. Acentos Funcionales
- **Primario / Acción:** Resplandor cian brillante (`#47fbef` / `#00ded2`) para botones de descarga, estados activos y compilador en línea.
- **Secundario / Metadatos:** Azul espacial suave (`#b8c7e3`) para etiquetas, fechas y subtítulos.
- **Superficie Inversa:** Contraste balanceado en modo claro con legibilidad óptima para impresión.

---

## 3. Tipografía Dual

El sistema tipográfico combina fuentes variables optimizadas:

```
┌────────────────────────────────────────────────────────┐
│                      TIPOGRAFÍAS                       │
├──────────────────────────┬─────────────────────────────┤
│ Space Grotesk Variable   │ Inter Variable              │
│ (Titulares aeroespaciales│ (Lectura, formularios e     │
│  y badges técnicos)      │  inputs de precisión)       │
└──────────────────────────┴─────────────────────────────┘
```

1. **Space Grotesk (`--font-heading`):**
   - Utilizada en titulares de sección, marca de la barra superior, badges de estado del compilador y contadores de páginas.
   - Brinda el carácter futurista y técnico de la plataforma.
2. **Inter (`--font-sans`):**
   - Utilizada en el cuerpo de texto, formularios de edición, campos de entrada (`Input`, `Textarea`) y textos explicativos.
   - Garantiza máxima legibilidad en interfaces densas con contenido textual extenso.

---

## 4. Biblioteca de Componentes Atómicos (`src/core/ui/`)

La capa de componentes de presentación está construida sobre primitivas accesibles basadas en `@base-ui/react` y los lineamientos de `shadcn/ui`, adaptadas a la paleta Cyber Lunar:

| Componente | Ubicación | Caso de Uso en Killa CV |
| :--- | :--- | :--- |
| `Button` | [`src/core/ui/button.tsx`](https://github.com/Killa-Tech/killa-cv/blob/main/src/core/ui/button.tsx) | Botones de acción, selección de plantilla, zoom y descarga PDF. |
| `Card` | [`src/core/ui/card.tsx`](https://github.com/Killa-Tech/killa-cv/blob/main/src/core/ui/card.tsx) | Tarjetas contenedoras de secciones con colapso y reordenamiento. |
| `Dialog` | [`src/core/ui/dialog.tsx`](https://github.com/Killa-Tech/killa-cv/blob/main/src/core/ui/dialog.tsx) | Modales de importación JSON, confirmación de borrado y errores. |
| `Input` | [`src/core/ui/input.tsx`](https://github.com/Killa-Tech/killa-cv/blob/main/src/core/ui/input.tsx) | Campos de texto de una sola línea (nombre, fechas, enlaces). |
| `Textarea` | [`src/core/ui/textarea.tsx`](https://github.com/Killa-Tech/killa-cv/blob/main/src/core/ui/textarea.tsx) | Editor multilínea con auto-expansión para secciones narrativas. |
| `Badge` | [`src/core/ui/badge.tsx`](https://github.com/Killa-Tech/killa-cv/blob/main/src/core/ui/badge.tsx) | Chips de habilidades en secciones agrupadas y estado WASM. |
| `DropdownMenu` | [`src/core/ui/dropdown-menu.tsx`](https://github.com/Killa-Tech/killa-cv/blob/main/src/core/ui/dropdown-menu.tsx) | Menú de selección de nuevas secciones y acciones secundarias. |
| `Separator` | [`src/core/ui/separator.tsx`](https://github.com/Killa-Tech/killa-cv/blob/main/src/core/ui/separator.tsx) | Divisores visuales entre controles de la barra de previsualización. |

Para conocer las pautas de código y cómo colaborar en estos componentes, revisa la [[Guía de Contribución|07-Guia-de-Contribucion]].
