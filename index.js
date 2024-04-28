const express = require('express');
var cors = require('cors')

const app = express();

const routes = require('./routes/routes');

const port = 12005;

// Add headers before the routes are defined
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use(cors());

app.use(express.urlencoded({ extended: true, limit: "2mb" }));
app.use(express.json({ limit: "2mb" }));
app.use('/api/', routes);

app.listen(port, () => {});