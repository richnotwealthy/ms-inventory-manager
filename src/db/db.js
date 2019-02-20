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

module.exports = router;
