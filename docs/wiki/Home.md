# Bienvenido a la Wiki de Killa CV 🌙

**Killa CV** es una plataforma de maquetación y generación de currículums de alta precisión tipográfica, **100% local, privada y sin dependencias de servidores externos**, impulsada por el motor tipográfico de última generación [Typst v0.15+](https://typst.app/) ejecutado íntegramente en WebAssembly (WASM) dentro de tu navegador web.

---

## ⚡ Pilares y Propuesta de Valor

- 🛡️ **Privacidad Absoluta (Zero-Server Architecture):** Toda la edición, saneamiento de datos y renderizado documental ocurre estrictamente en el cliente. Ningún dato personal, imagen o archivo sale a servidores de terceros.
- ⚡ **Compilación WebAssembly Nativa en el Cliente:** Typst corre directamente en el navegador (`@myriaddreamin/typst.ts`), logrando maquetación vectorial y exportación PDF sin necesidad de binarios instalados ni APIs remotas.
- 📐 **Contrato de Datos Formal y Estricto:** Los datos del currículum se validan en tiempo de ejecución con **Zod** y se adhieren a la especificación estándar formal [`cv.schema.json`](https://github.com/Killa-Tech/killa-cv/blob/main/src/assets/cv.schema.json).
- 🎨 **Estética Aeroespacial "Cyber Lunar":** Interfaz de usuario inmersiva con Tailwind CSS v4, espacio cromático **OKLCH**, modo oscuro/claro balanceado y tipografías *Space Grotesk* (titulares) e *Inter* (lectura).
- 📄 **Sistema Polimórfico y Multi-Plantilla:** Alterna con un solo clic entre la plantilla académica **Harvard** (optimizada para ATS) y la plantilla contemporánea **Modern** (con foto y acentos de color), en formatos **A4** o **US-Letter**.
- 🔍 **Previsualización Reactiva de Alta Fidelidad:** Renderizado de páginas vectoriales SVG en tiempo real con zoom interactivo (0.5x - 2.0x, ajuste de ancho) y sombras de papel realistas.

---

## 📚 Índice Maestro de Documentación

Esta wiki está organizada en módulos autodirigidos tanto para **usuarios finales** como para **desarrolladores e ingenieros de software**:

| Módulo | Descripción |
| :--- | :--- |
| [[Guía de Inicio Rápido\|01-Inicio-Rapido]] | Guía para usuarios (edición, importación/exportación JSON, descarga PDF) y desarrolladores (clonación, entorno local y scripts). |
| [[Arquitectura del Sistema\|02-Arquitectura-del-Sistema]] | DDD, Vertical Slices, Zustand Store, inmutabilidad por UUID y flujo de datos integral. |
| [[Motor Typst y WebAssembly\|03-Motor-Typst-y-WASM]] | Funcionamiento de `@myriaddreamin/typst.ts`, Virtual FS en memoria (`$typst.mapShadow`), debounce reactivo y cancelación con `AbortController`. |
| [[Especificación JSON Schema\|04-Especificacion-JSON-Schema]] | Contrato formal `cv.schema.json`, las 4 secciones polimórficas (texto, entradas, agrupadas, listas) y proceso de saneamiento. |
| [[Guía de Plantillas Typst\|05-Guia-de-Plantillas]] | Comparativa Harvard vs. Modern, tipografías asociadas y guía paso a paso para diseñar nuevas plantillas. |
| [[Diseño Cyber Lunar y UI\|06-Sistema-de-Diseno-Cyber-Lunar]] | Paleta OKLCH, tokens semánticos en Tailwind v4, tipografías y catálogo de primitivas UI. |
| [[Guía de Contribución\|07-Guia-de-Contribucion]] | Modelo de ramas Git, Conventional Commits, validaciones con Oxlint y TypeScript estricto. |
| [[FAQ y Solución de Problemas\|08-FAQ-y-Solucion-de-Problemas]] | Preguntas frecuentes sobre privacidad, diagnóstico de errores Typst, cabeceras WASM y restablecimiento de estado. |

---

## 🔗 Recursos y Enlaces Rápidos

- 🐙 **Repositorio GitHub:** [Killa-Tech/killa-cv](https://github.com/Killa-Tech/killa-cv)
- 📐 **JSON Schema Formal:** [`src/assets/cv.schema.json`](https://github.com/Killa-Tech/killa-cv/blob/main/src/assets/cv.schema.json)
- 🏛️ **Documento de Arquitectura SSOT:** [`ARCHITECTURE.md`](https://github.com/Killa-Tech/killa-cv/blob/main/ARCHITECTURE.md)
- 🎨 **Guía de Estilos y Tokens:** [`DESIGN.md`](https://github.com/Killa-Tech/killa-cv/blob/main/DESIGN.md)
- 🐞 **Reporte de Issues:** [GitHub Issues](https://github.com/Killa-Tech/killa-cv/issues)
