// use express to handle client request
var express = require("express");
var app = express();
//use body parser for handling of post request
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(express.static("."));


//create an instance of a mysql connection
var mysql = require("mysql");
var con = mysql.createConnection({
	host: '127.0.0.1',
	user: 'root',
	password: 'cs275@Drexel',
	database: 'student'
});
con.connect (function (err){
	if(err){
		console.log("Error connecting to database");
        console.log(err);
	}
	else{
		console.log("Successfully connected to database");
	}
});

// get tables from database
app.get("/getTable", function (req, res){
    var tableName = req.query.tableName;
    console.log("processing request for " + tableName);
    
    var sql = "SELECT * FROM " + tableName;
	con.query(sql, function(err, rows, fields){
		if(err){
			console.log("Error: can not process query");
			console.log(err);
			res.send("Error: can not process query");
		}
		else{
			//contruct html string to be sent to client
			var str = '<table border="1"><tr>';
			//process column headers
			var headers = [];
			for(i=0; i<fields.length; i++){
				headers.push(fields[i].name);
				str += '<th>' + fields[i].name + '</th>';
			}
			str += '</tr>';
			//process row values
			for(i=0; i<rows.length; i++){
				str += '<tr>';
				for(j=0; j<headers.length; j++){
					str += '<td>' + rows[i][headers[j]] + '</td>';
				}
				str += '</tr>';
			}
            
			 str += '</table>'
			console.log('Sending ' + tableName);
			res.send(str);
		}
	});
});

//send html for transcripts display page
app.get('/transcript', function (req, res){
    //start contructing html to be sent to client
    var html = `<h2>Display a Student Transcript from Database</h2>
				<select id="studentOpts">`;
	//sql query for student info 
    sql = 'SELECT studentID, firstName, lastName FROM students ORDER BY lastName;';
	con.query(sql, function(err, rows, fields){
		if(err){
			console.log('Error during student query processing');
			console.log(err);
			res.send('Error during student query processing');
		}
		else{
			
			// drop-down with student info
			for(i=0; i<rows.length; i++){
				html += '<option value="' + rows[i].studentID + '">' + rows[i].lastName + ', ' + rows[i].firstName + '</option>';
			}
            console.log(err);
			html += '</select>';
    // dynamically populate the term selection
    con.query('SELECT DISTINCT(term) FROM grades;', function(err,rows,fields){
        if(err){
				console.log('Error during term query processing');
				console.log(err);
				res.send('Error during term query processing');
        }
        else{
					//populate drop-down with terms/years available
            html += '<select id="termOpts"><option value="all">All</option>';
            for(i=0; i<rows.length; i++){
                html += '<option value="' + rows[i].term + '">' + rows[i].term + '</option>';
            }
            html += `</select><input type='button' onclick='getTranscript()' value='Display Transcript'><div id='result'></div>`;
            console.log('Rendering transcript display page');
            res.send(html);
        }
    });
        }
    });
});


app.get('/getTranscript', function (req, res){ 
	//get student id and term from json 
	var studentID = req.query.studentID;
	var term = req.query.term;
	console.log('Processing transcript request for student ID=' + studentID);
	
	if(term == 'all'){
		//display all terms for student
		var sql = 'SELECT students.studentID, firstName, lastName,  course.courseID, courseDescription, grades.term, grade FROM course, grades, students WHERE students.studentID = grades.studentID AND course.courseID = grades.courseID AND students.studentID = "' + studentID + '";';
	}
	else{
		//display specific term for student
		var sql = 'SELECT students.studentID, firstName, lastName, course.courseID, courseDescription, grades.term, grade FROM students, course, grades WHERE students.studentID = grades.studentID AND course.courseID = grades.courseID AND students.studentID = "'+ studentID +'" AND term ="'+ term +'";';
	}
	
        con.query(sql, function(err, rows, fields){
            if(err){
                console.log('Error during transcript query processing');
                console.log(err);
                res.send('Error during transcript query processing');
            }
            else{
                // create table 
                var html = '<table border="1"><tr>';
                //get headers
                var headers = [];
                for(i=0; i<fields.length; i++){
                    headers.push(fields[i].name);
                    html += '<th>' + fields[i].name + '</th>';
                }
                html += '</tr>';
                //get row values
                for(i=0; i<rows.length; i++){
                    html += '<tr>';
                    for(j=0; j<headers.length; j++){
                        html += '<td>' + rows[i][headers[j]] + '</td>';
                    }
                    html += '</tr>';
                }
                html += '</table>'
                
                res.send(html);
            }
        });
    });

//add new student to student table in database
app.post('/addstudent', function (req, res){
	
	//get data from post html body and escape to prevent SQL injections
    var ID = con.escape(req.body.studentID);
	var first = con.escape(req.body.firstName);
	var last = con.escape(req.body.lastName);
	var dob = con.escape(req.body.DoB);
	var major = con.escape(req.body.major);
	console.log("First: " + first + " Last: " + last + " DoB: " + dob + " Major: " + major);
	
	//to check if student already exists, based on name and DoB
	var sql = "SELECT firstName, lastName, dateOfBirth, major FROM students WHERE firstName = "+ first +" AND lastName = " + last + " AND dateOfBirth = " + dob + ";";
	con.query(sql, function(err, rows, fields){
		if(err){
			console.log("Error: can not process query");
			console.log(err);
			res.send("Error: can not process query");
		}
		else if(rows.length>0){ 
			console.log("Error: student already exists");
			res.send("Error: student already exists!");
		}
		else{ 
            //add new student into database
			var sqlAdd = "INSERT INTO students(studentID, firstName, lastName, dateOfBirth, major)VALUES("+ ID + "," + first + "," + last + "," + dob + "," + major + ");";
			con.query(sqlAdd, function(err, rows, fields){
				if(err){
					console.log("Error: can not process query");
					console.log(err);
					res.send("Error: can not process query");
				}
				else{
					console.log("Added new student to database");
					res.send("Student Added!");
				}
			});
		}
	});
});
// the server listen to port
app.listen(8080, function(){
    console.log("Server Runing...");
});