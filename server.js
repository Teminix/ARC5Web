const l = console.log;
const colors = require("colors")
const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
const express = require("express");
const child_process = require("child_process");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extented:false}))
app.use(bodyParser.json());
const globals = {
  host:"0.0.0.0",
  port:8001,
  mongoPort:8000
};
app.get("/",(req,res) => {
  res.send("hmmmmmmmmm")
})
app.get("/*(.js|.css|.woff|.ttf|.otf)")
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
