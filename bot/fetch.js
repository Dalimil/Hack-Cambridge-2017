
const request = require("request");

function getDevpost(username) {
    return new Promise((resolve, reject) => {
        request('http://example.com', function(error, response, body) {
            // Callback function
            if (!error && response.statusCode == 200) {
                const data = body.substring(0, 20);
                // console.log(data);
                resolve(data);
            } else {
                reject(response.statusCode);
            }
        });
    })
}

module.exports = {
    getDevpost
};

