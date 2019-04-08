CREATE DATABASE  IF NOT EXISTS `msim`;
USE `msim`;

--
-- Table structure for table `rooms`
--

DROP TABLE IF EXISTS `rooms`;

CREATE TABLE `rooms` (
  `rid` varchar(10) NOT NULL,
  `rstatus` varchar(1) NOT NULL,
  PRIMARY KEY (`rid`),
  UNIQUE KEY `rid_UNIQUE` (`rid`)
);

--
-- Table structure for table `lendables`
--

DROP TABLE IF EXISTS `lendables`;

CREATE TABLE `lendables` (
  `lid` varchar(25) NOT NULL,
  `ltype` varchar(25) NOT NULL,
  `rid` varchar(10) DEFAULT NULL,
  `lstatus` varchar(1) NOT NULL,
  PRIMARY KEY (`lid`),
  KEY `rid_idx` (`rid`),
  CONSTRAINT `lendable_room` FOREIGN KEY (`rid`) REFERENCES `rooms` (`rid`) ON DELETE SET NULL ON UPDATE CASCADE
);

--
-- Table structure for table `equipment`
--

DROP TABLE IF EXISTS `equipment`;

CREATE TABLE `equipment` (
  `etype` varchar(25) NOT NULL,
  `estatus` varchar(1) NOT NULL,
  `rid` varchar(10) NOT NULL,
  PRIMARY KEY (`etype`,`rid`),
  KEY `rid_idx` (`rid`),
  CONSTRAINT `equipment_room` FOREIGN KEY (`rid`) REFERENCES `rooms` (`rid`) ON DELETE CASCADE ON UPDATE CASCADE
);

--
-- Table structure for table `workers`
--

DROP TABLE IF EXISTS `workers`;

CREATE TABLE `workers` (
  `netid` varchar(10) NOT NULL,
  `wname` varchar(100) NOT NULL,
  PRIMARY KEY (`netid`)
);

--
-- Table structure for table `histories`
--

DROP TABLE IF EXISTS `histories`;

CREATE TABLE `histories` (
  `rid` varchar(10) NOT NULL,
  `htimestamp` datetime NOT NULL,
  `hdescription` mediumtext,
  PRIMARY KEY (`rid`,`htimestamp`),
  CONSTRAINT `histories_room` FOREIGN KEY (`rid`) REFERENCES `rooms` (`rid`) ON DELETE CASCADE ON UPDATE CASCADE
);

--
-- Table structure for table `histories_workers`
--

DROP TABLE IF EXISTS `histories_workers`;

CREATE TABLE `histories_workers` (
  `rid` varchar(10) NOT NULL,
  `htimestamp` datetime NOT NULL,
  `netid` varchar(10) NOT NULL,
  PRIMARY KEY (`rid`,`htimestamp`,`netid`),
  KEY `histories_workers_netid_idx` (`netid`),
  CONSTRAINT `histories_workers_history` FOREIGN KEY (`rid`, `htimestamp`) REFERENCES `histories` (`rid`, `htimestamp`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `histories_workers_netid` FOREIGN KEY (`netid`) REFERENCES `workers` (`netid`) ON DELETE CASCADE ON UPDATE CASCADE
);
