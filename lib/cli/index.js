module.exports = config => {
    const configure = require('./configure')
    const confirm = require('./confirm')
    const initialize = require('./initialize')

    return {
        confirm,
        configure: force => configure(config, force),
        initialize: () => initialize(config)
    }
}
