require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

mongoose.connect(process.env.DATABASE_URl, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', err => console.error(err));
db.once('open', () => console.log('Connected to Database'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));


app.get('/', (req, res) => {
  res.sendFile(`${process.cwd()}/views/index.html`);
});

const shortenRouter = require('./routes/shorten');
app.use('/api/shorten', shortenRouter);

app.use((req, res) => {
  res.status(404).send('404 Not Found');
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})