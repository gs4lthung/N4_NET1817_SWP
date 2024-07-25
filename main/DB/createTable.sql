
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
	address NVARCHAR(255),
	is_active BIT,
	activate_code VARCHAR(255),
	FOREIGN KEY (role_id) REFERENCES roles(id)
)

CREATE TABLE pending_requests(
	id BIGINT PRIMARY KEY IDENTITY(1,1),
	customer_id BIGINT,
	description NVARCHAR(255),
	created_date DATETIME,
	has_certificate BIT,
	FOREIGN KEY (customer_id) REFERENCES users(id) on DELETE SET NULL
)
CREATE TABLE pending_request_images(
	id NVARCHAR(255) PRIMARY KEY,
	pending_request_id BIGINT,
	FOREIGN KEY (pending_request_id) REFERENCES pending_requests(id)
)
CREATE TABLE process_requests(
	id BIGINT PRIMARY KEY IDENTITY(1,1),
	consulting_staff_id BIGINT,
	pending_request_id BIGINT,
	status NVARCHAR(255),
	created_date DATETIME,
	receive_date DATETIME,
	FOREIGN KEY (consulting_staff_id) REFERENCES users(id),
	FOREIGN KEY (pending_request_id) REFERENCES pending_requests(id)
)

CREATE TABLE payments(
	id BIGINT PRIMARY KEY IDENTITY(1,1),
	customer_id BIGINT,
	created_date DATETIME,
	bank NVARCHAR(20),
	amount int,
	transaction_no NVARCHAR(255),
	order_info NVARCHAR(255),
	FOREIGN KEY (customer_id) REFERENCES users(id) on DELETE SET NULL
)

CREATE TABLE services(
	id BIGINT PRIMARY KEY IDENTITY(1,1),
	name nvarchar(25),
	price INT,
	time INT,
	statistic NVARCHAR(255),
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
	update_date DATETIME,
	origin NVARCHAR(25),
	shape NVARCHAR(25),
	carat DECIMAL(4,2),
	color NVARCHAR(25),
	cut NVARCHAR(25),
	clarity NVARCHAR(25),
	symmetry NVARCHAR(25),
	polish NVARCHAR(25),
	fluorescence NVARCHAR(25),
	length DECIMAL(4,2),
	width DECIMAL(4,2),
	depth DECIMAL(4,2),
	depth_pct DECIMAL(4,2),
	table_pct DECIMAL(4,2),
	pav_pct DECIMAL(4,2),
	pav_angle DECIMAL(4,2),
	crown_pct DECIMAL(4,2),
	crown_angle DECIMAL(4,2),
	lower_half_pct DECIMAL(4,2),
	star_pct DECIMAL(4,2),
	girdle_pct DECIMAL(4,2),
	culet NVARCHAR(10),
	is_laser_drill_hole BIT,
	is_feather BIT,
	is_crystal BIT,
	is_chip BIT,
	is_needle BIT,
	is_cavity BIT,
	is_pinpoint BIT,
	is_bruise BIT,
	is_cloud BIT,
	is_etch_channel BIT,
	is_twinning_wisp BIT,
	is_indented_natural BIT,
	is_knot BIT,
	is_natural BIT,
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
	status NVARCHAR(25),
	created_date DATETIME,
	FOREIGN KEY (valuation_staff_id) REFERENCES users(id) ON DELETE SET NULL,
	FOREIGN KEY (valuation_result_id) REFERENCES valuation_results(id)
)

CREATE TABLE sealing_letters(
	id BIGINT PRIMARY KEY IDENTITY(1,1),
	valuation_request_id BIGINT,
	created_date DATETIME,
	content NVARCHAR(255),
	FOREIGN KEY (valuation_request_id) REFERENCES valuation_requests(id) ON DELETE SET NULL, 
)

CREATE TABLE commiment_letters(
	id BIGINT PRIMARY KEY IDENTITY(1,1),
	valuation_request_id BIGINT,
	created_date DATETIME,
	content NVARCHAR(255),
	FOREIGN KEY (valuation_request_id) REFERENCES valuation_requests(id) ON DELETE SET NULL,
)

CREATE TABLE diamond_prices(
	id BIGINT PRIMARY KEY IDENTITY(1,1),
	change_down NVARCHAR(255),
	change_up NVARCHAR(255),
	chart NVARCHAR(255),
	image_url NVARCHAR(255),
	inv NVARCHAR(255),
	inventory NVARCHAR(255),
	inventory_change_down NVARCHAR(255),
	inventory_change_up NVARCHAR(255),
	name NVARCHAR(255),
	price NVARCHAR(255),
	price_change NVARCHAR(255),
	price_index NVARCHAR(255),
	price_usd NVARCHAR(255),
	range NVARCHAR(255),
	title NVARCHAR(255),
	weight NVARCHAR(255),
	shape NVARCHAR(255)
)

CREATE TABLE diamond_prices_natural(
	id BIGINT PRIMARY KEY IDENTITY(1,1),
	change_down NVARCHAR(255),
	change_up NVARCHAR(255),
	chart NVARCHAR(255),
	image_url NVARCHAR(255),
	inv NVARCHAR(255),
	inventory NVARCHAR(255),
	inventory_change_down NVARCHAR(255),
	inventory_change_up NVARCHAR(255),
	name NVARCHAR(255),
	price NVARCHAR(255),
	price_change NVARCHAR(255),
	price_index NVARCHAR(255),
	price_usd NVARCHAR(255),
	range NVARCHAR(255),
	title NVARCHAR(255),
	weight NVARCHAR(255),
	shape NVARCHAR(255)
)
INSERT INTO roles(name)
VALUES
('Admin'),('Manager'),('Consulting staff'),('Valuation staff'),('Customer')


INSERT INTO services(name, price, time, statistic) 
VALUES('Normal', 200000, 30, 'Origin, Shape, Carat, Cut, Color, Clarity, Polish, Symmetry, Fluorescence, Measurements, Proportions'),
('Pro', 500000, 20, 'Origin, Shape, Carat, Cut, Color, Clarity, Polish, Symmetry, Fluorescence, Measurements, Proportions'), 
('Premium',1000000, 10, 'Origin, Shape, Carat, Cut, Color, Clarity, Polish, Symmetry, Fluorescence, Measurements, Proportions')

INSERT INTO users(role_id, username, password, full_name, email, phone_number, address,is_active)
VALUES
(5, 'tuan','$2a$10$cFVjD9HGp/AFH5meqqpNuem08iedeBNe6CD/lI09zgGTNG.yzt9Ni','NguyenTuan','tuan@gmail.com','0905038319','HCM',1),
(3, 'consulting001','$2a$10$cFVjD9HGp/AFH5meqqpNuem08iedeBNe6CD/lI09zgGTNG.yzt9Ni','NguyenTuan','tu@gmail.com','0905038311','HCM',1),
(4, 'valuation001','$2a$10$cFVjD9HGp/AFH5meqqpNuem08iedeBNe6CD/lI09zgGTNG.yzt9Ni','NguyenTuan','tun@gmail.com','0906038319','HCM',1),
(2, 'manager','$2a$10$cFVjD9HGp/AFH5meqqpNuem08iedeBNe6CD/lI09zgGTNG.yzt9Ni','NguyenTuan','un@gmail.com','0905038314','HCM',1),
(1, 'admin','$2a$10$cFVjD9HGp/AFH5meqqpNuem08iedeBNe6CD/lI09zgGTNG.yzt9Ni','NguyenTuan','n@gmail.com','0905038315','HCM',1)

-- All Pass Tuan@2011