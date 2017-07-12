const spnr = require('../spinner')

module.exports = download

function download (config) {
    const spinner = spnr('Downloading data from gist', config)
    const actions = require('./actions')(config, spinner)

    return actions.initialize()
        .then(cfg => {
            config = cfg
            actions.setConfig(config)
            return config
        })
        .then(() => actions.downloadOp())
        .then(data => {
            spinner.succeed('Successfully downloaded configuration from gist ' + config.get('gistId', ''))
            config.set('lastSynced', + new Date())
            return data
        })
        .catch(error => {
            spinner.fail('Failed to download configuration')
            console.log(error)
            process.exit(1)
        })
}
