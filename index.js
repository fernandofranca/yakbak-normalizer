const cluster  = require('cluster')
var tapeWorker = require('./worker.js')
let worker

function launch() {
  if (cluster.isMaster) {
    forkNewWorker()
  } else {
    tapeWorker.start(process.argv[2])
  }
}

function forkNewWorker() {
  const _forkNewWorker = () => {
    worker = cluster.fork()

    worker.process.on('message', (msg) => {
      if (msg.type==="CMD" && msg.value==="RESTART"){
        forkNewWorker()
        return
      }
    })
  }

  if (worker) {
    worker.process.removeAllListeners('message'); // remove worker process listeners to prevent "Error: IPC channel is already disconnected"

    // Waits for the exit event before forking a new worker
    worker.once('exit', (code, signal) => {
      _forkNewWorker()
    })

    try{
      worker.disconnect()
      worker.kill()
    } catch(err){ console.log(err) }

    return
  }

  _forkNewWorker()
}

launch()