export function createImportHandler(lambdaName, defaultEnv = {}) {
  return async (env = {}) => {
    Object.assign(process.env, defaultEnv, env)

    const modulePath = `../../lambdas/${lambdaName}/index.mjs`
    /** @type {Record<string, any>} */
    const module = await import(modulePath + '?' + Date.now())
    if (!module.handler) throw new Error('No handler found in ' + modulePath)
    return module.handler
  }
}
