'use strict';
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

mongoose.connect(process.env.DATABASE_URl, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', err => console.error(err));
db.once('open', () => console.log('Connected to Database'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json()); // Raw requests
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', (req, res) => {
  res.render('index');
});

const shortenRouter = require('./routes/shorten');
app.use('/shorten', shortenRouter);

app.use((req, res) => {
  return res.status(404).render('not_found', {
    errTitle: '404 Not Found',
    errStatus: '404',
    errMsg: 'Not Found'  
  });
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})