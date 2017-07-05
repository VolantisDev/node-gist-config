module.exports = (config, spinner) => {
    const confirm = require('../../cli/confirm')

    spinner.text('Resetting configuration')

    return confirm.reset(config)
        .then(confirmed => {
            if (confirmed) {
                config.delete()
                spinner.text('Gist config settings reset')
                return true
            } else {
                spinner.text('User canceled settings reset')
                return false
            }
        })
        .catch(error => {
            spinner.fail('Failed to reset configuration')
            console.error(error)
            process.exit(1)
        })
}
