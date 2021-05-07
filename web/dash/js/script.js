function setMonth(selector) {
    document.querySelector(selector).innerHTML = moment().format('M');
}

function setDay(selector) {
    document.querySelector(selector).innerHTML = moment().format('D');
}

function setWeek(selector) {
    const week = ['日', '月', '火', '水', '木', '金', '土', '日']
    document.querySelector(selector).innerHTML = week[moment().format('d')];
}

function setWeather(selector) {
    fetch('./sample/weather.json').then(function(data) {
        data.json().then(function(d) {
            document.querySelector(selector).setAttribute('src', './img/weather/' + d.currently.icon + '.png');
        });
    });
}

function setWeather_(selector, idx) {
    fetch('./sample/weather.json').then(function(data) {
        data.json().then(function(d) {
            var temp = ('00' + String(d.hourly.data[idx].temperature).split('.')[0]).substr(-2).split('');
            el = document.querySelector(selector);
            var perc = ('000' + parseInt(d.hourly.data[idx].precipProbability * 100)).substr(-3).split('');

            if (temp[0] == '0') el.querySelector('span:nth-child(1)').classList.add('zero');
            if (perc[0] == '0') el.querySelector('span:nth-child(3)').classList.add('zero');
            if (perc[1] == '0') el.querySelector('span:nth-child(4)').classList.add('zero');

            el.querySelector('span:nth-child(1)').innerHTML = temp[0];
            el.querySelector('span:nth-child(2)').innerHTML = temp[1];
            el.querySelector('span:nth-child(3)').innerHTML = perc[0];
            el.querySelector('span:nth-child(4)').innerHTML = perc[1];
            el.querySelector('span:nth-child(5)').innerHTML = perc[2];

        });
    });
}

function setTrends(selector) {
    fetch('./sample/trends.json').then(function(data) {
        data.json().then(function(d) {
            text = '';
            for (var item of d[0].trends) {
                text += '<p>' + item.name + '</p>';
            }
            document.querySelector(selector).innerHTML = text;
        });
    });
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function setLuck(selector) {
    const mik = [
        '特吉',
        '大吉',
        '中吉',
        '小吉',
        '末吉',
    ]
    document.querySelector(selector).innerHTML = mik[getRandomInt(5)];
}

function setAniv(selector) {
    fetch('./sample/aniv.json').then(function(data) {
        data.json().then(function(d) {
            document.querySelector(selector).innerHTML = d[moment().format('MM-DD')];
        });
    });
}

function setSaying(selector) {
    fetch('./sample/saying.json').then(function(data) {
        data.json().then(function(d) {
            document.querySelector(selector).innerHTML = d[getRandomInt(d.length)];
        });
    });
}

setMonth('.month');
setDay('.day');
setWeek('.week');
setWeather('.weather');
setWeather_('.weather_1', 0);
setWeather_('.weather_2', 5);
setWeather_('.weather_3', 11);
setTrends('.trends');
setLuck('.luck');
setAniv('.aniv');
setSaying('.saying');