const fs = require('fs')
const http = require('http')
const chokidar = require('chokidar')
const yakbak = require('yakbak')
const normalizeTape = require('./normalizeTape.js')
const configs = require('./config.js')
const getNetworkIPAddress = require('./getNetworkIPAddress.js')

let server

function startServer(domain) {
  let _domain = domain || configs.domain

  const start = () => {
    const middleware = yakbak(_domain, configs.tapesPath)

    getNetworkIPAddress()
    .then((ipAddress) => {
      server = http
        .createServer(middleware)
        .listen(configs.serverPort)
        
      console.log(`Started server on [ ${ipAddress}:${configs.serverPort} ] proxying requests to [ ${_domain} ]`)
    })

  }

  if (server) {
    server.close()
    start()
  } else {
    start()
  }
}

function start(domain) {
  chokidar.watch(configs.watcherPath, configs.watcher)
    .on('add', (path) => {
      normalizeTape(`./${path}`)
    })
    .on('change', () => {
      console.log('');
      process.send({type:"CMD", value:"RESTART"});
    })

  startServer(domain)
}

module.exports = {
  start
}