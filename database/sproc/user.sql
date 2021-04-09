CREATE PROCEDURE `insertEmployee`(IN `employee_id` VARCHAR(50), `first_name` VARCHAR(50), `last_name` VARCHAR(50), `phone` VARCHAR(50), `email` VARCHAR(50))

BEGIN
	INSERT INTO `employee` (`employee_id`, `first_name`, `last_name`, `email`) VALUES(`employee_id`, `first_name`, `last_name`, `email`) ON DUPLICATE KEY UPDATE
	employee.first_name=`first_name`, employee.last_name=`last_name`, employee.email=`email`;
END

CREATE PROCEDURE `getUserOIDByNameAndEmail` (IN `first` VARCHAR(50), IN `last` VARCHAR(50), IN `em` VARCHAR(50))

BEGIN
    SELECT employee_id
    FROM `employee` 
    WHERE first_name = `first` AND
	      last_name = `last` AND
          email = `em`;

END

CREATE PROCEDURE `getUserNameAndEmailByOID` (IN `oID` VARCHAR(50))

BEGIN
    SELECT first_name, last_name, email
    FROM `employee` 
    WHERE employee_id = `oID`;

END

CREATE PROCEDURE `updateProfilePhoto`(IN `employee_id` VARCHAR(50), `photo` MEDIUMBLOB)
BEGIN
    UPDATE `employee`
    SET employee.profile_photo = `photo`
    WHERE employee.employee_id = `employee_id`;
END