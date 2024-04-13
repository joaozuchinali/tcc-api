function returnAbsentProps(object, expected) {
    const empty = [];

    for (const iterator of expected) {
        if(
            object[iterator] == undefined || 
            object[iterator] == null || 
            (
                !object[iterator] && object[iterator] !== false
            )
        ) {
            empty.push(iterator);
        }
    }

    return empty;
}

function convertUrlParamsToObject(req) {
    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    const current_url = new URL(fullUrl);
    const search_params  = current_url.searchParams;
    const iterator = search_params.entries();
    const map = Object.fromEntries(iterator);
    return map;
}

function isEmptyObject(obj) {
    for(var prop in obj) {
        if(Object.prototype.hasOwnProperty.call(obj, prop)) {
            return false;
        }
    }
    
    return JSON.stringify(obj) === JSON.stringify({});
}

function toIsoString() {
    let date = new Date();

    var tzo = -date.getTimezoneOffset(),
        dif = tzo >= 0 ? '+' : '-',
        pad = function(num) {
            return (num < 10 ? '0' : '') + num;
        };
  
    return date.getFullYear() +
        '-' + pad(date.getMonth() + 1) +
        '-' + pad(date.getDate()) +
        'T' + pad(date.getHours()) +
        ':' + pad(date.getMinutes()) +
        ':' + pad(date.getSeconds()) +
        dif + pad(Math.floor(Math.abs(tzo) / 60)) +
        ':' + pad(Math.abs(tzo) % 60);
}

function getRandomId(configs = {}) {
    const codeSize = configs.codeSize ? configs.codeSize : 9;
    const values = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const len = values.length;

    function rec(iteration) {
        const pos = Math.random() * (len - 1);
        const chr = values[Math.round(pos)];

        if(iteration == 0) 
            return chr;
        else 
            return chr + rec(iteration - 1);
    }

    const code = rec(codeSize);
    return code;
}

module.exports.returnAbsentProps = returnAbsentProps;
module.exports.convertUrlParamsToObject = convertUrlParamsToObject;
module.exports.isEmptyObject = isEmptyObject;
module.exports.toIsoString = toIsoString;
module.exports.getRandomId = getRandomId;
