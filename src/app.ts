import express from 'express'
import 'express-async-errors'

import { fixedWindowRateLimiter } from './middlewares/fixedWindowRateLimiter'

const app = express()

app.use(fixedWindowRateLimiter({ windowSizeMinutes: 1, maxRequestCount: 10 }))

app.get('/', (req, res) => {
  res.send('hello world')
})

export default app
