module.exports = (config, spinner) => {
    const state = require('../../state')(config)
    spinner.text('Generating state bundle')

    return state
        .generate()
        .then(stateBundle => {
            spinner.text('Finished generating state bundle')
            return stateBundle
        })
        .catch(error => {
            spinner.fail('Failed generating state bundle')
            console.error(error)
            process.exit(1)
        })
}
