import { Request, Response, NextFunction } from 'express'

export function roundDateToTopOfHour(currentTime: Date): Date {
  currentTime = new Date(currentTime.getTime())
  currentTime.setHours(currentTime.getHours() + Math.round(currentTime.getMinutes() / 60))
  currentTime.setMinutes(0, 0, 0)
  return currentTime
}

export function roundDateToTopOfMinute(currentTime: Date): Date {
  currentTime = new Date(currentTime.getTime())
  currentTime.setMinutes(currentTime.getMinutes() + 1)
  return currentTime
}

export function calculateMillisecondsToTopOfMiniute(currentTime: Date): number {
  const topOfMinute = roundDateToTopOfMinute(currentTime)
  return topOfMinute.getTime() - currentTime.getTime()
}

export function makeIsWithinFixedWindow(windowSizeMinutes: number, maxRequestCount: number) {
  let ipAddresses: { [key: string]: number } = {}

  const clearIpAddresses = () => {
    ipAddresses = {}
  }

  const millisecondsToTopOfMinute = calculateMillisecondsToTopOfMiniute(new Date())
  setTimeout(() => {
    clearIpAddresses()
    const windowIntervalInMilliseconds = windowSizeMinutes * 60 * 1000
    setInterval(() => {
      clearIpAddresses()
    }, windowIntervalInMilliseconds)
  }, millisecondsToTopOfMinute)

  return (ipAddress: string): boolean => {
    if (ipAddresses[ipAddress]) {
      if (ipAddresses[ipAddress] < maxRequestCount) {
        ipAddresses[ipAddress]++
        return true
      } else {
        return false
      }
    } else {
      ipAddresses[ipAddress] = 1
      return true
    }
  }
}

export function fixedWindowRateLimiter({
  windowSizeMinutes,
  maxRequestCount,
}: {
  windowSizeMinutes: number
  maxRequestCount: number
}) {
  const isWithinFixedWindow = makeIsWithinFixedWindow(windowSizeMinutes, maxRequestCount)

  return (req: Request, res: Response, next: NextFunction): void => {
    const ipAddress = req.ip
    isWithinFixedWindow(ipAddress) ? next() : res.sendStatus(429)
  }
}
