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

app.get('/', (req, res) => {
    res.render('index'); 
});

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

app.get('/students/delete/:sid', (req, res) => {
   const sid = req.params.sid

    mySqlDao.deleteStudent(sid)
        .then(() => {
            console.log(JSON.stringify(data))
            res.redirect('/students'); // Redirect back to the students page after deletion
        })
        .catch((error) => {
            res.send(error)
        })
})

app.get('/grades', (req, res) => {
    res.send('Grades Page');
});

app.get('/lecturers', (req, res) => {
    res.send('Lecturers Page');
});

app.get('/add-student', (req, res) => {
    res.send('Add Student Page');
});

app.get('/update-student/:id', (req, res) => {
    const studentId = req.params.id;
    res.send(`Update Student Page for ID: ${studentId}`);
});
