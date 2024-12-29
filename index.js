var express = require('express');
var app = express();
var mongoDao = require('./mongoDao');
let ejs = require('ejs');
var bodyParser = require('body-parser');

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
    res.send('Students Page');
});

app.get('/grades', (req, res) => {
    res.send('Grades Page');
});

app.get('/lecturers', (req, res) => {
    res.send('Lecturers Page');
});

