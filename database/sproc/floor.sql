CREATE PROCEDURE `getFloorByOffice` (IN `office_id` INT(8), IN `office_location` VARCHAR(50))
BEGIN

SELECT * FROM `floor` where `fk_office_id`=`office_id` and `fk_office_location`=`office_location`;

END