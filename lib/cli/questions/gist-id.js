module.exports = (config, condition) => {
    if (typeof condition === 'undefined') {
        condition = true
    }
    
    return {
        type: 'input',
        name: 'gistId',
        message: 'If you have an existing gist ID to sync with, paste it here:',
        default: config.get('gistId'),
        when: condition
    }
}
