module.exports = (config, spinner) => {
    const confirm = require('../../cli/confirm')

    spinner.text('Resetting configuration')
    spinner.pause()

    return confirm.resetConfig(config)
        .then(confirmed => {
            if (confirmed) {
                config.del()
                spinner.text('Gist config settings reset')
            } else {
                spinner.fail('User canceled settings reset')
                process.exit(1)
            }
            return confirmed
        })
}
