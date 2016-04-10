var fs = require('fs'),
    path = require('path'),
    _ = require('lodash'),
    converter = require('./converter');

var data = [
    {
        filename: 'data.csv'
    }
].reduce(function(prev, source) {
    var csv = fs.readFileSync(path.join(__dirname, source.filename), 'utf8');
    return prev.concat(converter(csv));
}, []);

function transform(data) {
    var byCity = _.groupBy(data, 'city');

    var cities = Object.keys(byCity);
    cities.forEach(function(city) {
        var cityObjects = _.groupBy(byCity[city], 'section');

        var objects = Object.keys(cityObjects);
        objects.forEach(function(object) {
            cityObjects[object] = _.sortBy(cityObjects[object], [
                'type',
                function(o) {
                    return parseInt(o.price.replace(/\s/g, ''));
                }
            ]);
        });

        byCity[city] = cityObjects;
    });

    return byCity;
}

fs.writeFileSync('data.json', JSON.stringify(transform(data), null, 4));
