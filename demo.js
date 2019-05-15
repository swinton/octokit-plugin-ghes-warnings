// Log warnings
const log = require('console-log-level')({ level: 'warn' })

// Configure Octokit to use the plugin
const Octokit = require('@octokit/rest')
  .plugin([
    require('.'),
  ])

const octokit = new Octokit({
  auth: `token ${process.env.GITHUB_TOKEN}`,
  log,
  ...process.env.GHE_HOST && {baseUrl: `https://${process.env.GHE_HOST}/api/v3`}
})

// Get interaction restrictions for a repository
const getRestrictionsForRepo = async ({owner, repo}) => {
  return octokit.interactions.getRestrictionsForRepo({
      owner,
      repo
    })
}

if (require.main === module) {
  (async () => {
    const [ owner, repo ] = ['swinton', 'public']
    console.log(await getRestrictionsForRepo({ owner, repo }))
  })();
}
