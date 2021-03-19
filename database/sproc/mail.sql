CREATE PROCEDURE `createMail` (IN `eID` VARCHAR(50), IN `aID` VARCHAR(50), IN `oID` INT(8), IN `oLoc` VARCHAR(50), IN `arrive` DATE, 
                                IN `tp` VARCHAR(50), IN `dim` VARCHAR(50), IN `send` VARCHAR(50), IN `notes` VARCHAR(255))

BEGIN

INSERT INTO `mail` (`fk_employee_id`, `fk_admin_eid`, `fk_office_id`, `fk_office_location`, `date_arrived`, `type`,
                        `dimensions`, `sender_info`, `additional_notes`)
VALUES (`eID`, `aID`, `oID`, `oLoc`, `arrive`, `tp`, `dim`, `send`, `notes`);
SELECT LAST_INSERT_ID();

END

CREATE PROCEDURE `deleteMail` (IN `mailID` INT(8))

BEGIN

DELETE FROM `mail` WHERE `mail_id` = `mailID`;

END