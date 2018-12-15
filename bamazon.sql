DROP DATABASE IF EXISTS bamazonDB;

CREATE DATABASE bamazonDB;

USE bamazonDB;

CREATE TABLE products
(
    item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(45) NOT NULL,
    department_name VARCHAR(45) NULL,
    price DECIMAL(10,2) NULL,
    stock_quantity INTEGER(10) NULL,
    PRIMARY KEY(item_id)
);
   
   
INSERT INTO products
    (product_name, department_name, price, stock_quantity)
VALUES
    ("Kapok Zafu Meditation Cushion, Black", "Health & Fitness", 49.95, 15);

INSERT INTO products
    (product_name, department_name, price, stock_quantity)
VALUES
    ("Womens Fingerless Gloves", "Clothing", 12.99, 20);


INSERT INTO products
    (product_name, department_name, price, stock_quantity)
VALUES
    ("NIKE Women's in-Season Trainer 7 Cross", "Health & Fitness", 52.99, 30);

    SELECT *
    FROM products;

--     -- Updates the row where the column name is peter --
--     UPDATE products
-- SET has_pet = true, pet_name = "Miss Cuddly Wuddly", pet_age = 2
-- WHERE name = "Oleg";