var Promise = require('bluebird')
var check = require('check-types')
var fs = require('sander')
var path = require('path')
var isJson = require('is-json')
var dir = require('node-dir')

module.exports = getDataObject

function shortPath(data, basePath) {
    return basePath
        ? data.replace(basePath, '')
        : data
}

function toObjectObject(data) {
    return {
        type: 'object',
        data: data
    }
}

function toArrayObject(data) {
    var arrayData = [];
    data.forEach(dataItem => { arrayData.push(toDataObject(dataItem)) })

    return {
        type: 'array',
        data: arrayData
    }
}

function toJsonObject(data, path, basePath) {
    return {
        type: 'json',
        path: shortPath(path, basePath),
        data: JSON.parse(data)
    }
}

function toTextFileObject(data, path, basePath) {
    return {
        type: 'file',
        path: shortPath(path, basePath),
        data: data
    }
}

function toFileObject(data, basePath) {
    return fs.readFile(data).then(fileData => {
        return isJson(fileData)
            ? toJsonObject(fileData, data, basePath)
            : toTextFileObject(fileData, data, basePath)
    })
}

function toDirectoryObject(data, basePath) {
    return dir.promiseFiles(data)
        .then(files => {
            data = []
            files.forEach(file => { data.push(toFileObject(file, basePath)) })

            return {
                type: 'directory',
                path: shortPath(path, basePath),
                data: data
            }
        })
}

function toFsObject (data, basePath) {
    return new Promise((resolve, reject) => {
        return fs.stat(data).then(stats => {
            if (stats.isFile(data)) {
                return toFileObject(data, basePath)
            } else if (stats.isDirectory(data)) {
                return toDirectoryObject(data, basePath)
            }

            reject('String provided is not a valid path')
        })
    })
}

function toDataObject (data, basePath) {
    return new Promise((resolve, reject) => {
        var obj

        if (check.nonEmptyObject(data)) {
            obj = toObjectObject(data)
        }

        if (check.array(data)) {
            obj = toArrayObject(data)
        }

        if (check.nonEmptyString(data)) {
            obj = toFsObject(data, basePath)
        }

        return obj || new Error('Data type is not valid.')
    })
}

function getDataObject (data, basePath) {
    return toDataObject(data, basePath)
        .then(data => {

        })
}
