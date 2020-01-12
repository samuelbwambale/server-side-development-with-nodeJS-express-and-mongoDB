const mongoose = require('mongoose');
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const dishSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    label: {
        type: String,
        default: ''
    },
    price: {
        type: Currency,
        required: true,
        min: 0
    },
    featured: {
        type: Boolean,
        default: false
    },
    comments: [commentSchema]
}, {
    timestamps: true
});

const Dishes = mongoose.model('Dish', dishSchema);

module.exports = Dishes;

/*

{
    "name": "Dish One",
    "description": "This is first dish",
    "image": "images/dishOne.png",
    "category": "mains",
    "label": "Hot",
    "price": "4.99",
    "featured": true,
    "comments": [
    	{
    		"rating": 5,
    		"comment": "A unique taste",
    		"author": "Allan Smith"
		},
		{
    		"rating": 4,
    		"comment": "A combination of Adian and American cuisine",
    		"author": "Lorem Ipsum"
		}
	]
}

*/