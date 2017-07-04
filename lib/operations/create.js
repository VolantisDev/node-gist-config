const spnr = require('../spinner')
const confirm = require('../cli/confirm')
const GistPacker = require('../../../node-gist-packer')

module.exports = create

function create (config, data) {
    const spinner = spnr('Exporting data', config)
    const state = require('../state')(config)
    const basePath = config.get('basePath', '')
    const gistPacker = GistPacker(config)
    var bundles

    gistPacker.packer.pack(data, { basePath })
        .then(gistBundles => {
            spinner.text('Generating gist-config state bundle')
            var stateBundle = state.generate()
            bundles = gistBundles
            bundles.push(stateBundle)

            return stateBundle
        })
        .then(stateBundle => {
            return confirm.create(config, stateBundle)
        })
        .then(confirmed => {
            if (confirmed) {
                spinner.text('Uploading data to new gist')
                return gistPacker.gist.createGist(bundles)
            } else return false
        })
        .then(id => {
            if (id) {
                spinner.succeed('Uploaded data to new gist ' + id)
            } else {
                spinner.fail('User canceled upload')
            }
            return id
        })
        .catch(error => {
            spinner.fail('Failed to create gist')
            console.error(error)
            return error
        })
}
