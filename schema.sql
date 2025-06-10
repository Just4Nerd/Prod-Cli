CREATE SCHEMA IF NOT EXISTS `prodcli` ;

CREATE TABLE IF NOT EXISTS `prodcli`.`users` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `login` VARCHAR(45) NOT NULL,
    `password_hash` VARCHAR(45) NOT NULL,
    `role` VARCHAR(45) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE INDEX `password_hash_UNIQUE` (`password_hash` ASC) VISIBLE,
    UNIQUE INDEX `login_UNIQUE` (`login` ASC) VISIBLE);

CREATE TABLE IF NOT EXISTS `prodcli`.`categories` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(45) NOT NULL,
    `layout_type` VARCHAR(45) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE INDEX `name_UNIQUE` (`name` ASC) VISIBLE);

CREATE TABLE IF NOT EXISTS `prodcli`.`products` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(45) NOT NULL,
    `description` MEDIUMTEXT NULL,
    `price` FLOAT NULL,
    `category_id` INT NULL,
    PRIMARY KEY (`id`),
    UNIQUE INDEX `name_UNIQUE` (`name` ASC) VISIBLE,
    CONSTRAINT `category_id`
        FOREIGN KEY (`category_id`) REFERENCES `prodcli`.`categories` (`id`)
        ON DELETE RESTRICT
        ON UPDATE CASCADE);

CREATE TABLE IF NOT EXISTS `prodcli`.`product_features` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `content` LONGTEXT NOT NULL,
  `product_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  CONSTRAINT `product_id`
    FOREIGN KEY (`product_id`) REFERENCES `prodcli`.`products` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE);

CREATE TABLE IF NOT EXISTS `prodcli`.`user_product_visibility` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `product_id` INT NOT NULL,
  `show_description` TINYINT(1) NOT NULL,
  `show_price` TINYINT(1) NOT NULL,
  `show_features` TINYINT(1) NOT NULL,
  PRIMARY KEY (`user_id`, `product_id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  CONSTRAINT `user_product_visibility_users_foreignkey`
    FOREIGN KEY (`user_id`)
    REFERENCES `prodcli`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `user_product_visibility_product_foreignkey`
    FOREIGN KEY (`product_id`)
    REFERENCES `prodcli`.`products` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);



