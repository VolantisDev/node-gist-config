const confirm = require('../cli/confirm')
const spnr = require('../spinner')

module.exports = resetConfig

function resetConfig (config) {
    const spinner = spnr('Starting to reset configuration', config)
    const actions = require('./actions')(config, spinner)

    return actions
        .initialize()
        .then(cfg => {
            config = cfg
            actions.setConfig(config)
            return config
        })
        .then(() => actions.resetOp())
        .then(() => {
            spinner.succeed('Successfully reset configuration')
            return true
        })
        .catch(error => {
            spinner.fail('Failed to reset configuration')
            console.log(error)
            process.exit(1)
        })
}
