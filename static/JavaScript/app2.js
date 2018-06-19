'use strict';

let response, flag;

document.addEventListener('DOMContentLoaded', function() {
    init();
});

function init() {
    let city = 'Kortrijk'
    let placeInput = document.getElementById('place');
    placeInput.addEventListener('keypress', function(e) {
        if (e.keyCode == 13) {
            getWeather(e.target.value)
        }
    });
    getWeather(city);
}

function displayForecast() {
    let responseSection = document.getElementById('response');

    console.log(flag);
    let city = response.query.results.channel.location.city;
    let country = response.query.results.channel.location.country;
    let sunrise = response.query.results.channel.astronomy.sunrise;
    let sunset = response.query.results.channel.astronomy.sunset;
    let minimum = Math.round(convert2Celsius(response.query.results.channel.item.forecast[0].low));
    let maximum = Math.round(convert2Celsius(response.query.results.channel.item.forecast[0].high));
    console.log(response.query.results.channel.location.country);
    let current_temp = Math.round(convert2Celsius(response.query.results.channel.item.condition.temp));

    let text = '<b>' + city + ', ' + country + ' ' + flag + '</b><br>The current temp is: ' + current_temp + '°C<br> Max: ' + maximum + '°C <br> Min: ' + minimum + '°C <br>The sun will come up at ' + sunrise + ' and will go under at ' + sunset + '.';
    responseSection.innerHTML = text;

}

function drawChart() {
    let labels = [];
    let dataMax = [];
    let dataMin = [];
    for (let i = 0; i < 10; i++) {
        labels.push(response.query.results.channel.item.forecast[i].day);
        dataMax.push(Math.round(convert2Celsius(response.query.results.channel.item.forecast[i].high)));
        dataMin.push(Math.round(convert2Celsius(response.query.results.channel.item.forecast[i].low)));
    }
    var ctx = document.getElementById('myChart').getContext('2d');
    var chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: "Maximum",
                borderColor: "#3ED783",
                fill: 1,
                data: dataMax,
            }, {
                label: "Minima",
                borderColor: '#459945',
                backgroundColor: 'rgba(0,0,0,0)',
                data: dataMin,
            }]
        },
        options: {}
    });
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
                    flag = flags[i].emoji
                    displayForecast();
                    drawChart();
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