const fs = require("fs")
const buildResponse = require('./buildResponse.js')

function normalizeTape(file) {
  let tape = require(file)
  let fileContent = fs.readFileSync(file, {encoding:'utf8'})

  const skipFile = fileContent.indexOf('x-yakbak-tape-normalized') > -1
  if (skipFile) return

  const contentAboveCode = fileContent.substr(0, fileContent.indexOf('module.exports'))
  const res = buildResponse()
  tape({}, res)
  const newCodeContent = res.fnAsString
  const newContent = `${contentAboveCode}${newCodeContent}`
  console.log("√ Normalized file:", file);

  fs.writeFileSync(file, newContent, {encoding: 'utf8'})
}

module.exports = normalizeTape