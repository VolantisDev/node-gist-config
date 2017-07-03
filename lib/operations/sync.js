const spnr = require('./spinner')
const meta = require('./meta')
const gist = require('./gist')
const confirm = require('./confirm')
const Promise = require('bluebird')
const inquirer = require('inquirer')

module.exports = sync

function initializeGist (config, data) {
    return new Promise((resolve, reject) => {
        if (config.get('gistId')) {
            return true
        }

        return require('./initialize')(config)
            .then(config => {
                return require('./create')(config, data)
            })
            .then(data => {
                return false
            })
            .catch(reject)
    })
}

function sync (config, localData) {
    var spinner
    var data
    var operation

    return initializeGist(config, localData)
        .then(continueSync => {
            if (!continueSync) {
                return localData
            }

            spinner = spnr('Determining gist id', config)
            return gist.download(config.get('gitHubToken'), id)
                .then(gistData => {
                    spinner.text('Extracting meta data')
                    data = gistData
                    return meta.extract(data)
                })
                .then(remoteMeta => {
                    spinner.text('Comparing meta data')
                    const localMeta = meta.build(config)
                    const cmp = meta.compare(localMeta, remoteMeta)
                    operation = cmp ? 'upload' : (cmp < 0 ? 'download' : false)

                    return confirm.sync(config, meta.build(config), remoteMeta, operation)
                })
                .then(confirmed => {
                    if (confirmed) {
                        spinner.text('Syncing data')
                        
                        if (operation === 'upload') {
                            return require('./upload')(config, localData)
                        } else if (operation === 'download') {
                            return require('./download')(config)
                        }
                        return data
                    } else {
                        spinner.fail('User canceled sync')
                        return false
                    }
                })
        })
        .catch(error => {
            if (spinner) spinner.fail('Failed to sync data with gist')
            console.error(error)
            return error
        })
}
