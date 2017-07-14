const spnr = require('../spinner')

module.exports = upload

function createOrUpload (data, meta, config, actions) {
    return config.get('gistId')
        ? actions.uploadOp(data)
        : actions.createUp(data)
}

function upload (config, data, meta) {
    // If there is no gist ID, create instead of uploading
    if (!config.get('gistId')) {
        return require('./create')(config, data)
    }

    const spinner = spnr('Starting configuration upload', config)
    const actions = require('./actions')(config, spinner)

    return actions
        .initialize()
        .then(cfg => {
            config = cfg
            actions.setConfig(config)
            return config
        })
        .then(config => createOrUpload(data, meta, config, actions))
        .then(id => {
            spinner.succeed('Successfully uploaded configuration')
            config.set('lastSynced', + new Date())
            return id
        })
        .catch(error => {
            spinner.fail('Failed to upload data')
            console.log(error)
            process.exit(1)
        })
}
