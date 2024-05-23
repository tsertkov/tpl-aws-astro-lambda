import { Status } from '../../lib/services/status.mjs'

const status = new Status({
  region: process.env.AWS_REGION,
  env: process.env.ENV,
  version: process.env.VERSION,
})

/**
 * @returns {Promise<import('aws-lambda').APIGatewayProxyResultV2>}
 */
export async function handler() {
  return {
    statusCode: 200,
    headers: { 'content-type': 'application/json' },
    body: status.report(),
  }
}
