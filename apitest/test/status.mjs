import { describe, it, before } from 'node:test'
import assert from 'node:assert/strict'

const {
  API_URL,
  ENV,
  VERSION,
} = process.env

describe(`Api url: ${API_URL} (env: ${ENV}, version: ${VERSION})`, () =>
  describe('/status', () => {
    const endpoint = `${API_URL}/statusz`
    let response

    describe('with supported request method', () => {
      before(async () => {
        response = await fetch(endpoint)
      })

      it('should return 200', () => {
        assert.equal(response.status, 200)
      })

      it('should return JSON', () => {
        const contentType = response.headers.get('content-type')
        assert.equal(contentType, 'application/json')
      })
    })

    describe('with extra final slash added', () => {
      before(async () => {
        response = await fetch(`${endpoint}/`)
      })

      it('should return 404', () => {
        assert.equal(response.status, 404)
      })
    })

    describe('with unsupported request method', () => {
      before(async () => {
        response = await fetch(endpoint, {
          method: 'POST',
        })
      })

      it('should return 404', () => {
        assert.equal(response.status, 404)
      })
    })
  }))
