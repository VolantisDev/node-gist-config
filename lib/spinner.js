const ora = require('ora')

module.exports = (message, config) => {
    const enabled = config.get('spinner', true)
    const spinner = enabled ? ora(message).start() : null

    function succeed(message) {
        if (spinner) {
            spinner.succeed(message)
        }
    }

    function fail(message) {
        if (spinner) {
            spinner.fail(message)
        }
    }

    function pause() {
        if (spinner) {
            spinner.stop()
        }
    }

    function text(message) {
        if (spinner) {
            spinner.text = message
            spinner.start()
        }
    }

    return {
        enabled,
        spinner,
        text,
        succeed,
        fail,
        pause
    }
}
