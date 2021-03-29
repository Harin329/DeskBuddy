CREATE PROCEDURE `createMail` (IN `eID` VARCHAR(50), IN `aID` VARCHAR(50), IN `oID` INT(8), IN `oLoc` VARCHAR(50), IN `arrive` DATE, 
                                IN `tp` VARCHAR(50), IN `dim` VARCHAR(50), IN `send` VARCHAR(50), IN `notes` VARCHAR(255))
BEGIN
INSERT INTO `mail` (`fk_employee_id`, `fk_admin_eid`, `fk_office_id`, `fk_office_location`, `date_arrived`, `type`,
                        `dimensions`, `sender_info`, `additional_notes`)
VALUES (`eID`, `aID`, `oID`, `oLoc`, `arrive`, `tp`, `dim`, `send`, `notes`);
SELECT LAST_INSERT_ID();
END;

CREATE PROCEDURE `deleteMail` (IN `mailID` INT(8))
BEGIN
DELETE FROM `mail` WHERE `mail_id` = `mailID`;
END;

CREATE PROCEDURE `getMail` (IN `employeeID` VARCHAR(50))
BEGIN
SELECT * FROM `mail` WHERE `fk_employee_id` = `employeeID`;
END;
END

CREATE PROCEDURE `createRequest` (IN `mailID` INT, IN `employeeID` VARCHAR(50), IN `employeeName` VARCHAR(50), IN `employeeEmail` VARCHAR(50), IN `employeePhone` VARCHAR(50),
    IN `requestType` VARCHAR(50), IN `forwardLocation` VARCHAR(50), IN `additionalInstructions` VARCHAR(500), IN `reqCompletionDate` DATE, IN `modified_at` DATE)
BEGIN
INSERT INTO `mail_request` (`mail_id`, `employee_id`, `employee_name`, `employee_email`, `employee_phone`,
                    `request_type`, `forward_location`, `additional_instructions`, `req_completion_date`,
                    `completion_date`, `status`, `admin_eid`, `response`, `modified_at`)
VALUES (`mailID`, `employeeID`, `employeeName`, `employeeEmail`, `employeePhone`, `requestType`, `forwardLocation`,
                            `additionalInstructions`, `reqCompletionDate`, null, null, null, null, `modified_at`);
END

CREATE PROCEDURE `updateRequestEmployee` (IN `mailID` INT, IN `employeeID` VARCHAR(50), IN `employeePhone` VARCHAR(50),
IN `requestType` VARCHAR(50), IN `forwardLocation` VARCHAR(50), IN `additionalInstructions` VARCHAR(500), IN `reqCompletionDate` DATE, in `modified_at` DATE)

BEGIN

UPDATE `mail_request`

SET `employee_phone` = employeePhone,`request_type` = `requestType`, `forward_location` = `forwardLocation`, `additional_instructions` = `additionalInstructions`,
    `req_completion_date` = `reqCompletionDate`, `modifiedAt` = `modified_at`

WHERE `mail_id` = `mailID` && `employee_id` = `employeeID`;
END

CREATE PROCEDURE `getNewMail` (IN `employeeID` VARCHAR(50))

BEGIN

SELECT `*` FROM `mail` AS `M`
WHERE M.`fk_employee_id` = `employeeID` AND
      NOT EXISTS (SELECT * FROM `mail_request` AS `R` WHERE M.`mail_id` = R.`mail_id`);

END

CREATE PROCEDURE `getFilteredMail` (IN `employeeID` VARCHAR(50), IN `filter` VARCHAR(50))

BEGIN

SELECT `M.*` FROM `mail` AS `M`, `mail_request` AS `R`
WHERE M.`fk_employee_id` = `employeeID` AND M.`mail_id` = `R.mail_id` AND R.`status` = `filter`;

END