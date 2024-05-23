import { defineConfig } from 'astro/config'
import robotsTxt from 'astro-robots-txt'
import compress from 'astro-compress'
import config from '../../config.json'

// environment aware configuration
const ENV = process.env.ENV || 'stg'
const VERSION = process.env.VERSION || 'dev'
const domain = config[ENV]?.domain?.name || config.default.domain.name
const apiDomain = `api.${domain}`
const apiUrl = `https://${apiDomain}`

const robotsConfig =
  ENV === 'prd'
    ? {
        sitemap: false,
        policy: [
          {
            userAgent: '*',
            allow: '/',
          },
        ],
      }
    : {
        sitemap: false,
        policy: [
          {
            userAgent: '*',
            disallow: '/',
          },
          {
            userAgent: 'Googlebot',
            disallow: '/',
          },
        ],
      }

// https://astro.build/config
export default /** @type {import('astro').AstroUserConfig} */ defineConfig({
  build: {
    format: 'file',
    assets: '_assets',
  },
  custom: {
    env: ENV,
    version: VERSION,
    apiUrl: apiUrl,
  },
  site: import.meta.env.DEV ? 'http://localhost:4321' : `https://${domain}`,
  integrations: [
    robotsTxt(robotsConfig),
    compress({
      HTML: false,
    }),
  ],
})
