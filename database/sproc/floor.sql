CREATE PROCEDURE `getFloorByOffice` (IN `office_id` INT(8), IN `office_location` VARCHAR(50))
BEGIN

SELECT * FROM `floor` where `fk_office_id`=`office_id` and `fk_office_location`=`office_location`;

END

CREATE PROCEDURE `createFloor` (IN `floor_num` INT(8), IN `office_id` INT(8), IN `office_location` VARCHAR(50), IN `floor_plan` MEDIUMBLOB)
BEGIN

INSERT INTO `floor` (`floor_num`, `fk_office_id`, `fk_office_location`, `floor_plan`)
	VALUES (`floor_num`, `office_id`, `office_location`, `floor_plan`);

END

CREATE PROCEDURE `getFloors` (IN `office_id` INT(8), IN `office_location` VARCHAR(50))
BEGIN

SELECT *
FROM `floor`
WHERE `fk_office_id`=`office_id` AND `fk_office_location`=`office_location`;

END