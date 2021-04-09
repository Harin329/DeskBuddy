CREATE PROCEDURE `createOffice` (IN `office_id` INT(8), IN `office_location` VARCHAR(50), IN `name` VARCHAR(50), IN `address` VARCHAR(50), IN `image` MEDIUMBLOB)
BEGIN

INSERT INTO `office` (`office_id`, `office_location`, `name`, `address`, `office_photo`)
	VALUES (`office_id`, `office_location`, `name`, `address`, `image`);

END

CREATE PROCEDURE `deleteOffice` (IN `id` INT(8), IN `location` VARCHAR(50))
BEGIN

DELETE FROM `office` WHERE (`office_location` = `location`) AND (`office_id` = `id`);

END

CREATE PROCEDURE `updateOffice` (IN `id` INT(8), IN `city` VARCHAR(50), IN `newName` VARCHAR(50), IN `newAddress` VARCHAR(50), IN `originalId` INT(8), IN `originalCity` VARCHAR(50), IN `image` MEDIUMBLOB)
BEGIN

UPDATE `office` 
	SET `office_location` = `city`, `name` = `newName`, `office_id` = `id`, `address` = `newAddress`, `office_photo` = `image`
	WHERE `office_id` = `originalId` AND `office_location` = `originalCity`;

END

CREATE PROCEDURE `deleteDesksFloorsOffice`(IN `id` INT(8), IN `location` VARCHAR(50))
BEGIN

DELETE from desk where desk.fk_office_id = `id` AND desk.fk_office_location = `location`;
DELETE from floor where floor.fk_office_id = `id` AND floor.fk_office_location = `location`;
DELETE from office where office.office_id = `id` AND office.office_location = `location`;

END