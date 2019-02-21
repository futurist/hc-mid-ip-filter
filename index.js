const requestIp = require('request-ip')
const isLocal = require('is-local-ip')
const {
  Netmask
} = require('netmask')
const createError = require('http-errors')

function ipInRanges(arrMask, ip) {
  return arrMask.indexOf(ip) > -1 ||
    arrMask.some(mask => new Netmask(mask).contains(ip));
}

// inside middleware handler
module.exports = (app, appConfig) => {
  const {
    allow = [],
    deny = [],
    code = 403
  } = appConfig
  return (req, res, next) => {
    const ip = requestIp.getClientIp(req)
    let isValid = isLocal(ip) || !ipInRanges(deny, ip) && ipInRanges(allow, ip)
    if (isValid) {
      next()
    } else {
      console.log('invalid ip:', ip)
      let error = createError(code, {
        code
      })
      next(error)
    }
  }
}