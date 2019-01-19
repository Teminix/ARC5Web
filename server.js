const l = console.log;
const colors = require("colors")
const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
const express = require("express");
const child_process = require("child_process");
const app = express();
const bodyParser = require("body-parser");
const dir = __dirname
const fs = require("fs")
const logger = require('./core/logger')
const ROOT = "ground/";
const session = require("express-session");
app.use(bodyParser.urlencoded({extended:false}))
app.use(logger);
app.use(session({
  secret:"Some secret",
  resave:true,
  saveUninitialized:true
}))
app.use(bodyParser.json());
app.use(function(req,res,next){
  res.giveFile = function(path){
    let finalpath = dir+"/"+path
    if (fs.existsSync(finalpath)) {
      res.sendFile(finalpath)
    } else {
      res.sendFile(dir+"/ground/404.html")
    }
  }
  next()
});
const globals = {
  host:"0.0.0.0",
  port:8001,
  mongoPort:8000
};
app.get("/",(req,res) => {
  res.send("Hello")
})
app.get("/login",(req,res) => {
  res.giveFile("tests/login.html")
})
app.get("/*(.jpg|.js|.css|.woff|.jpeg|.ttf|.otf)",(req,res) => {
  res.giveFile(ROOT+req.path);
  // l(dir+"/tests/"+req.path)
})
app.get('/test',(req,res) => {
  res.sendFile("/Users/Apple/Documents/My Work/Code learning center/Github tests/test1/ARC5Web/tests/flamingo.jpg")
})
app.get("/test/login",(req,res) => {
  // res.giveFile("tests/login.html");
  if (req.session.usr != undefined) {
    res.redirect("/test/session")
  } else {
    res.giveFile("tests/login.html")
  }
})
app.get("/test/session",(req,res) => {
  // res.type('json').send(req.session)
  if (req.session.usr != undefined) {
    res.send(`Here are your credentials: username: ${req.session.usr}; Display:${req.session.display}`)

  } else {
    res.redirect("/test/login")
  }
})
app.get("/test/logout",(req,res) => {
  delete req.session.usr;
  delete req.session.display;
  res.redirect("/test/signup");
})
app.post("/test/signup",(req,res) => {
  // session testing:
  let {usr, display} = req.body;
  if(usr == undefined || display == undefined){
    res.status(400).send("Invalid data format used");
  } else if (usr.trim() == "" || display.trim() == ""){
    res.status(400).send("Username and display name are compulsory")
  } else {
    req.session.usr = usr;
    req.session.display = display;
    res.send("Success");
  }
})
app.get("/test/signup",(req,res) => {
  res.giveFile("tests/signup.html");
})
app.get("/*",(req,res) => {
  res.sendFile(dir+"/ground/404.html");
})
app.listen(globals.port,globals.host);
child_process.exec("ipconfig getifaddr en0",(err,stdout,stderr) => {
  if (err) {
    throw err
  } else {
    l(`Webserver running on http://`,`${stdout.trim()}:${globals.port}`.white.bold.bgBlue);
    l("\n\nRegistered routes: \n\n".green.bold)
    app._router.stack.forEach((e) => {
      if (typeof e.route != "undefined") {
        l("* ",`[${Object.keys(e.route.methods).map(item=>item.toUpperCase()).join(", ")}] =>`.cyan.bold, `"${e.route.path}"`.white.bold);
      }
    })
  }
})
