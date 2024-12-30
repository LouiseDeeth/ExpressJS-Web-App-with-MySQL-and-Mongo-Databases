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
            res.render("students", {"students": data})
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

app.get('/grades', (req, res) => {
    res.send('Grades Page');
});

app.get('/lecturers', (req, res) => {
    res.send('Lecturers Page');
});

app.get('/addStudent', (req, res) => {
    res.send('Add Student Page');
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
