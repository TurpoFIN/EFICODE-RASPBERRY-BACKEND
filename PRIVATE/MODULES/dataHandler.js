const dataObj = {};

module.exports = {
    getData: (options) => {
        let results = {err_c: 404, err: true};

        if (options.tagId && dataObj[`${options.tagId}`]) results = {err_c: 200, err: false, results: {dataObj: dataObj[`${options.tagId}`]}};
        else if (options.tagId === 1 && dataObj[`${options.tagId}`]) results = {err_c: 200, err: false, results: {dataObj}};

        return results;
    },

    updateData: (entry) => {
        console.log("New data entry!");
        console.log(entry);
    }
}