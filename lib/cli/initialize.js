const inquirer = require('inquirer')
const confirm = require('./confirm')

module.exports = initialize

function initialize (config) {
    return askQuestions(config)
}

function askQuestions (config) {
    return confirm.initialize(config)
        .then(confirmed => {
            return inquirer.prompt([
                require('./questions/token')(config, confirmed),
                require('./questions/gist-id')(config, confirmed)
            ])
        })
        .then(answers => {
            if (answers.token) config.set('token', answers.token)
            if (answers.gistId) config.set('gistId', answers.gistId)
            config.set('initialized', true)
            return config
        })
}
