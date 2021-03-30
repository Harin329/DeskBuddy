CREATE PROCEDURE `createRequest` (IN `mailID` INT, IN `employeeID` VARCHAR(50), IN `employeeName` VARCHAR(50), IN `employeeEmail` VARCHAR(50), IN `employeePhone` VARCHAR(50),
    IN `requestType` VARCHAR(50), IN `forwardLocation` VARCHAR(50), IN `additionalInstructions` VARCHAR(500), IN `reqCompletionDate` DATE, IN `in_status` VARCHAR(50), IN `modifiedAt` DATE)
BEGIN
INSERT INTO `mail_request` (`mail_id`, `employee_id`, `employee_name`, `employee_email`, `employee_phone`,
                    `request_type`, `forward_location`, `additional_instructions`, `req_completion_date`,
                    `completion_date`, `status`, `admin_eid`, 'response', 'modified_at')
VALUES (`mailID`, `employeeID`, `employeeName`, `employeeEmail`, `employeePhone`, `requestType`, `forwardLocation`,
                            `additionalInstructions`, `reqCompletionDate`, null, `in_status`, null, null, `modifiedAt`);
END;

CREATE PROCEDURE `updateRequestEmployee` (IN `mailID` INT, IN `employeeID` VARCHAR(50), IN `employeePhone` VARCHAR(50),
IN `requestType` VARCHAR(50), IN `forwardLocation` VARCHAR(50), IN `additionalInstructions` VARCHAR(500), IN `reqCompletionDate` DATE, IN `in_status` VARCHAR(50), IN `modifiedAt` DATE)
BEGIN
UPDATE `mail_request`
SET `employee_phone` = employeePhone,`request_type` = `requestType`, `forward_location` = `forwardLocation`, `additional_instructions` = `additionalInstructions`,
    `req_completion_date` = `reqCompletionDate`, `status` = `in_status`, `modified_at` = `modifiedAt`
WHERE `mail_id` = `mailID` && `employee_id` = `employeeID`;
END;

CREATE PROCEDURE `updateRequestAdmin` (IN `mailID` INT, IN `employeeID` VARCHAR(50), IN `requestType` VARCHAR(50), IN `forwardLocation` VARCHAR(50),
    IN `additionalInstructions` VARCHAR(500), IN `in_status` VARCHAR(50), IN `adminEid` VARCHAR(50), IN `in_response` VARCHAR(50), IN `modifiedAt` DATE)
BEGIN
UPDATE `mail_request`
SET `request_type` = `requestType`, `forward_location` = `forwardLocation`, `additional_instructions` = `additionalInstructions`,
    `status` = `in_status`, `admin_eid` = `adminEid`, `response` = `in_response`, `modified_at` = `modifiedAt`
WHERE `mail_id` = `mailID` && `employee_id` = `employeeID`;
END;

