const spnr = require('./spinner')
const mapper = require('./mapper')
const create = require('./create')
const meta = require('./meta')
const gist = require('./gist')
const confirm = require('./confirm')

module.exports = upload

function upload (config, data) {
    // If there is no gist ID, create instead of uploading
    if (!config.get('gistId')) {
        return create(config, data)
    }

    const spinner = spnr('Exporting data', config)
    var dataObject

    return mapper.toObject(data, config.get('basePath', ''))
        .then(data => {
            spinner.text('Extracting meta data')
            dataObject = data
            return meta.extract(dataObject)
        })
        .then(localMeta => {
            spinner.text('Comparing meta data')
            return confirm.upload(config, localMeta, {})
        })
        .then(confirmed => {
            if (confirmed) {
                spinner.text('Uploading configuration to gist', config)
                dataObject = meta.inject(dataObject, meta.build(config, { lastSynced: + new Date() }))
                return gist.upload(dataObject, config.get('gitHubToken'), config.get('gistId'))
                    .then(id => {
                        spinner.succeed('Successfully uploaded data')
                        return id
                    })
            } else {
                spinner.fail('User canceled upload')
                return false
            }
        })
        .catch(error => {
            spinner.fail('Failed to upload data')
            return error
        })
}
