-- phpMyAdmin SQL Dump
-- version 4.9.2
-- https://www.phpmyadmin.net/
--
-- Host: classmysql.engr.oregonstate.edu:3306
-- Generation Time: Mar 14, 2020 at 12:04 PM
-- Server version: 10.4.11-MariaDB-log
-- PHP Version: 7.0.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cs340_bechtelg`
--

-- --------------------------------------------------------

--
-- Table structure for table `Acts`
--

CREATE TABLE `Acts` (
  `id` int(11) UNSIGNED NOT NULL,
  `name` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Acts`
--

INSERT INTO `Acts` (`id`, `name`) VALUES
(27, 'I'),
(2, 'II'),
(3, 'III'),
(4, 'IV'),
(32, 'V');

-- --------------------------------------------------------

--
-- Table structure for table `Act_Runs`
--

CREATE TABLE `Act_Runs` (
  `id` int(11) UNSIGNED NOT NULL,
  `player_id` int(11) UNSIGNED NOT NULL,
  `act_id` int(11) UNSIGNED NOT NULL,
  `time` time NOT NULL,
  `class_id` int(11) UNSIGNED NOT NULL,
  `platform_id` int(11) UNSIGNED DEFAULT NULL,
  `date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Act_Runs`
--

INSERT INTO `Act_Runs` (`id`, `player_id`, `act_id`, `time`, `class_id`, `platform_id`, `date`) VALUES
(27, 16, 3, '00:23:12', 31, 4, '2020-11-13'),
(29, 4, 27, '00:23:00', 3, 4, '2020-11-11'),
(32, 2, 4, '00:23:24', 3, 4, '2020-11-12'),
(34, 4, 27, '00:23:22', 3, 4, '2050-12-12'),
(48, 80, 2, '00:05:00', 4, NULL, '2020-11-11');

-- --------------------------------------------------------

--
-- Table structure for table `Classes`
--

CREATE TABLE `Classes` (
  `id` int(11) UNSIGNED NOT NULL,
  `name` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Classes`
--

INSERT INTO `Classes` (`id`, `name`) VALUES
(31, 'Barbarian'),
(5, 'Demon Hunter'),
(4, 'Monk'),
(32, 'Necromancer'),
(22, 'Paladin'),
(2, 'Witch Doctor'),
(3, 'Wizard');

-- --------------------------------------------------------

--
-- Table structure for table `Platforms`
--

CREATE TABLE `Platforms` (
  `id` int(11) UNSIGNED NOT NULL,
  `name` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Platforms`
--

INSERT INTO `Platforms` (`id`, `name`) VALUES
(33, 'PC'),
(1, 'PS3'),
(2, 'PS4'),
(6, 'Switch'),
(3, 'Xbox 360'),
(4, 'Xbox One');

-- --------------------------------------------------------

--
-- Table structure for table `Players`
--

CREATE TABLE `Players` (
  `id` int(11) UNSIGNED NOT NULL,
  `name` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Players`
--

INSERT INTO `Players` (`id`, `name`) VALUES
(80, 'guyMan'),
(3, 'lameMule'),
(4, 'lock14'),
(1, 'Mclovin18'),
(5, 'nerfHerder16'),
(2, 'slamBacon99'),
(16, 'sloppyJoe69');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Acts`
--
ALTER TABLE `Acts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `Act_Runs`
--
ALTER TABLE `Act_Runs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Act_Runs_ibfk_1` (`player_id`),
  ADD KEY `Act_Runs_ibfk_2` (`act_id`),
  ADD KEY `Act_Runs_ibfk_3` (`class_id`),
  ADD KEY `Act_Runs_ibfk_4` (`platform_id`);

--
-- Indexes for table `Classes`
--
ALTER TABLE `Classes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `Platforms`
--
ALTER TABLE `Platforms`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `Players`
--
ALTER TABLE `Players`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD UNIQUE KEY `name_2` (`name`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Acts`
--
ALTER TABLE `Acts`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=55;

--
-- AUTO_INCREMENT for table `Act_Runs`
--
ALTER TABLE `Act_Runs`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT for table `Classes`
--
ALTER TABLE `Classes`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=56;

--
-- AUTO_INCREMENT for table `Platforms`
--
ALTER TABLE `Platforms`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=56;

--
-- AUTO_INCREMENT for table `Players`
--
ALTER TABLE `Players`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=97;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Act_Runs`
--
ALTER TABLE `Act_Runs`
  ADD CONSTRAINT `Act_Runs_ibfk_1` FOREIGN KEY (`player_id`) REFERENCES `Players` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `Act_Runs_ibfk_2` FOREIGN KEY (`act_id`) REFERENCES `Acts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `Act_Runs_ibfk_3` FOREIGN KEY (`class_id`) REFERENCES `Classes` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `Act_Runs_ibfk_4` FOREIGN KEY (`platform_id`) REFERENCES `Platforms` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
