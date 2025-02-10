import app from './app.js'
import { readdir, stat as getStat } from 'node:fs/promises'
import { join, parse } from 'path'
import 'dotenv/config'

const routeFolder = process.env.ROUTE_FOLDER ?? ''
const path = join(process.cwd(), routeFolder)

const allowedHttpMethods = [
  'GET',
  'POST',
  'PUT',
  'DELETE'
]

try {
  const files = (await readdir(path, {
    recursive: true
  }))

  const noDirectories = await filterDirectories(files)
  const onlyRouteFiles = await filterNonRouteFiles(noDirectories)
  
  for (const file of onlyRouteFiles) {
    const exported = await import('./' + join(routeFolder, file))
    const route = parse(file).dir
    const methods = Object.keys(exported)

    methods
      .filter(m => allowedHttpMethods.includes(m))
      .forEach(method => {
        const option = selectOption(method).bind(app)
        
        option(`/${route}`, async (req, res, next) => {
          const response = await exported[method](req, res, next)

          res.status(response.code ?? 200).send(response)
        })
      })
  }
} catch (err) {
  console.error(err)
}

async function filterDirectories (files: string[]) {
  const passed = []
  for (const file of files) {
    const stat = await getStat(join(path, file))
    if (!stat.isDirectory()) {
      passed.push(file)
    }
  }
  return passed
}

async function filterNonRouteFiles (files: string[]) {
  const passed = []
  for (const file of files) {
    const parsed = parse(file)
    if (parsed.name == 'route') {
      passed.push(file.split('.')[0].concat('.js'))
    }
  }
  return passed
}

function selectOption (method: string) {
  switch (method) {
    case 'GET' : return app.get
    case 'POST': return app.post
    case 'PUT': return app.put
    case 'DELETE': return app.delete
    default: return app.get
  }
}

const port = process.env.PORT
app.listen(port, () => {
  console.log(`Server listening at: http://localhost:${port}`)
})