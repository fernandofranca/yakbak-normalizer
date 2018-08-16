# yakbak-normalizer

## What
A Node.js Yakbak/VCR server with convenient settings.

It records, rewrites and decompress the generated tapes as human readable strings.

## Why
Human readable files are more convenient than encoded ones. 

You can simply edit the generated strings and manipulate responses as desired.

## How
- Clone the project
- Edit `./configs.js`
- Start it `node index https://your-domain.tld`
- Fire any request at `localhost:3000`
- Edit the generated files at `/tapes` directory
- The server will restart automatically after any "tape" updates
