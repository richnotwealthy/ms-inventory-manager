var express = require('express');
var router = express.Router();

var {
	sequelize,
	Rooms,
	Equipment,
	Lendables,
	Workers,
	History,
	HistoryWorkers
} = require('./sqlize');


// gets a raw array of all rooms in the database
router.get('/get/rooms', (req, res) => {
	Rooms.findAll({ raw: true, order: [['rid', 'ASC']] }).then(rooms => {
		res.json(rooms);
	});
});


// creates new room
router.post('/new/room', (req, res) => {
	const { rid, rstatus } = req.body;

	Rooms.create({ rid, rstatus }).then(r => {
		res.json(r);
	});
});


// deletes room
router.post('/delete/room', (req, res) => {
	const { rid } = req.body;

	Rooms.findOne({ where: { rid } }).then(room => {
		room.destroy().then(r => res.json(r));
	});
});


module.exports = router;
