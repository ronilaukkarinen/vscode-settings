var request = require('request')
var Filters = require('./filters')

class GitHub extends Filters {
  // Public: Creates a {GitHub} object for given {repo} with optional {token}.
  constructor({user, repo, token}) {
    super()
    this.token = token
    if (user)
      this.repo = `${user}/${repo}`
    else
      this.repo = repo
  }

  // Public: List all releases of the repo which matches the {filter}.
  getReleases(filter, callback) {
    if (!callback) {
      callback = filter
      filter = {}
    }

    var urlPath = 'releases'
    var responseIsArray = true

    if (filter.tag_name != null) {
      urlPath += `/tags/${filter.tag_name}`
      responseIsArray = false
    }

    this.callRepoApi(urlPath, (error, releases) => {
      if (error)
        return callback(error)
      if (!responseIsArray)
        releases = [releases]
      callback(null, this.filter(releases, filter))
    })
  }

  // Public: Download the {asset}.
  //
  // The {callback} would be called with the downloaded file's {ReadableStream}.
  downloadAsset(asset, callback) {
    this.downloadAssetOfUrl(asset.url, callback)
  }

  // Private: Download the asset of {url}.
  //
  // The {callback} would be called with the downloaded file's {ReadableStream}.
  downloadAssetOfUrl(url, callback) {
    var inputStream = request(this.getDownloadOptions(url))
    inputStream.on('response', response => {
      // Manually handle redirection so headers would not be sent for S3.
      if (response.statusCode === 302) {
        return this.downloadAssetOfUrl(response.headers.location, callback)
      } else if (response.statusCode !== 200) {
        return callback(new Error(`Request failed with code ${response.statusCode}`))
      }

      callback(null, response)
    })
  }

  // Private: Call the repos API.
  callRepoApi(path, callback) {
    var options = {
      url: `https://api.github.com/repos/${this.repo}/${path}`,
      proxy: process.env.http_proxy || process.env.https_proxy,
      headers: {
        accept: 'application/vnd.github.manifold-preview',
        'user-agent': 'node-github-releases/0.1.0'
      }
    }

    // Set access token.
    if (this.token)
      options.headers.authorization = `token ${this.token}`

    request(options, function(error, response, body) {
      if (error)
        return callback(error)
      var data = JSON.parse(body)
      if (response.statusCode !== 200)
        error = new Error(data.message)
      callback(error, data)
    })
  }

  // Private: Get the options for downloading asset.
  getDownloadOptions(url) {
    var options
    var isGitHubUrl = require('url').parse(url).hostname === 'api.github.com'

    // Only set headers for GitHub host, the url could also be a S3 link and
    // setting headers for it would make the request fail.
    var headers =
      isGitHubUrl ?{
        accept: 'application/octet-stream',
        'user-agent': 'node-github-releases/0.1.0'
      }
      :
        {}

    // Set access token.
    if (isGitHubUrl && (this.token != null)) { headers.authorization = `token ${this.token}` }

    return {
      url: url,
      // Do not follow redirection automatically, we need to handle it carefully.
      followRedirect: false,
      proxy: process.env.http_proxy || process.env.https_proxy,
      headers: headers
    }
  }
}

module.exports = GitHub
