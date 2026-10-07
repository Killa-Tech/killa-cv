# 📐 Especificación JSON Schema y Secciones Polimórficas

Killa CV fundamenta la estructura y portabilidad de sus datos en un contrato estricto: [`src/assets/cv.schema.json`](https://github.com/Killa-Tech/killa-cv/blob/main/src/assets/cv.schema.json).

---

## 1. El Contrato Formal (JSON Schema Draft 2020-12)

A diferencia de editores de CV que almacenan formatos propietarios e ilegibles, Killa CV utiliza una especificación formal basada en **JSON Schema (Draft 2020-12)**.

### Características del Esquema:
- **`additionalProperties: false`:** Ningún objeto en el esquema permite propiedades no autorizadas. Esto garantiza compatibilidad estricta y previene fallos sintácticos en el motor Typst.
- **Independencia de Frameworks:** El JSON exportado no contiene metadatos de React, Zustand ni librerías de UI; es un archivo de datos puro e interoperable.
- **Validación Bidireccional:** Zod valida y formatea en tiempo de ejecución en el cliente, mientras que el JSON Schema formal sirve como validador estándar para herramientas externas y pipelines CI.

---

## 2. Tipos de Secciones Polimórficas

Las secciones dentro del arreglo `secciones` forman una **unión discriminada** basada en la propiedad obligatoria `tipo`:

```typescript
export type SeccionCV =
  | SeccionTexto
  | SeccionEntradas
  | SeccionAgrupada
  | SeccionLista
```

### 2.1. Sección de Texto (`tipo: "texto"`)
Pensada para párrafos descriptivos como resúmenes profesionales, perfiles ejecutivos o cartas de presentación.

```json
{
  "titulo": "Perfil Profesional",
  "tipo": "texto",
  "contenido": "Ingeniero de Software Senior con más de 7 años de trayectoria diseñando sistemas distribuidos..."
}
```

### 2.2. Sección de Entradas Cronológicas (`tipo: "entradas"`)
La estructura principal para experiencia laboral, educación universitaria y proyectos destacados. Cada entrada en `items` contiene:
- `institucion`: Nombre de la empresa o universidad.
- `titulo`: Cargo, rol o título obtenido.
- `subtitulo` *(opcional)*: Departamento o especialización.
- `fecha_inicio` y `fecha_fin`: Rango temporal (o "Presente").
- `ubicacion` *(opcional)*: Ciudad, país o "Remoto".
- `detalles` *(opcional)*: Lista de viñetas (*bullet points*) con logros e impactos.

```json
{
  "titulo": "Experiencia Laboral",
  "tipo": "entradas",
  "items": [
    {
      "institucion": "Acme Aerospace",
      "titulo": "Lead Software Architect",
      "fecha_inicio": "2022",
      "fecha_fin": "Presente",
      "ubicacion": "Remoto",
      "detalles": [
        "Diseñó la arquitectura de micro-frontends reduciendo el tiempo de carga un 40%.",
        "Lideró un equipo multicultural de 8 ingenieros bajo metodología ágil."
      ]
    }
  ]
}
```

### 2.3. Sección Agrupada (`tipo: "agrupado"`)
Especializada en categorizar habilidades técnicas, idiomas o competencias en grupos etiquetados:
- `nombre`: Nombre de la categoría o grupo.
- `items`: Arreglo de cadenas con las habilidades individuales.

```json
{
  "titulo": "Habilidades Técnicas",
  "tipo": "agrupado",
  "grupos": [
    {
      "nombre": "Lenguajes",
      "items": ["TypeScript", "Rust", "Python", "Go"]
    },
    {
      "nombre": "Ecosistema Frontend",
      "items": ["React 19", "Tailwind CSS v4", "Next.js", "Vite"]
    }
  ]
}
```

### 2.4. Sección de Lista Simple (`tipo: "lista"`)
Para elementos directos en viñetas sin jerarquías complejas (certificaciones, premios, voluntariados, publicaciones):

```json
{
  "titulo": "Certificaciones",
  "tipo": "lista",
  "items": [
    "AWS Certified Solutions Architect – Professional (2025)",
    "Certified Kubernetes Administrator (CKA) – Linux Foundation (2024)"
  ]
}
```

---

## 3. Redes y Canales de Contacto

En `datos_personales.contacto`, cada canal se define polimórficamente:
- `tipo`: `"email" | "telefono" | "linkedin" | "github" | "portafolio" | "web" | string`
- `valor`: Texto visible que aparecerá en el currículum.
- `url` *(opcional)*: Enlace hipervínculo navegable al hacer clic en el PDF.

---

## 4. Proceso de Sanitización (`sanitizeCVData`)

Para que la experiencia de edición sea fluida, React y Zustand utilizan identificadores UUID `_id` y permiten campos temporalmente vacíos. Sin embargo, compilar datos incompletos rompería Typst o generaría un PDF con espacios en blanco.

La función [`sanitizeCVData(data)`](https://github.com/Killa-Tech/killa-cv/blob/main/src/domain/cv/sanitizer.ts) realiza una limpieza exhaustiva previa a la compilación y exportación:
1. **Purga de `_id`:** Elimina todos los identificadores UUID auxiliares creados para los keys de React.
2. **Filtrado de Contactos Vacíos:** Descarta canales sin valor o tipo definido.
3. **Omisión de Secciones Vacías:** Si una sección de texto no tiene contenido o una sección de entradas no tiene items, no se envía al motor Typst.
4. **Limpieza de Cadenas:** Aplica `.trim()` a cada texto y filtra viñetas vacías.

---

## 5. Ejemplo de JSON Mínimo Válido

Este es un ejemplo funcional completo listo para ser importado en Killa CV mediante **Importar JSON**:

```json
{
  "$schema": "https://raw.githubusercontent.com/Killa-Tech/killa-cv/main/src/assets/cv.schema.json",
  "plantilla": "harvard",
  "formato_papel": "a4",
  "datos_personales": {
    "nombre_completo": "Ada Lovelace",
    "titulo": "Ingeniera de Computación",
    "contacto": [
      {
        "tipo": "email",
        "valor": "ada@example.com",
        "url": "mailto:ada@example.com"
      },
      {
        "tipo": "github",
        "valor": "github.com/ada",
        "url": "https://github.com/ada"
      }
    ]
  },
  "secciones": [
    {
      "titulo": "Resumen",
      "tipo": "texto",
      "contenido": "Pionera en el desarrollo de algoritmos de cálculo automatizado."
    },
    {
      "titulo": "Competencias",
      "tipo": "lista",
      "items": [
        "Cálculo diferencial y álgebra simbólica",
        "Diseño de algoritmos para máquina analítica"
      ]
    }
  ]
}
```

Aprende cómo estas secciones cobran vida visual en la [[Guía de Plantillas Typst|05-Guia-de-Plantillas]].
