const spnr = require('../spinner')
const confirm = require('../cli/confirm')
const GistPacker = require('../../../node-gist-packer')

module.exports = upload

function upload (config, data) {
    // If there is no gist ID, create instead of uploading
    if (!config.get('gistId')) {
        return require('./create')(config, data)
    }

    const gistPacker = GistPacker(config)
    const state = require('../state')(config)
    var stateBundle

    const spinner = spnr('Downloading existing data', config)

    return gistPacker.gist
        .readGist()
        .then(gistBundles => {
            spinner.text('Extracting existing state data')
            return state.extract(gistBundles)
        })
        .then(remoteState => {
            spinner.text('Comparing state data')
            return state
                .generate()
                .then(localState => {
                    stateBundle = localState
                    return confirm.upload(config, localState, remoteState)
                })
        })
        .then(confirmed => {
            if (confirmed) {
                spinner.text('Generating bundle(s)', config)
                gistPacker.packer.pack(data)
                    .then(packedBundles => {
                        packedBundles.push(stateBundle)
                        return packedBundles
                    })
                    .then(bundles => {
                        spinner.text('Uploading bundles to gist')
                        return gistPacker.gist.updateGist(bundles)
                    })
                    .then(id => {
                        spinner.succeed('Successfully uploaded data')
                        return id
                    })
            } else {
                spinner.fail('User canceled upload')
                return false
            }
        })
        .catch(error => {
            spinner.fail('Failed to upload data')
            return error
        })
}
