module.exports = (cfg) => {
    const config = require('./lib/config').set(cfg)
    const cli = require('./lib/cli')(config)
    const sync = require('./lib/operations/sync')
    const download = require('./lib/operations/download')
    const upload = require('./lib/operations/upload')
    const create = require('./lib/operations/create')
    const reset = require('./lib/operations/reset')
    
    return {
        config,
        cli,
        sync: (data, meta) => sync(config, data, meta),
        download: (data, meta) => download(config, data, meta),
        upload: (data, meta) => upload(config, data, meta),
        create: (data, meta) => create(config, data, meta),
        reset: () => reset(config)
    }
}
