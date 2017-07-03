const gist = require('./gist')
const spnr = require('./spinner')
const mapper = require('./mapper')
const meta = require('./meta')
const confirm = require('./confirm')

module.exports = create

function create (config, data) {
    var spinner = spnr('Exporting data', config)
    var data
    var injectMeta

    return mapper.toObject(data, config.get('basePath', ''))
        .then(gistData => {
            spinner.text('Building meta data')
            data = gistData
            return meta.build(config, { lastSynced: + new Date() })
        })
        .then(localMeta => {
            spinner.text('Comparing meta data')
            injectMeta = localMeta
            return confirm.create(config, localMeta)
        })
        .then(confirmed => {
            if (confirmed) {
                spinner.text('Uploading data to new new gist')
                data = meta.inject(data, injectMeta)
                return gist.create(data, config.get('gitHubToken'))
                    .then(id => {
                        spinner.succeed('Uploaded data to new gist ' + id)
                        return id
                    })
            } else {
                spinner.fail('User canceled download')
                return false
            }
        })
        .catch(error => {
            spinner.fail('Failed to create gist')
            console.error(error)
            return error
        })
}
