const confirm = require('./confirm')
const spnr = require('./spinner')

module.exports = resetConfig

function resetConfig (config) {
    return confirm.reset(config)
        .then(confirmed => {
            const spinner = spnr('Resetting gist config settings', config)

            if (confirmed) {
                config.delete('gistConfig')
                spinner.succeed('Gist config settings reset')
                return true
            } else {
                spinner.fail('User canceled settings reset')
                return false
            }
        })
}
