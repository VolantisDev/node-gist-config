module.exports = (config, spinner) => {
    spinner.text('Initializing configuration')
    spinner.pause()

    return require('../../cli/initialize')(config)
        .then(config => {
            spinner.text('Initialized configuration')
            return config
        })
        .catch(error => {
            spinner.fail('Failed to initialize configuration')
            console.error(error)
            process.exit(1)
        })
}
