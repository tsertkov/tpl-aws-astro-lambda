const { REG_NAME } = process.env
import { Status } from '../../lib/services/status.mjs'

const status = new Status({
  region: REG_NAME,
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
