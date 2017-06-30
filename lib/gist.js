const Promise = require('bluebird')
const SimpleGistClient = require('simple-gist-client')

module.exports = {
    create,
    upload,
    download
}

function client(token) {
    const client = new SimpleGistClient({ token })

    return client
}

function create (data, token) {
    return new Promise((resolve, reject) => {
        if (token) {
            return client(token).create(data)
        } else reject('A GitHub token is required to create a gist')
    })
}

function upload (data, token, id) {
    return new Promise((resolve, reject) => {
        if (token && id) {
            return client(token).update(id, data)
        } else reject('A GitHub token and Gist id are both required to upload a gist')
    })
}

function download (token, id) {
    return new Promise((resolve, reject) => {
        if (token && id) {
            return client(token).read(id)
        } else reject('A GitHub token and Gist id are both required to download a gist')
    })
}
