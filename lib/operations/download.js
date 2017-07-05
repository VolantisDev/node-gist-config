const spnr = require('../spinner')
const confirm = require('../cli/confirm')

module.exports = download

function download (config) {
    const spinner = spnr('Downloading data from gist', config)
    const actions = require('./actions')(config, spinner)

    return actions
        .initialize()
        .then(cfg => {
            config = cfg
            actions.setConfig(config)
            return config
        })
        .then(() => actions.downloadOp())
        .then(data => {
            spinner.succeed('Successfully downloaded configuration')
            return data
        })
        .catch(error => {
            spinner.fail('Failed to download configuration')
            console.log(error)
            process.exit(1)
        })
}
