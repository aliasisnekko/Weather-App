const express = require('express');
const https = require('https'); //doesnt have to be installed due to being a native node module
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.urlencoded({ extended: true })); //this is necessary to use/parse/read through our documents post request

app.get('/', function(req, res) {
    res.sendFile(__dirname + "/index.html"); //this grabs/gets our index file from the current directory and sends it to our server to be printed
});
app.post("/", function(req, res) { //this grabs our button/post method so we can affect it
    var query = req.body.cityName; //this is what gets entered into our html doc
    const apiKey = "f5d7c24a7ecdef3e61276af6ce48a93d";
    const units = "imperial";
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + units;



    https.get(url, function(response) {
        console.log(response.statusCode);

        response.on('data', function(data) {
            const weatherData = JSON.parse(data); //w/o parsing the data into a JSON file a binary file will be written into the terminal,  also the opposite of JSON.stringify
            var temp = weatherData.main.temp;
            const weatherDescription = weatherData.weather[0].description;
            const location = weatherData.name;
            const icon = weatherData.weather[0].icon;
            const imageURL = ("https://openweathermap.org/img/wn/" + icon + "@2x.png") // this came from docs we just added our own icon to the api endpoint
            res.write("<h1 style='text-align:center'>" + "The temperature in " + location + " is " + temp + " degrees fahrenheit" + "</h1>")
            res.write("<p style='text-align:center'>The weather is currently " + weatherDescription + "</p>") //only one res.send can be send per app per page so this is how we get around that
            res.write("<div style='text-align:center'><img src=" + imageURL + "></div>");
            res.send();
        })
    })

})

app.listen(process.env.PORT || 3000, function() {
    console.log("The server is being ran on port 3000")
});