const express = require('express');
const router = express.Router();
const _ = require('lodash');

const {
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

// should be passing in an object with matching rid  but new rstatus
router.post('/set/room', (req, res) => {
	const { rid, rstatus } = req.body;

	Rooms.findOne({ where: { rid }}).then(room => {
		room.rstatus = rstatus;
		room.save().then(r => res.json(r));
	});
});

// creates new equipment and assigns to room
router.post('/new/equipment', (req, res) => {
	const { rid, etype, estatus } = req.body;

	Equipment.create({ rid, etype, estatus }).then(r => {
		res.json(r);
	});
});

// gets a raw array of all equipment in the database (stuff in rooms)
router.get('/get/equipment', (req, res) => {
	Equipment.findAll({ raw: true, order: [['etype', 'ASC']] }).then(equipment => {
		res.json(equipment);
	});
});

// should be passing in an object with matching rid and etype but new estatus
router.post('/set/equipment', (req, res) => {
	const { rid, etype, estatus } = req.body;

	Equipment.findOne({ where: { rid, etype }}).then(eqpmt => {
		eqpmt.estatus = estatus;
		eqpmt.save().then(r => res.json(r));
	});
});

// deletes equipment
router.post('/delete/equipment', (req, res) => {
	const { rid, etype } = req.body;

	Equipment.findOne({ where: { rid, etype } }).then(eqpmt => {
		eqpmt.destroy().then(r => res.json(r));
	});
});

// creates new log to histories
router.post('/new/history', (req, res) => {
	const { rid, hworkerList, hdescription } = req.body;

	History.create({ rid, hdescription }).then(r => {
    hworkerList.forEach(netid => {
      HistoryWorkers.create({ rid: r.rid, htimestamp: r.htimestamp, netid })
    });

		res.json(r);
	});
});

// gets a raw array of history for the rooms in the database
router.get('/get/history', (req, res) => {
	History.findAll({
    raw: true,
    include: HistoryWorkers,
    order: [['htimestamp', 'DESC']]
  }).then(history => {
		res.json(_.map(_.groupBy(history, h => h.rid + h.htimestamp), h => {
      const hworkerList = _.map(h, 'histories_workers.netid');
      return {
        rid: h[0].rid,
        htimestamp: h[0].htimestamp,
        hdescription: h[0].hdescription,
        hworkerList
      }
    }));
	});
});

// gets a raw array of all lendables in the database (stuff we lend out)
router.get('/get/lendables', (req, res) => {
	Lendables.findAll({ raw: true, order: [['lid', 'ASC']] }).then(lendables => {
		res.json(lendables);
	});
});

// gets a raw lendable object based on lid
router.post('/get/lendable', (req, res) => {
	Lendables.findOne({ where: { ...req.body }, raw: true }).then(lendable => {
		res.json(lendable);
	});
});

// creates new lendable
router.post('/new/lendable', (req, res) => {
	const { lid, ltype, lstatus } = req.body;

	Lendables.create({ lid, ltype, lstatus }).then(r => {
		res.json(r);
	});
});

// deletes lendable
router.post('/delete/lendable', (req, res) => {
	const { lid } = req.body;

	Lendables.findOne({ where: { lid } }).then(lndble => {
		lndble.destroy().then(r => res.json(r));
	});
});

// should be passing in an object with matching lid  but new rid
router.post('/set/lendable/room', (req, res) => {
	const { lid, rid } = req.body;

	Lendables.findOne({ where: { lid }}).then(lendable => {
		lendable.rid = rid;
		lendable.save().then(r => res.json(r));
	});
});

// should be passing in an object with matching lid  but new lstatus
router.post('/set/lendable/status', (req, res) => {
	const { lid, lstatus } = req.body;

	Lendables.findOne({ where: { lid }}).then(lendable => {
		lendable.lstatus = lstatus;
		lendable.save().then(r => res.json(r));
	});
});

// gets a raw array of workers
router.get('/get/workers', (req, res) => {
	Workers.findAll({ raw: true, order: [['netid', 'ASC']] }).then(workers => {
		res.json(workers);
	});
});

// creates new worker
router.post('/new/worker', (req, res) => {
	const { netid, wname } = req.body;

	Workers.create({ netid, wname }).then(r => {
		res.json(r);
	});
});

// deletes worker
router.post('/delete/worker', (req, res) => {
	const { netid } = req.body;

	Workers.findOne({ where: { netid } }).then(worker => {
		worker.destroy().then(r => res.json(r));
	});
});

module.exports = router;
