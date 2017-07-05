module.exports = (config, data, spinner) => {
    const confirm = require('../../cli/confirm')
    const actions = require('./')(config, spinner)
    var stateBundle

    spinner.text('Uploading configuration configuration')

    return actions
        .readGist()
        .then(actions.extractState)
        .then(remoteState => {
            spinner.text('Comparing state data')
            return actions
                .generateState()
                .then(localState => {
                    stateBundle = localState
                    spinner.text('Comparing state data')
                    return confirm.upload(config, localState, remoteState)
                })
        })
        .then(confirmed => {
            if (confirmed) {
                return actions
                    .packData(data)
                    .then(packedBundles => {
                        packedBundles.push(stateBundle)
                        return packedBundles
                    })
                    .then(actions.updateGist)
            } else {
                spinner.text('Not uploading data')
                return false
            }
        })
        .catch(error => {
            spinner.fail('Failed uploading data')
            console.error(error)
            process.exit(1)
        })
}
