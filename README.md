Dependencies:

- Git
- Node (v10.15.1 or later)
- MongoDB
- Yarn / npm

Instructions:

1. Clone the repository
2. Install node dependencies with `yarn install` / `npm install`
3. `mongod --dbpath db/`
4. In a separate terminal `yarn server-dev` (uses nodemon)
5. In another separate terminal `./createUser.sh` (registers a user)
6. `yarn start`
7. Visit to [localhost:3000](http://localhost:3000)
8. Login using credentials: `username="user"`, `password="password"` (from step 6)

Originally forked from [here](https://github.com/faizanv/react-auth-example)
