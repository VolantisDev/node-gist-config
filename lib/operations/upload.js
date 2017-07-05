const spnr = require('../spinner')

module.exports = upload

function createOrUpload (data, config, actions) {
    return config.get('gistId')
        ? actions.uploadOp(data)
        : actions.createUp(data)
}

function upload (config, data) {
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
        .then(config => createOrUpload(data, config, actions))
        .then(id => {
            spinner.succeed('Successfully uploaded configuration')
            return id
        })
        .catch(error => {
            spinner.fail('Failed to upload data')
            console.log(error)
            process.exit(1)
        })
}
