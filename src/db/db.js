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

// gets a raw array of all lendables in the database (stuff we lend out)
router.get('/get/lendables', (req, res) => {
	Lendables.findAll({ raw: true, order: [['lid', 'ASC']] }).then(lendables => {
		res.json(lendables);
	});
});

// creates new lendable
router.post('/new/lendable', (req, res) => {
	const { lid, ltype, lstatus } = req.body;

	Lendables.create({ lid, ltype, lstatus }).then(r => {
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

// deletes lendable
router.post('/delete/lendable', (req, res) => {
	const { lid } = req.body;

	Lendables.findOne({ where: { lid } }).then(lndble => {
		lndble.destroy().then(r => res.json(r));
	});
});

module.exports = router;
