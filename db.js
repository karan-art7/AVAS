const mongoose = require('mongoose');

var mongoURL = 'mongodb+srv://kg121bit:karan121@cluster0.imzpo.mongodb.net/Avas'

mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true })

var connect = mongoose.connection

connect.on('connected', () => {
    console.log('Connected to MongoDB')
})
connect.on('error', () => {
    console.log('Error connecting to MongoDB')
})


module.exports = mongoose;                               