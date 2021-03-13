CREATE PROCEDURE `createReservation` (IN `employee_id` VARCHAR(50), IN `desk_id` VARCHAR(50), IN `floor_num` INT(8), IN `office_id` INT(8), IN `office_location` VARCHAR(50), IN `start_date` DATE, IN `end_date` DATE)
BEGIN

INSERT INTO `reservation` (`fk_employee_id`, `fk_desk_id`, `fk_floor_num`, `fk_office_id`, `fk_office_location`, `start_date`, `end_date`)
	VALUES (`employee_id`, `desk_id`, `floor_num`, `office_id`, `office_location`, `start_date`, `end_date`);

END


CREATE PROCEDURE `deleteReservation` (IN `my_reservation_id` INT(8))
BEGIN

DELETE FROM `reservation` where `reservation_id`=`my_reservation_id`;


CREATE PROCEDURE `getUpcomingReservation` (IN `employee_id` VARCHAR(50))
BEGIN

SELECT `reservation.reservation_id`, `reservation.start_date`, `reservation.end_date`, `reservation.fk_office_id`, `reservation.fk_office_location`, `reservation.fk_floor_num`, `reservation.fk_desk_id`, `office.name`
FROM `reservation`
INNER JOIN `office` ON `office.office_id`=`reservation.fk_office_id` AND `office.office_location`=`reservation.fk_office_location`
WHERE `reservation.start_date` >= `CURDATE()` AND `fk_employee_id` = `employee_id`
ORDER BY `reservation.start_date`;

END
