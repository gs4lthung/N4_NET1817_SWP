CREATE TABLE roles(
	id BIGINT PRIMARY KEY IDENTITY(1,1),
	name NVARCHAR(25)
)

CREATE TABLE users(
	id BIGINT PRIMARY KEY IDENTITY(1,1),
	role_id BIGINT,
	username NVARCHAR(50) NOT NULL,
	password NVARCHAR(255) NOT NULL,
	full_name NVARCHAR(50),
	email NVARCHAR(50) NOT NULL,
	phone_number NVARCHAR(10),
	address NVARCHAR(255)
	FOREIGN KEY (role_id) REFERENCES roles(id)
)

CREATE TABLE pending_requests(
	id BIGINT PRIMARY KEY IDENTITY(1,1),
	customer_id BIGINT,
	description NVARCHAR(255),
	created_date DATETIME,
	FOREIGN KEY (customer_id) REFERENCES users(id)
)

CREATE TABLE process_requests(
	id BIGINT PRIMARY KEY IDENTITY(1,1),
	consulting_staff_id BIGINT,
	pending_request_id BIGINT,
	status NVARCHAR(255)
	FOREIGN KEY (consulting_staff_id) REFERENCES users(id),
	FOREIGN KEY (pending_request_id) REFERENCES pending_requests(id)
)

CREATE TABLE payments(
	id BIGINT PRIMARY KEY IDENTITY(1,1),
	customer_id BIGINT,
	created_date DATETIME,
	type NVARCHAR(20)
	FOREIGN KEY (customer_id) REFERENCES users(id)
)

CREATE TABLE service_statistics(
	id BIGINT PRIMARY KEY IDENTITY(1,1),
	name NVARCHAR(255)
)

CREATE TABLE services(
	id BIGINT PRIMARY KEY IDENTITY(1,1),
	name nvarchar(25),
	price INT,
	time INT,
	service_statistic_id BIGINT,
	FOREIGN KEY (service_statistic_id) REFERENCES service_statistics(id)
)

CREATE TABLE valuation_requests(
	id BIGINT PRIMARY KEY IDENTITY(1,1),
	pending_request_id BIGINT,
	service_id BIGINT,
	payment_id BIGINT,
	created_date DATETIME,
	finish_date DATETIME,
	sealing_date DATETIME,
	FOREIGN KEY (pending_request_id) REFERENCES pending_requests(id),
	FOREIGN KEY (service_id) REFERENCES services(id),
	FOREIGN KEY (payment_id) REFERENCES payments(id)
)

CREATE TABLE valuation_results(
	id NVARCHAR(50) PRIMARY KEY,
	valuation_request_id BIGINT,
	created_date DATETIME,
	origin NVARCHAR(25),
	shape NVARCHAR(25),
	carat DECIMAL(4,2),
	color NVARCHAR(25),
	cut NVARCHAR(25),
	clarity NVARCHAR(25),
	symmetry NVARCHAR(25),
	polish NVARCHAR(25),
	fluorescence NVARCHAR(25),
	measurements NVARCHAR(50),
	diamond_table DECIMAL(3,1),
	depth DECIMAL(3,1),
	length_to_width_ratio DECIMAL(3,1),
	price DECIMAL(10,2)
	FOREIGN KEY (valuation_request_id) REFERENCES valuation_requests(id)
)

CREATE TABLE valuation_receipts(
	id BIGINT PRIMARY KEY IDENTITY(1,1),
	valuation_request_id BIGINT,
	created_date DATETIME,
	FOREIGN KEY (valuation_request_id) REFERENCES valuation_requests(id)
)

CREATE TABLE valuation_result_images(
	id NVARCHAR(255) PRIMARY KEY,
	valuation_result_id NVARCHAR(50),
	FOREIGN KEY (valuation_result_id) REFERENCES valuation_results(id)
)

CREATE TABLE process_results(
	id BIGINT PRIMARY KEY IDENTITY(1,1),
	valuation_staff_id BIGINT,
	valuation_result_id NVARCHAR(50),
	status NVARCHAR(25)
	FOREIGN KEY (valuation_staff_id) REFERENCES users(id),
	FOREIGN KEY (valuation_result_id) REFERENCES valuation_results(id)
)

CREATE TABLE sealing_letters(
	id BIGINT PRIMARY KEY IDENTITY(1,1),
	valuation_request_id BIGINT,
	created_date DATETIME,
	content NVARCHAR(255),
	FOREIGN KEY (valuation_request_id) REFERENCES valuation_requests(id),
)

CREATE TABLE commiment_letters(
	id BIGINT PRIMARY KEY IDENTITY(1,1),
	valuation_request_id BIGINT,
	created_date DATETIME,
	content NVARCHAR(255),
	FOREIGN KEY (valuation_request_id) REFERENCES valuation_requests(id),
)

INSERT INTO roles(name)
VALUES
('Admin'),('Manager'),('Consulting staff'),('Valuation staff'),('Customer')

INSERT INTO service_statistics(
    NAME
) VALUES(
    'Origin, Shape, Carat Weight, Color, Cut, Clarity'
),
(
    'Origin, Shape, Carat Weight, Color, Cut, Clarity, Measurement, Polish'
),
(
    'Origin, Shape, Carat Weight, Color, Cut, Clarity, Measurement, Polish, Symmetry, Fluorescence, Proportion')

INSERT INTO Services(Name, Price, Time, service_statistic_id) VALUES('Normal', 200000, 30, 1),('Pro', 500000, 20, 2), ('Premium',1000000, 10, 3)