Fixed Window:

- track by IP address
- for each request we check if IP exists
  - either create counter
  - or increment existing counter (but only if < 100)
- wipe all logs every hour (aka delete the hash)

IP Address : Request Count since last widnow
{
"192.168.0.1": 1
}

Sliding Log:

- track by IP address
- for every request

  - check if IP exists
    - create new array for timestamps & add to array
  - else
    - calculate the relative cutoff time (present time - window size)
    - count backwards from most recent until we reach idx 0 or cross cutoff time
      - if cross cutoff time, also purge everything after (slice it)
    - track the timestamp or well deny

- run independently: maybe periodically purge if the newest (last) request is older than 1 hour ago

{
"192.168.0.1": [
"timestamp",
"timestamp",
]
}

Sliding Window:

- track by IP address
- for every request
  - check if IP exists
    - take current time, floor it to nearest division (flooredTime becomes our key)
    - run CALCULATE IF ACCEPT
  - else
    - create new bucket and accept

CALCULATE IF ACCEPT
init the relative cutoff time
init totalCount
iterater over time divisions from most recent to oldest
  - if timestamp < cutoff time (aka current is older) {
      delete that division and all divisions before
      add new request
      accept
    }
  - count up total count
  - if totalCount >= maxRequestsInWindow {
      delete all divisions before current (aka 0 to current-1)
      deny
    }
if we reach end of iteration, add new request & accept



block for every division in window size (ex 60 divisions of 1 min for 1h window, MAX 100 requests in window)

request timestamp => floor it to nearest increment
"11:02"
"11:15"
"12:00"
timestamp rounded down

{
  IP address: [
    { flooredTimestamp: countNum }
    [flooredTimestamp, count]
    { timestamp: "10:20", count: 15 }
    { timestamp: "11:01", count: 5 }
    { timestamp: "11:02", count: 10 }
    { timestamp: "11:22", count: 40 }
    { timestamp: "11:42", count: 40 }
    { timestamp: "11:59", count: 5 }
  ]
}

current 12:01, window 60 min, 1 min divisiions, 100 max
cutoff  11:01
