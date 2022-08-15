/* Replace with your SQL commands */
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price integer NOT NULL,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP
);
