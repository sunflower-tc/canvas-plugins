/**
 * Created by lvlq on 15/7/26.
 */
module.exports.production = {
    "host": "127.0.0.1",
    "port": 6379,
    "options": {
        no_ready_check: true
    }
};

module.exports.development = {
    "host": "139.196.25.62",
    "port": 6379,
    "options": {
        no_ready_check: true
    }
};