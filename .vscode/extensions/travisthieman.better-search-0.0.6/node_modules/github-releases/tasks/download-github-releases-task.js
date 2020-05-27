var fs        = require('fs')
var path      = require('path')
var os        = require('os')
var minimatch = require('minimatch')
var GitHub    = require('../lib/github')

module.exports = function(grunt) {
  var taskName = 'download-github-releases'
  return grunt.registerTask(taskName, 'Download assets from GitHub Releases', function() {
    var done = this.async()

    var config = grunt.config(taskName)
    if (config.repo == null) {
      grunt.log.error('Repo must be specified')
    }

    var tag = config.tag != null ? config.tag : '*'
    var filename = config.filename != null ? config.filename : '*'
    var outputDir = config.outputDir != null ? config.outputDir : os.tmpdir()

    var github = new GitHub(config)
    return github.getReleases({tag_name: tag}, function(error, releases) {
      if (error != null) {
        grunt.log.error('Failed to get releases', error)
        return done(false)
      }

      if (releases.length < 0) {
        grunt.log.error('No specified releases is found')
        return done(false)
      }

      var count = 0
      var completed = 0
      var files = []
      var downloadDone = function() {
        ++completed
        if (count === completed) {
          grunt.config(`${taskName}.files`, files)
          return done(true)
        }
      }

      for (var release of Array.from(releases)) {
        (function(release) {
          return Array.from(release.assets).map((asset) =>
            (function(asset) {
              if (minimatch(asset.name, filename)) {
                ++count
                return github.downloadAsset(asset, function(error, inputStream) {
                  var outputPath = path.join(outputDir, asset.name)
                  inputStream.pipe(fs.createWriteStream(outputPath))
                  inputStream.on('error', function() {
                    grunt.log.error('Failed to download', asset.name)
                    return downloadDone()
                  })
                  return inputStream.on('end', function() {
                    files.push(outputPath)
                    return downloadDone()
                  })
                })
              }
            })(asset))
        })(release)
      }

      if (count === 0) {
        grunt.log.error('No matching asset is found')
        return done(false)
      }
    })
  })
}
