const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const bodyparser = require('body-parser');
const path = require('path');
const ejsLayouts = require('express-ejs-layouts');

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
//  use this to parse json data through Fetch actions.
app.use(bodyparser.json());

// set view engines
app.set('view engine', 'ejs');

// set main layouts for ejs files.
app.use(ejsLayouts);
app.set('layout', './*');

// load all assets files
app.use('/css', express.static(path.join(__dirname, "/assets/css")));
app.use('/js', express.static(path.join(__dirname, "/assets/js")));
app.use('/img', express.static(path.join(__dirname, "/assets/img")));

// load routers
app.use('/', require('./server/users/users.router'));

app.listen(PORT, () => console.log(`Listening at http://localhost:${PORT}`));