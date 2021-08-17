const express = require("express");
const app = express();
const https = require("https");
const bodyParser = require("body-parser"); //deprecated

app.use(express.urlencoded({extended: true}));

app.get("/", function(req, res){
    res.sendFile(__dirname+"/index.html");
})

app.post("/", function(req, res){
    const userCity = req.body.cityName;
    const userUnit = req.body.units;
    const userApi = req.body.apiName;
    var tempMetric = "";
    if(userUnit == "metric"){
        tempMetric = "Celsius";
    } else if (userUnit == "imperial") {
        tempMetric = "Fahrenheit";
    } else {
        tempMetric = "Kelvin";
    }
    const weatherurl = `https://api.openweathermap.org/data/2.5/weather?q=${userCity}&appid=${userApi}&units=${userUnit}`;
    https.get(weatherurl, function(response){
        //console.log(response);
        response.on("data",function(data){
            const weatherData = JSON.parse(data);
            const city = weatherData.name;
            const cityTemp = weatherData.main.temp;
            const cityDesc = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const ImgURL = `https://openweathermap.org/img/wn/${icon}@2x.png`;
            const weatherReport = `
            <h2 align="center">The temperature in ${city} is ${cityTemp} degrees ${tempMetric}.</h2>
            <h3 align="center">There may be ${cityDesc}.</h3>
            <center><img src="${ImgURL}"></center> 
            `; 
            res.send(weatherReport);
        })
    })

})


app.listen(3000, function(req, res){
    console.log("--->> Server running on port 3000 <<---")
} )