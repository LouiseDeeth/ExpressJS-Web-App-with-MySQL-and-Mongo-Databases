var express = require('express');
var app = express();
var mongoDao = require('./mongoDao');
let ejs = require('ejs');
var bodyParser = require('body-parser');
var mySqlDao = require('./mySqlDao')

app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');

// Start the server
app.listen(3004, () => { // Web app must run on 3004
    console.log("Running on port 3004");
});

// Render the home page
app.get('/', (req, res) => {
    res.render('index');
});

// Display the list of students
app.get('/students', (req, res) => {
    mySqlDao.getStudents()
        .then((data) => {
            console.log(JSON.stringify(data))
            res.render("students", { "students": data })
        })
        .catch((error) => {
            res.send(error)
        })
})

// Render the update form for a student
app.get('/students/edit/:sid', (req, res) => {
    const sid = req.params.sid;
    mySqlDao.getStudentById(sid)
        .then((student) => {
            if (student) {
                res.render('updateStudent', { student, errors: [] }); // Send student data to the form
            } else {
                res.send(`No student found with ID ${sid}`);
            }
        })
        .catch((error) => {
            res.send(error);
        });
});

app.get('/students/delete/:sid', (req, res) => {
    const sid = req.params.sid;

    mySqlDao.deleteGradesByStudentId(sid)
        .then(() => {
            return mySqlDao.deleteStudent(sid);
        })
        .then(() => {
            res.redirect('/students'); // Redirect to the students page after deletion
        })
        .catch((error) => {
            res.send(`Error deleting student: ${error.message}`);
        });
});

app.get('/grades', (req, res) => {
    mySqlDao.getGrades()
        .then((data) => {
            // Sort the data alphabetically by student name, then by grade (ascending)
            data.sort((a, b) => {
                if (a.student_name < b.student_name) return -1;
                if (a.student_name > b.student_name) return 1;
                return a.grade - b.grade;
            });
            res.render('grades', { grades: data });
        })
        .catch((error) => {
            res.send('Error retrieving grades: ' + error);
        });
});

app.get('/lecturers', (req, res) => {
    mongoDao.getAllLecturers()
        .then((data) => {
            data.sort((a, b) => a.lecturerId.localeCompare(b.lecturerId)); // Sort alphabetically by Lecturer ID
            res.render('lecturers', { lecturers: data });
        })
        .catch((error) => {
            res.send('Error retrieving lecturers: ' + error);
        });
});

app.get('/lecturers/delete/:id', (req, res) => {
    const lecturerId = req.params.id;

    // Check if the lecturer is associated with any modules
    mongoDao.checkLecturerModules(lecturerId)
        .then((module) => {
            if (module) {
                // If lecturer is associated with modules, return an error message
                res.render('lecturers', {
                    lecturers: [],
                    errorMessage: `Cannot delete lecturer ${lecturerId}. He/She has associated modules.`
                });
            } else {
                // If lmecturer has no associated modules, proceed with deletion
                mongoDao.deleteLecturerById(lecturerId)
                    .then(() => {
                        res.redirect('/lecturers'); // Redirect back to the lecturers page
                    })
                    .catch((error) => {
                        res.send('Error deleting lecturer: ' + error);
                    });
            }
        })
        .catch((error) => {
            res.send('Error checking modules for lecturer: ' + error);
        });
});

// Render the form to add a lecturer
app.get('/lecturers/add', (req, res) => {
    res.render('addLecturer', { errors: [], lecturer: {} });
});

app.get('/students/add', (req, res) => {
    res.render('addStudent', { errors: [], student: {} });
});

app.post('/students/edit/:sid', (req, res) => {
    const sid = req.params.sid;
    const { name, age } = req.body;

    const errors = [];
    if (!name || name.length < 2) {
        errors.push('Student Name should be at least 2 characters');
    }
    if (!age || isNaN(age) || age < 18) { // isNaN = Not A Number
        errors.push('Student Age should be at least 18');
    }

    if (errors.length > 0) {
        // Re-render the form with errors and previous data
        res.render('updateStudent', { student: { sid, name, age }, errors });
    } else {
        // Update the student in the database
        mySqlDao.updateStudent(sid, name, age)
            .then(() => {
                res.redirect('/students'); // Redirect to the students page after update
            })
            .catch((error) => {
                res.send(error);
            });
    }
});

app.post('/students/add', (req, res) => {
    const { sid, name, age } = req.body;

    const errors = [];
    if (!sid || sid.length !== 4) {
        errors.push('Student ID should be 4 characters');
    }
    if (!name || name.length < 2) {
        errors.push('Student Name should be at least 2 characters');
    }
    if (!age || isNaN(age) || age < 18) {
        errors.push('Student Age should be at least 18');
    }

    if (errors.length > 0) {
        res.render('addStudent', { errors, student: { sid, name, age } });
    } else {
        mySqlDao.getStudentById(sid)
            .then((existingStudent) => {
                if (existingStudent) {
                    errors.push(`Student ID ${sid} already exists`);
                    res.render('addStudent', { errors, student: { sid, name, age } });
                } else {
                    // Add the student to the database
                    mySqlDao.addStudent(sid, name, age)
                        .then(() => {
                            res.redirect('/students'); // Redirect to the students list
                        })
                        .catch((error) => {
                            errors.push('Error adding student to the database');
                            res.render('addStudent', { errors, student: { sid, name, age } });
                        });
                }
            })
            .catch((error) => {
                errors.push('Error checking existing student ID');
                res.render('addStudent', { errors, student: { sid, name, age } });
            });
    }
});


app.post('/lecturers/add', (req, res) => {
    const { lecturerId, name, departmentId } = req.body;

    const errors = [];
    if (!lecturerId || lecturerId.length !== 4) {
        errors.push('Lecturer ID should be 4 characters');
    }
    if (!name || name.length < 2) {
        errors.push('Lecturer Name should be at least 2 characters');
    }
    if (!departmentId || departmentId.length !== 3) {
        errors.push('Department ID should be 3 characters');
    }

    if (errors.length > 0) {
        res.render('addLecturer', { errors, lecturer: { lecturerId, name, departmentId } });
    } else {
        // Check if the lecturer already exists
        mongoDao.getAllLecturers()
            .then((lecturers) => {
                const existingLecturer = lecturers.find(lecturer => lecturer.lecturerId === lecturerId);
                if (existingLecturer) {
                    errors.push(`Lecturer ID ${lecturerId} already exists`);
                    res.render('addLecturer', { errors, lecturer: { lecturerId, name, departmentId } });
                } else {
                    // Add the lecturer to MongoDB
                    mongoDao.addLecturer(lecturerId, name, departmentId)
                        .then(() => {
                            res.redirect('/lecturers'); // Redirect to the lecturers list
                        })
                        .catch((error) => {
                            errors.push('Error adding lecturer to the database');
                            res.render('addLecturer', { errors, lecturer: { lecturerId, name, departmentId } });
                        });
                }
            })
            .catch((error) => {
                errors.push('Error checking existing lecturer ID');
                res.render('addLecturer', { errors, lecturer: { lecturerId, name, departmentId } });
            });
    }
});