const Promise = require('bluebird')
const Gists = require('gists')

module.exports = {
    create,
    upload,
    download
}

function client(token) {
    const gists = Promise.promisifyAll(new Gists({ token }))

    return gists
}

function create (data, token) {
    return new Promise((resolve, reject) => {
        if (token) {
            return client(token).create(data).catch(reject)
        } else reject('A GitHub token is required to create a gist')
    })
}

function upload (data, token, id) {
    return new Promise((resolve, reject) => {
        if (token && id) {
            return client(token).edit(data, id)
        } else reject('A GitHub token and Gist id are both required to upload a gist')
    })
}

function download (token, id) {
    return new Promise((resolve, reject) => {
        if (token && id) {
            return client(token).download({ id })
        } else reject('A GitHub token and Gist id are both required to download a gist')
    })
}
