'use strict';
var controller = {
    //Common methods accesable to the controllers
    responsify: function (err, data, res) {
        var response = {};
        if (err) {
            response.status = 'error';
            response.err = err;
        } else {
            response.status = 'success';
            response.err = '';
            response.json = data;
        }
        res(response);
    }
};
module.exports = controller;
