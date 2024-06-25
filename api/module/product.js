
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
        "id": {
            type: Number,
            unique: true
        },
        "title": {
            type: String
        },
        "price": {
            type: Number
        },
        "description": {
            type: String
        },
        "category": {
            type: String
        },
        "image": {
            type: String
        },
        "sold": {
            type: Boolean
        },
        "dateOfSale": {
            type: Date
        }
});

module.exports= mongoose.model('products', productSchema);