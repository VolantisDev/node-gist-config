const GistPacker = require('../../../../node-gist-packer')

module.exports = (config, data, spinner) => {
    const gistPacker = GistPacker(config.get())
    const basePath = config.get('basePath', '')

    spinner.text('Packing data')

    return gistPacker.packer
        .pack(data, { basePath })
        .then(bundles => {
            spinner.text('Finished packing data')
            return bundles
        })
        .catch(error => {
            spinner.fail('Failed packing data')
            console.error(error)
            process.exit(1)
        })
}
