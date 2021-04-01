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

CREATE PROCEDURE `getMail` (IN `employeeID` VARCHAR(50))

BEGIN

SELECT * FROM `mail` WHERE `fk_employee_id` = `employeeID`;

END

CREATE PROCEDURE `getMailLoc` (IN `employeeID` VARCHAR(50), IN `loc` VARCHAR(50))

BEGIN

SELECT * FROM `mail` WHERE `fk_employee_id` = `employeeID` AND `fk_office_location` = `loc`;

END

CREATE PROCEDURE `getMailID` (IN `employeeID` VARCHAR(50), IN `ID` INT(8))

BEGIN

SELECT * FROM `mail` WHERE `fk_employee_id` = `employeeID` AND `fk_office_id` = `ID`;

END

CREATE PROCEDURE `getMailLocID` (IN `employeeID` VARCHAR(50), IN `loc` VARCHAR(50), IN `ID` INT(8))

BEGIN

SELECT * FROM `mail` WHERE `fk_employee_id` = `employeeID` AND `fk_office_location` = `loc` AND `fk_office_id` = `ID`;

END

CREATE PROCEDURE `getNewMail` (IN `employeeID` VARCHAR(50))

BEGIN

SELECT `*` FROM `mail` AS `M`
WHERE M.`fk_employee_id` = `employeeID` AND
      NOT EXISTS (SELECT * FROM `mail_request` AS `R` WHERE M.`mail_id` = R.`mail_id`);

END

CREATE PROCEDURE `getNewMailLoc` (IN `employeeID` VARCHAR(50), IN `loc` VARCHAR(50))

BEGIN

SELECT `*` FROM `mail` AS `M`
WHERE M.`fk_employee_id` = `employeeID` AND `fk_office_location` = `loc` AND
      NOT EXISTS (SELECT * FROM `mail_request` AS `R` WHERE M.`mail_id` = R.`mail_id`);

END

CREATE PROCEDURE `getNewMailID` (IN `employeeID` VARCHAR(50), IN `ID` INT(8))

BEGIN

SELECT `*` FROM `mail` AS `M`
WHERE M.`fk_employee_id` = `employeeID` AND `fk_office_id` = `ID` AND
      NOT EXISTS (SELECT * FROM `mail_request` AS `R` WHERE M.`mail_id` = R.`mail_id`);

END

CREATE PROCEDURE `getNewMailLocID` (IN `employeeID` VARCHAR(50), IN `loc` VARCHAR(50), IN `ID` INT(8))

BEGIN

SELECT `*` FROM `mail` AS `M`
WHERE M.`fk_employee_id` = `employeeID` AND `fk_office_location` = `loc` AND `fk_office_id` = `ID` AND
      NOT EXISTS (SELECT * FROM `mail_request` AS `R` WHERE M.`mail_id` = R.`mail_id`);

END

CREATE PROCEDURE `getFilteredMail` (IN `employeeID` VARCHAR(50), IN `filter` VARCHAR(50))

BEGIN

SELECT M.`*` FROM `mail` AS `M`, `mail_request` AS `R`
WHERE M.`fk_employee_id` = `employeeID` AND M.`mail_id` = R.`mail_id` AND R.`status` = `filter`;

END

CREATE PROCEDURE `getFilteredMailLoc` (IN `employeeID` VARCHAR(50), IN `filter` VARCHAR(50), IN `loc` VARCHAR(50))

BEGIN

SELECT M.`*` FROM `mail` AS `M`, `mail_request` AS `R`
WHERE M.`fk_employee_id` = `employeeID` 
AND M.`mail_id` = R.`mail_id` 
AND R.`status` = `filter` 
AND M.`fk_office_location` = `loc`;

END

CREATE PROCEDURE `getFilteredMailID` (IN `employeeID` VARCHAR(50), IN `filter` VARCHAR(50), IN `ID` INT(8))

BEGIN

SELECT M.`*` FROM `mail` AS `M`, `mail_request` AS `R`
WHERE M.`fk_employee_id` = `employeeID` 
AND M.`mail_id` = R.`mail_id` 
AND R.`status` = `filter`
AND M.`fk_office_id` = `ID`;

