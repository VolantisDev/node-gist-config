const spnr = require('../spinner')

module.exports = sync

function createOrSync(config, data, actions, spinner) {
    if (!config.get('gistId')) {
        spinner.text('Creating a new gist')
        return actions.createOp(data)
    } else {
        spinner.text('Syncing with existing gist')
        return actions.syncOp(data)
    }
}

function sync (config, localData) {
    const spinner = spnr('Starting to sync configuration', config)
    const actions = require('./actions')(config, spinner)

    return actions
        .initialize()
        .then(cfg => {
            config = cfg
            actions.setConfig(config)
            return config
        })
        .then(config => createOrSync(config, localData, actions, spinner))
        .catch(error => {
            if (spinner) spinner.fail('Failed to sync configuration')
            console.error(error)
            return error
        })
}
