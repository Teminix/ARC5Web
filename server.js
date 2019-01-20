const l = console.log;
const colors = require("colors");
const mongodb = require("mongodb");
const express = require("express");
const child_process = require("child_process");
const app = express();
const bodyParser = require("body-parser");
const dir = __dirname;
const fs = require("fs");
const {encrypt,decrypt} = require("./core/crypt.js");
const logger = require('./core/logger');
const ROOT = "ground/";
const session = require("express-session");
const MongoClient = mongodb.MongoClient;
const nodemailer = require("nodemailer");
const axios = require("axios");
app.use(bodyParser.urlencoded({extended:false}));
app.use(logger);
app.use(bodyParser.text());
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
app.post("/",(req,res) => {
  res.send("Data you sent: "+req.body)
})
app.get("/",(req,res) => {
  res.send("Hello")
})
app.get("/description",(req,res) => {
  res.giveFile("ground/description.html")
})
// app.get("/login",(req,res) => {
//   res.giveFile("ground/login.html")
// })
app.get("/*(.jpg|.js|.css|.woff|.jpeg|.ttf|.otf|.html)",(req,res) => {
  res.giveFile(ROOT+req.path);
  // l(dir+"/tests/"+req.path)
})
app.get('/test',(req,res) => {
  res.sendFile("/Users/Apple/Documents/My Work/Code learning center/Github tests/test1/ARC5Web/tests/flamingo.jpg")
})

app.get("/preftemp",(req,res) => {
  res.send("null for now")
})

app.get("/changeusr",(req,res) => {
  if (req.session.usr != undefined) {
    res.redirect("/login")
  } else {
    let usr = req.session.usr;
    (async function(){

    }()).catch(err=>{
      res.status(500).send("")
      l(err)
    })
  }
})
app.post("/changeusr",(req,res) => {
})
app.post("/mail/send",(req,res) => {
  // res.send(decrypt('43df3c2c36944aa507d1ebc62571f095','god'))

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'kabirdesarkar2016@gmail.com',
    pass: decrypt('43df3c2c36944aa507d1ebc62571f095','god')
  }
});

var mailOptions = {
  from: 'kabirdesarkar2016@gmail.com',
  to: 'kabirdesarkar@gmail.com',
  subject: 'Sending Email using Node.js',
  text: req.body
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    res.type("text").send("Sent email to kabirdesarkar");
  }
});
})
app.get("/login",(req,res) => {
  if (req.session.usr != undefined) {
    redirect("/session")
  } else {
    res.giveFile("ground/login.html")
  }
  // res.giveFile("ground/login.html")
})

app.post("/login",(req,res) => {
  let {usr,password} = req.body
  if (usr == undefined || password == undefined) {
    res.status(400).send("Invalid data format given")
  } else {
    (async function(){
      let client = await MongoClient.connect("mongodb://localhost:"+globals.mongoPort);
      let collection = client.db("codefest").collection("users");
      if (collection.countDocuments({username:usr,password:password}) == 0) {
        res.status(400).send("Username and password invalid")
      } else {
        req.session.usr = usr;
        req.session.password = password;

        res.send("Success");
      }
    }()).catch(err=>{
      res.status(500).send("Internal server error");
      l(err)
    })
  }

})


///////////////////////////////////////////
app.get("/session",(req,res) => {
  // res.type('json').send(req.session)
  if (req.session.usr != undefined) {
    res.type("html").send(`Here are your credentials: username: ${req.session.usr}; Display:${req.session.display}. <a href="logout">Logout here</a>`);
  } else {
    res.redirect("/login")
  }
})
app.get("/logout",(req,res) => {
  delete req.session.usr;
  delete req.session.display;
  res.redirect("/signup");
})
app.post("/signup",(req,res) => {
  // session testing:
  let {usr, password, confirm_password} = req.body;
  if(usr == undefined || password == undefined || confirm_password == undefined){
    res.status(400).send("Invalid data format used");
  } else if (usr.trim() == "" || password.trim() == "" || confirm_password.trim() == ""){
    res.status(400).send("Username, password and confirm password are compulsory")
  } else if (password != confirm_password) {
    res.status(400).send("Confirm password and password must be the same");
  } else {
    (async function(){
      let client = await MongoClient.connect("mongodb://localhost:"+globals.mongoPort);
      let collection = client.db("codefest").collection("users");
      let criteria = {username:usr};
      if (await collection.countDocuments(criteria) >= 1) {
        res.status(409).send("Username taken");
      } else {
        let doc = {
          username:usr,
          password:password
        }
        let confirm = await collection.insertOne(doc);
        req.session.usr = usr;
        res.send("Success");
      }
      client.close()
    }()).catch(err=>{
      res.status(500).send("Internal server error");
      l(err)
    })

  }
})
app.get("/signup",(req,res) => {
  if (req.session.usr != undefined) {
    res.redirect("/session")
  } else {
    res.giveFile("ground/signup.html")
  }
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
