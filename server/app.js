var express = require('express');
var path = require('path');
var fs = require('fs');
var xml2js = require('xml2js');
var bodyParser = require("body-parser");
var crypto = require('crypto');
var helmet = require('helmet');
var cookeParser =  require('cookie-parser');
var session =  require('express-session') ;

var app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(helmet()); // secure module
app.use(session({
    secret: 'cat',
    resave: false,
    saveUninitialized: true,
    key: 'sid',
    cookie: {
        path: '/',
        httpOnly: true,
        maxAge: null,
    }
  }));
//starting server
app.listen(3012, function(){
    console.log('Server started on :3012');
});

app.post('/signin', function(req, res){
    var newUser = req.body;
    //password+salt md5 hashing
    var saltedpass = newUser.password += 'соль';
    newUser.password = crypto.createHash('md5').update(saltedpass).digest('hex');
    var loggedUser = null;
    //get users obj from xml file
    var parser = new xml2js.Parser({trim: true, explicitArray: false, explicitRoot :false });
    fs.readFile(__dirname + '/db.xml', function(err, data) {
        var usersArray;
        parser.parseString(data,  function (err, result) {
            usersArray = result.user;
            //authentication check & authorization
            var userIsLogged = false;
            usersArray.forEach(el => {
                if (el.login == newUser.login && el.password == newUser.password) {
                    userIsLogged = true;
                    loggedUser = el;
                };
            });
            if (userIsLogged) {
                return res.status(200).send({message: `Hello ${loggedUser.name}`, userStatus: 'logged'});
            } else{
                return res.status(200).send({message: `Authentication failed. Check login and password`, userStatus: null});
            };
        });
    });
});

app.post('/signup', function(req, res){
    var newUser = req.body;
    var saltedpass = newUser.password += 'соль';
    newUser.password = crypto.createHash('md5').update(saltedpass).digest('hex');
    //get users obj from xml file
    var parser = new xml2js.Parser({trim: true, explicitArray: false, explicitRoot :false });
    fs.readFile(__dirname + '/db.xml', function(err, data) {
        var usersArray;
        parser.parseString(data,  function (err, result) {
            usersArray = result.user;
            //unique check
            var isLoginUnique = true;
            var isEmailUnique = true;
            usersArray.forEach(el => {
                if (el.login == newUser.login) {isLoginUnique = false; };
                if (el.email == newUser.email) {isEmailUnique = false;  };
            });
            if (isLoginUnique == false) { return res.status(200).send({message: 'not unique login'}) };
            if (isEmailUnique == false) { return res.status(200).send({message: 'not unique email'}) };
            //adding new user to xml
            usersArray.push(newUser);
            var builder = new xml2js.Builder({rootName : 'user', headless: true});
            var xml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<root>';
            for(i=0; i<usersArray.length;i++) {
                xml += `\n${builder.buildObject(usersArray[i])}`;
            }
            xml += '\n</root>';
            fs.writeFile('db.xml', xml , function(error){
                if(error) throw error;
                return res.status(200).send({message: `Thank you for registration, ${newUser.name}`});
            });
        });
    });
});