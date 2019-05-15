# `octokit-plugin-ghes-warnings`

> Octokit plugin that will generate warnings when accessing GitHub REST APIs that are not available on a given GitHub Enterprise Server version

## Installation

```bash
npm i octokit-plugin-ghes-warnings
```

## Usage

```javascript
// Configure Octokit to use the plugin
const Octokit = require('@octokit/rest')
  .plugin([
    require('octokit-plugin-ghes-warnings'),
  ])
```


## Demo

See [the included `demo.js`](demo.js) for a demonstration of the plugin.
