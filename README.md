# Deerics

Translate the lyrics of your favorite song your way.

## Tools

- Node, Express
- Vue.js
- Bootstrap

## Setup

You will need [Node](https://nodejs.org/en/) installed.

Install all dependencies (run in each folder):
```
npm install
```

Run in /backend:
```
npx knex migrate:latest
npx knex seed:run
npm start
```
And in /frontend:
```
npm run serve
```

**To activate login with facebook, you must create an app on [Facebook for developers](https://developers.facebook.com/docs/development/create-an-app) and rename the file .env.example to .env in both folders (/backend and /frontend) and fill in the required fields.*
