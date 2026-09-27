import { execFile } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { promisify } from 'node:util'
import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Plugin } from 'vite'

const execFileAsync = promisify(execFile)

async function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let body = ''
    req.on('data', (chunk) => {
      body += chunk
    })
    req.on('end', () => resolve(body))
    req.on('error', reject)
  })
}

function sendJson(res: ServerResponse, statusCode: number, data: unknown) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
  })
  res.end(JSON.stringify(data))
}

export function typstCompilerPlugin(): Plugin {
  const rootDir = process.cwd()
  const cacheDir = path.resolve(rootDir, '.killa-cache')
  const engineTypstPath = path.resolve(rootDir, 'src/assets/cv-engine.typ')

  return {
    name: 'vite-plugin-typst-compiler',
    configureServer(server) {
      // Asegurar que exista la carpeta de cache local
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true })
      }

      server.middlewares.use(async (req, res, next) => {
        const url = req.url?.split('?')[0]

        // 1. Estado y diagnóstico de Typst CLI
        if (url === '/api/typst/status' && req.method === 'GET') {
          try {
            const { stdout } = await execFileAsync('typst', ['--version'])
            return sendJson(res, 200, {
              ok: true,
              version: stdout.trim(),
            })
          } catch (err: unknown) {
            return sendJson(res, 200, {
              ok: false,
              error: err instanceof Error ? err.message : String(err),
            })
          }
        }

        // 2. Compilar a SVG para previsualización reactiva
        if (url === '/api/typst/compile-svg' && req.method === 'POST') {
          try {
            const rawBody = await readBody(req)
            const payload = JSON.parse(rawBody || '{}')
            const cvData = payload.data || {}
            const plantilla = payload.plantilla || cvData.plantilla || 'harvard'
            const paper = payload.paper || 'a4'

            // Guardar JSON en caché local dentro del proyecto
            const jsonPath = path.join(cacheDir, 'cv.json')
            fs.writeFileSync(jsonPath, JSON.stringify(cvData, null, 2), 'utf-8')

            // Limpiar SVGs previos
            const existingFiles = fs.readdirSync(cacheDir)
            for (const file of existingFiles) {
              if (file.startsWith('preview-') && file.endsWith('.svg')) {
                fs.unlinkSync(path.join(cacheDir, file))
              }
            }

            const relJsonPath = path.relative(rootDir, jsonPath)
            const svgPattern = path.join(cacheDir, 'preview-{p}.svg')
            const args = [
              'compile',
              '--root',
              rootDir,
              '--input',
              `data=${relJsonPath}`,
              '--input',
              `plantilla=${plantilla}`,
              '--input',
              `paper=${paper}`,
              engineTypstPath,
              svgPattern,
            ]

            await execFileAsync('typst', args)

            // Leer las páginas generadas
            const files = fs.readdirSync(cacheDir)
            const svgFiles = files
              .filter((f) => f.startsWith('preview-') && f.endsWith('.svg'))
              .sort((a, b) => {
                const numA = parseInt(a.replace('preview-', '').replace('.svg', ''), 10) || 0
                const numB = parseInt(b.replace('preview-', '').replace('.svg', ''), 10) || 0
                return numA - numB
              })

            const pages = svgFiles.map((f) => fs.readFileSync(path.join(cacheDir, f), 'utf-8'))

            return sendJson(res, 200, {
              ok: true,
              pages,
              totalPages: pages.length,
            })
          } catch (err: unknown) {
            const errorMsg =
              typeof err === 'object' && err !== null && 'stderr' in err
                ? String((err as { stderr: string }).stderr)
                : err instanceof Error
                  ? err.message
                  : String(err)

            return sendJson(res, 422, {
              ok: false,
              error: errorMsg,
            })
          }
        }

        // 3. Compilar a PDF para descarga
        if (url === '/api/typst/compile-pdf' && req.method === 'POST') {
          try {
            const rawBody = await readBody(req)
            const payload = JSON.parse(rawBody || '{}')
            const cvData = payload.data || {}
            const plantilla = payload.plantilla || cvData.plantilla || 'harvard'
            const paper = payload.paper || 'a4'

            const jsonPath = path.join(cacheDir, 'cv.json')
            fs.writeFileSync(jsonPath, JSON.stringify(cvData, null, 2), 'utf-8')

            const relJsonPath = path.relative(rootDir, jsonPath)
            const pdfPath = path.join(cacheDir, 'cv.pdf')
            const args = [
              'compile',
              '--root',
              rootDir,
              '--input',
              `data=${relJsonPath}`,
              '--input',
              `plantilla=${plantilla}`,
              '--input',
              `paper=${paper}`,
              engineTypstPath,
              pdfPath,
            ]

            await execFileAsync('typst', args)

            if (!fs.existsSync(pdfPath)) {
              throw new Error('No se generó el archivo PDF.')
            }

            const pdfBuffer = fs.readFileSync(pdfPath)
            res.writeHead(200, {
              'Content-Type': 'application/pdf',
              'Content-Disposition': 'attachment; filename="cv.pdf"',
              'Content-Length': pdfBuffer.length,
            })
            return res.end(pdfBuffer)
          } catch (err: unknown) {
            const errorMsg =
              typeof err === 'object' && err !== null && 'stderr' in err
                ? String((err as { stderr: string }).stderr)
                : err instanceof Error
                  ? err.message
                  : String(err)

            return sendJson(res, 422, {
              ok: false,
              error: errorMsg,
            })
          }
        }

        next()
      })
    },
  }
}
