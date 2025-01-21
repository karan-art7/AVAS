const express = require('express');
const cors = require('cors');
const app = express();

const dbconfig = require('./db');
const roomsRoute = require('./routes/roomsRoute');
const usersRoute = require('./routes/usersRoute');
const bookingsRoute = require('./routes/bookingsRoute');

app.use(cors({
    origin: 'http://localhost:3000', // Replace with the URL of your frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed HTTP methods
    credentials: true, // Include credentials like cookies in requests if needed
}
));

app.use(express.json());
app.use('/api/rooms',  roomsRoute)
app.use('/api/users', usersRoute)
app.use('/api/bookings', bookingsRoute);
app.use ((req, res, next) => {
    console.log(`Request received: ${req.method} ${req.url}`);
    next();    
})

const port =process.env.PORT || 5000;
app.listen(5000, () => {
    console.log(`Node server started on port ${port}`);
});
