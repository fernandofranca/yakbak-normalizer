module.exports = {
  domain: 'https://api.flickr.com',
  serverPort: 3000,
  tapesPath: { dirname: `${__dirname}/tapes` },
  watcherPath: './tapes/',
  watcher: { 
    persistent: true,
    ignoreInitial: true
  },
}