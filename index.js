const routesDotCom = require('@octokit/routes/routes/api.github.com')
const routesGHES216 = require('@octokit/routes/routes/ghe-2.16')
const routesGHES215 = require('@octokit/routes/routes/ghe-2.15')
const routesGHES214 = require('@octokit/routes/routes/ghe-2.14')

// Build 'index' of api.github.com routes key'd by path
const routesDotComByPath = {}

// Iterate over each api.github.com namespace, e.g. 'repos`
Object.keys(routesDotCom).forEach(namespace => {

  // Extract idName, method and path for each route within namespace
  // E.g. 'get', GET', '/repos/:owner/:repo'
  routesDotCom[namespace].forEach(({ idName, method, path }) => {

    // Add to 'routesDotComByPath' index so we can validate existence
    // of equivalent namespace.apiName for GitHub Enterprise Server
    routesDotComByPath[path] = routesDotComByPath[path] || {}
    routesDotComByPath[path][method] = {
      namespace,
      idName
    }
  })
})

// Build 'index' of ghe-2.16 routes key'd by idName
const routesGHES216ByIdName = {}

// Iterate over each ghe-2.16 namespace, e.g. 'repos`
Object.keys(routesGHES216).forEach(namespace => {
  routesGHES216[namespace].forEach(({ idName, method, path }) => {
    routesGHES216ByIdName[namespace] = routesGHES216ByIdName[namespace] || {}
    routesGHES216ByIdName[namespace][idName] = {
      method,
      path
    }
  })
})

module.exports = (octokit, options = { version: 'ghe-2.16' }) => {
  // check if this request is matched by a ghe-2.16 route
  octokit.hook.before('request', async (options) => {
    try {
      const { namespace, idName } = routesDotComByPath[options.url][options.method]

      // We should warn if either the namespace or idName doesn't exist on GitHub Enterprise Server 2.16
      const warn = typeof routesGHES216ByIdName[namespace] === 'undefined' ||
        typeof routesGHES216ByIdName[namespace][idName] === 'undefined'

      if (warn) {
        const warning = new Error(`Warning: "${options.method} ${options.url}" is not a valid API route on GitHub Enterprise Server 2.16`)

        octokit.log.warn(warning)
      }  
    } catch (e) {
      // Log the error
      octokit.log.error(e)
    }
  })
}