END

CREATE PROCEDURE `getFilteredMailLocID` (IN `employeeID` VARCHAR(50), IN `filter` VARCHAR(50), IN `loc` VARCHAR(50), IN `ID` INT(8))

BEGIN

SELECT M.`*` FROM `mail` AS `M`, `mail_request` AS `R`
WHERE M.`fk_employee_id` = `employeeID` 
AND M.`mail_id` = R.`mail_id` 
AND R.`status` = `filter` 
AND M.`fk_office_location` = `loc`
AND M.`fk_office_id` = `ID`;

END

CREATE PROCEDURE `getMailSortedAsc` (IN `employeeID` VARCHAR(50), IN `sort` VARCHAR(50))

BEGIN

SELECT * FROM `mail` WHERE `fk_employee_id` = `employeeID` ORDER BY `sort` ASC;

END

CREATE PROCEDURE `getMailSortedAscLoc` (IN `employeeID` VARCHAR(50), IN `sort` VARCHAR(50), IN `loc` VARCHAR(50))

BEGIN

SELECT * FROM `mail` WHERE `fk_employee_id` = `employeeID` AND `fk_office_location` = `loc` ORDER BY `sort` ASC;

END

CREATE PROCEDURE `getMailSortedAscID` (IN `employeeID` VARCHAR(50), IN `sort` VARCHAR(50), IN `ID` INT(8))

BEGIN

SELECT * FROM `mail` WHERE `fk_employee_id` = `employeeID` AND `fk_office_id` = `ID` ORDER BY `sort` ASC;

END

CREATE PROCEDURE `getMailSortedAscLocID` (IN `employeeID` VARCHAR(50), IN `sort` VARCHAR(50), IN `loc` VARCHAR(50), IN `ID` INT(8))

BEGIN

SELECT * FROM `mail` WHERE `fk_employee_id` = `employeeID` AND `fk_office_location` = `loc` AND `fk_office_id` = `ID` ORDER BY `sort` ASC;

END

CREATE PROCEDURE `getMailSortedDesc` (IN `employeeID` VARCHAR(50), IN `sort` VARCHAR(50))

BEGIN

SELECT * FROM `mail` WHERE `fk_employee_id` = `employeeID` ORDER BY `sort` DESC;

END

CREATE PROCEDURE `getMailSortedDescLoc` (IN `employeeID` VARCHAR(50), IN `sort` VARCHAR(50), IN `loc` VARCHAR(50))

BEGIN

SELECT * FROM `mail` WHERE `fk_employee_id` = `employeeID` AND `fk_office_location` = `loc` ORDER BY `sort` DESC;

END

CREATE PROCEDURE `getMailSortedDescID` (IN `employeeID` VARCHAR(50), IN `sort` VARCHAR(50), IN `ID` INT(8))

BEGIN

SELECT * FROM `mail` WHERE `fk_employee_id` = `employeeID` AND `fk_office_id` = `ID` ORDER BY `sort` DESC;

END

CREATE PROCEDURE `getMailSortedDescLocID` (IN `employeeID` VARCHAR(50), IN `sort` VARCHAR(50), IN `loc` VARCHAR(50), IN `ID` INT(8))

BEGIN

SELECT * FROM `mail` WHERE `fk_employee_id` = `employeeID` AND `fk_office_location` = `loc` AND `fk_office_id` = `ID` ORDER BY `sort` DESC;

END

CREATE PROCEDURE `getNewMailSortedAsc` (IN `employeeID` VARCHAR(50), IN `sort` VARCHAR(50))

BEGIN

SELECT `*` FROM `mail` AS `M`
WHERE M.`fk_employee_id` = `employeeID` AND
      NOT EXISTS (SELECT * FROM `mail_request` AS `R` WHERE M.`mail_id` = R.`mail_id`)
ORDER BY `sort` ASC;

END

CREATE PROCEDURE `getNewMailSortedAscLoc` (IN `employeeID` VARCHAR(50), IN `sort` VARCHAR(50), IN `loc` VARCHAR(50))

