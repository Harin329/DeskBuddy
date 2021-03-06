CREATE PROCEDURE `getDeskByOffice` (IN `office_id` INT(8), IN `office_location` VARCHAR(50))
BEGIN

SELECT * FROM `desk` where `fk_office_id`=`office_id` and `fk_office_location`=`office_location`;

END

DELIMITER $$

CREATE PROCEDURE `getOpenDesks` (IN `officeid` INT(8), IN `officelocation` VARCHAR(50), IN `desk_id` VARCHAR(50), IN `floor_num` INT(8), IN `from` DATE, IN `to` DATE, IN `startindex` INT(8), IN `numOnPage` INT(8))
BEGIN

SELECT * FROM `desk` 
JOIN `office` ON `fk_office_id`=`office_id` AND `fk_office_location`=`office_location`
WHERE CONCAT(`fk_office_location`, `fk_office_id`, `fk_floor_num`, `desk_id`) NOT IN
	(SELECT CONCAT(`fk_office_location`, `fk_office_id`, `fk_floor_num`, `fk_desk_id`) AS `deskKey` FROM `reservation` WHERE `start_date` BETWEEN `from` and `to`)
    AND desk.desk_id=`desk_id`
    AND desk.fk_floor_num=`floor_num`
    AND desk.fk_office_id=`officeid`
    AND desk.fk_office_location=`officelocation`
LIMIT `startindex`, `numOnPage`;

END$$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE `getOpenDesksAtOffice` (IN `officeid` INT(8), IN `officelocation` VARCHAR(50), IN `from` DATE, IN `to` DATE, IN `startindex` INT(8), IN `numOnPage` INT(8))
BEGIN

SELECT * FROM `desk` 
JOIN `office` ON `fk_office_id`=`office_id` AND `fk_office_location`=`office_location`
WHERE CONCAT(`fk_office_location`, `fk_office_id`, `fk_floor_num`, `desk_id`) NOT IN
	(SELECT CONCAT(`fk_office_location`, `fk_office_id`, `fk_floor_num`, `fk_desk_id`) AS `deskKey` FROM `reservation` WHERE `start_date` BETWEEN `from` and `to`)
    AND desk.fk_office_id=`officeid`
    AND desk.fk_office_location=`officelocation`
LIMIT `startindex`, `numOnPage`;

END$$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE `getAllOpenDesks` (IN `from` DATE, IN `to` DATE, IN `startindex` INT(8), IN `numOnPage` INT(8))
BEGIN

SELECT * FROM `desk` 
JOIN `office` ON `fk_office_id`=`office_id` AND `fk_office_location`=`office_location`
WHERE CONCAT(`fk_office_location`, `fk_office_id`, `fk_floor_num`, `desk_id`) NOT IN
	(SELECT CONCAT(`fk_office_location`, `fk_office_id`, `fk_floor_num`, `fk_desk_id`) AS `deskKey` FROM `reservation` WHERE `start_date` BETWEEN `from` and `to`)
LIMIT `startindex`, `numOnPage`;

END$$

DELIMITER ;

CREATE PROCEDURE `createDesk` (IN `desk_id` VARCHAR(50), IN `floor_num` INT(8), IN `office_id` INT(8), IN `office_location` VARCHAR(50), IN `capacity` INT(8))
BEGIN

INSERT INTO `desk` (`desk_id`, `fk_floor_num`, `fk_office_id`, `fk_office_location`, `capacity`)
	VALUES (`desk_id`, `floor_num`, `office_id`, `office_location`, `capacity`);

END

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE `deleteDesks` (IN `id` INT(8), IN `city` VARCHAR(50), IN `floorNum` INT(8))
BEGIN

DELETE FROM `desk` 
	WHERE `fk_office_id` = `id` AND `fk_office_location` = `city` AND `fk_floor_num` = `floorNum`;

END

DELIMITER ;

DELIMITER $$
