const dataObj = {};
const origin = require('../../app/app');

module.exports = {
    getData: (options) => {
        let results = {err_c: 404, err: true};

        console.log(options);

        if (options.tagId && dataObj[`${options.tagId}`]) results = {err_c: 200, err: false, results: {dataObj: dataObj[`${options.tagId}`]}};
        else if (options.tagId === 1 && dataObj[`${options.tagId}`]) results = {err_c: 200, err: false, results: {dataObj}};

        return results;
    },

    updateData: (entry, cb) => {
        console.log("New data entry!");

        for (const [key, value] of Object.entries(entry.data)) {
            origin.getRuuvi({ruuviId: key}, res => {
                
                if (dataObj[`${key}`]) {
                    dataObj[`${key}`] = module.exports.merging(dataObj[`${key}`], value);
                } else {
                    dataObj[`${key}`] = value;
                }

                if (res.err) {
                    console.log("Error: " + res.err);
                }   
            });
        }

        return true;
    },

    merging(original, from) {
        for (const [key, value] of Object.entries(from)) {
            if (!(value instanceof Object) || value instanceof Array) {
                if (original[key] instanceof Array) {
                    if (value instanceof Array) {
                        original[key] = original[key].concat(value);
                    } else {
                        original[key].push(value);
                    }
                } else {
                    original[key] = value;
                }
            } else {
                if (!original[key]) original[key] = {};
                origin[key] = this.merging(original[key], value);
            }
        }

        return original;
    }
}

console.log(module.exports.merging({b: {a: ['a']}}, {b: {c: ['b']}}));