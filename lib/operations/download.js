const spnr = require('./spinner')
const mapper = require('./mapper')
const meta = require('./meta')
const gist = require('./gist')
const confirm = require('./confirm')

module.exports = download

function importData (data, basePath) {
    return mapper.fromObject(data, basePath)
}

function download (config) {
    const spinner = spnr('Downloading data from gist', config)
    var data

    return gist.download(config.get('gitHubToken'), config.get('gistId'))
        .then(gistData => {
            spinner.text('Extracting meta data')
            data = gistData
            return meta.extract(data)
        })
        .then(remoteMeta => {
            spinner.text('Comparing meta data')
            return confirm.download(config, meta.build(config), remoteMeta)
        })
        .then(confirmed => {
            if (confirmed) {
                spinner.text('Importing downloaded data')
                return importData(data, config.get('basePath', ''))
                    .then(items => {
                        spinner.succeed('Successfully downloaded data')
                        return items
                    })
            } else {
                spinner.fail('User canceled download')
                return false
            }
        })
        .catch(error => {
            spinner.fail(spinner, 'Failed to download data from gist ' + id)
            return error
        })
}
