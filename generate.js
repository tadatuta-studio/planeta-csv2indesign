var fs = require('fs');

var header = fs.readFileSync('templates/header.tmpl', 'utf-16le');
var cityTitle = fs.readFileSync('templates/cityTitle.tmpl', 'utf-16le');
var item = fs.readFileSync('templates/item.tmpl', 'utf-16le');
var subtitle = fs.readFileSync('templates/subtitle.tmpl', 'utf-16le');

var data = require('./data');
var cities = Object.keys(data);

var result = header;

cities.forEach(function(cityName) {
    result += cityTitle.replace('%%city%%', cityName);

    var city = data[cityName];
    var sections = Object.keys(city);

    sections.forEach(function(sectionName) {
        if (sectionName !== 'Жилая недвижимость') {
            result += subtitle.replace('%%section%%', sectionName);
        }

        var items = city[sectionName];
        items.forEach(function(itemData) {
            result += item
                .replace('%%type%%', itemData.type || '')
                .replace('%%area%%', itemData.area ? itemData.area + ';' : '')
                .replace('%%notice%%', itemData.notice ? itemData.notice.substr(0, 55) : '')
                .replace('%%floor%%', itemData.floor || '')
                .replace('%%layout%%', itemData.layout || '')
                .replace('%%contacts%%', itemData.contacts || '')
                .replace('%%street%%', itemData.street ? itemData.street + (itemData.landmark ? ' ' : '') : '')
                .replace('%%landmark%%', itemData.street ? '' : itemData.landmark || '')
                .replace('%%price%%', itemData.price || '');
        })
    });
});

result += '<tEnd:>';

fs.writeFileSync('result.txt', result, { encoding: 'utf-16le' });
