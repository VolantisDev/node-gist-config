const spnr = require('../spinner')

module.exports = create

function create (config, data) {
    const spinner = spnr('Starting to create new gist config', config)
    const actions = require('./actions')(config, spinner)

    return actions
        .initialize()
        .then(cfg => {
            config = cfg
            actions.setConfig(config)
            return config
        })
        .then(() => actions.createOp(data))
        .then(id => {
            spinner.succeed('Successfully created gist ' + id)
            config.set('gistId', id)
            config.set('lastSynced', + new Date())
            return id
        })
        .catch(error => {
            spinner.fail('Failed to create configuration')
            console.log(error)
            process.exit(1)
        })
}
