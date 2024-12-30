const MongoClient = require('mongodb').MongoClient

var db
var collection

MongoClient.connect('mongodb://127.0.0.1:27017')
    .then((client) => {
        db = client.db('proj2024MongoDB')
        collection = db.collection('lecturers')
    })
    .catch((error) => {
        console.log(error.message)
    })

const getAllLecturers = () => {
    return db.collection('lecturers').find().toArray()
        .then(lecturers => {
            return lecturers.map(lecturer => ({
                lecturerId: lecturer._id,
                name: lecturer.name,
                departmentId: lecturer.did
            }));
        });
};

const deleteLecturerById = (lecturerId) => {
    return db.collection('lecturers').deleteOne({ _id: lecturerId });
};

const checkLecturerModules = (lecturerId) => {
    return db.collection('modules').findOne({ lecturerId: lecturerId }); // Check if the lecturer is associated with any module
};

const addLecturer = (lecturerId, name, departmentId) => {
    return db.collection('lecturers').insertOne({
        _id: lecturerId,
        name: name,
        did: departmentId
    });
};

module.exports = { getAllLecturers, deleteLecturerById, checkLecturerModules, addLecturer };