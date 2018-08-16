module.exports = {
  domain: 'https://api.flickr.com',
  serverPort: 3000,
  yakbak: { 
    dirname: `${__dirname}/tapes`,
    hash: (req, body) => {
      const url = req.url.split("/").join("|")
      const method = req.method
      return `${url}[${method}]`
    }
  },
  watcherPath: './tapes/',
  watcher: { 
    persistent: true,
    ignoreInitial: true
  },
}