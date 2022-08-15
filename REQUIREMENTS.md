# API Requirements
FrontStore API in Node.js
Database Schema and Endpoints

## API Endpoints
#### Products
- Index: `'products/' [GET]`
- Show: `'products/:id' [GET]`
- Create (args: Product): `'products/' [POST]`
- [OPTIONAL] Top 5 most popular products `'five-most-expensive/ [GET]`
- [ADDED] Delete: `'products/:id  [DELETE]`

#### Users
- Index: `'users/' [GET]`
- Show: `'users/:id' [GET]`
- Update [token required]: `'users/:id' [PUT] (token)`
- [ADDED] Delete [token required]: `'users/:id' [DELETE] (token)`

#### Auth
- Login (args: Email, Password): `'login/' [POST]`
- Register: `'register/' [POST]`
- Auth `'auth/' [POST]` [token required]

#### Orders
- Index: `'orders/' [GET] (token)`
- Create [token required] (args: Status (open OR close), user_id): `'orders/' [POST] (token)`
- Add Product [token required] (args: product_id, quantity): `'orders/:order_id/products/' [POST] (token)`
- Update Order Status [token required] (args: status (open OR Close)): `'orders/:order_id/update_status/' [PUT] (token)`

#### Dashboard Relationships
- Products: products_in_orders: `'products_in_orders/' [GET]`
- Users: users_with_orders: `'users_with_orders/' [GET]`
- Products: five-most-expensive: `'five-most-expensive/' [GET]`

## Data Shapes
#### Product
- id
- name
- price
- created_at
- updated_at

```
Table: Product (id:serial[primary key], name:varchar(50)[not null], price:numeric[not null])
```
#### User
- id
- name
- email
- password
- created_at
- updated_at

```
Table: User (id:serial[primary key], name:varchar(50)[not null], email:varchar(50)[not null], password:varchar(60)[not null])
```
#### Orders
- id
- quantity
- user_id
- status of order (open or close)

```
Table: Orders (id:serial[primary key], product_id:integer(foreign key to products table), quantity:integer, user_id:integer(foreign key to users table), status:varchar(50)[not null])
```
