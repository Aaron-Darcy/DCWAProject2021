// imports
var express = require("express");
var app = express();
var mysql = require("./mysqlFunc");
var bodyParser = require('body-parser');

//ejs and bodyparser
var ejs = require('ejs');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:false}))

//check
const { check, validationResult } = require('express-validator');

//port 3000.
app.listen(3000, () => 
{
    console.log("Listening on port 3000")
})

//get for / and index redirect
app.get('/', (req, res) => 
{
    res.sendFile(__dirname + "/index.html")
})

//get / students
app.get('/students', (req, res) => 
{
    mysql.getStudents()
        .then((data) => 
        {
            res.render("listStudents", { students: data });
        })
        .catch((error) => 
        {
            res.send(error);
        })
})

//get / add students
app.get('/addStudent', (req, res) => 
{
    res.render("addStudent", { errors: undefined, sid: undefined, name: undefined, gpa: undefined });
})

//get for students/delete
app.get('/students/delete/:sid', (req, res) => 
{

    //delete student function
    mysql.deleteStudent(req.params.sid)
        .then((data) => 
        {
            
            if (data.length == 0) 
            {
                res.send('<h1>No such student with id = ' + req.params.sid + '</h1> <p><a href="/">Home</p>')
            }
            else 
            {
                res.redirect("/students");
            }
        })
        .catch((error) => {
            // Else, send an error onscreen (MYSQL error)
            res.send(error);
        })
})

//get for add student page
app.post('/addStudent',
    [
        //checking/validation
        check('sid').isLength({ min: 4 }).withMessage("Student ID must be 4 characters"),
        check('name').isLength({ min: 5 }).withMessage("Name must be atleast 5 characters"),
        check('gpa').isFloat({ min: 0.0, max: 4.0 }).withMessage("GPA must be between 0.0 & 4.0")
    ],
    (req, res) => 
    {

        //error/validation checker
        var errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.render('addStudent', { errors: errors.errors, sid: req.body.sid, name: req.body.name, gpa: req.body.gpa });
        }
        else 
        {
            //addStudent function
            mysql.addStudent(req.body)
                .then((data) => 
                {
                    res.redirect("/students");
                })
                .catch((error) => 
                {
                    err = { msg: "Error: " + error.message };
                    errors = [];
                    errors.push(err);
                    res.render('addStudent', { errors: errors, sid: req.body.sid, name: req.body.name, gpa: req.body.gpa });
                })
        }
    })

//get for modules page
app.get('/modules', (req, res) => 
{

    // get modules function
    mysql.getModules()
        .then((data) => 
        {
            res.render("listModules", { modules: data });
        })
        .catch((error) => 
        {
            res.send(error);
        })
})

//get for module edit
app.get('/module/edit/:mid', (req, res) => 
{
    //getmodulebyid function
    mysql.getModulebyID(req.params.mid)
        .then((data) => 
        {
            if (data.length == 0) 
            {
                res.send('<h1>No such module with id = ' + req.params.mid + '</h1> <p><a href="/">Home</p>')
            }
            else 
            {
                res.render("editModule", { errors: undefined, module: data[0] });
            }

        })
        .catch((error) => 
        {
            res.send('<h1>Error occured while retrieving specified module</h1> <p><a href="/">Home</p>');
        })

    app.post("/module/edit/:mid",
        [
            //check for 5 caracthers and 5 10 15 gpa
            check('name').isLength({ min: 5 }).withMessage("Module Name must be a minimum of at least 5 characters"),
            check('credits').isIn([5, 10, 15]).withMessage("The Credits should be 5,10 or 15")

        ],
        (req, res) => {

            //error/validation checker
            var errors = validationResult(req);
            if (!errors.isEmpty())
            {
                res.render('editModule', { errors: errors.errors, module: req.body });
            }
            else
            {
                //updatemodule function
                mysql.updateModule(req.body)
                    .then((data) =>
                    {
                        res.redirect('/modules');
                    })
                    .catch((error) => 
                    {
                        res.send(error)
                    })
            }
        }
    )
})

//get for module/student/mid
app.get('/module/students/:mid', (req, res) => 
{
  //studyingModule function
    mysql.studyingModule(req.params.mid)
        .then((data) => 
        {
            if (data.length == 0) 
            {
                res.send('<h1>No student is currently studying this module</h1> <p><a href="/">Home</p>')
            }
            else 
            {
                res.render("listStudying", { mid: req.params.mid, students: data })
            }
        })
        .catch((error) => 
        {
            res.send('<h1>Cannot retrieve list of students studying ' + req.params.mid + '</h1> <p><a href="/">Home</p>');
        })
})






