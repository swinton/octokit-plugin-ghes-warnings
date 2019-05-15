const routesDotCom = require('@octokit/routes/routes/api.github.com')
const routesGHES216 = require('@octokit/routes/routes/ghe-2.16')
const routesGHES215 = require('@octokit/routes/routes/ghe-2.15')
const routesGHES214 = require('@octokit/routes/routes/ghe-2.14')

const buildIndex = function(source, callback) {
  const index = {}
  Object.keys(source).forEach(namespace => {
    Object.assign(index, source[namespace].map(callback), ...index)
  })
  return index
}

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


module.exports = (octokit, options = { version: 'ghe-2.16' }) => {
  // hook into the request lifecycle
  octokit.hook.before('request', async (options) => {
    octokit.log.info(routesDotComByPath[options.url][options.method])
  })
}

if (require.main === module) {
  console.log(routesDotComByPath['/repos/:owner/:repo/interaction-limits'])
}
