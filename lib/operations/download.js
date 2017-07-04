const spnr = require('../spinner')
const confirm = require('../cli/confirm')
const GistPacker = require('../../../node-gist-packer')

module.exports = download

function download (config) {
    const gistPacker = GistPacker(config)
    const spinner = spnr('Downloading data from gist', config)
    const state = require('../state')(config)
    var bundles

    spinner.text('Generating gist-config state bundle')

    return gistPacker.gist
        .readGist()
        .then(gistBundles => {
            spinner.text('Extracting state data')
            var remoteState = state.extract(gistBundles)
            bundles = gistBundles
            return remoteState
        })
        .then(remoteState => {
            spinner.text('Comparing meta data')
            return state
                .generate()
                .then(localState => {
                    return confirm.download(config, localState, remoteState)
                })
        })
        .then(confirmed => {
            if (confirmed) {
                spinner.text('Importing downloaded data')

                return gistPacker.packer.unpack(bundles)
                    .then(items => {
                        spinner.succeed('Successfully downloaded data')
                        return items
                    })
            } else {
                spinner.fail('User canceled download')
                return false
            }
        })
        .catch(error => {
            spinner.fail(spinner, 'Failed to download data from gist ' + id)
            return error
        })
}
