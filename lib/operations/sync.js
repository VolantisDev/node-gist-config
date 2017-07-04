const Promise = require('bluebird')
const spnr = require('../spinner')
const confirm = require('../cli/confirm')
const GistPacker = require('../../../node-gist-packer')

module.exports = sync

function initializeGist (config, data) {
    return new Promise((resolve, reject) => {
        if (config.get('gistId')) {
            return true
        }

        return require('../cli/initialize')(config)
            .then(config => require('../operations/create')(config, data))
            .then(data => {
                return false
            })
            .catch(reject)
    })
}

function sync (config, localData) {
    const gistPacker = GistPacker(config)
    const state = require('../state')(config)
    var spinner
    var bundles
    var operation

    return initializeGist(config, localData)
        .then(continueSync => {
            if (!continueSync) {
                return localData
            }

            spinner = spnr('Downloading existing data', config)
            return gistPacker.gist.readGist()
                .then(gistBundles => {
                    spinner.text('Extracting existing state data')
                    bundles = gistBundles
                    return state.extract(bundles)
                })
                .then(remoteState => {
                    spinner.text('Comparing meta data')
                    const localState = state.generate()
                    const cmp = state.compare(localState, remoteState)
                    operation = cmp ? 'upload' : (cmp < 0 ? 'download' : false)
                    return confirm.sync(config, localState, remoteState, operation)
                })
                .then(confirmed => {
                    if (confirmed) {
                        spinner.text('Syncing data')
                        
                        if (operation === 'upload') {
                            return require('./upload')(config, localData)
                        } else if (operation === 'download') {
                            return require('./download')(config)
                        }
                        return false
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
