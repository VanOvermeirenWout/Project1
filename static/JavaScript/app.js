'use strict';

let response, flag;

document.addEventListener('DOMContentLoaded', function() {
    init();
});

function init() {
    let city = 'Kortrijk';
    let placeInput = document.getElementById('place');
    placeInput.addEventListener('keypress', function(e) {
        if (e.keyCode == 13) {
            getWeather(e.target.value)
        }
    });
    getWeather(city);
    let timer = setInterval(function(){getWeather(city)}, 150000);
}

function displayForecast() {
    let responseSection = document.getElementById('response');
    let responseSection_2 = document.getElementById('code');
    let responseCity = document.getElementById('location');
    let responseCurrent = document.getElementById('temp');
    console.log(flag);
    let code = response.query.results.channel.item.forecast[0].code;
    document.getElementById("weather_image").src="/static/svg/Code" + code + ".svg";
    // console.log(code);
    let city = response.query.results.channel.location.city;
    let country = response.query.results.channel.location.country;
    let sunrise = response.query.results.channel.astronomy.sunrise;
    let sunset = response.query.results.channel.astronomy.sunset;
    let current_temp = Math.round(convert2Celsius(response.query.results.channel.item.condition.temp));
    console.log(current_temp);
    let minimum = Math.round(convert2Celsius(response.query.results.channel.item.forecast[0].low));
    let maximum = Math.round(convert2Celsius(response.query.results.channel.item.forecast[0].high));
    console.log(response.query.results.channel.location.country);
    //let text = 'Her weer voor vandaag in ' + city + '<br><ul><li>Sunrise: ' + sunrise + '</li><li>Sunset: ' + sunset + '</li><li>Min: ' + minimum + '°C</li><li>Max: ' + maximum + '°C</li></ul>';
    let locatie = '<b>' + city + ', ' + country + '</b>';
    let temp = '<b>' + current_temp + '°C' + '</b>';
    let codeDoorsturen = code;
    // let text = '<b>' + city + ', ' + country + ' ' + flag + '</b><br>Het wordt maximum ' + maximum + '°c en de minima is ' + minimum + '°C vandaag. <br> De zon komt op om ' + sunrise + ' en gaat onder om ' + sunset + '.';
    // responseSection.innerHTML = text;
    responseCurrent.innerHTML = temp;
    responseSection_2.innerHTML = codeDoorsturen;
    responseCity.innerHTML = locatie;
}


function getWeather(city) {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            response = JSON.parse(this.responseText);
            console.log(response);
            getFlag(response.query.results.channel.location.country);
        }
    };
    let query = 'select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="' + city + '")';
    xhttp.open('GET', 'http://query.yahooapis.com/v1/public/yql?q=' + query + '&format=json', true);
    xhttp.send();
}

function getFlag(country) {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let flags = JSON.parse(this.responseText);
            console.log(flags);
            for (let i = 0; i < flags.length; i++) {
                if (flags[i].name == country) {
                    flag = flags[i].emoji;
                    displayForecast();
                    // drawChart();
                }
            }
        }
    };
    xhttp.open('GET', 'https://raw.githubusercontent.com/matiassingers/emoji-flags/master/data.json', true);
    xhttp.send();
}

function convert2Celsius(fahrenheit) {
    return (fahrenheit - 32) / 1.8;
}