import { defineConfig } from 'cypress'

// NB! using readFileSync instead of import since eslint does not suport
// import with. Once it does, update the code below accordingly.
// import config from '../config.json' with { type: 'json' }

import { readFileSync } from 'fs'
const config = JSON.parse(readFileSync('../config.json', 'utf8'))

const ENV = process.env.ENV
const DOMAIN = process.env.DOMAIN

if (!DOMAIN) {
  throw new Error('Missing DOMAIN environment variable')
}

export default defineConfig({
  e2e: {
    baseUrl: `https://${DOMAIN}`,
    env: {
      ENV,
      DOMAIN,
      BASIC_AUTH: config[ENV]?.basicAuth || config.default.basicAuth,
      BASIC_AUTH_USERNAME: config[ENV]?.basicAuthUsername || config.default.basicAuthUsername,
      BASIC_AUTH_PASSWORD: config[ENV]?.basicAuthPassword || config.default.basicAuthPassword,
    },
    setupNodeEvents() {
      // implement node event listeners here
    },
  },
})
