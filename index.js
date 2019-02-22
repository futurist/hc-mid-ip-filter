const proxyaddr = require('proxy-addr')
const ipRegex = require('ip-regex')({
  includeBoundaries: true
})
const {
  Netmask
} = require('netmask')
const createError = require('http-errors')

function ipInRanges(arrMask, ip) {
  return arrMask.indexOf(ip) > -1 ||
    arrMask.some(mask => new Netmask(mask).contains(ip))
}

/**
 * Filter headers with value that contains ip
 * @param {object} headers req.headers
 * @returns {object} that contains only ip values
 */
function filterHeaders(headers) {
  const obj = {}
  for (let k in headers) {
    if (ipRegex.test(headers[k])) {
      obj[k] = headers[k]
    }
  }
  return obj
}

function getIp(req) {
  return proxyaddr.all(req)
    .filter(ip => ipRegex.test(ip))
}

// inside middleware handler
module.exports = (app, appConfig) => {
  const {
    allow = [],
    deny = [],
    code = 403,
    message
  } = appConfig
  return (req, res, next) => {
    const ips = getIp(req)
    let isValid = ips.some(ip => !ipInRanges(deny, ip) && ipInRanges(allow, ip))
    if (isValid) {
      next()
    } else {
      const ipHeaders = filterHeaders(req.headers)
      console.log('invalid ip:', ips, ipHeaders)
      let error = createError(code, Object.assign({
        code,
      }, message && {
        message: String(message)
          .replace(/\$\{ip\}/ig, ips)
          .replace(/\$\{headers\}/ig, JSON.stringify(ipHeaders))
      }))
      next(error)
    }
  }
}