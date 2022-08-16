# Node.js Front Store [Udacity Second Project]
- Postgres Database on Port 5432
- Start App on Port 3000
## Build Setup

```bash
# install dependencies
$ npm install
# serve with hot reload at localhost:3000
$ npm run start
$ npm run server
# build for production and launch server
$ npm run build
$ npm run start
# build and run jasmine tests
$ npm run test
# linting
$ npm run lint
# run preitter
$ npm run preitter
# database migration
$ db-migrate up
```

## `Postman API Documentaion`
https://documenter.getpostman.com/view/15765892/VUjSG3v4#9e39e488-bfc1-4c76-aace-709fd1aca8ae

## `dist`
build destination folder

## `src`
where you can find working files and routes

### `src/modles`
you can find working models
- product.ts
- order.ts
- user.ts

### `src/controllers`
you can find working controllers
- products.ts
- orders.ts
- users.ts

### `src/middleware`
- Auth.ts -> Authentication Middleware File

### `src/routes`
- index.ts -> exporting All Project Routes

### `src/tests`
- products.ts -> testing products models

