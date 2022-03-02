/*

Fixed Time Window

within closure => hash of IP adress
isWithinFixedWindow(ipAddress, reqTimestamp, currentTime) => true/false

rateLimiterMiddleware(req, res, next) => next() // accepted request || res.sendStatus(429) // too many requests

rateLimiter({ windowSizeMinutes, maxRequestCount }) => rateLimiterMiddleware

*/

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

export function calculateMillisecondsToTopOfHour(currentTime: Date): number {
  const topOfHour = roundDateToTopOfMinute(currentTime)
  return topOfHour.getTime() - currentTime.getTime()
}

export function makeIsWithinFixedWindow(windowSizeMinutes: number, maxRequestCount: number) {
  let ipAddresses: { [key: string]: number } = {}

  const clearIpAddresses = () => {
    ipAddresses = {}
  }

  const millisecondsToTopOfHour = calculateMillisecondsToTopOfHour(new Date())
  setTimeout(() => {
    clearIpAddresses()
    const windowIntervalInMilliseconds = windowSizeMinutes * 60 * 1000
    setInterval(() => {
      clearIpAddresses()
    }, windowIntervalInMilliseconds)
  }, millisecondsToTopOfHour)

  return (ipAddress: string, currentTime: Date): boolean => {
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

export function rateLimiter({
  windowSizeMinutes,
  maxRequestCount,
}: {
  windowSizeMinutes: number
  maxRequestCount: number
}) {
  const isWithinFixedWindow = makeIsWithinFixedWindow(windowSizeMinutes, maxRequestCount)

  return (req: Request, res: Response, next: NextFunction): void => {
    const ipAddress = req.ip
    const currentTime = new Date()
    isWithinFixedWindow(ipAddress, currentTime) ? next() : res.sendStatus(429)
  }
}
