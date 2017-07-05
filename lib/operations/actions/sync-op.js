module.exports = (config, data, spinner) => {
    const confirm = require('../../cli/confirm')
    const actions = require('./')(config, spinner)
    var bundles
    var operation

    spinner.text('Syncing configuration')

    return actions.readGist()
        .then(gistBundles => {
            bundles = gistBundles
            return actions.extractState(bundles)
        })
        .then(remoteState => {
            spinner.text('Comparing meta data')
            return actions
                .generateState()
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
                    return actions.uploadOp(data)
                        .then(() => data)
                } else if (operation === 'download') {
                    return actions.downloadOp()
                }
                return false
            } else {
                spinner.text('Not syncing data')
                return false
            }
        })
        .catch(error => {
            spinner.fail('Failed syncing data')
            console.error(error)
            process.exit(1)
        })
}
