CREATE PROCEDURE `createOffice` (IN `office_id` INT(8), IN `office_location` VARCHAR(50), IN `address` VARCHAR(50))
BEGIN

INSERT INTO `office` (`office_id`, `office_location`, `address`)
	VALUES (`office_id`, `office_location`, `address`);

END