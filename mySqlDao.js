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

    var addStudent = function (sid, name, age) {
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO student (sid, name, age) VALUES (?, ?, ?)';
            pool.query(query, [sid, name, age])
                .then((results) => {
                    resolve(results);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    };

    var getGrades = function () {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT s.name AS student_name, 
                       m.name AS module_name, 
                       g.grade 
                FROM student s
                LEFT JOIN grade g ON s.sid = g.sid
                LEFT JOIN module m ON g.mid = m.mid
                ORDER BY s.name, g.grade ASC;`;
            pool.query(query)
                .then((results) => {
                    resolve(results);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    };
    
    const deleteStudent = (sid) => {
        return new Promise((resolve, reject) => {
            const query = 'DELETE FROM student WHERE sid = ?';
            pool.query(query, [sid])
                .then((result) => resolve(result))
                .catch((error) => reject(error));
        });
    };

    const deleteGradesByStudentId = (sid) => {
        return new Promise((resolve, reject) => {
            const query = 'DELETE FROM grade WHERE sid = ?';
            pool.query(query, [sid])
                .then((result) => resolve(result))
                .catch((error) => reject(error));
        });
    };
    
    const deleteGradesByModuleId = (mid) => {
        return new Promise((resolve, reject) => {
            const query = 'DELETE FROM grade WHERE mid = ?';
            pool.query(query, [mid])
                .then((result) => resolve(result))
                .catch((error) => reject(error));
        });
    };
    
    module.exports = { getStudents, getStudentById, updateStudent, getGrades, addStudent, deleteStudent, deleteGradesByStudentId, deleteGradesByModuleId, };
    