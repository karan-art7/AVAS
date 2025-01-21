const mongoose = require('mongoose');

const roomSchema = mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    awayFromHighway: { type: String },
    capacity: { type: Number },
    price: { type: Number, required: true },
    imageUrls: [],
    currentBookings: [ {
        bookingid: String,
        fromdate: String,
        todate: String,
        userid: String,
        status: String,
      },
    ],
    description: { type: String, required: true },
    listedAt: { type: Date, default: Date.now },
}, {
    timestamps: true,
});

const roomModel = mongoose.model('room', roomSchema);

module.exports = roomModel;
