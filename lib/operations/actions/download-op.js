module.exports = (config, spinner) => {
    const confirm = require('../../cli/confirm')
    const actions = require('./')(config, spinner)
    var bundles

    spinner.text('Generating gist-config state bundle')

    return actions.readGist()
        .then(gistBundles => {
            bundles = gistBundles
            return actions.extractState(gistBundles)
        })
        .then(remoteState => {
            return actions.generateState()
                .then(localState => {
                    spinner.text('Comparing meta data')
                    return confirm.download(config, localState, remoteState)
                })
        })
        .then(confirmed => {
            if (confirmed) {
                return actions.importData(bundles)
            } else {
                spinner.fail('Not importing data')
                return false
            }
        })
        .catch(error => {
            spinner.fail('Failed to download data from gist')
            console.error(error)
            process.exit(1)
        })
}
