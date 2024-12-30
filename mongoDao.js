const MongoClient = require('mongodb').MongoClient

var database
var collection
/*
MongoClient.connect('mongodb://127.0.0.1:27017')
    .then((client) => {
        database = client.database('proj2024MongoDB')
        collection = database.collection('lecturers')
    })
    .catch((error) => {
        console.log(error.message)
    })

var findAll = function () {
    return new Promise((resolve, reject) => {
        var cursor = collection.find()
        cursor.toArray()
            .then((documents) => {
                resolve(documents)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

var addStudent = function () {
    return new Promise((resolve, reject) => {
        coll.insertOne(lecturer)
            .then((documents) => {
                resolve(documents)
            })
            .catch((error) => {
                reject(error)
            })
    })
}*/