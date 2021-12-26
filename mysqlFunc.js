var mysql = require('promise-mysql')
var pool;
//connect to db
mysql.createPool({
    connectionLimit: 5,
    user: 'root',
    password: '1234',
    database: 'collegedb'
})
.then(p =>
    {
    pool = p;
})
.catch(error => 
    {
    console.log(error);
})

//select all query for students table
function getStudents()
{
    return new Promise((resolve,reject) =>
    {
        pool.query("SELECT * from student")
        .then((data) => 
        {
            resolve(data);
        })
        .catch((error) => 
        {
            reject(error);
        })
    })
}
//add student function
function addStudent(newStudent)
{
    return new Promise((resolve,reject) =>
    {
        var myQuery = 
        {
            sql: "INSERT into student (sid,name,gpa) values (?,?,?);",
            values: [newStudent.sid,newStudent.name,newStudent.gpa]
        }

        pool.query(myQuery)
        .then((data) => 
        {
            resolve(data);
        })
        .catch((error) => 
        {
            reject(error);
        })
    })
}

//delete student function
function deleteStudent(sid){
    return new Promise((resolve,reject) =>{
        var myQuery = {
            sql: "DELETE from student WHERE sid = ?",
            values: [sid]
        }
        pool.query(myQuery)
        .then((data) => {
            resolve(data);
        })
        .catch((error) => {
            reject(error);
        })
    })
}


//select all query for modules
function getModules()
{
    return new Promise((resolve,reject) =>
    {
        pool.query("SELECT * from module")
        .then((data) => 
        {
            resolve(data);
        })
        .catch((error) => 
        {
            reject(error);
        })
    })
}

//query to return a module record matching the id
function getModulebyID(mid)
{
    return new Promise((resolve,reject) =>{
        
        var myQuery =
        {
            sql: "SELECT * from module WHERE mid = ?",
            values: [mid]
        }
        pool.query(myQuery)
        .then((data) => 
        {
            resolve(data);
        })
        .catch((error) => 
        {
            reject(error);
        })
    })
}

//makes a query to return all student records where the id is linked to a module
function studyingModule(mid)
{
    return new Promise((resolve,reject) =>
    {
        
        var myQuery = 
        { 
            sql: "SELECT m.mid,s.name,s.sid,s.name,s.gpa from student_module m INNER JOIN student s ON m.sid = s.sid WHERE m.mid = ?;",
            values: [mid]
        }
        
        pool.query(myQuery)
        .then((data) => 
        {
            resolve(data);
        })
        .catch((error) => 
        {
            reject(error);
        })
    })
}

//update module function
function updateModule(updatedModule)
{
    return new Promise((resolve,reject) =>
    {
        
        var myQuery = 
        {
            sql: "UPDATE module SET name = ?, credits = ? WHERE mid = ?",
            values: [updatedModule.name,updatedModule.credits,updatedModule.mid]
        }
        
        pool.query(myQuery)
        .then((data) => 
        {
            resolve(data);
        })
        .catch((error) => 
        {
            reject(error);
        })
    })
}

//module exports
module.exports = {getStudents, addStudent, deleteStudent, getModules, getModulebyID, studyingModule, updateModule,};