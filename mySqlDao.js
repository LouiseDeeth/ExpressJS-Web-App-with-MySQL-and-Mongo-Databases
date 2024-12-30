var pmysql = require('promise-mysql')
var pool

pmysql.createPool({
    connectionLimit: 3,
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'proj2024mysql'
})
    .then((p) => {
        pool = p
    })
    .catch((e) => {
        console.log("pool error:" + e)
    })

    var getStudents = function () {
        return new Promise((resolve, reject) => {
            pool.query('SELECT * FROM student')
                .then((data) => {
                    resolve(data)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }

    var getStudentById = function (sid) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM student WHERE sid = ?';
            pool.query(query, [sid])
                .then((results) => {
                    resolve(results[0]); // Return the first (and only) result
                })
                .catch((error) => {
                    reject(error);
                });
        });
    };
    
    var updateStudent = function (sid, name, age) {
        return new Promise((resolve, reject) => {
            var myQuery = 'UPDATE student SET name = ?, age = ? WHERE sid = ?';     
            pool.query(myQuery, [name, age, sid])
                .then((results) => {
                    resolve(results)
                })
                .catch((error) => {
                    reject(error)
                    console.log("Error")
                })
        })
    }
    module.exports = { getStudents, getStudentById, updateStudent };
