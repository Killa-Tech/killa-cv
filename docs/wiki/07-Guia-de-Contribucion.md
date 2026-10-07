# 🤝 Guía de Contribución

¡Gracias por tu interés en contribuir a **Killa CV**! Este documento resume los lineamientos de desarrollo, el flujo de ramas en Git, las convenciones de commit y los requisitos de calidad que todo pull request debe cumplir.

---

## 1. Flujo de Trabajo en Git y Ramas

1. **Haz un Fork** del repositorio oficial ([`Killa-Tech/killa-cv`](https://github.com/Killa-Tech/killa-cv)) y clónalo en tu entorno local.
2. Crea una rama descriptiva a partir de la rama principal `main`:
   ```bash
   # Para nuevas funcionalidades
   git checkout -b feature/nueva-plantilla-minimalist

   # Para corrección de defectos
   git checkout -b fix/error-compilacion-caracteres-especiales
   ```
3. Realiza tus modificaciones manteniendo commits pequeños, atómicos y bien explicados.
4. Envía tu rama a tu fork y abre un **Pull Request** hacia `main` en el repositorio original.

---

## 2. Convención de Mensajes de Commit (Conventional Commits)

Utilizamos el estándar [Conventional Commits](https://www.conventionalcommits.org/) para mantener un historial limpio y facilitar el versionado semántico:

| Prefijo | Propósito | Ejemplo |
| :--- | :--- | :--- |
| `feat:` | Una nueva funcionalidad para el usuario | `feat(editor): añadir atajo de teclado para reordenar secciones` |
| `fix:` | Corrección de un defecto o bug | `fix(compiler): evitar bloqueo al ingresar caracteres emoji en Typst` |
| `docs:` | Cambios exclusivamente en documentación | `docs(wiki): actualizar guía de arquitectura con nuevo diagrama` |
| `refactor:` | Refactorización de código sin cambio funcional | `refactor(domain): simplificar lógica de saneamiento de contactos` |
| `style:` | Ajustes de formato, espaciado o CSS | `style(ui): ajustar padding en tarjetas del workbench móvil` |
| `ci:` | Cambios en workflows de GitHub Actions | `ci(wiki): optimizar script de sincronización automática` |
| `chore:` | Mantenimiento de dependencias o scripts auxiliares | `chore(deps): actualizar @myriaddreamin/typst.ts a v0.15.2` |

---

## 3. Estándares de Código y Calidad

### 3.1. TypeScript Estricto
- **Cero `any`:** Está prohibido el uso de `any` salvo en límites de deserialización estrictamente tipados de librerías externas sin soporte de tipos. Utiliza uniones discriminadas, `unknown` con type guards o tipos inferidos de Zod.
- **Tipado Explícito de Dominio:** Toda entidad debe derivar de los tipos definidos en [`src/domain/cv/types.ts`](https://github.com/Killa-Tech/killa-cv/blob/main/src/domain/cv/types.ts).

### 3.2. Regla de Oro: Sincronización Cuádruple del Dominio
Si tu contribución modifica la estructura de datos del currículum (por ejemplo, agregar un nuevo campo como "pronombres" o un nuevo tipo de sección), **debes actualizar sincrónicamente los cuatro componentes del contrato**:

1. [`src/domain/cv/schema.ts`](https://github.com/Killa-Tech/killa-cv/blob/main/src/domain/cv/schema.ts) (Validación runtime con Zod).
2. [`src/domain/cv/types.ts`](https://github.com/Killa-Tech/killa-cv/blob/main/src/domain/cv/types.ts) (Definiciones de TypeScript).
3. [`src/assets/cv.schema.json`](https://github.com/Killa-Tech/killa-cv/blob/main/src/assets/cv.schema.json) (Contrato formal JSON Schema).
4. [`src/assets/cv-engine.typ`](https://github.com/Killa-Tech/killa-cv/blob/main/src/assets/cv-engine.typ) (Lógica de renderizado en Typst).

### 3.3. Verificación Previa al Envío (Lint & Build)
Antes de confirmar tus cambios o abrir un PR, ejecuta obligatoriamente en tu terminal:

```bash
# 1. Análisis estático ultra-rápido con Oxlint
pnpm lint

# 2. Verificación estricta de tipos con el compilador de TypeScript
pnpm build
```

Ambos comandos deben finalizar con código de salida `0` (sin errores ni advertencias críticas).

---

## 4. Revisión de Pull Requests

Cada PR pasará por revisión de los mantenedores de Killa-Tech:
- **Claridad del propósito:** Explica el contexto del problema y la solución adoptada.
- **Capturas visuales:** Si tu cambio impacta la interfaz de usuario o las plantillas del PDF, adjunta capturas de pantalla o un video comparativo.
- **Sin regresiones:** Asegúrate de que las plantillas existentes sigan compilando correctamente y que la importación/exportación JSON mantenga compatibilidad hacia atrás.

Para resolver dudas habituales sobre el entorno o posibles errores, consulta [[FAQ y Solución de Problemas|08-FAQ-y-Solucion-de-Problemas]].
