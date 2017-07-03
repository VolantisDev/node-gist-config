const meta = require('./meta')
const inquirer = require('inquirer')

module.exports = {
    configure,
    create,
    upload,
    download,
    sync
}

function handleAnswers (answers, required) {
    return !((required || ['confirm'])
        .filter(n => (typeof answers[n] !== 'undefined' || answers[n]))
        .length)
}

function configure (config, answers) {
    return inquirer
        .prompt([])
        .then(handleAnswers)
}

function reset (config) {
    return inquirer
        .prompt([
            {
                type: 'confirm',
                name: 'confirm',
                message: 'Are you sure you wish to reset your local gist config settings?',
                default: true,
                when: config.get('interactive', true)
            }
        ])
        .then(handleAnswers)
}

function create (config, localMeta) {
    return inquirer
        .prompt([])
        .then(handleAnswers)
}

function upload (config, localMeta, remoteMeta) {
    var cmp = meta.compare(localMeta, remoteMeta)

    return inquirer
        .prompt([
            {
                type: 'confirm',
                name: 'confirm',
                message: 'The remote configuration is newer. Are you sure you wish to overwrite it?',
                default: false,
                when: cmp === -1
            }
        ])
        .then(handleAnswers)
}

function download (config, localMeta, remoteMeta) {
    var cmp = meta.compare(localMeta, remoteMeta)

    return inquirer
        .prompt([
            {
                type: 'confirm',
                name: 'confirm',
                message: 'The local confirmation is newer. Are you sure you wish to overwrite it?',
                default: false,
                when: cmp === 1
            }
        ])
        .then(handleAnswers)
}

function sync (config, localMeta, remoteMeta, operation) {
    return inquirer
        .prompt([])
        .then(handleAnswers)
}
