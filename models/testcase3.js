var mongoose = require('mongoose');

var restaurantSchema2 = mongoose.Schema({
    name: String,
    restaurant_id: String
});

module.exports = restaurantSchema2;
