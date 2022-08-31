import express, { NextFunction, Request, Response } from 'express'
import path from 'path'

import { Filesrocket } from '@filesrocket/core'
import { LocalService } from '@filesrocket/local'

const app = express()
// 1. Initialize filesrocket.
const filesrocket = new Filesrocket()

// 2. Configure your service.
const service = new LocalService({
  pagination: {default: 15, max: 50},
  host: 'http://localhost:3000',
  directory: 'uploads',
})

// 3. Register the service.
filesrocket.register('local', service)

// 4: Register endpoints
const controller = filesrocket.controller('local')

// Create/Upload files.
app.post('/files', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const files = await controller?.create(req, {})
    res.status(200).json(files)
  } catch (error) {
    next(error)
  }
})

// List files.
app.get('/files', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const files = await controller?.list({})
    res.status(200).json(files)
  } catch (error) {
    next(error)
  }
})

// Static files
app.use('/uploads', express.static(path.resolve('uploads')))

app.listen(3000, () => {
  console.log('Server running on port 3000');
})