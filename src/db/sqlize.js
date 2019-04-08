const Sequelize = require('sequelize');

const DATABASE_URL = process.env.DATABASE_URL || 'mysql://root:password@localhost:3306/msim'

const sequelize = new Sequelize(DATABASE_URL,
	{
		dialect: 'mysql',
		pool: {
			max: 5,
			min: 0,
			acquire: 30000,
			idle: 10000
		},
	}
);

sequelize.authenticate()
	.then(() => {
		console.log('Connection has been established successfully.');
	})
	.catch(err => {
		console.error('Unable to connect to the database:', err);
	});

// sequelize Model definitions to make querying less verbose and more secure/consistent with db
const Rooms = sequelize.define('rooms', {
	rid: { type: Sequelize.STRING(10), primaryKey: true },
	rstatus: Sequelize.STRING(1)
}, { timestamps: false });

const Equipment = sequelize.define('equipment', {
	eid: { type: Sequelize.STRING(25), primaryKey: true },
  ename: Sequelize.STRING(25),
	etype: Sequelize.STRING(25),
	estatus: Sequelize.STRING(1),
  rid: Sequelize.STRING(10)
}, { timestamps: false });

const Lendables = sequelize.define('lendables', {
	lid: { type: Sequelize.STRING(25), primaryKey: true },
	ltype: Sequelize.STRING(25),
	rid: Sequelize.STRING(10),
	lstatus: Sequelize.STRING(1)
}, { timestamps: false });

const Workers = sequelize.define('workers', {
	netid: { type: Sequelize.STRING(10), primaryKey: true },
	wname: Sequelize.STRING(100)
}, { timestamps: false });

const History = sequelize.define('histories', {
	rid: { type: Sequelize.STRING(10), primaryKey: true },
	htimestamp: { type: Sequelize.DATE, primaryKey: true },
	hdescription: Sequelize.TEXT
}, { timestamps: true, createdAt: 'htimestamp', updatedAt: false });

const HistoryWorkers = sequelize.define('histories_workers', {
	rid: { type: Sequelize.STRING(10), primaryKey: true },
	htimestamp: { type: Sequelize.DATE, primaryKey: true },
	netid: { type: Sequelize.STRING(10), primaryKey: true }
}, { timestamps: false });

module.exports = {
	sequelize,
	Rooms,
	Equipment,
	Lendables,
	Workers,
	History,
  HistoryWorkers
};
