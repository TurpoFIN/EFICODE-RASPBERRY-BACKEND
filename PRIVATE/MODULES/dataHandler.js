const dataObj = {};
const origin = require('../../app/app');

module.exports = {
    getData: (options) => {
        let results = {err_c: 404, err: true};

        if (options.tagId && dataObj[`${options.tagId}`]) results = {err_c: 200, err: false, results: {dataObj: dataObj[`${options.tagId}`]}};
        else if (options.tagId === 1 && dataObj[`${options.tagId}`]) results = {err_c: 200, err: false, results: {dataObj}};

        return results;
    },

    updateData: (entry, cb) => {
        console.log("New data entry!");
        console.log(entry);

        for (const [key, value] of Object.entries(entry.data)) {
            console.log(`${key}: ${value}`);
            origin.getRuuvi({ruuviId: key}, res => {
                console.log(res);
                if (!res.err) {

                } else {
                    
                }
            });
        }

        return true;
    }
}