BEGIN

SELECT `*` FROM `mail` AS `M`
WHERE M.`fk_employee_id` = `employeeID` AND `fk_office_location` = `loc` AND
      NOT EXISTS (SELECT * FROM `mail_request` AS `R` WHERE M.`mail_id` = R.`mail_id`)
ORDER BY `sort` ASC;

END

CREATE PROCEDURE `getNewMailSortedAscID` (IN `employeeID` VARCHAR(50), IN `sort` VARCHAR(50), IN `ID` INT(8))

BEGIN

SELECT `*` FROM `mail` AS `M`
WHERE M.`fk_employee_id` = `employeeID` AND `fk_office_id` = `ID` AND
      NOT EXISTS (SELECT * FROM `mail_request` AS `R` WHERE M.`mail_id` = R.`mail_id`)
ORDER BY `sort` ASC;

END

CREATE PROCEDURE `getNewMailSortedAscLocID` (IN `employeeID` VARCHAR(50), IN `sort` VARCHAR(50), IN `loc` VARCHAR(50), IN `ID` INT(8))

BEGIN

SELECT `*` FROM `mail` AS `M`
WHERE M.`fk_employee_id` = `employeeID` AND `fk_office_location` = `loc` AND `fk_office_id` = `ID` AND
      NOT EXISTS (SELECT * FROM `mail_request` AS `R` WHERE M.`mail_id` = R.`mail_id`)
ORDER BY `sort` ASC;

END

CREATE PROCEDURE `getNewMailSortedDesc` (IN `employeeID` VARCHAR(50), IN `sort` VARCHAR(50))

BEGIN

SELECT `*` FROM `mail` AS `M`
WHERE M.`fk_employee_id` = `employeeID` AND
      NOT EXISTS (SELECT * FROM `mail_request` AS `R` WHERE M.`mail_id` = R.`mail_id`)
ORDER BY `sort` DESC;

END

CREATE PROCEDURE `getNewMailSortedDescLoc` (IN `employeeID` VARCHAR(50), IN `sort` VARCHAR(50), IN `loc` VARCHAR(50))

BEGIN

SELECT `*` FROM `mail` AS `M`
WHERE M.`fk_employee_id` = `employeeID` AND `fk_office_location` = `loc` AND
      NOT EXISTS (SELECT * FROM `mail_request` AS `R` WHERE M.`mail_id` = R.`mail_id`)
ORDER BY `sort` DESC;

END

CREATE PROCEDURE `getNewMailSortedDescID` (IN `employeeID` VARCHAR(50), IN `sort` VARCHAR(50), IN `ID` INT(8))

BEGIN

SELECT `*` FROM `mail` AS `M`
WHERE M.`fk_employee_id` = `employeeID` AND `fk_office_id` = `ID` AND
      NOT EXISTS (SELECT * FROM `mail_request` AS `R` WHERE M.`mail_id` = R.`mail_id`)
ORDER BY `sort` DESC;

END

CREATE PROCEDURE `getNewMailSortedDescLocID` (IN `employeeID` VARCHAR(50), IN `sort` VARCHAR(50), IN `loc` VARCHAR(50), IN `ID` INT(8))

BEGIN

SELECT `*` FROM `mail` AS `M`
WHERE M.`fk_employee_id` = `employeeID` AND `fk_office_location` = `loc` AND `fk_office_id` = `ID` AND
      NOT EXISTS (SELECT * FROM `mail_request` AS `R` WHERE M.`mail_id` = R.`mail_id`)
ORDER BY `sort` DESC;

END


CREATE PROCEDURE `getFilteredMailSortedAsc` (IN `employeeID` VARCHAR(50), IN `filter` VARCHAR(50), IN `sort` VARCHAR(50))

BEGIN

SELECT M.`*` FROM `mail` AS `M`, `mail_request` AS `R`
WHERE M.`fk_employee_id` = `employeeID` 
AND M.`mail_id` = R.`mail_id` 
AND R.`status` = `filter`
ORDER BY `sort` ASC;

