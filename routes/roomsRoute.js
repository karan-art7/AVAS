const express = require('express');
const router = express.Router();
const Room = require('../models/room'); 

router.get('/getallrooms', async (req, res) => {
    try {
        const rooms = await Room.find({});
        if (!rooms) {
            return res.status(404).json({ error: 'No rooms found.' });
        }
        res.send(rooms);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    } 
});

router.post('/getroombyid', async (req, res) => {
    const { roomid } = req.body;

    try {
        const room = await Room.findOne({ _id: roomid });
        res.send(room);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});


module.exports = router;
