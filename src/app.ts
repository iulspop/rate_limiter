import express from 'express'
import 'express-async-errors'

import { rateLimiter } from './middlewares/rateLimiter'

const app = express()

app.use(rateLimiter({ windowSizeMinutes: 1, maxRequestCount: 10 }))

app.get('/', (req, res) => {
  res.send('hello world')
})

export default app
