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
	etype: { type: Sequelize.STRING(25), primaryKey: true },
	estatus: Sequelize.STRING(1),
  rid: { type: Sequelize.STRING(10), primaryKey: true }
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

History.hasMany(HistoryWorkers, {
  foreignKey: 'rid',
  scope: {
    htimestamp: sequelize.where(
      sequelize.col('histories.htimestamp'),
      '=',
      sequelize.col('histories_workers.htimestamp')
    )
  }
});
Workers.hasMany(HistoryWorkers, { foreignKey: 'netid' });
HistoryWorkers.hasMany(Workers, { foreignKey: 'netid' });
HistoryWorkers.hasMany(History, {
  foreignKey: 'rid',
  scope: {
    htimestamp: sequelize.where(
      sequelize.col('histories_workers.htimestamp'),
      '=',
      sequelize.col('histories.htimestamp')
    )
  }
});

module.exports = {
	sequelize,
	Rooms,
	Equipment,
	Lendables,
	Workers,
	History,
  HistoryWorkers
};