END

CREATE PROCEDURE `getFilteredMailSortedAscLoc` (IN `employeeID` VARCHAR(50), IN `filter` VARCHAR(50), 
                  IN `sort` VARCHAR(50), IN `loc` VARCHAR(50))

BEGIN

SELECT M.`*` FROM `mail` AS `M`, `mail_request` AS `R`
WHERE M.`fk_employee_id` = `employeeID` 
AND M.`mail_id` = R.`mail_id` 
AND R.`status` = `filter`
AND M.`fk_office_location` = `loc`
ORDER BY `sort` ASC;

END

CREATE PROCEDURE `getFilteredMailSortedAscID` (IN `employeeID` VARCHAR(50), IN `filter` VARCHAR(50), 
                  IN `sort` VARCHAR(50), IN `ID` INT(8))

BEGIN

SELECT M.`*` FROM `mail` AS `M`, `mail_request` AS `R`
WHERE M.`fk_employee_id` = `employeeID` 
AND M.`mail_id` = R.`mail_id` 
AND R.`status` = `filter`
AND M.`fk_office_id` = `ID`
ORDER BY `sort` ASC;

END

CREATE PROCEDURE `getFilteredMailSortedAscLocID` (IN `employeeID` VARCHAR(50), IN `filter` VARCHAR(50), 
                  IN `sort` VARCHAR(50), IN `loc` VARCHAR(50), IN `ID` INT(8))

BEGIN

SELECT M.`*` FROM `mail` AS `M`, `mail_request` AS `R`
WHERE M.`fk_employee_id` = `employeeID` 
AND M.`mail_id` = R.`mail_id` 
AND R.`status` = `filter`
AND M.`fk_office_location` = `loc`
AND M.`fk_office_id` = `ID`
ORDER BY `sort` ASC;

END

CREATE PROCEDURE `getFilteredMailSortedDesc` (IN `employeeID` VARCHAR(50), IN `filter` VARCHAR(50), IN `sort` VARCHAR(50))

BEGIN

SELECT M.`*` FROM `mail` AS `M`, `mail_request` AS `R`
WHERE M.`fk_employee_id` = `employeeID` 
AND M.`mail_id` = R.`mail_id` 
AND R.`status` = `filter`
ORDER BY `sort` DESC;

END

CREATE PROCEDURE `getFilteredMailSortedDescLoc` (IN `employeeID` VARCHAR(50), IN `filter` VARCHAR(50), 
                  IN `sort` VARCHAR(50), IN `loc` VARCHAR(50))

BEGIN

SELECT M.`*` FROM `mail` AS `M`, `mail_request` AS `R`
WHERE M.`fk_employee_id` = `employeeID` 
AND M.`mail_id` = R.`mail_id` 
AND R.`status` = `filter`
AND M.`fk_office_location` = `loc`
ORDER BY `sort` DESC;

END

CREATE PROCEDURE `getFilteredMailSortedDescID` (IN `employeeID` VARCHAR(50), IN `filter` VARCHAR(50), 
                  IN `sort` VARCHAR(50), IN `ID` INT(8))

BEGIN

SELECT M.`*` FROM `mail` AS `M`, `mail_request` AS `R`
WHERE M.`fk_employee_id` = `employeeID` 
AND M.`mail_id` = R.`mail_id` 
AND R.`status` = `filter`
AND M.`fk_office_id` = `ID`
ORDER BY `sort` DESC;

END

CREATE PROCEDURE `getFilteredMailSortedDescLocID` (IN `employeeID` VARCHAR(50), IN `filter` VARCHAR(50), 
                  IN `sort` VARCHAR(50), IN `loc` VARCHAR(50), IN `ID` INT(8))

BEGIN

SELECT M.`*` FROM `mail` AS `M`, `mail_request` AS `R`
WHERE M.`fk_employee_id` = `employeeID` 
AND M.`mail_id` = R.`mail_id` 
AND R.`status` = `filter`
AND M.`fk_office_location` = `loc`
AND M.`fk_office_id` = `ID`
ORDER BY `sort` DESC;

END