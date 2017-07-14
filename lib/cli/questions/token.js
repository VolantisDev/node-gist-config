module.exports = (config, condition) => {
    if (typeof condition === 'undefined') {
        condition = true
    }

    return {
        type: 'password',
        name: 'token',
        message: 'Auth token for GitHub (https://github.com/settings/tokens/new):',
        default: config.get('token'),
        when: condition && config.get('interactive', true) && (!config.get('initialized', false) || !config.get('token'))
    }
}
