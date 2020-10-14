const fs = require("fs");
const http = require("http");
const requests = require("requests");
const home = fs.readFileSync("home.html", "utf-8");

const replaceVal = (tempValue, originalData) => {
  let temperature = tempValue.replace("{%temp_value%}", originalData.main.temp);
  temperature = temperature.replace("{%city%}", originalData.name);
  temperature = temperature.replace("{%country%}", originalData.sys.country);
  temperature = temperature.replace("{%temp_s%}", originalData.weather[0].main);

  return temperature;
};

//console.log(home);

//lets create a sever

//installing a requests node package
const server = http.createServer((req, res) => {
  if (req.url == "/") {
    requests(
      "http://api.openweathermap.org/data/2.5/weather?q=Delhi&appid=b2f0681af727cabd50163e86261e83e7"
    )
      .on("data", function (chunk) {
        //When the data is available to read
        const objdata = JSON.parse(chunk); //converting JSON to object
        //now converting the objdata into array of objects
        const objarray = [objdata];
        // var ktemp = objarray[0].main.temp;
        // var ctemp = ktemp - 273.15;
        // console.log(ctemp.toFixed(2));

        const realtimedata = objarray.map((val) => replaceVal(home, val));
        //this realtimedata is none other than updated home file
        // res.write(realtimedata.join(""));
        // console.log(realtimedata.join(" "));
        res.write(realtimedata.join(" "));
      })
      .on("end", function (err) {
        if (err) return console.log("connection closed due to errors", err);
        res.end();

        console.log("end");
      });
  }
});
server.listen(3000, "127.0.0.1", () => {
  console.log("Server started");
});
