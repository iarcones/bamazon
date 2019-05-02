DROP DATABASE IF EXISTS bamazonDB;

CREATE DATABASE bamazonDB;

USE bamazonDB;

CREATE TABLE products
(
    item_id INT NOT NULL
    AUTO_INCREMENT,
    product_name VARCHAR
    (45) NOT NULL,
    department_name VARCHAR
    (45) NULL,
    price DECIMAL
    (10,2) NULL,
    stock_quantity INTEGER
    (10) NULL,
    product_sales DECIMAL
    (10,2) NULL,
    PRIMARY KEY
    (item_id)
);


    INSERT INTO products
        (product_name, department_name, price, stock_quantity, product_sales)
    VALUES
        ("Kapok Zafu Meditation Cushion, Black", "Health & Fitness", 49.95, 15, 0);

    INSERT INTO products
        (product_name, department_name, price, stock_quantity, product_sales)
    VALUES
        ("Womens Fingerless Gloves", "Clothing", 12.99, 20, 0);


    INSERT INTO products
        (product_name, department_name, price, stock_quantity, product_sales)
    VALUES
        ("NIKE Women's in-Season Trainer 7 Cross", "Health & Fitness", 52.99, 30, 0);

    SELECT *
    FROM products;



    CREATE TABLE departments
    (
        department_id INT NOT NULL
        AUTO_INCREMENT,
    department_name VARCHAR
        (45) NULL,
    over_head_costs  DECIMAL
        (10) NULL,
    PRIMARY KEY
        (department_id)
);

        INSERT INTO departments
            (department_name, over_head_costs)
        VALUES
            ("Health & Fitness", 200);

        INSERT INTO departments
            (department_name, over_head_costs)
        VALUES
            ("Clothing", 150);
        INSERT INTO departments
            (department_name, over_head_costs)
        VALUES
            ("Food", 100);




SELECT max(deppro.department_id),
    deppro.department_name,
    max(deppro.over_head_costs),
	sum(deppro.product_sales)
from
(SELECT departments.department_id,
    departments.department_name,
    departments.over_head_costs,
	pro.product_sales
FROM bamazonDB.departments
JOIN bamazonDB.products as pro
using(department_name)) as deppro group by deppro.department_name;