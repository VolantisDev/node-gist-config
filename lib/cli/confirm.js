const inquirer = require('inquirer')

module.exports = {
    configure,
    create,
    initialize,
    upload,
    download,
    sync,
    resetConfig
}

function handleAnswers (answers, required) {
    return !((required || ['confirm'])
        .filter(n => !(typeof answers[n] === 'undefined' || answers[n]))
        .length)
}

function initialize (config) {
    return inquirer.prompt([require('./questions/confirm-initialize')(config, !config.get('token'))])
        .then(handleAnswers)
}

function configure (config) {
    return inquirer.prompt([])
        .then(answers => handleAnswers(answers, []))
}

function create (config, localMeta) {
    return inquirer.prompt([])
        .then(answers => handleAnswers(answers, []))
}

function upload (config, localMeta, remoteMeta) {
    const state = require('../state')(config)
    var cmp = state.compare(localMeta, remoteMeta)

    return inquirer.prompt([require('./questions/confirm-upload')(config, cmp === -1)])
        .then(handleAnswers)
}

function download (config, localMeta, remoteMeta) {
    const state = require('../state')(config)
    var cmp = state.compare(localMeta, remoteMeta)

    return inquirer.prompt([require('./questions/confirm-download')(config, cmp === -1)])
        .then(handleAnswers)
}

function sync (config, localMeta, remoteMeta, operation) {
    return inquirer.prompt([]).then(answers => handleAnswers(answers, []))
}

function resetConfig (config) {
    return inquirer.prompt([require('./questions/confirm-reset')(config, config.get('interactive', true))])
        .then(handleAnswers)
}
