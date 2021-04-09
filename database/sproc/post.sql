CREATE PROCEDURE `getPostByCategory`(IN `channel` INT)
BEGIN
SELECT * FROM `post` WHERE `channel_id`=`channel`;
END

CREATE PROCEDURE `createPostNow`(IN `employee_id` VARCHAR(50), IN `channel_id` INT, IN `post_title` VARCHAR(50), IN `post_content` VARCHAR(500), IN `post_image` MEDIUMBLOB, IN `report_count` INT)
BEGIN
INSERT INTO `post` (`employee_id`, `channel_id`, `date_posted`, `post_content`, `report_count`)
VALUES (`employee_id`, `channel_id`, NOW(), `post_content`, `report_count`);
SELECT LAST_INSERT_ID();
END

CREATE PROCEDURE `deletePost` (IN `post_id` INT)
BEGIN
DELETE FROM `post` WHERE post.post_id=`post_id` ;
END

CREATE PROCEDURE `deletePostAssertUser`(IN `post_id` INT, IN `employee_id` VARCHAR(50))
BEGIN
DELETE FROM `post` WHERE post.post_id=`post_id` AND post.employee_id=`employee_id` ;
END

CREATE PROCEDURE `getPostByCategoryWithEmployeeInfo`(IN `channel` INT)
BEGIN
SELECT post.post_id, post.employee_id, post.channel_id, post.date_posted, post.post_content, post.report_count, employee.first_name, employee.last_name, employee.profile_photo  FROM `post`
INNER JOIN `employee` ON employee.employee_id=post.employee_id
WHERE post.channel_id = `channel`
ORDER BY post.date_posted DESC LIMIT 30;
END

CREATE PROCEDURE `getReportedPosts`()
BEGIN
SELECT post.post_id, post.employee_id, post.channel_id, post.date_posted, post.post_title, post.post_content, post.post_image, post.report_count, employee.first_name, employee.last_name, employee.profile_photo  FROM `post`
INNER JOIN `employee` ON employee.employee_id=post.employee_id
WHERE post.report_count > 0
ORDER BY post.date_posted DESC LIMIT 30;
END

CREATE PROCEDURE `reportPost`(IN `post_id` INT)
BEGIN
UPDATE `post` SET post.report_count=post.report_count+1 WHERE post.post_id=`post_id` ;
END

CREATE PROCEDURE `clearReports`(IN `post_id` INT)
BEGIN
UPDATE `post` SET post.report_count=0 WHERE post.post_id=`post_id`;
END