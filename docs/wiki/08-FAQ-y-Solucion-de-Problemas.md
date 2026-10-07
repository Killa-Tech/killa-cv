# ❓ FAQ y Solución de Problemas

Respuestas a preguntas habituales y guía de diagnóstico para resolver fallos de compilación, almacenamiento o configuración de entorno.

---

## 1. Preguntas Frecuentes (FAQ)

### ¿Dónde se guardan mis datos personales y mi currículum?
Tus datos se guardan única y exclusivamente en el **`localStorage` de tu navegador** bajo la clave `killa-cv-storage-v3`. Killa CV opera bajo una arquitectura **Zero-Server**: ningún dato, contacto ni fotografía se transmite a ningún servidor web o base de datos externa.

### ¿Puedo usar Killa CV sin conexión a Internet (Offline)?
Sí. Una vez cargada la aplicación en tu navegador, todos los binarios de WebAssembly y el código JavaScript quedan en caché. Puedes editar tu currículum, alternar plantillas y descargar el archivo PDF incluso sin conexión a la red.

### ¿Qué ocurre si borro la caché del navegador?
Borrar los datos de navegación o el almacenamiento de tu navegador eliminará la clave de `localStorage`. Por esta razón, recomendamos siempre utilizar el botón **Exportar JSON** en la barra superior para guardar una copia de seguridad en tu computadora.

### ¿Cómo restauro los datos de demostración o empiezo de cero?
En la esquina superior derecha o en el menú de acciones del encabezado, puedes:
- **Restaurar Ejemplo:** Carga el perfil modelo predeterminado (*John Doe*) para explorar las capacidades completas del sistema.
- **Limpiar Todo:** Borra todos los campos y crea un currículum vacío listo para completar.

---

## 2. Diagnóstico de Errores y Solución de Problemas

### Error: "Error al cargar el módulo WebAssembly" / Falla de inicialización de Typst
**Síntoma:** El badge de la barra superior muestra un estado de desconexión o la previsualización queda con spinner indefinido.  
**Causas y Soluciones:**
1. **Tipo MIME del Servidor Web:** En despliegues de producción (Nginx, Apache, AWS S3), asegúrate de que el servidor web entregue los archivos con extensión `.wasm` con la cabecera HTTP:
   ```http
   Content-Type: application/wasm
   ```
2. **Políticas de Seguridad de Contenido (CSP):** Si tu servidor implementa cabeceras `Content-Security-Policy`, debe permitir la ejecución de WebAssembly (`script-src 'self' 'wasm-unsafe-eval'`).

### Error: "Typst Compilation Error" en la tarjeta de previsualización
**Síntoma:** En lugar de las páginas del CV, aparece una tarjeta de diagnóstico con detalles del error de Typst.  
**Causas habituales:**
1. **Caracteres de escape o formato no compatible:** Ingresar secuencias que Typst interpreta como comandos de control no cerrados.
2. **Estructura corrupta tras importar un JSON externo:** Ocurre si importaste un JSON que no cumple estrictamente con [`cv.schema.json`](https://github.com/Killa-Tech/killa-cv/blob/main/src/assets/cv.schema.json).
**Solución:**
- Revisa el mensaje detallado en la tarjeta de error: indica la línea y la causa del problema.
- Abre el modal **Importar JSON**, valida la estructura o descarga un JSON limpio mediante **Exportar JSON** para comparar su contenido.

### El PDF generado sale cortado o con páginas vacías
**Causas:**
- **Exceso de texto continuo sin puntos de salto:** Secciones con bloques de texto excesivamente largos que exceden la altura física de la página elegida (A4 o US-Letter).
**Solución:**
- Divide el contenido en párrafos o viñetas más concisas.
- Alterna entre el formato **A4** (297 mm de alto) y **US-Letter** (279.4 mm de alto) en la barra de herramientas para ajustar el margen disponible.

---

## 3. ¿Necesitas Más Ayuda?

Si descubriste un defecto en la compilación o tienes una propuesta de mejora:
- Revisa los issues reportados o abre uno nuevo en [GitHub Issues](https://github.com/Killa-Tech/killa-cv/issues).
- Para proponer cambios o contribuir, consulta la [[Guía de Contribución|07-Guia-de-Contribucion]].
