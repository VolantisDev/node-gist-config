module.exports = (config, bundles, spinner) => {
    const state = require('../../state')(config)

    spinner.text('Extracting state data')

    return state.extract(bundles)
        .then(bundle => {
            spinner.text('Finished extracting state data')
            return bundle
        })
        .catch(error => {
            spinner.fail('Failed extracting state data')
            console.error(error)
            process.exit(1)
        })
}
