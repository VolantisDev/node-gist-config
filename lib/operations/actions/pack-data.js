const GistPacker = require('../../../../node-gist-packer')

module.exports = (config, data, meta, spinner) => {
    const gistPacker = GistPacker(config.get())
    const basePath = config.get('basePath', '')

    spinner.text('Packing data')

    meta = meta || {}
    meta = Object.assign({basePath}, meta)

    return gistPacker.packer.pack(data, meta)
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
