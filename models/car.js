const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    name:
    {
        type: String,
        required: true
    },
    carImage:
     { 
        type: String,
         required: true 
     },
    importType: 
    {   
        type: String, 
        enum: ['Commercial', 'Japan Import', 'Local', 'UK Import', 'SUV'],
        required: true
     },
    carMake: {
         type: String,
         },
    model: { 
        type: String, 
    },
    mileage: { 
        type: Number, 
        required: true 
    },
    transmission: {
         type: String, 
         required: true 
        },
    fuel: { 
         type: String,
         required: true 
        },
    engine: { 
        type: String,
         required: true
         },
    year: { 
        type: Number, 
        required: true 
    },
    price: {
        type: Number,
        required: true
    }
},
{timestamps:true}
);

module.exports = mongoose.model('cars', carSchema);
