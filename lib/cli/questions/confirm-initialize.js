module.exports = (config, condition) => {
    if (typeof condition === 'undefined') {
        condition = true
    }

    return {
        type: 'confirm',
        name: 'confirm',
        message: 'It looks like you haven\'t initialized your gist sync settings yet. Would you like to do so now?',
        default: true,
        when: !alreadyConfigured(config) && condition
    }
}

function alreadyConfigured (config) {
    return config.get('initialized') || (config.get('token') && !config.get('interactive'))
}
