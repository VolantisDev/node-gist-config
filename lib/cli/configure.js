const Promise = require('bluebird')
const inquirer = require('inquirer')
const confirm = require('./confirm')

module.exports = configure

function configure (config, force) {
    return new Promise((resolve, reject) => {
        if (needsReconfigure(config, force)) {
            return reconfigure(config)
                .then(() => { resolve(config) })
                .catch(reject)
        } else resolve(config)
    })
}

function needsReconfigure (config, force) {
    return (
        config.get('interactive', true) 
        && (force || !config.get('token'))
    )
}

function questions(config, includeGistId) {
    return [
        require('./questions/token')(config),
        require('./questions/gist-id')(config, includeGistId)
    ]
}

function setAnswers(config, answers) {
    return confirm
        .configure(config, answers)
        .then(confirmed => {
            if (confirmed) {
                if (answers.token) config.set('token', answers.token)    
                if (answers.gistId) config.set('gistId', answers.gistId)
            }

            return config
        })
}

function reconfigure (config, includeGistId) {
    return inquirer
        .prompt(questions(config, includeGistId))
        .then(answers => setAnswers(config, answers))
}
