const spnr = require('../spinner')

module.exports = sync

function createOrSync(config, data, meta, actions, spinner) {
    if (!config.get('gistId')) {
        spinner.text('Creating a new gist')
        return actions.createOp(data, meta)
    } else {
        spinner.text('Syncing with existing gist')
        return actions.syncOp(data, meta)
    }
}

function sync (config, localData, meta) {
    const spinner = spnr('Starting to sync configuration', config)
    const actions = require('./actions')(config, spinner)

    return actions.initialize()
        .then(cfg => {
            config = cfg
            actions.setConfig(config)
            return config
        })
        .then(config => createOrSync(config, localData, meta, actions, spinner))
        .then(data => {
            if (typeof data === 'string') {
                config.set('gistId', data)
                data = localData
            }

            if (data) {
                spinner.succeed('Successfully synced configuration with gist ' + config.get('gistId', ''))
                config.set('lastSynced', + new Date())
            } else {
                spinner.succeed('There were no changes to sync')
                data = localData
            }

            return data
        })
        .catch(error => {
            if (spinner) spinner.fail('Failed to sync configuration')
            console.error(error)
            return error
        })
}
