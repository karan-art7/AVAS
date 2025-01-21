const express = require('express');
const router = express.Router();
const Booking = require('../models/booking')
const Room = require('../models/room')
router.post('/bookroom', async (req, res) => {
  try {
    const {
      room,
      userid,
      fromdate,
      todate,
      totalamount,
      totaldays,
    } = req.body;

    if (!room || !userid || !fromdate || !todate || !totalamount || !totaldays) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newbooking = new Booking({
      room: room.name,
      roomid: room._id,
      userid,
      fromdate,
      todate,
      totalamount,
      totaldays,
      transactionId: '1234',
    });

    const booking = await newbooking.save();

    const roomtemp = await Room.findOne({ _id: room._id });
    if (!roomtemp) {
      return res.status(404).json({ message: "Room not found" });
    }
    
    console.log("Room before update:", roomtemp);
    
    roomtemp.currentBookings.push({
      bookingid: booking._id,
      fromdate,
      todate,
      userid,
      status: booking.status,
    });
    
    try {
      await roomtemp.save();
    } catch (error) {
      console.error("Error saving room with updated bookings:", error);
      return res.status(500).json({ message: "Failed to update room bookings" });
    }
  
    res.send('Room Booked Successfully');
  } catch (error) {
    console.error("Booking Error:", error);
    return res.status(400).json({ message: error.message });
  }
});

  
module.exports = router
