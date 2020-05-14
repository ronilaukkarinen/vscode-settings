var fs         = require('fs')
var optimist   = require('optimist')
var prettyjson = require('prettyjson')
var minimatch  = require('minimatch')
var GitHub     = require('./github')

var options = optimist
  .usage('Usage: github-releases [--tag==<tag>] [--pre] [--filename=<filename>] [--token=<token>] <command> <repo>')
  .alias('h', 'help').describe('help', 'Print this usage message')
  .string('token').describe('token', 'Your GitHub token')
  .string('tag').describe('tag', 'The tag of the release')
  .boolean('pre').describe('pre', 'Is the release a pre-release')
                 .default('pre', false)
  .string('filename').describe('filename', 'The filename of the asset')
                     .default('filename', '*')

var print = function(error, result) {
  if (error != null) {
    var message = error.message != null ? error.message : error
    return console.error(`Command failed with error: ${message}`)
  } else {
    return console.log(prettyjson.render(result))
  }
}

var run = function(github, command, argv, callback) {
  switch (command) {
    case 'list':
      var filters = {}
      if (argv.tag != null) { filters.tag_name = argv.tag }
      filters.prerelease = argv.pre
      return github.getReleases(filters, callback)

    case 'show':
      return run(github, 'list', argv, function(error, releases) {
        if (error != null) { return callback(error) }
        if (releases.length === 0) { return callback(new Error("No matching release can be found")) }
        return callback(null, releases[0])
    })

    case 'download':
      return run(github, 'show', argv, function(error, release) {
        if (error != null) { return callback(error) }
        return Array.from(release.assets).filter((asset) => (asset.state === 'uploaded') && minimatch(asset.name, argv.filename)).map((asset) =>
          (function(asset) {
            return github.downloadAsset(asset, function(error, stream) {
              if (error != null) { return console.error(`Unable to download ${asset.name}`) }
              return stream.pipe(fs.createWriteStream(asset.name))
            })
          })(asset))
      })

    case 'download-all':
      return run(github, 'list', argv, function(error, releases) {
        if (error != null) { return callback(error) }
        return Array.from(releases).map((release) =>
          (function(release) {
            return Array.from(release.assets).filter((asset) => (asset.state === 'uploaded') && minimatch(asset.name, argv.filename)).map((asset) =>
              (function(asset) {
                return github.downloadAsset(asset, function(error, stream) {
                  if (error != null) { return console.error(`Unable to download ${asset.name}`) }
                  return stream.pipe(fs.createWriteStream(asset.name))
                })
              })(asset))
          })(release))
      })

    default:
      return console.error(`Invalid command: ${command}`)
  }
}

var argv = options.argv
if ((argv._.length < 2) || argv.h) {
  return options.showHelp()
}

var command = argv._[0]
var github = new GitHub({repo: argv._[1], token: argv.token})
run(github, command, argv, print)
