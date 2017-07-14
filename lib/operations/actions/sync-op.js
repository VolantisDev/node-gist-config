const GistPacker = require('../../../../node-gist-packer')

module.exports = (config, data, meta, spinner) => {
    const gistPacker = GistPacker(config.get())
    const confirm = require('../../cli/confirm')
    const actions = require('./')(config, spinner)
    const state = require('../../state')(config)
    var bundles
    var operation

    spinner.text('Syncing configuration')

    return actions.readGist()
        .then(gistBundles => {
            bundles = gistBundles
            return actions.extractState(bundles)
        })
        .then(remoteState => {
            if (!remoteState) {
                throw new Error('Remote state could not be determined.')
            }

            spinner.text('Comparing meta data')
            return actions.generateState().then(gistPacker.packer.unpack)
                .then(localState => {
                    const cmp = state.compare(localState, remoteState)
                    operation = cmp ? 'upload' : (cmp < 0 ? 'download' : false)
                    return confirm.sync(config, localState, remoteState, operation)
                })
        })
        .then(confirmed => {
            if (confirmed) {
                spinner.text('Syncing data')
                        
                if (operation === 'upload') {
                    return actions.uploadOp(data, meta)
                        .then(() => data)
                } else if (operation === 'download') {
                    return actions.downloadOp()
                }
                return false
            } else {
                spinner.text('Not syncing data')
                throw new Error('User did not confirm sync operation')
            }
        })
        .catch(error => {
            spinner.fail('Failed syncing data')
            console.error(error)
            process.exit(1)
        })
}
