# Deerics

Translate the lyrics of your favorite song your way.

## Demo
[Click here :)](https://deerics.herokuapp.com/)

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