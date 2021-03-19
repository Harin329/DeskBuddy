CREATE PROCEDURE `insertEmployee`(IN `employee_id` VARCHAR(50), `first_name` VARCHAR(50), `last_name` VARCHAR(50), `phone` VARCHAR(50), `email` VARCHAR(50))

BEGIN
	INSERT INTO `employee` (`employee_id`, `first_name`, `last_name`, `email`, `phone`) VALUES(`employee_id`, `first_name`, `last_name`, `email`, `phone`) ON DUPLICATE KEY UPDATE    
	employee.first_name=`first_name`, employee.last_name=`last_name`, employee.phone=`phone`, employee.email=`email`;
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