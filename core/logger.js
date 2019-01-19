module.exports = function(req,res,next){
  Date.prototype.getWeekDay = function(){
    let days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    return days[this.getDay()]
  }
  let ip = req.ip;
  let date = new Date();
  let weekDay = date.getWeekDay();
  let day = date.getDate();
  let year = date.getFullYear();
  let month = date.getMonth();
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let seconds = date.getSeconds()
  let method = req.method;
  let path = req.path;
  console.log(`<(${ip})> <(${day}/${month}/${year}) (${weekDay}) (${hours}:${minutes}:${seconds})> => {${method.toUpperCase()} --> "${path}"}`)
  next()
}
