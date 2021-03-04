CREATE PROCEDURE `createOffice` (IN `office_id` INT(8), IN `office_location` VARCHAR(50), IN `name` VARCHAR(50), IN `address` VARCHAR(50), IN `image` MEDIUMBLOB)
BEGIN

INSERT INTO `office` (`office_id`, `office_location`, `name`, `address`, `office_photo`)
	VALUES (`office_id`, `office_location`, `name`, `address`, `image`);

END

CREATE PROCEDURE `deleteOffice` (IN `id` INT(8), IN `location` VARCHAR(50))
BEGIN

DELETE FROM `office` WHERE (`office_location` = `location`) AND (`office_id` = `id`);

END