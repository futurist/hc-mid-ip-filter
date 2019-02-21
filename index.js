const requestIp = require('request-ip')
const isLocal = require('is-local-ip')
const {Netmask} = require('netmask')

function ipInRanges(arrMask, ip) {
  return arrMask.indexOf(ip) > -1 ||
    arrMask.some(mask=>new Netmask(mask).contains(ip));
}
// console.log(ipInRanges(['10.18', '10.8.8.10'], '10.8.8.10'))

// inside middleware handler
module.exports = (app, appConfig) => {
  const {
    allow = [],
    deny = []
  } = appConfig
  return (req, res, next) => {
    const ip = requestIp.getClientIp(req)
    let isValid = isLocal(ip) || !ipInRanges(deny, ip) && ipInRanges(allow, ip)
    if (isValid) {
      next()
    } else {
      console.log('invalid ip:', ip)
      let error = new Error('Forbidden')
      error.code = 403
      error.statusCode = 403
      next(error)
    }
  }
}
