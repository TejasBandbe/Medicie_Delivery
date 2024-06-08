create database pillpulse;
use pillpulse;

create table pillpulse_users(id int primary key auto_increment,
name varchar(30) not null, age int not null, email_id varchar(40) not null unique,
password varchar(30) not null, mob_no varchar(10) not null unique,
address varchar(200) not null, pincode varchar(6) not null, 
role varchar(10) not null default('user'), registeredOn datetime not null default(now()), 
status varchar(10) not null default('active'), x varchar(10), y varchar(10));

create table medicines(id int primary key auto_increment,
name varchar(40) not null, manufacturer varchar(20) not null, unit_price float not null,
discount float not null default(0.05), available_qty int not null, exp_date datetime not null,
image varchar(200) not null, status varchar(10) not null default('active'), 
x varchar(10), y varchar(10), unique key un_name_manu (name, manufacturer));

create table cart(id int primary key auto_increment,
user_id int not null, medicine_id int not null, unit_price float not null,
discount float not null, quantity int not null default(1), 
total float not null default(unit_price*quantity*(1-discount)), x varchar(10), y varchar(10),
constraint fk_cart_userId foreign key(user_id) references users(id),
constraint fk_cart_medicineId foreign key(medicine_id) references medicines(id));

create table orders(id int primary key auto_increment,
user_id int not null, order_no varchar(12) not null, order_total float not null,
o_timestamp datetime not null default(now()), 
d_timestamp datetime not null default(date_add(now(), interval 3 day)),
order_status varchar(10) not null default('ordered'), x varchar(10), y varchar(10), 
constraint fk_orders_userId foreign key(user_id) references users(id) 
on update cascade on delete cascade);

create table order_items(id int primary key auto_increment, 
order_id int not null, medicine_id int not null, unit_price float not null,
discount float not null, quantity int not null, 
total float not null default(unit_price*quantity*(1-discount)), 
x varchar(10), y varchar(10), 
constraint fk_orderItmes_orderId foreign key(order_id) references orders(id) 
on update cascade on delete cascade);

create table likes(
id int primary key auto_increment,
medicine_id int not null,
user_id int not null,
constraint fk_likes_medicineId foreign key (medicine_id) references medicines(id),
constraint fk_likes_userId foreign key (user_id) references pillpulse_users(id),
constraint unique_likes unique (medicine_id, user_id)
);

create table delivery(id int primary key auto_increment,
order_id int not null, user_id int not null,
constraint unique_orderId_userId unique(order_id, user_id),
constraint fk_delivery_orderId foreign key(order_id) references orders(id),
constraint fk_delivery_userId foreign key(user_id) references pillpulse_users(id)
);