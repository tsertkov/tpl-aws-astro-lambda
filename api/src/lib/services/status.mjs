/**
 * Service status
 */
export class Status {
  /**
   * @param {Object} registry
   */
  constructor(registry) {
    this.registry = registry
  }

  /**
   * Get multiple services by name
   * @returns {Object} key-value pairs of services
   */
  report() {
    return JSON.stringify({
      ...this.registry,
      status: 'ok',
    })
  }
}
