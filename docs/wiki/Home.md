# 🌌 Killa CV — Wiki del Proyecto

Bienvenido a la **Wiki Oficial de Killa CV**. Este espacio constituye la **fuente única de verdad** técnica y operativa del proyecto, estructurada de manera modular, profesional y autodirigida.

---

## 1. Objetivo de la Wiki

El objetivo primordial de esta wiki es **crear una documentación integral, rigurosa y accesible** para dos audiencias complementarias con necesidades diferenciadas:

```
                                  ┌────────────────────────┐
                                  │   Wiki de Killa CV     │
                                  └───────────┬────────────┘
                                              │
                     ┌────────────────────────┴────────────────────────┐
                     ▼                                                 ▼
        ┌─────────────────────────┐                       ┌─────────────────────────┐
        │     USUARIOS FINALES    │                       │  DEV & CONTRIBUIDORES   │
        ├─────────────────────────┤                       ├─────────────────────────┤
        │ • Introducción y flujo  │                       │ • Arquitectura Zero-Srv │
        │ • Cambio de plantillas  │                       │ • Motor Typst WASM      │
        │ • Importar/Exportar JSON│                       │ • Dominios y Features   │
        │ • Descarga de PDF       │                       │ • Diseño Cyber Lunar    │
        │ • Privacidad local      │                       │ • Extensión plantillas  │
        └─────────────────────────┘                       └─────────────────────────┘
```

### 1.1. Audiencia 1: Usuarios Finales
Orientada a cualquier persona que desee diseñar y maquetar un currículum vitae de alto impacto tipográfico:
- **Flujo de trabajo guiado:** Aprender a navegar el editor interactivo y configurar la información personal.
- **Gestión de plantillas:** Intercambiar entre diseños como *Harvard* y *Modern*, adaptando formato de papel (A4 / US-Letter).
- **Control y portabilidad de datos:** Importar y exportar perfiles completos en formato JSON sin riesgo de pérdida de datos.
- **Generación y descarga de PDF:** Compilar en tiempo real y exportar documentos vectoriales listos para imprimir o enviar.
- **Privacidad absoluta:** Comprender las garantías de una plataforma *Zero-Server* donde los datos nunca abandonan el dispositivo del usuario.

### 1.2. Audiencia 2: Desarrolladores y Contribuidores
Orientada a ingenieros de software, diseñadores y contribuidores que deseen extender o auditar la plataforma:
- **Arquitectura Zero-Server:** Funcionamiento client-side puro en el navegador, sin APIs intermedias ni backend Node.js en producción.
- **Motor Typst WebAssembly (WASM):** Integración profunda con `@myriaddreamin/typst.ts`, shadow virtual filesystem (`$typst.mapShadow`), hooks reactivos y canalización de buffers binarios.
- **Árbol de Dominios y Features:** Arquitectura modular basada en Domain-Driven Design (DDD) y Vertical Slices (`src/domain/cv/`, `src/features/`, `src/core/`, `src/store/`).
- **Sistema de Diseño Cyber Lunar:** Principios estéticos, paleta de color aeroespacial en espacio OKLCH, tokens semánticos en Tailwind CSS v4 y tipografías (*Space Grotesk* e *Inter*).
- **Extensibilidad de Plantillas y Secciones:** Guía paso a paso para crear nuevas plantillas tipográficas en Typst y registrar nuevos tipos de secciones polimórficas en React mediante el *Strategy Pattern*.

---

## 2. Principios Rectores de la Documentación

Toda sección y página dentro de esta wiki se rige por cuatro principios fundamentales:

| Principio | Definición operativa |
| :--- | :--- |
| **Completitud** | Cubre desde la primera interacción de usuario hasta la manipulación interna de la memoria WebAssembly. |
| **Autodirección** | Cada documento contiene contexto autónomo, ejemplos ejecutables, diagramas y referencias cruzadas. |
| **Modularidad** | Estructurada en módulos independientes y navegables sin dependencias circulares ni duplicación. |
| **Rigor Técnico (SSOT)** | Ninguna afirmación contradice el código productivo ni los contratos formales ([`src/assets/cv.schema.json`](file:///home/cachambi/Code/killa-cv/src/assets/cv.schema.json)). |

---

## 3. Mapa de Contenidos

### 👤 Sección I: Guía para Usuarios Finales
1. [**Primeros Pasos y Flujo de Trabajo**](Usuario-01-Primeros-Pasos): Recorrido por el workbench y edición básica.
2. [**Catálogo y Selección de Plantillas**](Usuario-02-Seleccion-Plantillas): Diferencias entre Harvard y Modern, ajuste de papel y márgenes.
3. [**Gestión de Datos: Importación y Exportación JSON**](Usuario-03-Gestion-Datos-JSON): Respaldo de información, migración y formato JSON estándar.
4. [**Compilación, Previsualización y Descarga de PDF**](Usuario-04-Compilacion-Descarga-PDF): Previsualización reactiva en tiempo real y descarga instantánea.
5. [**Privacidad, Seguridad y Modo Offline**](Usuario-05-Privacidad-Zero-Server): Almacenamiento local, sandbox de datos e independencia de servidores.

### 💻 Sección II: Guía de Arquitectura e Ingeniería
1. [**Arquitectura Zero-Server y Flujo de Datos**](Dev-01-Arquitectura-Zero-Server): Modelo 100% Client-Side, ciclo de mutación y persistencia con Zustand.
2. [**Motor Typst WebAssembly (WASM)**](Dev-02-Motor-Typst-WASM): Compilación cliente, Virtual FS `$typst.mapShadow`, debounce y cancelación.
3. [**Árbol de Dominios, Features y Estado Central**](Dev-03-Arbol-Dominios-Features): DDD, Vertical Slices, esquemas Zod con UUIDs estables.
4. [**Sistema de Diseño Cyber Lunar**](Dev-04-Sistema-Diseno-Cyber-Lunar): Tailwind CSS v4, espacio cromático OKLCH, primitivas y tokens.
5. [**Guía de Extensibilidad: Nuevas Plantillas Typst**](Dev-05-Creacion-Plantillas): Cómo diseñar un template Typst y conectarlo al dispatcher universal.
6. [**Estrategia Polimórfica de Secciones**](Dev-06-Estrategia-Polimorfica): Strategy Pattern en editores de CV y adición de tipos de sección.

---

## 4. Ficha Técnica Rápida del Ecosistema

- **Núcleo UI:** React 19 + TypeScript + Vite 8
- **Estilos:** Tailwind CSS v4 (`@theme` con paleta OKLCH y modo oscuro/claro)
- **Tipografía:** *Space Grotesk* (encabezados aeroespaciales) + *Inter* (lectura)
- **Compilador Documental:** Typst v0.15+ compilado a WebAssembly (`@myriaddreamin/typst.ts`)
- **Gestión de Estado:** Zustand con persistencia local (`localStorage: killa-cv-storage-v3`)
- **Validación de Dominio:** Zod con asignación automática de identificadores UUIDv4 estables
