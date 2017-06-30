const Promise = require('bluebird')

module.exports = (config, data) => {
    return new Promise((resolve, reject) => {
        if (!config.gitHubToken) {
            return reject('Cannot generate a new gist ID without a GitHub auth token')
        }


    })
}
