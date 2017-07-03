const gist = require('./gist')

module.exports = {
    build,
    save,
    extract,
    inject,
    compare,
    compareData,
    compareMetaData,
    compareDataMeta
}

function extract (data) {
    const meta = data.gistConfigMeta || {}
    delete data.gistConfigMeta
    return meta
}

function inject (data, meta) {
    data.gistConfigMeta = meta
    return data
}

function build (config, override) {
    override = override || {}
    const date = + new Date()

    const meta = Object.assign({
        lastSaved: config.get('lastSaved', date),
        lastSynced: config.get('lastSynced', date)
    }, override)

    return meta
}

function save (config, meta) {
    config.set('lastSaved', meta.lastSaved)
    config.set('lastSynced', meta.lastSynced)
}

function compare (metaA, metaB, prop) {
    prop = prop || 'lastSaved'

    var comp
    if (metaA[prop] > metaB[prop]) {
        comp = 1
    } else if (metaA[prop] < metaB[prop]) {
        comp = -1
    } else {
        comp = 0
    }

    return comp
}

function compareData(dataA, dataB, prop) {
    return compare(extract(dataA), extract(dataB), prop)
}

function compareMetaData(meta, data, prop) {
    return compare(meta, extract(data), prop)
}

function compareDataMeta(data, meta, prop) {
    return compare(extract(data), meta, prop)
}
