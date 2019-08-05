CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
item_id INTEGER(10) AUTO_INCREMENT NOT NULL,
product_name VARCHAR(30),
product_sales INTEGER(10),
department_name VARCHAR(30),
price INTEGER(10),
stock_quantity INTEGER(10),
PRIMARY KEY(item_id)
);

INSERT INTO products(product_name, product_sales, department_name, price, stock_quantity) 
VALUES('shampoo', 0, 'hair_care', 5, 10);
INSERT INTO products(product_name, product_sales, department_name, price, stock_quantity) 
VALUES('conditioner', 0, 'hair_care', 6, 15);
INSERT INTO products(product_name, product_sales, department_name, price, stock_quantity) 
VALUES('deodorant', 0, 'pearsonal_care', 7, 10);
INSERT INTO products(product_name, product_sales, department_name, price, stock_quantity) 
VALUES('soap', 0, 'pearsonal_care', 6, 20);
INSERT INTO products(product_name, product_sales, department_name, price, stock_quantity) 
VALUES('mackbook', 0, 'electronics', 1000, 5);
INSERT INTO products(product_name, product_sales, department_name, price, stock_quantity) 
VALUES('Iron', 0, 'electronics', 100, 10);
INSERT INTO products(product_name, product_sales, department_name, price, stock_quantity) 
VALUES('iphone', 0, 'electronics', 700, 8);
INSERT INTO products(product_name, product_sales, department_name, price, stock_quantity) 
VALUES('mouse', 0, 'electronics', 15, 12);
INSERT INTO products(product_name, product_sales, department_name, price, stock_quantity) 
VALUES('refined-oil', 0, 'Kitchen', 10, 3);
INSERT INTO products(product_name, product_sales, department_name, price, stock_quantity) 
VALUES('aata', 0, 'Kitchen', 8, 2);


select* from products;

USE bamazon;
CREATE TABLE departments(
department_id INTEGER(10) AUTO_INCREMENT NOT NULL,
department_name VARCHAR(30),
over_head_costs INTEGER(10),
product_sales INTEGER(10),
PRIMARY KEY(department_id)
);

