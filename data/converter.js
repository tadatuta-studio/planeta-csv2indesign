var _ = require('lodash');

function csv2array(csv) {
    csv = csv.replace('\\', '/');
    csv = csv.replace(/"""(.*)"""/g, '«$1»');
    csv = csv.replace(/""(.*)""/g, '«$1»');
    csv = csv.replace(/"(.*)"/g, '«$1»');

    var rows = csv.split('\n');

    return rows.map(function(row) {
        return row.split(';');
    });
}

function title2field(title) {
    title = title.toLowerCase();

    return {
        '№ п/п': 'id',
        'рубрика': 'category',
        'город': 'city',
        'раздел': 'section',
        'кол-во комнат / тип': 'type',
        'район': 'district',
        'улица': 'street',
        'ориентир': 'landmark',
        'площ.': 'area',
        'площ. уч.': 'landArea',
        'тип план.': 'layout',
        'эт./эт.': 'floor',
        'примечание': 'notice',
        'конт. инф., конт. телефон': 'contacts',
        'цена\r': 'price'
    }[title] || title;
}

function preprocessField(field, value) {
    if (field === 'price') return value.replace(',\r', '');

    return value;
}

function transformData(csv) {
    var data = csv2array(csv),
        fields = data.shift().map(title2field);

    return data.reduce(function(transformed, row) {
        var obj = row.reduce(function(prev, cell, idx) {
            if (!cell || cell === '\r') return prev;

            var field = fields[idx];

            if (field) {
                prev[field] = preprocessField(field, cell);
            }

            return prev;
        }, {});

        // drop useless records
        if (+obj.id > 0) {
            transformed.push(obj);
        }

        return transformed;
    }, []);
};

module.exports = transformData;
