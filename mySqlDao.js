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
    
    var deleteStudent = function (sid) {
        return new Promise((resolve, reject) => {
            var myQuery = {
                sql: 'DELETE FROM student where sid = ?',
                values: [sid]
            }     
            pool.query(myQuery)
                .then((data) => {
                    resolve(data)
                })
                .catch((error) => {
                    reject(error)
                    console.log("Error")
                })
        })
    }
    module.exports = { getStudents, deleteStudent }