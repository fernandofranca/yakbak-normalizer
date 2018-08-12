const glob = require("glob")
const normalizeTape = require('./normalizeTape.js')

const tapesPath = './tapes/'

glob(`${tapesPath}*.js`, {}, function (er, files) {
  startWithFileList(files)
})

function startWithFileList(files) {
  files.forEach((file) => {
    normalizeTape(file)
  })
}