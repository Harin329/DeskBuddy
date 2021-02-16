CREATE PROCEDURE `createReservation` (IN `employee_id` INT(8), IN `desk_id` VARCHAR(50), IN `floor_num` INT(8), IN `office_id` INT(8), IN `office_location` VARCHAR(50), IN `start_date` DATE, IN `end_date` DATE)
BEGIN

INSERT INTO `reservation` (`fk_employee_id`, `fk_desk_id`, `fk_floor_num`, `fk_office_id`, `fk_office_location`, `start_date`, `end_date`)
	VALUES (`employee_id`, `desk_id`, `floor_num`, `office_id`, `office_location`, `start_date`, `end_date`);

END
