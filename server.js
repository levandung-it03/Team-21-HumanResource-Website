const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const bodyparser = require('body-parser');
const path = require('path');

const app = express();
const connectDB = require('./server/users/users.DBconnection');

dotenv.config( {path: 'config.env'});
const PORT = 3000;

// pulic assets file
app.use(express.static(path.join(__dirname, 'assets')));

//  log requests
app.use(morgan('tiny'));

// MongoDB connection
connectDB();

//  parse request to body-parser
app.use(bodyparser.urlencoded({ extended: true }));

// set view engines
app.set('view engine', 'ejs');

// load all assets files
app.use('/css', express.static(path.join(__dirname, "/assets/css")));
app.use('/js', express.static(path.join(__dirname, "/assets/js")));
app.use('/img', express.static(path.join(__dirname, "/assets/img")));

// load routers
app.use('/', require('./server/users/users.router'));

app.listen(PORT, () => console.log(`Listening at http://localhost:${PORT}`));