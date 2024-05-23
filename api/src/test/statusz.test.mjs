import { describe, it, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import { createImportHandler } from './lib/create-import-handler.mjs'

const defaultEnv = {
  REGION: 'eu-central-1',
}

const importStatusHandler = createImportHandler('statusz', defaultEnv)
describe('status handler', () => {
  let handler
  let response

  beforeEach(async () => {
    handler = await importStatusHandler()
    response = await handler({})
  })

  it('should return 200', () => {
    assert.equal(response.statusCode, 200)
  })

  it('should return application/json', () => {
    assert.equal(response.headers['content-type'], 'application/json')
  })

  it('should return region', () => {
    const body = JSON.parse(response.body)
    assert.equal(body.region, defaultEnv.REGION)
  })

  it('should return version', () => {
    const body = JSON.parse(response.body)
    assert.equal(body.version, 'local')
  })

  it('should return env', () => {
    const body = JSON.parse(response.body)
    assert.equal(body.env, 'local')
  })
})
