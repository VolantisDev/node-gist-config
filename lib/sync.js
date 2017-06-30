const spnr = require('./spinner')
const mapper = require('./mapper')
const meta = require('./meta')
const gist = require('./gist')
const confirm = require('./confirm')

module.exports = sync

function sync (config, localData) {
    const spinner = spnr('Getting data from gist', config)
    var data
    var operation

    return gist.download(config.get('gistConfig.gitHubToken'), config.get('gistConfig.gistId'))
        .then(gistData => {
            spinner.text('Extracting meta data')
            data = gistData
            return meta.extract(data)
        })
        .then(remoteMeta => {
            spinner.text('Comparing meta data')
            const localMeta = meta.build(config)
            const cmp = meta.compare(localMeta, remoteMeta)
            operation = cmp ? 'upload' : (cmp < 0 ? 'download' : false)

            return confirm.sync(config, meta.build(config), remoteMeta, operation)
        })
        .then(confirmed => {
            if (confirmed) {
                spinner.text('Syncing data')
                
                if (operation === 'upload') {
                    return require('./upload')(config, localData)
                } else if (operation === 'download') {
                    return require('./download')(config)
                }
                return data
            } else {
                spinner.fail('User canceled sync')
                return false
            }
        })
        .catch(error => {
            spinner.fail('Failed to sync data with gist')
            console.error(error)
            console.log(config.get())
            return error
        })
}
