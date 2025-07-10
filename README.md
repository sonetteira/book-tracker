# Book Tracker

A React Project using React, NodeJS, and MongoDB to implement a system for keeping track of a personal library and reading history.

## Setup

Set local values in .env files in api and book-tracker subdirectories. Use .env.example files as templates.

Script for creating a database collection and a few sample books.

```
cd api
node setup.js
```

## Run 
### API

Run express API for interfacing with MongoDB and making external API calls. Defaults to run on port 3002

```
cd api
npm start
```

### React App

Run front end react app. Defaults to run on port 3000.

```
cd book-tracker
npm start
```


## Testing

Run API tests (do this after setup)

```
cd api
npx jest
```

## Documentation

API index documents endpoints