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

    function text(message) {
        if (spinner) {
            spinner.text = message
        }
    }

    return {
        enabled,
        spinner,
        text,
        succeed,
        fail
    }
}
