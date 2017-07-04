module.exports = (config, condition) => {
    if (typeof condition === 'undefined') {
        condition = true
    }

    return {
        type: 'confirm',
        name: 'confirm',
        message: 'Are you sure you wish to reset your local gist config settings?',
        default: true,
        when: condition
    }
}
