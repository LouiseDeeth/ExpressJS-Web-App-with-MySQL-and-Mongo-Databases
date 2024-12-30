const MongoClient = require('mongodb').MongoClient
const mySqlDao = require('./mySqlDao');

var db
var collection

// Establish a connection to the MongoDB database
MongoClient.connect('mongodb://127.0.0.1:27017')
    .then((client) => {
        db = client.db('proj2024MongoDB') // Selects the proj2024MongoDB database
        collection = db.collection('lecturers') // Initializes the lecturers collection
    })
    .catch((error) => {
        console.log(error.message)
    })

// Retrieves all lecturers from the lecturers collection
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

// Deletes a lecturer from the lecturers collection by lecturerId
const deleteLecturerById = (lecturerId) => {
    return db.collection('lecturers').deleteOne({ _id: lecturerId })
        .then((result) => {
            if (result.deletedCount === 0) {
                throw new Error(`No lecturer found with ID ${lecturerId}`);
            }
            return result;
        })
        .catch((error) => {
            console.error('Error deleting lecturer:', error);
            throw error;
        });
};

// Adds a new lecturer to the lecturers collection
const addLecturer = (lecturerId, name, departmentId) => {
    return db.collection('lecturers').insertOne({
        _id: lecturerId,
        name: name,
        did: departmentId
    });
};

// Checks if a lecturer is associated with any modules in the modules collection
const checkLecturerModules = (lecturerId) => {
    return new Promise((resolve, reject) => {
        // Query MySQL to check for modules associated with the lecturerId
        mySqlDao.getModulesByLecturerId(lecturerId)
            .then((modules) => {
                if (modules.length > 0) {
                    resolve(true); // Modules exist for the lecturer
                } else {
                    resolve(false); 
                }
            })
            .catch((error) => {
                reject(error); 
            });
    });
};

module.exports = { getAllLecturers, deleteLecturerById, checkLecturerModules, addLecturer };