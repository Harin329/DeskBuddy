CREATE PROCEDURE `getPostByCategory` (IN `category` INT)
BEGIN

SELECT * FROM `post` WHERE `channel_id`=`category`;

END


CREATE PROCEDURE `createPost` (IN `employee_id` VARCHAR(50), IN `channel_id` INT, IN `date_posted` DATE, IN `post_title` VARCHAR(50), IN `post_content` VARCHAR(500), IN `post_image` MEDIUMBLOB, IN `is_flagged` BOOLEAN)
BEGIN

INSERT INTO `post` (`employee_id`, `channel_id`, `date_posted`, `post_title`, `post_content`, `post_image`, `is_flagged`)
  VALUES (`employee_id`, `channel_id`, `date_posted`, `post_title`, `post_content`, `post_image`, `is_flagged`);

END


CREATE PROCEDURE `flagPost` (IN `post_id` INT, IN `is_flagged` BOOLEAN)
BEGIN

UPDATE `post` SET `post.is_flagged`=`is_flagged` WHERE `post.post_id`=`post_id`;

END

CREATE PROCEDURE `deletePost` (IN `post_id` INT)
BEGIN

DELETE FROM `post` WHERE `post_id`=`post_id`;

END