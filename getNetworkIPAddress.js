const dns = require('dns')
const os = require('os')

let cachedResponse

module.exports = function getNetworkIPAddress() {
  return new Promise((resolve, reject) => {
    if (cachedResponse) {
      return resolve(cachedResponse)
    }
    dns.lookup(os.hostname(), (err, add, fam) => {
      if (err) reject(err)
      cachedResponse = add
      resolve(add)
    })
  })
}