const zlib = require("zlib")
const HEADER_NORMALIZED = "x-yakbak-tape-normalized"

function decompressBuffers(buffersArr) {
  const totalLength = buffersArr.reduce((acc, buffer) => {
    return acc + buffer.length
  }, 0)
  
  const allBuffers = Buffer.concat(buffersArr, totalLength)
  return zlib.gunzipSync(allBuffers)
}

function buildResponse() {
  let buffers = ''
  let buffersArr = []
  let statusCode = 200
  let headers = {}
  let fnAsString = ''
  let decompressResponse = false

  return {
    get fnAsString () {
      return fnAsString
    },
    set statusCode (code){
      statusCode = code
    },
    setHeader: (key, value) => {
      headers[key] = value
      if (key==="content-encoding" && value==="gzip") {
        decompressResponse = true
      }
    },
    write: (newBuffer) => {
      if (decompressResponse) {
        buffersArr.push(newBuffer)
      } else {
        buffers += newBuffer.toString()
      }
    },
    end: () => {
      const shouldOverwriteFile = !!!headers[HEADER_NORMALIZED]
      let decodedResponse

      if (decompressResponse) {
        decodedResponse = decompressBuffers(buffersArr)
      } else {
        decodedResponse = buffers
      }
      
      // Add header "normalized"
      if (!shouldOverwriteFile) return

      headers[HEADER_NORMALIZED] = "true"
      
      let response = decodedResponse
      try {
        const jsonParsedObj = JSON.parse(decodedResponse)
        response = JSON.stringify(jsonParsedObj, null, 2)
      } catch (err) {}

      fnAsString = buildFunction(statusCode, headers, response)
    },
  }
}

function buildFunction(statusCode, headers, response) {
  delete headers["content-length"]
  delete headers["content-encoding"]

  const headersLines = Object.keys(headers)
    .map((key) => {
      return `  res.setHeader("${key}", \`${headers[key]}\`);`
    })
    .join('\n')

  return `module.exports = function (req, res) {
${headersLines}

  res.statusCode = ${statusCode};

  const response = \`${response}\`

  res.write(response);
  res.end();

  return __filename;
};`
}

module.exports = buildResponse