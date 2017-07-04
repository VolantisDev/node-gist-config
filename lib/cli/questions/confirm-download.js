module.exports = (config, condition) => {
    if (typeof condition === 'undefined') {
        condition = true
    }

    return {
        type: 'confirm',
        name: 'confirm',
        message: 'The local confirmation is newer. Are you sure you wish to overwrite it?',
        default: false,
        when: condition
    }
}
